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
exports.PedidoVenta = void 0;
const typeorm_1 = require("typeorm");
const Cliente_1 = require("./Cliente");
const PedidoVentaDetalle_1 = require("./PedidoVentaDetalle");
let PedidoVenta = class PedidoVenta {
    // Método para agregar un detalle al pedido
    agregarDetalle(detalle) {
        if (!detalle.producto || !detalle.cantidad || !detalle.subtotal) {
            console.error("Detalle incompleto:", detalle);
            return false;
        }
        this.detalles.push(detalle);
        return true;
    }
};
exports.PedidoVenta = PedidoVenta;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PedidoVenta.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Cliente_1.Cliente, (cliente) => cliente.pedidos, { nullable: false, eager: true }),
    __metadata("design:type", Cliente_1.Cliente)
], PedidoVenta.prototype, "cliente", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 10 }),
    __metadata("design:type", String)
], PedidoVenta.prototype, "fechaPedido", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "bigint", unique: true }),
    __metadata("design:type", Number)
], PedidoVenta.prototype, "nroComprobante", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 50 }),
    __metadata("design:type", String)
], PedidoVenta.prototype, "formaPago", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], PedidoVenta.prototype, "observaciones", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], PedidoVenta.prototype, "totalPedido", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "int", default: 1 }),
    __metadata("design:type", Number)
], PedidoVenta.prototype, "existe", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PedidoVentaDetalle_1.PedidoVentaDetalle, (detalle) => detalle.pedidoVenta, { cascade: true }),
    __metadata("design:type", Array)
], PedidoVenta.prototype, "detalles", void 0);
exports.PedidoVenta = PedidoVenta = __decorate([
    (0, typeorm_1.Entity)()
], PedidoVenta);
