import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { PedidoVentaDetalle } from "./PedidoVentaDetalle";

@Entity()
export class Producto {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 50, unique: true })
    codigoProducto: string;

    @Column({ type: "varchar", length: 100 })
    denominacion: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    precioVenta: number;

    @OneToMany(() => PedidoVentaDetalle, (detalle) => detalle.producto)
    detalles: PedidoVentaDetalle[];
}
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