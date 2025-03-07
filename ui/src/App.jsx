import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Outlet } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

const App = () => {


  return (
    <main className="w-full bg-white-500 items-center justify-center h-screen">
      <Header />
      <Outlet/>
      <Footer/>
    </main>
  );
};

export default App;
