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
exports.getProductosid = exports.getProductos = void 0;
const Producto_1 = require("../models/Producto");
const conexion_1 = require("../conexion");
// Obtener todos los productos
const getProductos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const productoRepository = conexion_1.AppDataSource.getRepository(Producto_1.Producto);
        const productos = yield productoRepository.find();
        res.status(200).json(productos);
    }
    catch (error) {
        console.error("Error al obtener los clientes:", error);
        res.status(500).json({ message: "Error al obtener los clientes" });
    }
});
exports.getProductos = getProductos;
const getProductosid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const productoRepository = conexion_1.AppDataSource.getRepository(Producto_1.Producto);
        const productos = yield productoRepository.findBy({ id: Number(id) });
        res.status(200).json(productos);
    }
    catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ message: "Error al obtener los productos" });
    }
});
exports.getProductosid = getProductosid;
