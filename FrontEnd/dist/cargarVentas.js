var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let detalles = [];
var pedidoVenta;
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
            success: (productos) => {
                const producto = productos[0];
                precioProducto = producto.precioVenta;
                let precioSubtotal = (precioProducto * cantidadProducto);
                totalPedido += precioSubtotal;
                let detalle = {
                    id: 0,
                    pedidoVenta: pedidoVenta,
                    producto: producto,
                    cantidad: Number(cantidadProducto),
                    subtotal: precioSubtotal,
                    existe: 1
                };
                detalles.push(detalle);
                actualizarTotalPedido();
                $("#cantidadProducto").val('');
                mostrarDetalles();
            }
        });
    }
    else {
        alert("No ingreso ninguna cantidad!!!");
    }
});
function mostrarDetalles() {
    let divDetalles = $("#detalles");
    divDetalles.empty();
    let i = 1;
    for (const detalle of detalles) {
        let formDetalle = `
            <form class="detalleForm" style="width: 30%; margin: 3% auto; height: 22rem; border: solid, black">
            <label>Detalle: </label><label name="posicion">${i}</label><br>
            <label name="producto">Producto: ${detalle.producto.denominacion} | Precio: $${detalle.producto.precioVenta}</label><br>
            <label name="cantidad">Cantidad: ${detalle.cantidad}</label><br>
            <label>Subtotal: $</label><label name="subtotal">${detalle.subtotal}</label><br>
            <button type="button" class="borrarDetalle">Borrar</button>
            </form>
            `;
        divDetalles.append(formDetalle);
        i++;
    }
}
$(document).on("click", ".borrarDetalle", function (event) {
    event.preventDefault();
    let form = $(this).closest(".detalleForm");
    let posicion = parseInt(form.find("label[name='posicion']").text()) - 1;
    let subtotal = form.find("label[name='subtotal']").text();
    totalPedido -= parseFloat(subtotal);
    detalles.splice(posicion, 1);
    actualizarTotalPedido();
    mostrarDetalles();
});
function actualizarTotalPedido() {
    $("#totalPedido").text(`${totalPedido}`);
}
function subirVenta() {
    return __awaiter(this, void 0, void 0, function* () {
        if (totalPedido != 0) {
            const idCliente = $("#clientes").val();
            const fechaPedido = $("#fechaPedido").val();
            const nroComprobante = $("#comprobantePedido").val();
            const formaPago = $("#formaPago").val();
            const observaciones = $("#observaciones").val();
            const totalPedido = parseFloat($("#totalPedido").text());
            if (idCliente && fechaPedido && nroComprobante && formaPago && observaciones && totalPedido) {
                try {
                    // Obtener el cliente directamente dentro de subirVenta
                    const cliente = yield $.ajax({
                        url: `http://localhost:3000/admin/service/clientes/${idCliente}`,
                        method: "GET",
                    });
                    // Crear y asignar valores al objeto PedidoVenta
                    const pedidoVenta = {
                        id: 0,
                        cliente: cliente, // Asignar el cliente obtenido
                        fechaPedido: fechaPedido,
                        nroComprobante: nroComprobante ? parseInt(nroComprobante) : 0,
                        formaPago: formaPago,
                        observaciones: observaciones,
                        totalPedido: totalPedido,
                        existe: 1,
                        detalles: detalles, // Detalles acumulados previamente
                    };
                    console.log("Datos al create ", pedidoVenta);
                    // Enviar el pedido al servidor
                    $.ajax({
                        url: `http://localhost:3000/admin/service/pedido_venta/CREATE`,
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(pedidoVenta),
                    });
                    alert("El pedido y los detalles se cargaron exitosamente!!!");
                    location.reload();
                }
                catch (error) {
                    alert("Ocurrió un error al procesar la venta: ");
                }
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
export {};
