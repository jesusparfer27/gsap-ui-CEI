import { Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { SliderProvider } from './context/SliderContext'; // Importa el SliderProvider
import Slider from './components/Slider'; // Asegúrate de importar el Slider

const App = () => {
  return (
    <SliderProvider>
      <main className="w-full bg-white-500 items-center justify-center h-screen relative">
        <Header />
        <Slider /> {/* Asegúrate de renderizar el Slider aquí */}
        <Outlet /> {/* Rutas hijas con z-index normal */}
        <Footer /> {/* Footer con un z-index más bajo */}
      </main>
    </SliderProvider>
  );
};

export default App;
