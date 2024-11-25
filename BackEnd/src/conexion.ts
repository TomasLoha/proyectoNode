import { DataSource } from "typeorm";
import { Cliente } from "./models/Cliente";
import { Producto } from "./models/Producto";
import { PedidoVenta } from "./models/PedidoVenta";
import { PedidoVentaDetalle } from "./models/PedidoVentaDetalle";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "86023",
    database: "shop2",
    synchronize: false,
    logging: true,
    entities: [Cliente,Producto,PedidoVenta,PedidoVentaDetalle],
    subscribers: [],
    migrations: [],
})