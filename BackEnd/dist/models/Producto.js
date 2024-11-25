"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Producto = void 0;
const typeorm_1 = require("typeorm");
const PedidoVentaDetalle_1 = require("./PedidoVentaDetalle");
let Producto = class Producto {
};
exports.Producto = Producto;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Producto.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50, unique: true }),
    __metadata("design:type", String)
], Producto.prototype, "codigoProducto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], Producto.prototype, "denominacion", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Producto.prototype, "precioVenta", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PedidoVentaDetalle_1.PedidoVentaDetalle, (detalle) => detalle.producto),
    __metadata("design:type", Array)
], Producto.prototype, "detalles", void 0);
exports.Producto = Producto = __decorate([
    (0, typeorm_1.Entity)()
], Producto);
/*
INSERT INTO Producto (codigoProducto, denominacion, precioVenta) VALUES
('P001', 'Laptop Intel Core i5', 1200.00),
('P002', 'Mouse Óptico Inalámbrico', 25.50),
('P003', 'Teclado Mecánico RGB', 75.99),
('P004', 'Monitor LED 24 pulgadas', 220.00),
('P005', 'Impresora Multifunción', 299.99),
('P006', 'Smartphone Samsung Galaxy', 800.00),
('P007', 'Auriculares Bluetooth', 150.75),
('P008', 'Tablet 10" 64GB', 550.00),
('P009', 'Disco Duro Externo 1TB', 89.99),
('P010', 'Pendrive 64GB USB 3.0', 12.50),
('P011', 'Cámara Digital Canon', 450.00),
('P012', 'Altavoces Estéreo', 100.00),
('P013', 'Router WiFi Dual-Band', 95.00),
('P014', 'Smartwatch Deportivo', 275.00),
('P015', 'Microondas 20L', 180.50),
('P016', 'Refrigerador 300L', 1300.00),
('P017', 'Lavadora Automática 7kg', 980.00),
('P018', 'Secadora de Ropa 7kg', 870.00),
('P019', 'Aspiradora Vertical', 325.00),
('P020', 'Cafetera Espresso', 175.99);

*/ 
