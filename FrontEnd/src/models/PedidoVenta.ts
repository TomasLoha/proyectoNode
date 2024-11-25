import { Cliente, PedidoVentaDetalle } from "../modelos";

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