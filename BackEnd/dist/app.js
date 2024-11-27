"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rutas_1 = __importDefault(require("./rutas"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
// Configuración de CORS
// app.use(morgan('dev'));
app.use((0, cors_1.default)()); // Habilita CORS para todas las rutas
app.use(express_1.default.json()); // Para analizar cuerpos JSON en las peticiones
app.use(express_1.default.urlencoded({ extended: true }));
// Usar las rutas
app.use('/admin/service', rutas_1.default); // Prefijo 'admin/service' para todas las rutas
exports.default = app;
