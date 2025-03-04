const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Colaborador = require('../models/colaborador');
const ManicureColaborador = require('../models/relationship/manicureColaborador');
const ColaboradorServico = require('../models/relationship/colaboradorServico');
const moment = require('moment');
const pagarme = require('../services/pagarme');
const uuid = require('uuid');

router.post('/', async (req, res) => {
    const db = mongoose.connection;
    const session = await db.startSession();
    session.startTransaction();

    try {
        const { colaborador, manicureId } = req.body;
        let newColaborador = null;
        let existentColaborador;

        existentColaborador = await Colaborador.findOne({
            $or: [
                { email: colaborador.email },
                { telefone: colaborador.telefone },
            ],
        });

        if (!existentColaborador) {
            try {
                newColaborador = await new Colaborador({
                    ...colaborador,
                    recipientId: uuid.v4(),
                }).save({ session });
            } catch (saveError) {
                await session.abortTransaction();
                session.endSession();
                if (saveError.code === 11000) {
                    return res.json({ error: true, message: 'Telefone já cadastrado.' });
                }
                return res.json({ error: true, message: `Erro ao salvar colaborador: ${saveError.message}` });
            }
        }

        const colaboradorId = existentColaborador
            ? existentColaborador._id
            : newColaborador ? newColaborador._id : null;

        if (!colaboradorId) {
            throw new Error('Erro ao obter o ID do colaborador.');
        }

        const existentRelationship = await ManicureColaborador.findOne({
            manicureId,
            colaboradorId,
            status: { $ne: 'E' },
        });

        if (!existentRelationship) {
            await new ManicureColaborador({
                manicureId,
                colaboradorId,
                status: colaborador.vinculo,
            }).save({ session });
        }

        if (existentColaborador) {
            await ManicureColaborador.findOneAndUpdate(
                {
                    manicureId,
                    colaboradorId,
                },
                { status: colaborador.vinculo },
                { session }
            );
        }

        // Criação dos relacionamentos na coleção ColaboradorServico
        if (Array.isArray(colaborador.especialidades)) {
            await ColaboradorServico.insertMany(
                colaborador.especialidades.map(servicoId => ({
                    servicoId,
                    colaboradorId,
                })),
                { session }
            );
        }

        await session.commitTransaction();
        session.endSession();

        if (existentRelationship && existentColaborador && existentColaborador.email) {
            res.json({ error: true, message: 'Colaborador já cadastrado!' });
        } else {
            res.json({ error: false });
        }
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.json({ error: true, message: err.message });
    }
});

router.post('/filter', async (req, res) => {
    try {
        const colaboradores = await Colaborador.find(req.body.filters);
        res.json({ error: false, colaboradores });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

router.get('/manicure/:manicureId', async (req, res) => {
    try {
        const { manicureId } = req.params;
        let listaColaboradores = [];

        const manicureColaboradores = await ManicureColaborador.find({
            manicureId,
            status: { $ne: 'E' },
        })
            .populate({
                path: 'colaboradorId',
                select: '-senha -recipientId',
                populate: {
                    path: 'especialidades',
                    model: 'Servico',
                },
            })
            .select('colaboradorId dataCadastro status');

        for (let vinculo of manicureColaboradores) {
            if (vinculo.colaboradorId) {
                listaColaboradores.push({
                    ...vinculo._doc,
                    especialidades: vinculo.colaboradorId.especialidades.map((especialidade) => ({
                        label: especialidade.titulo,
                        value: especialidade._id,
                    })),
                });
            }
        }

        res.json({
            error: false,
            colaboradores: listaColaboradores.map((vinculo) => ({
                ...vinculo.colaboradorId._doc,
                vinculoId: vinculo._id,
                vinculo: vinculo.status,
                especialidades: vinculo.especialidades,
                dataCadastro: vinculo.dataCadastro,
            })),
        });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

router.put('/:colaboradorId', async (req, res) => {
    try {
        const { vinculo, vinculoId, especialidades } = req.body;
        const { colaboradorId } = req.params;

        await Colaborador.findByIdAndUpdate(colaboradorId, { especialidades });

        await ManicureColaborador.findByIdAndUpdate(vinculoId, { status: vinculo });

        // Atualização dos relacionamentos na coleção ColaboradorServico
        await ColaboradorServico.deleteMany({ colaboradorId });

        if (Array.isArray(especialidades)) {
            await ColaboradorServico.insertMany(
                especialidades.map(servicoId => ({
                    servicoId,
                    colaboradorId,
                }))
            );
        }

        res.json({ error: false });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

router.delete('/vinculo/:id', async (req, res) => {
    try {
        await ManicureColaborador.findByIdAndUpdate(req.params.id, { status: 'E' });
        res.json({ error: false });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

module.exports = router;