import { Cliente } from "./Cliente";
import { PedidoVentaDetalle } from "./PedidoVentaDetalle";

export type PedidoVenta = {
    id: number;
    cliente: Cliente; // Relacionado con Cliente
    fechaPedido: string;
    nroComprobante: number;
    formaPago: string;
    observaciones: string;
    totalPedido: number;
    existe: number
    detalles: PedidoVentaDetalle[];
}