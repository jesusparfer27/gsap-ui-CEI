import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Outlet } from "react-router-dom";

const App = () => {


  return (
    <main className="w-32 h-32 bg-blue-500 text-white flex items-center justify-center">
      <Outlet/>
    </main>
  );
};

export default App;
