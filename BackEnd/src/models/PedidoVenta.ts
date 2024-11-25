import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { Cliente } from "./Cliente";
import { PedidoVentaDetalle } from "./PedidoVentaDetalle";

@Entity()
export class PedidoVenta {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cliente, (cliente) => cliente.pedidos, { nullable: false, eager: true })
    cliente: Cliente;

    @Column({ type: "varchar", length: 10 })
    fechaPedido: string;

    @Column({ type: "bigint", unique: true })
    nroComprobante: number;

    @Column({ type: "varchar", length: 50 })
    formaPago: string;

    @Column({ type: "text", nullable: true })
    observaciones: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    totalPedido: number;

    @Column({ type: "int", default: 1 })
    existe: number;

    @OneToMany(() => PedidoVentaDetalle, (detalle) => detalle.pedidoVenta, { cascade: true })
    detalles: PedidoVentaDetalle[];

    // Método para agregar un detalle al pedido
    agregarDetalle(detalle: PedidoVentaDetalle): boolean {
        if (!detalle.producto || !detalle.cantidad || !detalle.subtotal) {
        console.error("Detalle incompleto:", detalle);
        return false;
        }
        this.detalles.push(detalle);
        return true;
    }
}
