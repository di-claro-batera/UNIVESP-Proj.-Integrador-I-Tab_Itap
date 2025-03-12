import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchRelatorios } from '../../store/modules/relatorio/actions';
import { allServicos } from '../../store/modules/servico/actions';
import { Chart, PieController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale);

const Relatorios = () => {
    const dispatch = useDispatch();
    const { relatorios } = useSelector((state) => state.relatorio);
    const { servicos } = useSelector((state) => state.servico);
    const pieChartInstance = useRef(null);
    const barChartInstance = useRef(null);
    const receitasChartInstance = useRef(null);

    useEffect(() => {
        const anoAtual = new Date().getFullYear();
        const inicioAno = `${anoAtual}-01-01`;
        const fimAno = `${anoAtual}-12-31`;
        dispatch(fetchRelatorios({ inicio: inicioAno, final: fimAno }));
        dispatch(allServicos());
    }, [dispatch]);

    useEffect(() => {
        if (relatorios?.servicosMaisPrestados && Object.keys(relatorios.servicosMaisPrestados).length > 0) {
            const ctx = document.getElementById('pieChart').getContext('2d');
            if (pieChartInstance.current) {
                pieChartInstance.current.destroy();
            }
            pieChartInstance.current = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: Object.keys(relatorios.servicosMaisPrestados),
                    datasets: [{
                        data: Object.values(relatorios.servicosMaisPrestados),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    return `${label}: ${value} vezes`;
                                },
                            },
                        },
                    },
                },
            });
        } else {
            console.warn('Nenhum dado encontrado para o gráfico de pizza.');
        }
    }, [relatorios]);

    useEffect(() => {
        const topClientes = relatorios?.melhoresClientes?.length > 0
            ? relatorios.melhoresClientes
            : relatorios.melhorCliente
                ? [relatorios.melhorCliente]
                : [];
        if (topClientes.length > 0) {
            const ctx = document.getElementById('barChart').getContext('2d');
            if (barChartInstance.current) {
                barChartInstance.current.destroy();
            }
            barChartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: topClientes.map((cliente) => cliente.nome),
                    datasets: [{
                        label: 'Serviços realizados',
                        data: topClientes.map((cliente) => cliente.total),
                        backgroundColor: '#36A2EB',
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `${context.raw} serviços`;
                                },
                            },
                        },
                    },
                    scales: {
                        x: { title: { display: true, text: 'Clientes' } },
                        y: {
                            title: { display: true, text: 'Quantidade de Serviços' },
                            beginAtZero: true,
                        },
                    },
                },
            });
        } else {
            console.warn('Nenhum cliente encontrado para o gráfico de barras.');
        }
    }, [relatorios]);

    useEffect(() => {
        if (relatorios?.servicosMaisPrestados && servicos.length > 0) {
            const ctx = document.getElementById('receitasChart').getContext('2d');
            if (receitasChartInstance.current) {
                receitasChartInstance.current.destroy();
            }
            const precosServicos = {};
            servicos.forEach((servico) => {
                precosServicos[servico.titulo] = servico.preco;
            });
            const receitasPorEspecialidade = {};
            Object.entries(relatorios.servicosMaisPrestados).forEach(([servico, quantidade]) => {
                const preco = precosServicos[servico] || 0;
                receitasPorEspecialidade[servico] = quantidade * preco;
            });
            const labels = Object.keys(receitasPorEspecialidade);
            const data = Object.values(receitasPorEspecialidade);
            const datasets = [{
                label: 'Receitas por Especialidade',
                data: data,
                backgroundColor: labels.map((_, index) => `hsl(${index * 45}, 70%, 50%)`),
            }];
            receitasChartInstance.current = new Chart(ctx, {
                type: 'bar',
                data: { labels, datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'top' },
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return `${context.dataset.label}: R$ ${context.raw.toFixed(2)}`;
                                },
                            },
                        },
                    },
                    scales: {
                        x: { title: { display: true, text: 'Especialidades' } },
                        y: {
                            title: { display: true, text: 'Receitas (R$)' },
                            beginAtZero: true,
                        },
                    },
                },
            });
        } else {
            console.warn('Dados insuficientes para gerar o gráfico de receitas.');
        }
    }, [relatorios, servicos]);

    return (
        <div className="col p-5 overflow-auto h-100">
            <h2 className="mb-4 mt-0">Relatórios e Análises</h2>
            {relatorios && servicos ? (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
                        <div style={{ width: '400px', height: '400px', margin: '0 10px', position: 'relative' }}>
                            <h4>Serviços Mais Prestados</h4>
                            <canvas id="pieChart"></canvas>
                        </div>
                        <div style={{ width: '600px', height: '400px', margin: '0 10px', position: 'relative' }}>
                            <h4>Top Clientes</h4>
                            <canvas id="barChart"></canvas>
                        </div>
                    </div>
                    <div style={{ width: '600px', height: '400px', margin: '40px auto', position: 'relative' }}>
                        <h4>Receitas por Especialidade</h4>
                        <canvas id="receitasChart"></canvas>
                    </div>
                    <div style={{ marginBottom: '80px' }}></div>
                </div>
            ) : (
                <p>Carregando dados...</p>
            )}
        </div>
    );
};

export default Relatorios;