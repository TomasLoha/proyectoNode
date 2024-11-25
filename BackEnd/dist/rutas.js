"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clienteController_1 = require("./controller/clienteController");
const productoController_1 = require("./controller/productoController");
const pedidoVentaController_1 = require("./controller/pedidoVentaController");
const PedidoVentaDetalleController_1 = require("./controller/PedidoVentaDetalleController");
const router = express_1.default.Router();
//cliente
router.get('/clientes', clienteController_1.getClientes);
router.get('/clientes/:id', clienteController_1.getClientesid);
//producto
router.get('/productos', productoController_1.getProductos);
router.get('/productos/:id', productoController_1.getProductosid);
//pedido Venta
router.get('/pedido_venta', pedidoVentaController_1.getPedidosVenta);
router.get('/pedido_venta/SINFILTRO', pedidoVentaController_1.getPedidosVentaSinFiltro);
router.get('/pedido_venta/:id', pedidoVentaController_1.getPedidosVentaid);
router.post('/pedido_venta/CREATE', pedidoVentaController_1.crearPedidosVenta);
router.put('/pedido_venta/UPDATE', pedidoVentaController_1.updatePedidoVenta);
//pedido Venta Detalle
router.get('/pedido_venta_detalle', PedidoVentaDetalleController_1.getPedidosVentaDetalle);
router.get('/pedido_venta_detalle/:id', PedidoVentaDetalleController_1.getPedidosVentaDetalleid);
exports.default = router;
