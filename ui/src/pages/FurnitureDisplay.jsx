import { useState, useEffect } from "react";

const FurnitureDisplay = () => {
  const [furnitures, setFurnitures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const VITE_API_BACKEND = import.meta.env.VITE_API_BACKEND;

  useEffect(() => {
    const fetchFurnitures = async () => {
      try {
        const response = await fetch(`${VITE_API_BACKEND}/furniture`);
        if (!response.ok) throw new Error("Error al obtener los datos");
        const data = await response.json();
        setFurnitures(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFurnitures();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Catálogo de Muebles</h1>

      {loading && <p className="text-center text-gray-500">Cargando muebles...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {furnitures.map((furniture) => (
          <div key={furniture._id} className="bg-white rounded-lg shadow-lg p-4">
            <img
              src={`${VITE_API_BACKEND}${furniture.imagen}`}
              alt={furniture.nombre}
              className="w-full h-48 object-cover rounded-md"
            />
            <h2 className="text-xl font-semibold mt-4">{furniture.nombre}</h2>
            <p className="text-gray-600 mt-2">{furniture.descripcion}</p>
            <p className="text-gray-500 text-sm mt-2">Diseñado por: <strong>{furniture.diseñador}</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FurnitureDisplay;
