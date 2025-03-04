const express = require('express');
const router = express.Router();
const Horario = require('../models/horario');
const ColaboradorServico = require('../models/relationship/colaboradorServico');
const Colaborador = require('../models/colaborador');
const moment = require('moment');
const _ = require('lodash');

router.post('/', async (req, res) => {
  try {
      const { manicureId, especialidades, colaboradores, dias, inicio, fim } = req.body;

      // Converte as strings de data para objetos Date usando moment.js
      const inicioDate = moment(inicio).toDate();
      const fimDate = moment(fim).toDate();

      const horario = await new Horario({
          manicureId,
          especialidades,
          colaboradores,
          dias,
          inicio: inicioDate,
          fim: fimDate,
      }).save();

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
      const { dias, inicio, fim, especialidades, colaboradores } = req.body;
  
      // Converte as strings de data para objetos Date usando moment.js
      const inicioDate = moment(inicio).toDate();
      const fimDate = moment(fim).toDate();
  
      const horarioAtualizado = await Horario.findByIdAndUpdate(
        horarioId,
        {
          $set: {
            dias,
            inicio: inicioDate,
            fim: fimDate,
            especialidades,
            colaboradores,
          },
        },
        { new: true }
      );
  
      if (!horarioAtualizado) {
        return res.status(404).json({ error: true, message: 'Horário não encontrado.' });
      }
  
      res.json({ error: false, horario: horarioAtualizado });
    } catch (err) {
      console.error('Erro ao atualizar horário:', err);
      res.status(500).json({ error: true, message: err.message });
    }
  });

  router.post('/colaboradores', async (req, res) => {
    try {
        console.log('Especialidades recebidas:', req.body.especialidades);

        const especialidades = req.body.especialidades;
        const colaboradoresIds = [];

        // Busca colaboradores que possuem todas as especialidades
        for (const especialidadeId of especialidades) {
            const colaboradorServico = await ColaboradorServico.find({
                servicoId: especialidadeId,
                status: 'A',
            })
                .populate('colaboradorId', 'nome')
                .select('colaboradorId -_id');

            const ids = colaboradorServico
                .filter(vinculo => vinculo.colaboradorId !== null)
                .map(vinculo => vinculo.colaboradorId._id.toString());

            if (colaboradoresIds.length === 0) {
                colaboradoresIds.push(...ids);
            } else {
                // Interseção dos IDs
                colaboradoresIds.splice(0, colaboradoresIds.length, ...colaboradoresIds.filter(id => ids.includes(id)));
            }
        }

        // Busca os colaboradores pelos IDs
        const colaboradores = await Colaborador.find({
            _id: { $in: colaboradoresIds },
        }).select('nome _id');

        const listaColaboradores = colaboradores.map(colaborador => ({
            label: colaborador.nome,
            value: colaborador._id,
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