import { Request, Response } from "express";
import {Producto} from '../models/Producto'
import { AppDataSource } from "../conexion";
 // Obtener todos los productos

export const getProductos = async (req: Request, res: Response) => {
    try {
        
        const productoRepository = AppDataSource.getRepository(Producto);

        
        const productos = await productoRepository.find();

        
        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener los clientes:", error);
        res.status(500).json({ message: "Error al obtener los clientes" });
    }
};
export const getProductosid = async (req: Request, res: Response) => {
    const {id} = req.params;

    try {
        
        const productoRepository = AppDataSource.getRepository(Producto);

        
        const productos = await productoRepository.findBy({id : Number(id)});

        
        res.status(200).json(productos);
    } catch (error) {
        console.error("Error al obtener los productos:", error);
        res.status(500).json({ message: "Error al obtener los productos" });
    }
};

