"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientesid = exports.getClientes = void 0;
const Cliente_1 = require("../models/Cliente"); // Modelo de cliente si es necesario para validaciones o transformaciones
const conexion_1 = require("../conexion");
const getClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener el repositorio del modelo Cliente
        const clienteRepository = conexion_1.AppDataSource.getRepository(Cliente_1.Cliente);
        // Obtener todos los clientes
        const clientes = yield clienteRepository.find();
        // Devolver los clientes
        res.status(200).json(clientes);
    }
    catch (error) {
        console.error("Error al obtener los clientes:", error);
        res.status(500).json({ message: "Error al obtener los clientes" });
    }
});
exports.getClientes = getClientes;
const getClientesid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const clienteRepository = conexion_1.AppDataSource.getRepository(Cliente_1.Cliente);
        const cliente = yield clienteRepository.findOneBy({ id: Number(id) });
        res.status(200).json(cliente);
    }
    catch (error) {
        console.error("Error al obtener los clientes:", error);
        res.status(500).json({ message: "Error al obtener los clientes" });
    }
});
exports.getClientesid = getClientesid;
