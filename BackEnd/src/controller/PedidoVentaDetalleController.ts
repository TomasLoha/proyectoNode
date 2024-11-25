// src/controlador/pedidoVentaDetalle.ts
import { Request, Response } from "express";
import { PedidoVentaDetalle } from '../models/PedidoVentaDetalle';
import { AppDataSource } from "../conexion";



export const getPedidosVentaDetalle = async (req: Request, res: Response) => {
    try {
        
        const pedidoVentaDetalleRepository = AppDataSource.getRepository(PedidoVentaDetalle);

        
        const pedidoVentaDetalles = await pedidoVentaDetalleRepository.find({
            where: { existe: 1 }, 
        });

        
        res.status(200).json(pedidoVentaDetalles);
    } catch (error) {
        console.error("Error al obtener los detalles:", error);
        res.status(500).json({ message: "Error al obtener los detalles" });
    }
};
export const getPedidosVentaDetalleid = async (req: Request, res: Response) => {

    const {id} = req.params;

    try {
        
        const pedidoVentaDetalleRepository = AppDataSource.getRepository(PedidoVentaDetalle);

        
        const pedidoVentaDetalles = await pedidoVentaDetalleRepository.findBy({id : Number(id),existe:1});

        
        res.status(200).json(pedidoVentaDetalles);
    } catch (error) {
        console.error("Error al obtener los detalles:", error);
        res.status(500).json({ message: "Error al obtener los detalles" });
    }
};
export const crearPedidosVentaDetalle = async (req: Request, res: Response) => {

    const {id} = req.params;

    try {
        
        const pedidoVentaDetalleRepository = AppDataSource.getRepository(PedidoVentaDetalle);

        
        const pedidoVentaDetalles = await pedidoVentaDetalleRepository.findBy({id : Number(id)});

        
        res.status(200).json(pedidoVentaDetalles);
    } catch (error) {
        console.error("Error al obtener los detalles:", error);
        res.status(500).json({ message: "Error al obtener los detalles" });
    }
};


export const eliminarPedidoVentaDetalle = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params; // Obtener el ID del pedido a eliminar
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
        // 1. Repositorios
        const pedidoRepo = AppDataSource.getRepository(PedidoVentaDetalle);
        

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


