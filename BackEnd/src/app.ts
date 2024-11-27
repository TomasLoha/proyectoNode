import express from "express";
import rutas from './rutas';
import path from "path";
import cors from "cors";  
import morgan from "morgan";

const app = express();

// Configuración de CORS
// app.use(morgan('dev'));
app.use(cors());  // Habilita CORS para todas las rutas

app.use(express.json());  // Para analizar cuerpos JSON en las peticiones
app.use(express.urlencoded({ extended: true }));

// Usar las rutas
app.use('/admin/service', rutas);  // Prefijo 'admin/service' para todas las rutas


export default app;