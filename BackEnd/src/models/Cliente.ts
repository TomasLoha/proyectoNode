import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PedidoVenta } from "./PedidoVenta";

@Entity()
export class Cliente {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 20, unique: true })
    cuit: string;

    @Column({ type: "varchar", length: 100 })
    razonSocial: string;

    @OneToMany(() => PedidoVenta, (pedidoVenta) => pedidoVenta.cliente)
    pedidos: PedidoVenta[];
}
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

