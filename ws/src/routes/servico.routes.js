const express = require('express');
const router = express.Router();
const Busboy = require('busboy');
const aws = require('../services/aws');
const Servico = require('../models/servico');
const Arquivos = require('../models/arquivo');
const moment = require('moment');

/*
  FAZER NA #01
*/
router.post('/', async (req, res) => {
  try {
    const { manicureId, servico } = req.body;
    let errors = [];
    let arquivos = [];

    if (req.files && Object.keys(req.files).length > 0) {
      for (let key of Object.keys(req.files)) {
        const file = req.files[key];
        
        const nameParts = file.name.split('.');
        const fileName = `${new Date().getTime()}.${
          nameParts[nameParts.length - 1]
        }`;    
        const path = `servicos/${manicureId}/${fileName}`;
        const response = await aws.uploadToS3(file,path);
        
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

            // CRIAR SERVIÇO
    let jsonServico = JSON.parse(servico);
    //jsonServico.manicureId = req.body.manicureId;
    const servicoCadastrado = await Servico(jsonServico).save();

            // CRIAR ARQUIVO
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
  
  //return req.json({ error: false, message: "Sucesso" });
});

router.put('/:id', async (req, res) => {
  try {
    const { manicureId, servico } = req.body;
    let errors = [];
    let arquivos = [];

    if (req.files && Object.keys(req.files).length > 0) {
      for (let key of Object.keys(req.files)) {
        const file = req.files[key];
        
        const nameParts = file.name.split('.');
        const fileName = `${new Date().getTime()}.${
          nameParts[nameParts.length - 1]
        }`;    
        const path = `servicos/${req.body.manicureId}/${fileName}`;
        const response = await aws.uploadToS3(file,path);
        
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

            // CRIAR SERVIÇO
    const jsonServico = JSON.parse(servico)
    await Servico.findByIdAndUpdate(req.params.id, jsonServico);

            // CRIAR ARQUIVO
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
  
  //return req.json({ error: false, message: "Sucesso" });
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
    const { id } = req.body;

    await aws.deleteFileS3(id);

    await Arquivos.findOneAndDelete({
      caminho: id,
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