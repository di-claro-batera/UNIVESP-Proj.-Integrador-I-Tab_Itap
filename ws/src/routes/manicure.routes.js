const express = require('express');
const router = express.Router();
const Manicure = require('../models/manicure');
const Servico = require('../models/servico');
const Horario = require('../models/horario');
//const turf = require('@turf/turf');


router.post('/', async (req, res) => {
    try {
      const manicure = await new Manicure(req.body).save();
      res.json({ manicure });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });

router.get('/servicos/:manicureId', async (req, res) => {
  try {
    const { manicureId } = req.params;
    const servicos = await Servico.find({
      manicureId,
      status: 'A',
    }).select('_id titulo');

    res.json({
      error: false,
      servicos: servicos.map((s) => ({ label: s.titulo, value: s._id })),
    });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

/*
  FAZER NA #01
*/
router.get('/:id', async (req, res) => {
  try {
    const manicure = await Manicure.findById(req.params.id).select(
      'capa nome endereco.cidade telefone'
    );

    if (!manicure) {
      // Trate o erro aqui. Por exemplo, você pode enviar uma resposta com um erro.
      res.json({ error: true, message: "Manicure não encontrada." });
      return;
    }

    /*
    const distance = turf
      .distance(
        turf.point([-21.745909, -48.661047]),
        turf.point([-30.043858, -51.103487])
      )
      .toFixed(2);
*/

    const horarios = await Horario.find({
      manicureId: req.params.id,
    }).select('dias inicio fim');

    const isOpened = await util.isOpened(horarios);

    res.json({ error: false, manicure: { ...manicure._doc, isOpened } });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});

  module.exports = router;