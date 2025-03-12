import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const Sidebar = () => {
    return (
        <div className="col-2 h100 sidebar">
            <img src={logo} className="img-fluid px-3 py-4" alt="logo" />
            <ul className="p-0 m-0">
                <li>
                    <Link to="/">
                        <span className="mdi mdi-calendar-check"></span>
                        <span>Agendamentos</span>
                    </Link>    
                </li>
                <li>
                    <Link to="/clientes">
                        <span className="mdi mdi-account-multiple"></span>
                        <span>Clientes</span>
                    </Link>    
                </li>
                <li>
                    <Link to="/colaboradores">
                        <span className="mdi mdi-card-account-details-outline"></span>
                        <span>Colaboradores</span>
                    </Link>    
                </li>
                <li>
                    <Link to="/servicos">
                        <span className="mdi mdi-auto-fix"></span>
                        <span>Serviços</span>
                    </Link>    
                </li>
                <li>
                    <Link to="/horarios">
                        <span className="mdi mdi-clock-check-outline"></span>
                        <span>Horários</span>
                    </Link>    
                </li>
                <li>
                    <Link to="/relatorios">
                        <span className="mdi mdi-chart-bar"></span> {/* Icone de gráfico */}
                        <span>Relatórios</span>
                    </Link>    
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;
