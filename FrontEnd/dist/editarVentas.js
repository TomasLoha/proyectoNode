var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let pedidoVentaGlobal;
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
function buscarIds() {
    let idPedido = $("#idPedido");
    idPedido.empty();
    $.ajax({
        url: `http://localhost:3000/admin/service/pedido_venta`,
        method: "GET",
        success: (data) => {
            data.forEach((pedidoVenta) => {
                let opcion = `<option value="${pedidoVenta.id}">${pedidoVenta.id}</option>`;
                idPedido.append(opcion);
            });
        }
    });
}
$("#buscarId").on("click", (event) => {
    event.preventDefault();
    buscarId();
});
function buscarId() {
    return __awaiter(this, void 0, void 0, function* () {
        let idPedido = $("#idPedido").val();
        let clientes = $("#clientes");
        let fechaPedido = $("#fechaPedido");
        let nroComprobante = $("#nroComprobante");
        let formaPago = $("#formaPago");
        let observaciones = $("#observaciones");
        let totalPedido = $("#totalPedido");
        yield $.ajax({
            url: `http://localhost:3000/admin/service/pedido_venta/${idPedido}`,
            method: "GET",
            success: (data) => __awaiter(this, void 0, void 0, function* () {
                let pedidoVenta = data[0];
                pedidoVentaGlobal = pedidoVenta;
                clientes.val(pedidoVenta.cliente.id);
                fechaPedido.val(pedidoVenta.fechaPedido);
                nroComprobante.val(pedidoVenta.nroComprobante);
                formaPago.val(pedidoVenta.formaPago);
                observaciones.val(pedidoVenta.observaciones);
                totalPedido.text(pedidoVenta.totalPedido);
                const contenedorDetalles = $("#contenedorDetalles");
                contenedorDetalles.empty();
                yield $.ajax({
                    url: `http://localhost:3000/admin/service/productos`,
                    method: "GET",
                    success: (productos) => {
                        for (const detalleVenta of pedidoVenta.detalles) {
                            //cartas Existentes
                            let formDetalle = `
                            <form style="width: 30%; margin: 3% auto;" data-id="${detalleVenta.id}" class="detalleForm">

                                <label>ID:  </label><label name="idDetalle">${detalleVenta.id}</label><br>
                                <label>Producto:  </label><select name="producto" id="productos${detalleVenta.id}"></select><br>
                                <label>Cantidad:  </label><input style="width: 25%; text-align: center;" type="number" name="cantidad" value="${detalleVenta.cantidad}"><br>
                                <label>Subtotal:  </label><label name="subtotal">${detalleVenta.subtotal}</label><br>
                                <input type="hidden" name="existe" value="${detalleVenta.existe}">
                                <div style="display: flex; justify-content: space-evenly;">
                                    <button type="button" class="borrarDetalle">Borrar</button>                                        
                                </div>

                            </form>`;
                            contenedorDetalles.append(formDetalle);
                            let productosDetalle = $(`#productos${detalleVenta.id}`);
                            productos.forEach((producto) => {
                                let opcionProducto = `<option value="${producto.id}">${producto.denominacion} | Precio:$${producto.precioVenta}</option>`;
                                productosDetalle.append(opcionProducto);
                            });
                            productosDetalle.val(`${detalleVenta.producto.id}`);
                        }
                    }
                });
            })
        });
    });
}
function actualizarPedido() {
    return __awaiter(this, void 0, void 0, function* () {
        let idPedido = parseInt($("#idPedido").val());
        let idcliente = $("#clientes").val();
        let fechaPedido = $("#fechaPedido").val();
        let nroComprobante = $("#nroComprobante").val();
        let formaPago = $("#formaPago").val();
        let observaciones = $("#observaciones").val();
        let totalPedido = 0;
        let detallesLlenos = true;
        if (idPedido && idcliente && fechaPedido && nroComprobante && formaPago && observaciones) {
            let detalles = [];
            let forms = $("#contenedorDetalles form").toArray();
            for (const form of forms) {
                const $form = $(form);
                let textoProducto = $form.find("select[name='producto'] option:selected").text();
                let precioProducto = parseFloat(textoProducto.split("$")[1].trim());
                let idDetalle = parseInt($form.find("label[name='idDetalle']").text().trim());
                let idproducto = parseInt($form.find("select[name='producto']").val());
                let productos = yield $.ajax({
                    url: `http://localhost:3000/admin/service/productos/${idproducto}`,
                    method: "GET"
                });
                let producto = productos[0];
                let cantidadVal = $form.find("input[name='cantidad']").val();
                let cantidad = cantidadVal ? parseInt(cantidadVal) : 0;
                let subtotal = (cantidad * precioProducto);
                let existe = $form.find("input[name='existe']").val();
                if (existe == 1) {
                    totalPedido += subtotal;
                }
                //detalles validacion
                if (idproducto && cantidad) {
                    let detalle = {
                        id: idDetalle,
                        pedidoVenta: pedidoVentaGlobal,
                        producto: producto,
                        cantidad: cantidad,
                        subtotal: subtotal,
                        existe: existe
                    };
                    detalles.push(detalle);
                }
                else {
                    detallesLlenos = false;
                    return alert("Todos los detalles del pedido deben tener sus campos completos!");
                }
            }
            if (detallesLlenos) {
                let cliente = yield $.ajax({
                    url: `http://localhost:3000/admin/service/clientes/${idcliente}`,
                    method: "GET"
                });
                let pedido_venta = {
                    id: idPedido,
                    cliente: cliente,
                    fechaPedido: fechaPedido,
                    nroComprobante: nroComprobante ? parseInt(nroComprobante) : 0,
                    formaPago: formaPago,
                    observaciones: observaciones,
                    totalPedido: totalPedido,
                    existe: 1,
                    detalles: detalles
                };
                yield $.ajax({
                    url: `http://localhost:3000/admin/service/pedido_venta/UPDATE/${idPedido}`,
                    method: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(pedido_venta),
                    success: (response) => __awaiter(this, void 0, void 0, function* () {
                        alert("El pedido de venta y sus detalles fueron actualizados");
                        yield buscarId();
                    }),
                    error: (error) => {
                        console.error(`Ocurrio un error al intentar actualizar:`, error);
                    }
                });
            }
        }
        else {
            alert("Todos los campos deben estar llenos para actualizar el pedido");
        }
    });
}
$("#actualizarPedido").on("click", (event) => {
    event.preventDefault();
    actualizarPedido();
});
$("#agregarDetalle").on("click", (event) => {
    event.preventDefault();
    let contenedorDetalles = $("#contenedorDetalles");
    let formDetalle = `
                        <form style="width: 30%; margin: 3% auto; position: relative;" class="detalleFormAgregado">
                        <button type="button" class="cerrarForm" 
                        style="position: absolute; top: 0; right: 0; padding: 5px 10px; text-align: center;">x</button>
                        <label>ID: </label><label name="idDetalle"></label><br>
                        <label>Producto: </label><select name="producto"></select><br>
                        <label>Cantidad: </label><input style="width: 25%; text-align: center; padding: 5px 10px;" type="number" name="cantidad"><br>
                        <label>Subtotal: </label><label name="subtotal"></label><br>
                        <input type="hidden" value="1" name="existe">
                        </form>
                        `;
    contenedorDetalles.append(formDetalle);
    $.ajax({
        url: "http://localhost:3000/admin/service/productos",
        method: "GET",
        success: (productos) => {
            $(".detalleFormAgregado").each(function () {
                let productosSelect = $(this).find("select[name='producto']");
                productos.forEach((producto) => {
                    let opcionProducto = `<option value="${producto.id}">${producto.denominacion} | Precio:$${producto.precioVenta}</option>`;
                    productosSelect.append(opcionProducto);
                });
            });
        }
    });
});
$(document).on("click", ".cerrarForm", function (event) {
    event.preventDefault();
    $(this).closest("form").remove(); // Elimina el formulario
});
$(document).on("click", ".borrarDetalle", function (event) {
    return __awaiter(this, void 0, void 0, function* () {
        event.preventDefault();
        let form = $(this).closest(".detalleForm");
        let id = form.data("id");
        let existe = form.find("input[name='existe']");
        if (existe.val() == 1) {
            existe.val(0);
            form.css("background-color", "grey");
            $(this).text("Recuperar");
        }
        else {
            existe.val(1);
            form.css("background-color", "#fff5c4");
            $(this).text("Borrar");
        }
    });
});
buscarClientes();
buscarIds();
export {};
//MODELO DE CLASES POO ARREGLADO (ACTUALIZAR PEDIDOS Y RECIBIDOS DEL BACK Y FRONT CON EL MODELO NUEVO\),
//  EL BORRADO NO DEBE SUCEDER HASTA QUE SE ACTUALIZA Y EL USER DEBE PODER REVERTIR EL BORRADO DE DETALLES
//  , EN "CARGAR" LOS DETALLES QUE SE VAYAN INGRESANDO DEBEN PODER VERSE Y ELIMINARSE EN LISTA. 
