export type Producto = {
    id?: number;
    codigoProducto: string;
    denominacion: string;
    precioVenta: number;
}

export type PedidoVentaDetalle = {
    id?: number;
    pedidoVenta: PedidoVenta; // Relacionado con PedidoVenta
    producto: Producto; // Relacionado con Producto
    cantidad: string;
    subtotal: string;
    existe: number
}

export type PedidoVenta = {
    id?: number;
    cliente: Cliente; // Relacionado con Cliente
    fechaPedido: string;
    nroComprobante: number;
    formaPago: string;
    observaciones: string;
    totalPedido: number;
    existe: number;
    detalles: PedidoVenta[];
}

export type Cliente = {
    id?: number;
    cuit: string;
    razonSocial: string;
}

