import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import 'rsuite/dist/rsuite.min.css';
import './styles.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

import Agendamentos from './pages/Agendamentos';
import Clientes from './pages/Clientes'; 
import Colaboradores from './pages/Colaboradores'; 
import Servicos from './pages/Servicos'; 



const App = () => {
    return (
        <>
        <Header/>
        <div className="container-fluid h-100">
            <div className="row h-100">
                <Router>
                    <Sidebar/>
                    <Routes>
                        <Route path="/" element={<Agendamentos />} />
                        <Route path="/clientes" element={<Clientes />} />
                        <Route path="/colaboradores" element={<Colaboradores />} />
                        <Route path="/servicos" element={<Servicos />} />
                    </Routes>
                </Router>           
            </div>
        </div>
        </>
    );
};

export default App;
