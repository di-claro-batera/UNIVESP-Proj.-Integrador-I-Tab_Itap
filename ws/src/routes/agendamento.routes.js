const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const pagarme = require('../services/pagarme');
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

/*
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

    if (!manicure) {
      throw new Error(`Manicure com ID ${manicureId} não encontrada`);
    }
    
    if (!manicure.recipientId) {
      throw new Error(`ID do recebedor da manicure com ID ${manicureId} está faltando`);
    }

    //RECUPERAR O SERVICO
    const servico = await Servico.findById(servicoId).select(
      'preco titulo comissao'
    );

    //RECUPERAR O COLABORADOR
    const colaborador = await Colaborador.findById(colaboradorId).select(
      'recipientId'
    );

    if (!colaborador) {
      throw new Error('Colaborador não encontrado');
    }
    
    if (!colaborador.recipientId) {
      throw new Error('ID do recebedor do colaborador está faltando');
    }

        // PREÇO TOTAL DA TRANSAÇÃO
        const precoFinal = util.toCents(servico.preco) * 100;

        // REGRAS DE SPLIT DO COLABORADOR
        const colaboradoreSplitRule = {
          recipient_id: colaborador.recipientId,
          amount: parseInt(precoFinal * (servico.comissao / 100)),
        };
    
        console.log(manicure.recipientId);

        // CRIANDO PAGAMENTO MESTRE
        const createPayment = await pagarme('/transactions', {
          amount: precoFinal,
          card_number: '4111111111111111',
          card_cvv: '123',
          card_expiration_date: '0922',
          card_holder_name: 'Morpheus Fishburne',
          customer: {
            id: cliente.customerId,
          },
          billing: {
            // SUBISTITUIR COM OS DADOS DO CLIENTE
            name: cliente.nome,
            address: {
              country: cliente.endereco.pais,
              state: cliente.endereco.uf,
              city: cliente.endereco.cidade,
              street: cliente.endereco.logradouro,
              street_number: cliente.endereco.numero,
              zipcode: cliente.endereco.cep,
            },
          },
          items: [
            {
              id: servicoId,
              title: servico.titulo,
              unit_price: precoFinal,
              quantity: 1,
              tangible: false,
            },
          ],
          split_rules: [
            // TAXA DO SALÃO
            {
              recipient_id: manicure.recipientId,
              amount: precoFinal - keys.app_fee - colaboradoreSplitRule.amount,
            },
            // TAXAS DOS ESPECIALISTAS / COLABORADORES
            colaboradoreSplitRule,
            // TAXA DO APP
            {
              recipient_id: keys.recipient_id,
              amount: keys.app_fee,
              charge_processing_fee: false,
            },
          ],
        });
    
        if (createPayment.error) {
          throw { message: createPayment.message };
        }

    // CRIAR O AGENDAMENTOS
    let agendamento = req.body;
    agendamento = {
      ...agendamento,
      recipientId: uuid.v4(), // Gerando um novo recipientId
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
*/

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
    const { data, manicureId, servicoId } = req.body;
    const horarios = await Horario.find({ manicureId });
    const servico = await Servico.findById(servicoId).select('duracao');
    
    let agenda = [];
    let colaboradores = [];
    let lastDay = moment(data);

    const servicoDuracao = util.hourToMinutes(
      moment(servico.duracao).format('HH:mm')
    );
    const servicoSlots = util.sliceMinutes(
      moment(servico.duracao).format('HH:mm'),
      moment(servico.duracao).add(servicoDuracao, 'minutes'),
      util.SLOT_DURATION
    ).length;

    for (let i = 0; i <= 365 && agenda.length <= 7; i++) {
      const espacosValidos = horarios.filter((h) => {
        
      const diaSemanaDisponivel = h.dias.includes(moment(lastDay).day());

       
      const servicosDisponiveis = h.especialidades.includes(servicoId);
      return diaSemanaDisponivel && servicosDisponiveis;
    });
    if (espacosValidos.length > 0) {
      let todosHorariosDia = {};
      for (let espaco of espacosValidos) {
        for (let colaboradorId of espaco.colaboradores) {
          if (!todosHorariosDia[colaboradorId]) {
            todosHorariosDia[colaboradorId] = [];
          }
          todosHorariosDia[colaboradorId] = [
            ...todosHorariosDia[colaboradorId],
            ...util.sliceMinutes(
              util.mergeDateTime(lastDay, moment(espaco.inicio, "HH:mm")),
              util.mergeDateTime(lastDay, moment(espaco.fim, "HH:mm")),
              util.SLOT_DURATION
              ),
            ];
          }
        } 
        
        for (let colaboradorId of Object.keys(todosHorariosDia)) {
          const agendamentos = await Agendamento.find({
            colaboradorId,
            data: {
              $gte: moment(lastDay).startOf('day'),
              $lte: moment(lastDay).endOf('day'),
            },
          })
          .select('data servicoId -_id')
          .populate('servicoId', 'duracao');
          
          let horariosOcupados = agendamentos.map((agendamento) => ({
            inicio: moment(agendamento.data),
            final: moment(agendamento.data).add(util.hourToMinutes(moment(agendamento.servicoId.duracao).format('HH:mm'),
            ),
            'minutes'
            ),
          }));
          
          horariosOcupados = horariosOcupados
            .map((horario) =>
              util.sliceMinutes(
                horario.inicio, 
                horario.final, 
                util.SLOT_DURATION
              )
            )
            .flat();


            let horariosLivres = util
            .splitByValue(
              todosHorariosDia[colaboradorId].map(
                (horarioLivre) => {
                  return horariosOcupados.includes(horarioLivre) 
                  ? '-' 
                  : horarioLivre;
              }), 
              '-'
            ).filter(space => space.length > 0);

            horariosLivres = horariosLivres.filter(
              horarios => horarios.length >= servicoSlots
            );

            horariosLivres = horariosLivres.map((slot) => 
              slot.filter(
                (horario,index) => slot.length - index >= servicoSlots
              )
            )
            .flat();
          
            horariosLivres = _.chunk(horariosLivres, 2);

            if (horariosLivres.length === 0) {
              todosHorariosDia = _.omit(todosHorariosDia, colaboradorId);
            } else {
              todosHorariosDia[colaboradorId] = horariosLivres;
            }
         }

        const totalEspecialistas = Object.keys(todosHorariosDia).length;

        if(totalEspecialistas > 0) {
          colaboradores.push(Object.keys(todosHorariosDia));
          agenda.push({
            [lastDay.format('YYYY-MM-DD')]: todosHorariosDia,
          });
        }
      }

      lastDay = lastDay.add(1, 'day');
    }

    colaboradores = _.uniq(colaboradores.flat());

    colaboradores = await Colaborador.find({
      _id: { $in: colaboradores },
    }).select('nome foto');

    colaboradores = colaboradores.map(colaborador => ({
      ... colaborador.doc,
      nome: colaborador,
    }));

    res.json({
       error: false, 
       colaboradores,  
       agenda, 
      });
  } catch (err) {
    res.json({ error: true, message: err.message });
  }
});


module.exports = router;