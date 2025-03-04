import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import 'moment/locale/pt-br';
import { useDispatch, useSelector } from 'react-redux';
import { filterAgendamentos } from '../../store/modules/agendamento/actions';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const Agendamentos = () => {
    const dispatch = useDispatch();
    const { agendamentos } = useSelector((state) => state.agendamento);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentView, setCurrentView] = useState('week');

    const formatEventos = agendamentos.map((agendamento) => {
        const dataInicio = moment(agendamento.data);
        const duracaoMinutos = agendamento.servicoId.duracao; // Duração em minutos

        return {
            title: `${agendamento.servicoId.titulo} - ${agendamento.clienteId.nome} - ${agendamento.colaboradorId.nome}`,
            start: dataInicio.toDate(),
            end: dataInicio.clone().add(duracaoMinutos, 'minutes').toDate(), // Adiciona a duração em minutos
        };
    });

    const formatRange = (periodo) => {
        let finalRange = {};
        if (Array.isArray(periodo)) {
            finalRange = {
                start: moment(periodo[0]).format('YYYY-MM-DD'),
                end: moment(periodo[periodo.length - 1]).format('YYYY-MM-DD'),
            };
        } else {
            finalRange = {
                start: moment(periodo.start).format('YYYY-MM-DD'),
                end: moment(periodo.end).format('YYYY-MM-DD'),
            };
        }
        return finalRange;
    };

    useEffect(() => {
        dispatch(filterAgendamentos(moment().weekday(0).format('YYYY-MM-DD'), moment().weekday(6).format('YYYY-MM-DD')));
    }, [dispatch]);

    return (
        <div className="col p-5 overflow-auto h-100">
            <div className="row">
                <div className="col-12">
                    <h2 className="mb-4 mt-0">Agendamentos</h2>
                    <Calendar
                        localizer={localizer}
                        onRangeChange={(periodo) => {
                            const { start, end } = formatRange(periodo);
                            dispatch(filterAgendamentos(start, end));
                        }}
                        events={formatEventos}
                        view={currentView}
                        onView={(view) => setCurrentView(view)}
                        selectable={true}
                        popup
                        style={{ height: 600 }}
                        messages={{
                            next: 'Próximo',
                            previous: 'Anterior',
                            today: 'Hoje',
                            month: 'Mês',
                            week: 'Semana',
                            day: 'Dia',
                        }}
                        date={currentDate}
                        onNavigate={(date) => setCurrentDate(date)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Agendamentos;