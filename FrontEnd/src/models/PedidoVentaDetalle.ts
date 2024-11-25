import { PedidoVenta } from "./PedidoVenta";
import { Producto } from "./Producto";

export type PedidoVentaDetalle = {
    id: number
    pedidoVenta: PedidoVenta; // Relacionado con PedidoVenta
    producto: Producto; // Relacionado con Producto
    cantidad: number;
    subtotal: number;
    existe: number
}