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
exports.Cliente = void 0;
const typeorm_1 = require("typeorm");
const PedidoVenta_1 = require("./PedidoVenta");
let Cliente = class Cliente {
};
exports.Cliente = Cliente;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Cliente.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 20, unique: true }),
    __metadata("design:type", String)
], Cliente.prototype, "cuit", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", length: 100 }),
    __metadata("design:type", String)
], Cliente.prototype, "razonSocial", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => PedidoVenta_1.PedidoVenta, (pedidoVenta) => pedidoVenta.cliente),
    __metadata("design:type", Array)
], Cliente.prototype, "pedidos", void 0);
exports.Cliente = Cliente = __decorate([
    (0, typeorm_1.Entity)()
], Cliente);
/*
INSERT INTO Cliente (cuit, razonSocial) VALUES
('20-12345678-1', 'Comercial Pérez S.A.'),
('20-23456789-2', 'Transportes López Ltda.'),
('30-34567890-3', 'Inversiones Gómez SRL'),
('30-45678901-4', 'Servicios Martínez SA'),
('20-56789012-5', 'Industrias Fernández S.A.'),
('20-67890123-6', 'Construcciones García EIRL'),
('30-78901234-7', 'Electrodomésticos Rodríguez S.A.'),
('30-89012345-8', 'Textiles Sánchez Ltda.'),
('20-90123456-9', 'Agropecuaria Ramírez SRL'),
('30-01234567-0', 'Tecnología Flores SA'),
('20-11223344-1', 'Minería Torres Ltda.'),
('30-22334455-2', 'Automotriz González S.A.'),
('20-33445566-3', 'Farmacia Castro EIRL'),
('30-44556677-4', 'Panadería Ortiz S.A.'),
('20-55667788-5', 'Mueblería Silva Ltda.'),
('30-66778899-6', 'Ropa Morales S.A.'),
('20-77889900-7', 'Electrónica Cruz SRL'),
('30-88990011-8', 'Ferretería Delgado SA'),
('20-99001122-9', 'Papelería Rivas EIRL'),
('30-10111213-0', 'Supermercado Gómez SRL');

*/
