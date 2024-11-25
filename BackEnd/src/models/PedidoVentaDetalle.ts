import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { PedidoVenta } from "./PedidoVenta";
import { Producto } from "./Producto";

@Entity()
export class PedidoVentaDetalle {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => PedidoVenta, (pedidoVenta) => pedidoVenta.detalles, { nullable: false, onDelete: "CASCADE" })
    pedidoVenta: PedidoVenta;

    @ManyToOne(() => Producto, (producto) => producto.detalles, { nullable: false, eager: true })
    producto: Producto;

    @Column({ type: "varchar", length: 10 })
    cantidad: string;

    @Column({ type: "decimal", precision: 10, scale: 2 })
    subtotal: string;

    @Column({ type: "int", default: 1 }) // Ahora es de tipo number (integer en la DB)
    existe: number;
}
