"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const Cliente_1 = require("./models/Cliente");
const Producto_1 = require("./models/Producto");
const PedidoVenta_1 = require("./models/PedidoVenta");
const PedidoVentaDetalle_1 = require("./models/PedidoVentaDetalle");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "shop2",
    synchronize: false,
    logging: true,
    entities: [Cliente_1.Cliente, Producto_1.Producto, PedidoVenta_1.PedidoVenta, PedidoVentaDetalle_1.PedidoVentaDetalle],
    subscribers: [],
    migrations: [],
});
