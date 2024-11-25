"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
$(() => {
    let detalles = [];
    let totalPedido = 0;
    function buscarClientes() {
        let clientes = $("#clientes");
        $.ajax({
            url: `http://localhost:3000/admin/service/clientes`,
            method: "GET",
            success: (arrayClientes) => {
                arrayClientes.forEach((cliente) => {
                    let option = `<option value="${cliente.id}">${cliente.razonSocial}</option>`;
                    clientes.append(option);
                });
            },
            error: () => {
                alert("No se encuentran clientes");
            }
        });
    }
    function buscarProductos() {
        let productos = $("#productos");
        $.ajax({
            url: `http://localhost:3000/admin/service/productos`,
            method: "GET",
            success: (arrayProductos) => {
                arrayProductos.forEach((producto) => {
                    let option = `<option value="${producto.id}">${producto.denominacion} | Precio: $${producto.precioVenta}</option>`;
                    productos.append(option);
                });
            },
            error: () => {
                alert("No se encuentran productos");
            }
        });
    }
    $("#agregarProducto").on("click", function CrearDetalle(event) {
        event.preventDefault();
        let idProducto = $("#productos").val();
        let cantidadProducto = parseInt($("#cantidadProducto").val());
        if (idProducto && cantidadProducto) {
            let precioProducto = 0;
            $.ajax({
                url: `http://localhost:3000/admin/service/productos/${idProducto}`,
                method: "GET",
                success: (producto) => {
                    precioProducto = producto.precioVenta;
                    let precioSubtotal = (precioProducto * cantidadProducto);
                    totalPedido += precioSubtotal;
                    let detalle = {
                        id: 0,
                        idpedidoventa: 0,
                        idproducto: idProducto ? parseInt(idProducto) : 0,
                        cantidad: cantidadProducto,
                        subtotal: precioSubtotal,
                        existe: 1
                    };
                    detalles.push(detalle);
                    actualizarTotalPedido();
                    $("#cantidadProducto").val('');
                }
            });
        }
        else {
            alert("No ingreso ninguna cantidad!!!");
        }
    });
    function actualizarTotalPedido() {
        $("#totalPedido").text(`${totalPedido}`);
    }
    function subirVenta() {
        return __awaiter(this, void 0, void 0, function* () {
            if (totalPedido != 0) {
                let id = 0;
                let idcliente = $("#clientes").val();
                let fechaPedido = $("#fechaPedido").val();
                let nroComprobante = $("#comprobantePedido").val();
                let formaPago = $("#formaPago").val();
                let observaciones = $("#observaciones").val();
                let totalPedido = parseFloat($("#totalPedido").text());
                if (idcliente && fechaPedido && nroComprobante && formaPago && observaciones && totalPedido) {
                    let pedido_venta = {
                        id: id,
                        idcliente: idcliente ? parseInt(idcliente) : 0,
                        fechaPedido: fechaPedido,
                        nroComprobante: nroComprobante ? parseInt(nroComprobante) : 0,
                        formaPago: formaPago,
                        observaciones: observaciones,
                        totalPedido: totalPedido,
                        existe: 1
                    };
                    const response = yield $.ajax({
                        url: `http://localhost:3000/admin/service/pedido_venta/CREATE`,
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(pedido_venta)
                    });
                    id = response.id;
                    for (const detalle of detalles) {
                        detalle.idpedidoventa = id;
                        yield $.ajax({
                            url: `http://localhost:3000/admin/service/pedido_venta_detalle/CREATE`,
                            method: "POST",
                            contentType: "application/json",
                            data: JSON.stringify(detalle),
                            success: (response) => {
                            },
                            error: () => {
                                alert("No se pudo cargar el detalle");
                            }
                        });
                    }
                    alert("El pedido y los detalles se cargaron exitosamente!!!");
                    location.reload();
                }
                else {
                    alert("Debe completar todos los datos del pedido para poder crearlo!");
                }
            }
            else {
                alert("Debe agregar por lo menos 1 producto al pedido!!!");
            }
        });
    }
    $("#crearPedido").on("click", (event) => {
        event.preventDefault();
        subirVenta();
    });
    buscarClientes();
    buscarProductos();
    actualizarTotalPedido();
});
