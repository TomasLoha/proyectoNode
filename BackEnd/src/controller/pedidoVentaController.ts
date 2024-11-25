// src/controlador/pedidoVenta.ts
import { Request, Response } from "express";
import {PedidoVenta} from '../models/PedidoVenta'
import { AppDataSource } from "../conexion"; 
import { Cliente } from "../models/Cliente";
import { PedidoVentaDetalle } from "../models/PedidoVentaDetalle";
import { Producto } from "../models/Producto";
import { resolve } from '../../node_modules/app-root-path/index.d';





export const getPedidosVentaSinFiltro = async (req: Request, res: Response) => {
    try {
        
        const pedidoVentaRepository = AppDataSource.getRepository(PedidoVenta);

        
        const pedidoVentas = await pedidoVentaRepository.find({
            
            relations: ["detalles", "detalles.producto"]  // Cargar detalles y productos relacionados
        });

        
        res.status(200).json(pedidoVentas);
    } catch (error) {
        console.error("Error al obtener los pedidos de ventas:", error);
        res.status(500).json({ message: "Error al obtener los pedidos de venta" });
    }
};
export const getPedidosVenta = async (req: Request, res: Response) => {
    try {
        const pedidoVentaRepository = AppDataSource.getRepository(PedidoVenta);

        // Usamos QueryBuilder para obtener los pedidos y filtrar los detalles con existe = 1
        const pedidoVentas = await pedidoVentaRepository
            .createQueryBuilder("pedidoVenta")
            .leftJoinAndSelect("pedidoVenta.cliente", "cliente")
            .leftJoinAndSelect("pedidoVenta.detalles", "detalle")
            .leftJoinAndSelect("detalle.producto", "producto")
            .where("pedidoVenta.existe = :existe", { existe: 1 })
            .andWhere("detalle.existe = :detalleExiste", { detalleExiste: 1 })  // Filtramos detalles
            .getMany();

        res.status(200).json(pedidoVentas);
    } catch (error) {
        console.error("Error al obtener los pedidos de ventas:", error);
        res.status(500).json({ message: "Error al obtener los pedidos de venta" });
    }
};



export const getPedidosVentaid = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const pedidoVentaRepository = AppDataSource.getRepository(PedidoVenta);

        // Usamos QueryBuilder para obtener el pedido de venta y filtrar los detalles con existe = 1
        const pedidoVentas = await pedidoVentaRepository
            .createQueryBuilder("pedidoVenta")
            .leftJoinAndSelect("pedidoVenta.cliente", "cliente")
            .leftJoinAndSelect("pedidoVenta.detalles", "detalle")
            .leftJoinAndSelect("detalle.producto", "producto")
            .where("pedidoVenta.id = :id", { id: Number(id) })
            .andWhere("pedidoVenta.existe = :existe", { existe: 1 })
            .andWhere("detalle.existe = :detalleExiste", { detalleExiste: 1 })  // Filtramos detalles
            .getMany();

        if (pedidoVentas.length > 0) {
            res.status(200).json(pedidoVentas);
            console.log(pedidoVentas);  // Verifica si los detalles están siendo cargados correctamente
        } else {
            res.status(404).json({ message: "Pedido de venta no encontrado" });
        }
    } catch (error) {
        console.error("Error al obtener los pedidos de ventas:", error);
        res.status(500).json({ message: "Error al obtener los pedidos de venta" });
    }
};


export const crearPedidosVenta = async (req: Request, res: Response) => {
    console.log("Datos recibidos en req.body:", req.body);
    const pedidoData : PedidoVenta = req.body;
    // console.log("este el el body --------------------------------------------------------" + pedidoData);
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        
        const pedidoBuffer = new PedidoVenta();
        pedidoBuffer.cliente = await AppDataSource.getRepository(Cliente).findOneByOrFail({id: Number(pedidoData.cliente.id)})
        pedidoBuffer.fechaPedido = pedidoData.fechaPedido;
        pedidoBuffer.nroComprobante = pedidoData.nroComprobante;
        pedidoBuffer.formaPago = pedidoData.formaPago;
        pedidoBuffer.observaciones = pedidoData.observaciones;
        pedidoBuffer.totalPedido = pedidoData.totalPedido;
        pedidoBuffer.existe = 1;
        const pedidoGuardado = await queryRunner.manager.save(PedidoVenta, pedidoBuffer);


        //detalles

        if(pedidoData.detalles && pedidoData.detalles.length > 0){
            for(const detalles of pedidoData.detalles){
                const detalleBuffer = new PedidoVentaDetalle();
                detalleBuffer.pedidoVenta = pedidoGuardado;
                detalleBuffer.producto = await AppDataSource.getRepository(Producto).findOneByOrFail({ id: detalles.producto.id })
                detalleBuffer.cantidad = detalles.cantidad;
                detalleBuffer.subtotal = detalles.subtotal;
                detalleBuffer.existe = 1;

                await queryRunner.manager.save(PedidoVentaDetalle, detalleBuffer);

            }
        }
        await queryRunner.commitTransaction();
        //devuelve "pedido" como pedido venta guardado
        res.status(201).json({ message: "Pedido de venta creado con éxito", pedido: pedidoGuardado });

    } catch (error) {
        // Si ocurre un error, hacer rollback de la transacción
        await queryRunner.rollbackTransaction();
        console.error("Error al crear el pedido de venta:", error);
        res.status(500).json({ message: "Error al crear el pedido de venta", error });
    } finally {
        // Liberar el queryRunner
        await queryRunner.release();
    }

};



export const updatePedidoVenta = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // ID del pedido a actualizar
    const pedidoData: PedidoVenta = req.body;

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // Repositorios necesarios
        const pedidoRepo = AppDataSource.getRepository(PedidoVenta);
        const detalleRepo = AppDataSource.getRepository(PedidoVentaDetalle);
        const clienteRepo = AppDataSource.getRepository(Cliente);
        const productoRepo = AppDataSource.getRepository(Producto);

        // Buscar el pedido existente
        const pedido = await pedidoRepo.findOne({
            where: { id: Number(id), existe: 1 },
            relations: ["detalles", "cliente"],
        });

        if (!pedido) {
            res.status(404).json({ message: "Pedido no encontrado" });
            return;
        }

        // Actualizar datos del pedido
        pedido.cliente = await clienteRepo.findOneByOrFail({ id: pedidoData.cliente.id });
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
        const detallesActualizados: PedidoVentaDetalle[] = [];

        for (const detalleEnviado of detallesEnviados) {
            if (detalleEnviado.id) {
                // Actualizar detalle existente
                const detalleExistente = mapaDetallesBD.get(detalleEnviado.id);
                if (detalleExistente) {
                    detalleExistente.cantidad = detalleEnviado.cantidad;
                    detalleExistente.subtotal = detalleEnviado.subtotal;
                    detalleExistente.existe = detalleEnviado.existe;
                    detalleExistente.producto = await productoRepo.findOneByOrFail({ id: detalleEnviado.producto.id });
                    detallesActualizados.push(detalleExistente);
                    mapaDetallesBD.delete(detalleEnviado.id);
                }
            } else {
                // Crear nuevo detalle
                const nuevoDetalle = detalleRepo.create({
                    cantidad: detalleEnviado.cantidad,
                    subtotal: detalleEnviado.subtotal,
                    existe: detalleEnviado.existe,
                    producto: await productoRepo.findOneByOrFail({ id: detalleEnviado.producto.id }),
                    pedidoVenta: pedido,
                });
                detallesActualizados.push(nuevoDetalle);
            }
        }

        // Eliminar los detalles que no están en el JSON recibido
        const detallesAEliminar = Array.from(mapaDetallesBD.values());
        if (detallesAEliminar.length > 0) {
            await detalleRepo.remove(detallesAEliminar);
        }

        // Actualizar los detalles en el pedido y guardar
        pedido.detalles = detallesActualizados;
        await queryRunner.manager.save(pedido);

        // Confirmar la transacción
        await queryRunner.commitTransaction();
        res.status(200).json({ message: "Pedido actualizado correctamente", pedido });
    } catch (error) {
        // Revertir la transacción en caso de error
        await queryRunner.rollbackTransaction();
        console.error("Error al actualizar el pedido:", error);
        res.status(500).json({ message: "Error al actualizar el pedido", error });
    } finally {
        // Liberar el queryRunner
        await queryRunner.release();
    }
};



export const eliminarPedidoVenta = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Obtener el ID del pedido a eliminar
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // 1. Repositorios
        const pedidoRepo = AppDataSource.getRepository(PedidoVenta);
        

        // 2. Buscar el pedido existente
        const pedido = await pedidoRepo.findOne({
            where: { id: Number(id), existe: 1 },
            relations: ["detalles"],
        });

        if (!pedido) {
            res.status(404).json({ message: "Pedido no encontrado" });
            return;
        }

        // 4. Eliminar el pedido de venta
        await pedidoRepo.remove(pedido);

        // 5. Confirmar la transacción
        await queryRunner.commitTransaction();
        res.status(200).json({ message: "Pedido de venta eliminado correctamente" });
    } catch (error) {
        // 6. Revertir la transacción en caso de error
        await queryRunner.rollbackTransaction();
        console.error("Error al eliminar el pedido:", error);
        res.status(500).json({ message: "Error al eliminar el pedido", error });
    } finally {
        // 7. Liberar el queryRunner
        await queryRunner.release();
    }
};
