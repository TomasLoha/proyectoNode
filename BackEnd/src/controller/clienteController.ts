// src/controllers/ClienteController.ts
import { Request, Response } from 'express';
import { Cliente } from '../models/Cliente'; // Modelo de cliente si es necesario para validaciones o transformaciones
import { AppDataSource } from "../conexion";


  export const getClientes = async (req: Request, res: Response) => {
    try {
        // Obtener el repositorio del modelo Cliente
        const clienteRepository = AppDataSource.getRepository(Cliente);

        // Obtener todos los clientes
        const clientes = await clienteRepository.find();

        // Devolver los clientes
        res.status(200).json(clientes);
    } catch (error) {
        console.error("Error al obtener los clientes:", error);
        res.status(500).json({ message: "Error al obtener los clientes" });
    }
};
  export const getClientesid = async (req: Request, res: Response) => {
    const {id} = req.params;
    try {
        
        const clienteRepository = AppDataSource.getRepository(Cliente);

        
        const cliente = await clienteRepository.findOneBy({id : Number(id)});

        
        res.status(200).json(cliente);
    } catch (error) {
        console.error("Error al obtener los clientes:", error);
        res.status(500).json({ message: "Error al obtener los clientes" });
    }
};


