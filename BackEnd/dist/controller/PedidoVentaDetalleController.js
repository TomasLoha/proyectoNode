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
exports.eliminarPedidoVentaDetalle = exports.crearPedidosVentaDetalle = exports.getPedidosVentaDetalleid = exports.getPedidosVentaDetalle = void 0;
const PedidoVentaDetalle_1 = require("../models/PedidoVentaDetalle");
const conexion_1 = require("../conexion");
const getPedidosVentaDetalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pedidoVentaDetalleRepository = conexion_1.AppDataSource.getRepository(PedidoVentaDetalle_1.PedidoVentaDetalle);
        const pedidoVentaDetalles = yield pedidoVentaDetalleRepository.find({
            where: { existe: 1 },
        });
        res.status(200).json(pedidoVentaDetalles);
    }
    catch (error) {
        console.error("Error al obtener los detalles:", error);
        res.status(500).json({ message: "Error al obtener los detalles" });
    }
});
exports.getPedidosVentaDetalle = getPedidosVentaDetalle;
const getPedidosVentaDetalleid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const pedidoVentaDetalleRepository = conexion_1.AppDataSource.getRepository(PedidoVentaDetalle_1.PedidoVentaDetalle);
        const pedidoVentaDetalles = yield pedidoVentaDetalleRepository.findBy({ id: Number(id), existe: 1 });
        res.status(200).json(pedidoVentaDetalles);
    }
    catch (error) {
        console.error("Error al obtener los detalles:", error);
        res.status(500).json({ message: "Error al obtener los detalles" });
    }
});
exports.getPedidosVentaDetalleid = getPedidosVentaDetalleid;
const crearPedidosVentaDetalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const pedidoVentaDetalleRepository = conexion_1.AppDataSource.getRepository(PedidoVentaDetalle_1.PedidoVentaDetalle);
        const pedidoVentaDetalles = yield pedidoVentaDetalleRepository.findBy({ id: Number(id) });
        res.status(200).json(pedidoVentaDetalles);
    }
    catch (error) {
        console.error("Error al obtener los detalles:", error);
        res.status(500).json({ message: "Error al obtener los detalles" });
    }
});
exports.crearPedidosVentaDetalle = crearPedidosVentaDetalle;
const eliminarPedidoVentaDetalle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Obtener el ID del pedido a eliminar
    const queryRunner = conexion_1.AppDataSource.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        // 1. Repositorios
        const pedidoRepo = conexion_1.AppDataSource.getRepository(PedidoVentaDetalle_1.PedidoVentaDetalle);
        // 2. Buscar el pedido existente
        const pedido = yield pedidoRepo.findOne({
            where: { id: Number(id), existe: 1 },
            relations: ["detalles"],
        });
        if (!pedido) {
            res.status(404).json({ message: "Pedido no encontrado" });
            return;
        }
        // 4. Eliminar el pedido de venta
        yield pedidoRepo.remove(pedido);
        // 5. Confirmar la transacción
        yield queryRunner.commitTransaction();
        res.status(200).json({ message: "Pedido de venta eliminado correctamente" });
    }
    catch (error) {
        // 6. Revertir la transacción en caso de error
        yield queryRunner.rollbackTransaction();
        console.error("Error al eliminar el pedido:", error);
        res.status(500).json({ message: "Error al eliminar el pedido", error });
    }
    finally {
        // 7. Liberar el queryRunner
        yield queryRunner.release();
    }
});
exports.eliminarPedidoVentaDetalle = eliminarPedidoVentaDetalle;
