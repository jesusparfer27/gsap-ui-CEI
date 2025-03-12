import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

const App = () => {
  return (
      <main className="w-full bg-white-500 items-center justify-center h-screen relative overflow-hidden">
        <Header />
        <Outlet /> {/* Rutas hijas con z-index normal */}
        <Footer /> {/* Footer con un z-index más bajo */}
      </main>
  );
};

export default App;
