import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Ruteo } from './const/routes';
import Home from './Pages/Home/Home';
import NuevoPresupuesto from './Pages/NuevoPresupuesto/NuevoPresupuesto';
import Historial from './Pages/History/Historial';
import Navbar from './Components/Navbar/Navbar';

export default function App() {
  return (
    <BrowserRouter>
    <Navbar />
      <Routes>
        <Route path={Ruteo.home} element={<Home />} />
        <Route path={Ruteo.nuevo} element={<NuevoPresupuesto />} />
        <Route path={Ruteo.history} element={<Historial />} />
      </Routes>
    </BrowserRouter>
  );
}