const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');
const Agendamento = require('../models/agendamento');
const Servico = require('../models/servico');
const Cliente = require('../models/cliente');

// Rota para buscar relatórios (semanal, mensal, anual)
router.post('/get', async (req, res) => {
    try {
        const { periodo, manicureId } = req.body;

        if (!periodo || !manicureId) {
            return res.json({ error: true, message: 'Dados incompletos na requisição' });
        }

        // Calcular o intervalo de datas
        const inicio = moment(periodo.inicio).startOf('day');
        const final = moment(periodo.final).endOf('day');

        // Buscar agendamentos no período
        const agendamentos = await Agendamento.find({
            manicureId,
            data: {
                $gte: inicio.toDate(),
                $lte: final.toDate(),
            },
        }).populate([
            { path: 'servicoId', select: 'titulo' },
            { path: 'clienteId', select: 'nome' },
            { path: 'colaboradorId', select: 'nome status especialidades' },
        ]);

        // Processar os dados para o relatório
        const servicosMaisPrestados = {};
        const clientes = {};
        let totalReceita = 0;

        agendamentos.forEach((agendamento) => {
            // Contar serviços mais prestados
            const servicoTitulo = agendamento.servicoId?.titulo || 'Desconhecido';
            servicosMaisPrestados[servicoTitulo] = (servicosMaisPrestados[servicoTitulo] || 0) + 1;

            // Contar melhor cliente
            const clienteNome = agendamento.clienteId?.nome || 'Desconhecido';
            clientes[clienteNome] = (clientes[clienteNome] || 0) + 1;

            // Somar total de receita
            totalReceita += agendamento.valor || 0;
        });

        // Identificar serviço mais prestado e melhor cliente
        const servicoTop = Object.entries(servicosMaisPrestados).sort((a, b) => b[1] - a[1])[0];
        const clienteTop = Object.entries(clientes).sort((a, b) => b[1] - a[1])[0];

        res.json({
            error: false,
            servicosMaisPrestados: servicosMaisPrestados,
            melhorCliente: clienteTop ? { nome: clienteTop[0], total: clienteTop[1] } : null,
            totalReceita: totalReceita,
        });
    } catch (err) {
        console.error('Erro na rota de relatórios:', err);
        res.json({ error: true, message: err.message });
    }
});

module.exports = router;
