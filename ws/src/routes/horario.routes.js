const express = require('express');
const router = express.Router();
const Horario = require('../models/horario');
const ColaboradorServico = require('../models/relationship/colaboradorServico');
const moment = require('moment');
const _ = require('lodash');

router.post('/', async (req, res) => {
    try {
        const horario = await new Horario(req.body).save();
        res.json({ horario });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.get('/manicure/:manicureId', async (req, res) => {
  try {
    const { manicureId } = req.params;

    const horarios = await Horario.find({
      manicureId,
    });

    res.json({ error: false, horarios });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.put('/:horarioId', async (req, res) => {
  try {
    const { horarioId } = req.params;
    const horario = req.body;

    // SE NÃO HOVER, ATUALIZA
    await Horario.findByIdAndUpdate(horarioId, horario);

    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

router.post('/colaboradores', async (req, res) => {
  try {
    console.log('Especialidades recebidas:', req.body.especialidades);

    const colaboradorServico = await ColaboradorServico.find({
      servicoId: { $in: req.body.especialidades },
      status: 'A',
    })
      .populate('colaboradorId', 'nome')
      .select('colaboradorId -_id');

    console.log('Colaboradores encontrados:', colaboradorServico);


    const listaColaboradores = _.uniqBy(
      colaboradorServico.filter(vinculo => vinculo.colaboradorId !== null), 
      (vinculo) => vinculo.colaboradorId._id.toString()
    ).map((vinculo) => ({
      label: vinculo.colaboradorId.nome, 
      value: vinculo.colaboradorId._id,
    }));

    console.log('Lista de Colaboradores:', listaColaboradores);

    res.json({ error: false, colaboradores: listaColaboradores });
  } catch (err) {
    console.error('Erro ao buscar colaboradores:', err);
    res.status(500).json({ error: true, message: err.message });
  }
});

router.delete('/:horarioId', async (req, res) => {
  try {
    const { horarioId } = req.params;
    await Horario.findByIdAndDelete(horarioId);
    res.json({ error: false });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});



module.exports = router;