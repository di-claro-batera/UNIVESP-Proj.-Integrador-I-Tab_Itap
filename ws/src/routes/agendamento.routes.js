const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const uuid = require('uuid');
const _ = require('lodash');

const Cliente = require('../models/cliente');
const Manicure = require('../models/manicure');
const Servico = require('../models/servico');
const Colaborador = require('../models/colaborador');
const Agendamento = require('../models/agendamento');
const Horario = require('../models/horario');

const util = require('../util');
const keys = require('../data/keys.json');
const cliente = require('../models/cliente');

const { toCents, hourToMinutes, sliceMinutes, mergeDateTime, splitByValue, SLOT_DURATION } = require('../util');


router.post('/', async (req, res) => {
  const db = mongoose.connection;
  const session = await db.startSession();
  session.startTransaction();

  try {
    const { clienteId, manicureId, servicoId, colaboradorId } = req.body;

    //RECUPERAR O CLIENTE
    const cliente = await Cliente.findById(clienteId).select(
      'nome endereco customerId'
    );

    //RECUPERAR A MANICURE
    const manicure = await Manicure.findById(manicureId).select(
      'recipientId'
    );

    //RECUPERAR O SERVICO
    const servico = await Servico.findById(servicoId).select(
      'preco titulo comissao'
    );

    //RECUPERAR O COLABORADOR
    const colaborador = await Colaborador.findById(colaboradorId).select(
      'recipientId'
    );

    // PREÇO TOTAL DA TRANSAÇÃO
    const precoFinal = util.toCents(servico.preco) * 100;

    // CRIAR O AGENDAMENTOS
    let agendamento = req.body;
    agendamento = {
      ...agendamento,
      recipientId: uuid.v4(), // Gerando um novo recipientId
      transactionId: uuid.v4(), // Gerando um novo transactionId
      comissao: servico.comissao,
      valor: servico.preco,
    };
    await new Agendamento(agendamento).save();

    await session.commitTransaction();
    session.endSession();
    res.json({ error: false, agendamento: agendamento });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.json({ error: true, message: err.message });
  }
});
    
router.post('/filter', async (req, res) => {
  try {
    const { periodo, manicureId } = req.body;
    const agendamentos = await Agendamento.find({
      manicureId,
      data: {
        $gte: moment(periodo.inicio).startOf('day'),
        $lte: moment(periodo.final).endOf('day'),
      },
    }).populate([
      { path: 'servicoId', select: 'titulo duracao' },
      { path: 'colaboradorId', select: 'nome' },
      { path: 'clienteId', select: 'nome' },
    ]);
    res.json({ error: false, agendamentos });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});


router.post('/dias-disponiveis', async (req, res) => {
  try {
      console.log('Dados da requisição:', req.body);
      const { data, manicureId, servicoId } = req.body;
      console.log('Data:', data, 'Manicure ID:', manicureId, 'Serviço ID:', servicoId);

      if (!manicureId || !servicoId || !data) {
          return res.json({ error: true, message: 'Dados incompletos na requisição' });
      }

      const horario = await Horario.findOne({ manicureId });
      const servico = await Servico.findById(servicoId).select('duracao');

      if (!servico) {
          return res.json({ error: true, message: 'Serviço não encontrado' });
      }

      if (!horario) {
          return res.json({ error: true, message: 'Horário de atendimento não encontrado' });
      }

      // Função para formatar horários
      const formatTime = (time) => moment(time, 'HH:mm').format('HH:mm');

      let agenda = [];
      let colaboradores = [];
      let lastDay = moment(data, 'YYYY-MM-DD', true);
      if (!lastDay.isValid()) {
          return res.json({ error: true, message: 'Formato de data inválido' });
      }

      // Usar a duração diretamente (já está em minutos)
      const servicoDuracao = servico.duracao;
      console.log('Duração do serviço (minutos):', servicoDuracao);

      // Converter horário de atendimento para o fuso horário local
      const inicioAtendimento = moment(horario.inicio, 'HH:mm').local();
      const fimAtendimento = moment(horario.fim, 'HH:mm').local();

      console.log('Início do atendimento:', inicioAtendimento.format('HH:mm'));
      console.log('Fim do atendimento:', fimAtendimento.format('HH:mm'));

      for (let i = 0; i < 7; i++) {
          const diaSemana = lastDay.day();

          // Verificar se o dia está no horário de atendimento e se o serviço é oferecido
          if (horario.dias.includes(diaSemana) && horario.especialidades.includes(servicoId)) {
              let todosHorariosDia = {};
              let colaboradoresDia = new Set();

              horario.colaboradores.forEach((colaboradorId) => {
                  colaboradoresDia.add(colaboradorId);
                  if (!todosHorariosDia[colaboradorId]) {
                      todosHorariosDia[colaboradorId] = [];
                  }

                  // Gerar horários disponíveis para o dia
                  const horariosDisponiveis = util.sliceMinutes(
                      util.mergeDateTime(lastDay, inicioAtendimento),
                      util.mergeDateTime(lastDay, fimAtendimento),
                      util.SLOT_DURATION
                  );

                  console.log('Horários disponíveis para o colaborador:', colaboradorId, horariosDisponiveis);

                  todosHorariosDia[colaboradorId] = horariosDisponiveis;
              });

              const agendamentos = await Agendamento.find({
                  colaboradorId: { $in: [...colaboradoresDia] },
                  data: {
                      $gte: moment(lastDay).startOf('day'),
                      $lte: moment(lastDay).endOf('day'),
                  },
              })
                  .select('data servicoId colaboradorId -_id')
                  .populate('servicoId', 'duracao');

              console.log('Agendamentos encontrados:', agendamentos);

              for (let colaboradorId of Object.keys(todosHorariosDia)) {
                  const agendamentosColaborador = agendamentos.filter(
                      (agendamento) => {
                          console.log('Agendamento colaboradorId:', agendamento.colaboradorId, 'ColaboradorId:', colaboradorId);
                          return agendamento.colaboradorId && agendamento.colaboradorId.toString() === colaboradorId;
                      }
                  );

                  if (agendamentosColaborador.length > 0) {
                      let horariosOcupados = agendamentosColaborador.map((agendamento) => {
                          if (!agendamento.servicoId || !agendamento.servicoId.duracao) {
                              console.log('Agendamento com servicoId inválido:', agendamento);
                              return { inicio: moment(agendamento.data), final: moment(agendamento.data) };
                          }

                          // Calcular o horário final do agendamento (início + duração em minutos)
                          const inicio = moment(agendamento.data);
                          const final = inicio.clone().add(agendamento.servicoId.duracao, 'minutes');

                          return {
                              inicio: inicio,
                              final: final,
                          };
                      });

                      // Converter horários ocupados para slots de 60 minutos
                      horariosOcupados = horariosOcupados
                          .map((horario) =>
                              util.sliceMinutes(horario.inicio, horario.final, util.SLOT_DURATION)
                          )
                          .flat();

                      // Remover horários duplicados
                      horariosOcupados = [...new Set(horariosOcupados.map(formatTime))];

                      console.log('Horários ocupados (sem duplicatas):', horariosOcupados);

                      // Filtrar horários disponíveis para remover os horários ocupados
                      let horariosLivres = todosHorariosDia[colaboradorId].filter(
                          (horarioLivre) => !horariosOcupados.includes(formatTime(horarioLivre))
                      );

                      console.log('Horários livres (antes da formatação):', horariosLivres);

                      // Agrupar horários livres de 2 em 2
                    const horariosAgrupados = [];
                      for (let j = 0; j < horariosLivres.length; j += 2) {
                    const grupo = [horariosLivres[j]];
                        if (horariosLivres[j + 1]) {
                        grupo.push(horariosLivres[j + 1]);
                        }
                    horariosAgrupados.push(grupo);
                    }

                      if (horariosAgrupados.length === 0) {
                          delete todosHorariosDia[colaboradorId];
                      } else {
                          todosHorariosDia[colaboradorId] = horariosAgrupados;
                      }
                  } else {
                      console.log(`Nenhum agendamento encontrado para o colaborador ${colaboradorId}`);
                      // Se não houver agendamentos, agrupar todos os horários disponíveis
                      const horariosAgrupados = [];
                      for (let j = 0; j < todosHorariosDia[colaboradorId].length; j += 2) {
                          if (todosHorariosDia[colaboradorId][j + 1]) {
                              horariosAgrupados.push([todosHorariosDia[colaboradorId][j], todosHorariosDia[colaboradorId][j + 1]]);
                          }
                      }
                      todosHorariosDia[colaboradorId] = horariosAgrupados;
                  }
              }

              const totalEspecialistas = Object.keys(todosHorariosDia).length;

              if (totalEspecialistas > 0) {
                  colaboradores.push(Object.keys(todosHorariosDia));
                  agenda.push({
                      [lastDay.format('YYYY-MM-DD')]: todosHorariosDia,
                  });
              }
          }

          lastDay = lastDay.add(1, 'day');
      }

      colaboradores = _.uniq(colaboradores.flat());

      const colaboradoresData = await Colaborador.find({
          _id: { $in: colaboradores },
      }).select('nome foto');

      const colaboradoresList = colaboradoresData.map((colaborador) => ({
          ...colaborador._doc,
          nome: colaborador.nome,
      }));

      console.log('Agenda final:', agenda);

      res.json({
          error: false,
          colaboradores: colaboradoresList,
          agenda,
      });
  } catch (err) {
      console.error('Erro na rota dias-disponiveis:', err);
      res.json({ error: true, message: err.message });
  }
});


module.exports = router;