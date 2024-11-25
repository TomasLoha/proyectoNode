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
exports.eliminarPedidoVenta = exports.updatePedidoVenta = exports.crearPedidosVenta = exports.getPedidosVentaid = exports.getPedidosVenta = exports.getPedidosVentaSinFiltro = void 0;
const PedidoVenta_1 = require("../models/PedidoVenta");
const conexion_1 = require("../conexion");
const Cliente_1 = require("../models/Cliente");
const PedidoVentaDetalle_1 = require("../models/PedidoVentaDetalle");
const Producto_1 = require("../models/Producto");
const getPedidosVentaSinFiltro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pedidoVentaRepository = conexion_1.AppDataSource.getRepository(PedidoVenta_1.PedidoVenta);
        const pedidoVentas = yield pedidoVentaRepository.find({
            relations: ["detalles", "detalles.producto"] // Cargar detalles y productos relacionados
        });
        res.status(200).json(pedidoVentas);
    }
    catch (error) {
        console.error("Error al obtener los pedidos de ventas:", error);
        res.status(500).json({ message: "Error al obtener los pedidos de venta" });
    }
});
exports.getPedidosVentaSinFiltro = getPedidosVentaSinFiltro;
const getPedidosVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pedidoVentaRepository = conexion_1.AppDataSource.getRepository(PedidoVenta_1.PedidoVenta);
        // Usamos QueryBuilder para obtener los pedidos y filtrar los detalles con existe = 1
        const pedidoVentas = yield pedidoVentaRepository
            .createQueryBuilder("pedidoVenta")
            .leftJoinAndSelect("pedidoVenta.cliente", "cliente")
            .leftJoinAndSelect("pedidoVenta.detalles", "detalle")
            .leftJoinAndSelect("detalle.producto", "producto")
            .where("pedidoVenta.existe = :existe", { existe: 1 })
            .andWhere("detalle.existe = :detalleExiste", { detalleExiste: 1 }) // Filtramos detalles
            .getMany();
        res.status(200).json(pedidoVentas);
    }
    catch (error) {
        console.error("Error al obtener los pedidos de ventas:", error);
        res.status(500).json({ message: "Error al obtener los pedidos de venta" });
    }
});
exports.getPedidosVenta = getPedidosVenta;
const getPedidosVentaid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const pedidoVentaRepository = conexion_1.AppDataSource.getRepository(PedidoVenta_1.PedidoVenta);
        // Usamos QueryBuilder para obtener el pedido de venta y filtrar los detalles con existe = 1
        const pedidoVentas = yield pedidoVentaRepository
            .createQueryBuilder("pedidoVenta")
            .leftJoinAndSelect("pedidoVenta.cliente", "cliente")
            .leftJoinAndSelect("pedidoVenta.detalles", "detalle")
            .leftJoinAndSelect("detalle.producto", "producto")
            .where("pedidoVenta.id = :id", { id: Number(id) })
            .andWhere("pedidoVenta.existe = :existe", { existe: 1 })
            .andWhere("detalle.existe = :detalleExiste", { detalleExiste: 1 }) // Filtramos detalles
            .getMany();
        if (pedidoVentas.length > 0) {
            res.status(200).json(pedidoVentas);
            console.log(pedidoVentas); // Verifica si los detalles están siendo cargados correctamente
        }
        else {
            res.status(404).json({ message: "Pedido de venta no encontrado" });
        }
    }
    catch (error) {
        console.error("Error al obtener los pedidos de ventas:", error);
        res.status(500).json({ message: "Error al obtener los pedidos de venta" });
    }
});
exports.getPedidosVentaid = getPedidosVentaid;
const crearPedidosVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Datos recibidos en req.body:", req.body);
    const pedidoData = req.body;
    // console.log("este el el body --------------------------------------------------------" + pedidoData);
    const queryRunner = conexion_1.AppDataSource.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        const pedidoBuffer = new PedidoVenta_1.PedidoVenta();
        pedidoBuffer.cliente = yield conexion_1.AppDataSource.getRepository(Cliente_1.Cliente).findOneByOrFail({ id: Number(pedidoData.cliente.id) });
        pedidoBuffer.fechaPedido = pedidoData.fechaPedido;
        pedidoBuffer.nroComprobante = pedidoData.nroComprobante;
        pedidoBuffer.formaPago = pedidoData.formaPago;
        pedidoBuffer.observaciones = pedidoData.observaciones;
        pedidoBuffer.totalPedido = pedidoData.totalPedido;
        pedidoBuffer.existe = 1;
        const pedidoGuardado = yield queryRunner.manager.save(PedidoVenta_1.PedidoVenta, pedidoBuffer);
        //detalles
        if (pedidoData.detalles && pedidoData.detalles.length > 0) {
            for (const detalles of pedidoData.detalles) {
                const detalleBuffer = new PedidoVentaDetalle_1.PedidoVentaDetalle();
                detalleBuffer.pedidoVenta = pedidoGuardado;
                detalleBuffer.producto = yield conexion_1.AppDataSource.getRepository(Producto_1.Producto).findOneByOrFail({ id: detalles.producto.id });
                detalleBuffer.cantidad = detalles.cantidad;
                detalleBuffer.subtotal = detalles.subtotal;
                detalleBuffer.existe = 1;
                yield queryRunner.manager.save(PedidoVentaDetalle_1.PedidoVentaDetalle, detalleBuffer);
            }
        }
        yield queryRunner.commitTransaction();
        //devuelve "pedido" como pedido venta guardado
        res.status(201).json({ message: "Pedido de venta creado con éxito", pedido: pedidoGuardado });
    }
    catch (error) {
        // Si ocurre un error, hacer rollback de la transacción
        yield queryRunner.rollbackTransaction();
        console.error("Error al crear el pedido de venta:", error);
        res.status(500).json({ message: "Error al crear el pedido de venta", error });
    }
    finally {
        // Liberar el queryRunner
        yield queryRunner.release();
    }
});
exports.crearPedidosVenta = crearPedidosVenta;
const updatePedidoVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // ID del pedido a actualizar
    const pedidoData = req.body;
    const queryRunner = conexion_1.AppDataSource.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        // Repositorios necesarios
        const pedidoRepo = conexion_1.AppDataSource.getRepository(PedidoVenta_1.PedidoVenta);
        const detalleRepo = conexion_1.AppDataSource.getRepository(PedidoVentaDetalle_1.PedidoVentaDetalle);
        const clienteRepo = conexion_1.AppDataSource.getRepository(Cliente_1.Cliente);
        const productoRepo = conexion_1.AppDataSource.getRepository(Producto_1.Producto);
        // Buscar el pedido existente
        const pedido = yield pedidoRepo.findOne({
            where: { id: Number(id), existe: 1 },
            relations: ["detalles", "cliente"],
        });
        if (!pedido) {
            res.status(404).json({ message: "Pedido no encontrado" });
            return;
        }
        // Actualizar datos del pedido
        pedido.cliente = yield clienteRepo.findOneByOrFail({ id: pedidoData.cliente.id });
        pedido.fechaPedido = pedidoData.fechaPedido;
        pedido.nroComprobante = pedidoData.nroComprobante;
        pedido.formaPago = pedidoData.formaPago;
        pedido.observaciones = pedidoData.observaciones;
        pedido.totalPedido = pedidoData.totalPedido;
        pedido.existe = pedidoData.existe;
        // Manejar los detalles
        const detallesEnBaseDeDatos = pedido.detalles || [];
        const detallesEnviados = pedidoData.detalles || [];
        // Crear un mapa para los detalles existentes en la base de datos
        const mapaDetallesBD = new Map(detallesEnBaseDeDatos.map((det) => [det.id, det]));
        // Lista para los detalles actualizados o nuevos
        const detallesActualizados = [];
        for (const detalleEnviado of detallesEnviados) {
            if (detalleEnviado.id) {
                // Actualizar detalle existente
                const detalleExistente = mapaDetallesBD.get(detalleEnviado.id);
                if (detalleExistente) {
                    detalleExistente.cantidad = detalleEnviado.cantidad;
                    detalleExistente.subtotal = detalleEnviado.subtotal;
                    detalleExistente.existe = detalleEnviado.existe;
                    detalleExistente.producto = yield productoRepo.findOneByOrFail({ id: detalleEnviado.producto.id });
                    detallesActualizados.push(detalleExistente);
                    mapaDetallesBD.delete(detalleEnviado.id);
                }
            }
            else {
                // Crear nuevo detalle
                const nuevoDetalle = detalleRepo.create({
                    cantidad: detalleEnviado.cantidad,
                    subtotal: detalleEnviado.subtotal,
                    existe: detalleEnviado.existe,
                    producto: yield productoRepo.findOneByOrFail({ id: detalleEnviado.producto.id }),
                    pedidoVenta: pedido,
                });
                detallesActualizados.push(nuevoDetalle);
            }
        }
        // Eliminar los detalles que no están en el JSON recibido
        const detallesAEliminar = Array.from(mapaDetallesBD.values());
        if (detallesAEliminar.length > 0) {
            yield detalleRepo.remove(detallesAEliminar);
        }
        // Actualizar los detalles en el pedido y guardar
        pedido.detalles = detallesActualizados;
        yield queryRunner.manager.save(pedido);
        // Confirmar la transacción
        yield queryRunner.commitTransaction();
        res.status(200).json({ message: "Pedido actualizado correctamente", pedido });
    }
    catch (error) {
        // Revertir la transacción en caso de error
        yield queryRunner.rollbackTransaction();
        console.error("Error al actualizar el pedido:", error);
        res.status(500).json({ message: "Error al actualizar el pedido", error });
    }
    finally {
        // Liberar el queryRunner
        yield queryRunner.release();
    }
});
exports.updatePedidoVenta = updatePedidoVenta;
const eliminarPedidoVenta = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Obtener el ID del pedido a eliminar
    const queryRunner = conexion_1.AppDataSource.createQueryRunner();
    yield queryRunner.connect();
    yield queryRunner.startTransaction();
    try {
        // 1. Repositorios
        const pedidoRepo = conexion_1.AppDataSource.getRepository(PedidoVenta_1.PedidoVenta);
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
exports.eliminarPedidoVenta = eliminarPedidoVenta;
