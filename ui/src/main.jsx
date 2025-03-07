import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import router from './lib/Routes'
import { RouterProvider } from 'react-router-dom';
import { FurnitureProvider } from '../src/context/FurnitureContext';
import './output.css'

createRoot(document.getElementById('root')).render(
  <StrictMode> 
    <FurnitureProvider>
      <RouterProvider router={router} />
    </FurnitureProvider>
  </StrictMode>,
)
