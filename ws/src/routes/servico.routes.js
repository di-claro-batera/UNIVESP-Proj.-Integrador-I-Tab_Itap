const express = require('express');
const router = express.Router();
const Busboy = require('busboy');
const aws = require('../services/aws');
const Servico = require('../models/servico');
const Arquivos = require('../models/arquivo');
const moment = require('moment');

router.post('/', async (req, res) => {
    try {
        const { manicureId, servico } = req.body;
        let errors = [];
        let arquivos = [];

        // Upload de arquivos (se houver)
        if (req.files && Object.keys(req.files).length > 0) {
            for (let key of Object.keys(req.files)) {
                const file = req.files[key];
                const nameParts = file.name.split('.');
                const fileName = `${new Date().getTime()}.${nameParts[nameParts.length - 1]}`;
                const path = `servicos/${manicureId}/${fileName}`;
                const response = await aws.uploadToS3(file, path);

                if (response.error) {
                    errors.push({ error: true, message: response.message.message });
                } else {
                    arquivos.push(path);
                }
            }
        }

        // Se houver erros no upload, retorne o primeiro erro
        if (errors.length > 0) {
            res.json(errors[0]);
            return false;
        }

        // Parse do JSON do serviço
        const jsonServico = JSON.parse(servico);

        // A duração já está em minutos, não é necessário converter
        const duracaoEmMinutos = jsonServico.duracao;
        console.log('Duração em minutos (criação):', duracaoEmMinutos);

        // Verificar e validar o horário de início
        if (!jsonServico.inicio || typeof jsonServico.inicio !== 'string') {
            throw new Error('O horário de início é obrigatório e deve ser uma string.');
        }

        const inicioDate = new Date(jsonServico.inicio);
        console.log('Horário de início (criação):', inicioDate);

        if (isNaN(inicioDate.getTime())) {
            throw new Error('Formato do horário de início inválido. Use o formato ISO 8601 (ex: "2025-03-26T08:00:00.000Z").');
        }

        // Calcular o horário de fim com base no horário de início e na duração em minutos
        const fimDate = new Date(inicioDate.getTime() + duracaoEmMinutos * 60000); // Converter minutos para milissegundos
        console.log('Horário de fim (criação):', fimDate);

        // Atualizar a duração e os horários no objeto do serviço
        jsonServico.duracao = duracaoEmMinutos;
        jsonServico.inicio = inicioDate;
        jsonServico.fim = fimDate;

        // Salvar o serviço no banco de dados
        const servicoCadastrado = await Servico(jsonServico).save();

        // Salvar os arquivos no banco de dados
        arquivos = arquivos.map((arquivo) => ({
            referenciaId: servicoCadastrado._id,
            model: 'Servico',
            caminho: arquivo,
        }));
        await Arquivos.insertMany(arquivos);

        // Retornar o serviço cadastrado e os arquivos
        res.json({ servico: servicoCadastrado, arquivos });
    } catch (err) {
        // Retornar erro em caso de exceção
        res.json({ error: true, message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { servico } = req.body;
        let errors = [];
        let arquivos = [];

        // Upload de arquivos (se houver)
        if (req.files && Object.keys(req.files).length > 0) {
            for (let key of Object.keys(req.files)) {
                const file = req.files[key];
                const nameParts = file.name.split('.');
                const fileName = `${new Date().getTime()}.${nameParts[nameParts.length - 1]}`;
                const path = `servicos/${req.body.manicureId}/${fileName}`;
                const response = await aws.uploadToS3(file, path);

                if (response.error) {
                    errors.push({ error: true, message: response.message.message });
                } else {
                    arquivos.push(path);
                }
            }
        }

        // Se houver erros no upload, retorne o primeiro erro
        if (errors.length > 0) {
            res.json(errors[0]);
            return false;
        }

        // Parse do JSON do serviço
        const jsonServico = JSON.parse(servico);

        // A duração já está em minutos, não é necessário converter
        const duracaoEmMinutos = jsonServico.duracao;
        console.log('Duração em minutos (atualização):', duracaoEmMinutos);

        // Atualizar a duração no objeto do serviço
        jsonServico.duracao = duracaoEmMinutos;

        // Atualizar o serviço no banco de dados
        await Servico.findByIdAndUpdate(req.params.id, jsonServico, { new: true });

        // Salvar os arquivos no banco de dados
        arquivos = arquivos.map((arquivo) => ({
            referenciaId: req.params.id,
            model: 'Servico',
            caminho: arquivo,
        }));
        await Arquivos.insertMany(arquivos);

        res.json({ error: false });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

router.get('/manicure/:manicureId', async (req, res) => {
    try {
        let servicosManicure = [];
        const servicos = await Servico.find({
            manicureId: req.params.manicureId,
            status: { $ne: 'E' },
        });

        for (let servico of servicos) {
            const arquivos = await Arquivos.find({
                model: 'Servico',
                referenciaId: servico._id
            });
            servicosManicure.push({ ...servico._doc, arquivos });
        }

        res.json({
            servicos: servicosManicure,
        });
    } catch (err) {
        res.json({ error: true, message: err.message })
    }
});

router.post('/delete-arquivo', async (req, res) => {
    try {
        const { key } = req.params;

        await aws.deleteFileS3(key);

        await Arquivos.findOneAndDelete({
            caminho: key,
        });

        res.json({ error: false });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Servico.findByIdAndUpdate(id, { status: 'E' });

        res.json({ error: false });
    } catch (err) {
        res.json({ error: true, message: err.message });
    }
});

module.exports = router;