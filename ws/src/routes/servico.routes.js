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

    if (errors.length > 0) {
      res.json(errors[0]);
      return false;
    }

    let jsonServico = JSON.parse(servico);

    // Calcular o horário de fim com base no horário de início e na duração
    const inicioDate = new Date(jsonServico.inicio);
    const fimDate = new Date(inicioDate.getTime() + jsonServico.duracao * 60000); // Adiciona a duração em minutos

    jsonServico.inicio = inicioDate;
    jsonServico.fim = fimDate;

    const servicoCadastrado = await Servico(jsonServico).save();

    arquivos = arquivos.map((arquivo) => ({
      referenciaId: servicoCadastrado._id,
      model: 'Servico',
      caminho: arquivo,
    }));
    await Arquivos.insertMany(arquivos);

    res.json({ servico: servicoCadastrado, arquivos });
  } catch (err) {
    return res.json({ error: true, message: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { servico } = req.body;
    let errors = [];
    let arquivos = [];

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

    if (errors.length > 0) {
      res.json(errors[0]);
      return false;
    }

    const jsonServico = JSON.parse(servico);
    await Servico.findByIdAndUpdate(req.params.id, jsonServico);

    arquivos = arquivos.map((arquivo) => ({
      referenciaId: req.params.id,
      model: 'Servico',
      caminho: arquivo,
    }));
    await Arquivos.insertMany(arquivos);

    res.json({ error: false });
  } catch (err) {
    return res.json({ error: true, message: err.message });
  }
});


router.get('/manicure/:manicureId', async (req, res) =>{
  try{
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
      servicosManicure.push({ ... servico._doc, arquivos });
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

router.delete('/:id', async (req, res) =>{
  try {
    const { id } = req.params;
    await Servico.findByIdAndUpdate(id, {status: 'E'});

    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });   
  }
});

module.exports = router;