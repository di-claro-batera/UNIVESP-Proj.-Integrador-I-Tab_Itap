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

    const existentColaborador = await Colaborador.findOne({
      $or: [
        { email: colaborador.email },
        { telefone: colaborador.telefone },
        //{ cpf: colaborador.cpf },
      ],
    });

   
    if (!existentColaborador) {
      
/*
      const { contaBancaria } = colaborador;
      const pagarmeBankAccount = await pagarme('/bank_accounts', {
        bank_code: contaBancaria.banco,
        document_number: contaBancaria.cpfCnpj,
        agencia: contaBancaria.agencia,
        conta: contaBancaria.numero,
        conta_dv: contaBancaria.dv,
        type: contaBancaria.tipo,
        legal_name: contaBancaria.titular,
      });

      if (pagarmeBankAccount.error) {
        throw pagarmeBankAccount;
      }

      // CRIANDO RECEBEDOR
      const pargarmeRecipient = await pagarme('/recipients', {
        transfer_interval: 'daily',
        transfer_enabled: true,
        bank_account_id: pagarmeBankAccount.data.id,
      });

      if (pargarmeRecipient.error) {
        throw pargarmeRecipient;
      }
*/
      newColaborador = await new Colaborador({
        ...colaborador,
       recipientId: uuid.v4(),
      }).save({ session });

    }
    

    const colaboradorId = existentColaborador
      ? existentColaborador
      : newColaborador;



    // RELAÇÃO COM O SALÃO
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

    // RELAÇÃO COM OS SERVIÇOS / ESPECIALIDADES
    if (typeof colaborador.especialidades === 'string') {
      let especialidades = colaborador.especialidades.split(',');
    
      await ColaboradorServico.insertMany(
        especialidades.map((servicoId) => ({
          servicoId,
          colaboradorId,        
        })),
        { session }
      );
    } else {
      // Trate o caso em que colaborador.especialidades não é uma string
    }

    await session.commitTransaction();
    session.endSession();

    if (existentRelationship && existentColaborador) {
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
      .populate({ path: 'colaboradorId', select: '-senha -recipientId' })
      .select('colaboradorId dataCadastro status');

      for (let vinculo of manicureColaboradores) {
        if (vinculo.colaboradorId) {
          const especialidades = await ColaboradorServico.find({
            colaboradorId: vinculo.colaboradorId._id,
          });
      
          listaColaboradores.push({
            ...vinculo._doc,
            especialidades: especialidades.map((e) => e.servicoId),
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

    await Colaborador.findByIdAndUpdate(colaboradorId, req.body);

    // ATUALIZANDO VINCULO
    
    await ManicureColaborador.findByIdAndUpdate(vinculoId, { status: vinculo });
    

    // ATUALIZANDO ESPECIALIDADES
    await ColaboradorServico.deleteMany({
        colaboradorId,
      });

      if (typeof especialidades === 'string') {
        let especialidadesArray = especialidades.split(',');
  
        await ColaboradorServico.insertMany(
          especialidadesArray.map((servicoId) => ({
            servicoId,
            colaboradorId,        
          }))
        );
      } else {
        // Trate o caso em que especialidades não é uma string
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