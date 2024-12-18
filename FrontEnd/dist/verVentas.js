var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function buscarPedidosVentas() {
    // Captura los valores ingresados por el usuario
    let idBuscado = Number($("#idBuscado").val());
    let fechaMinima = $("#fechaMinima").val();
    let fechaMaxima = $("#fechaMaxima").val();
    // Caso: ID no proporcionado o igual a 0
    if (!idBuscado || idBuscado == 0) {
        if (fechaMinima && fechaMaxima) {
            let fechaMinimaDate = new Date(fechaMinima);
            let fechaMaximaDate = new Date(fechaMaxima);
            $.ajax({
                url: `http://localhost:3000/admin/service/pedido_venta`,
                method: "GET",
                success: (data) => {
                    let tableBody = $("#tableBody");
                    tableBody.empty(); // Limpia la tabla antes de llenar con nuevos datos
                    // Asegurarse de que las fechas ingresadas sean válidas
                    if (isNaN(fechaMinimaDate.getTime()) || isNaN(fechaMaximaDate.getTime())) {
                        alert("Las fechas proporcionadas no son válidas.");
                        return;
                    }
                    // Filtra pedidos según rango de fechas
                    data.forEach((pedido_venta) => {
                        let fechaPedidoDate = new Date(pedido_venta.fechaPedido);
                        // Compara las fechas solo si la fechaPedido es válida
                        if (!isNaN(fechaPedidoDate.getTime())) {
                            if (fechaPedidoDate >= fechaMinimaDate &&
                                fechaPedidoDate <= fechaMaximaDate) {
                                // Genera una fila para la tabla con datos del pedido y del cliente
                                let fila = `<tr>
                                        <td>${pedido_venta.id}</td>
                                        <td>${pedido_venta.cliente.razonSocial}</td>
                                        <td>${pedido_venta.fechaPedido}</td>
                                        <td>${pedido_venta.formaPago}</td>
                                        <td>${pedido_venta.totalPedido}</td>
                                        <td><button style="margin: auto" onclick="mostrarInfoCompleta(${pedido_venta.id})" type="button">PDF</button></td>
                                    </tr>`;
                                tableBody.append(fila);
                            }
                        }
                    });
                },
                error: () => {
                    alert("No se pudo cargar los datos.");
                }
            });
        }
        else {
            $.ajax({
                url: `http://localhost:3000/admin/service/pedido_venta/`,
                method: "GET",
                success: (data) => __awaiter(this, void 0, void 0, function* () {
                    let tableBody = $("#tableBody");
                    tableBody.empty();
                    // Itera sobre cada pedido para obtener y mostrar los clientes asociados
                    for (const pedido_venta of data) {
                        let fila = `<tr>
                                        <td>${pedido_venta.id}</td>
                                        <td>${pedido_venta.cliente.razonSocial}</td>
                                        <td>${pedido_venta.fechaPedido}</td>
                                        <td>${pedido_venta.formaPago}</td>
                                        <td>${pedido_venta.totalPedido}</td>
                                        <td><button style="margin: auto" onclick="mostrarInfoCompleta(${pedido_venta.id})" type="button">PDF</button></td>
                                    </tr>`;
                        tableBody.append(fila);
                    }
                }),
            });
        }
    }
    else {
        // Caso: Buscar pedido por ID específico
        $.ajax({
            url: `http://localhost:3000/admin/service/pedido_venta/${idBuscado}`,
            method: "GET",
            success: (data) => {
                if (data.length > 0) {
                    const pedido_venta = data[0];
                    let tableBody = $("#tableBody");
                    tableBody.empty();
                    let fila = `<tr>
                            <td>${pedido_venta.id}</td>
                            <td>${pedido_venta.cliente.razonSocial}</td>
                            <td>${pedido_venta.fechaPedido}</td>
                            <td>${pedido_venta.formaPago}</td>
                            <td>${pedido_venta.totalPedido}</td>
                            <td><button style="margin: auto" onclick="mostrarInfoCompleta(${pedido_venta.id})" type="button">PDF</button></td>
                        </tr>`;
                    tableBody.append(fila);
                }
                else {
                    alert("No se encontró el pedido.");
                }
            },
            error: () => {
                alert(`No existe el pedido de venta con ID = ${idBuscado}`);
            }
        });
    }
    $("#idBuscado").val("");
    $("#fechaMinima").val("");
    $("#fechaMaxima").val("");
}
// Eventos para manejar las acciones del usuario
$("#botonBuscar").on("click", (event) => {
    event.preventDefault();
    buscarPedidosVentas(); // Llama a la función principal de búsqueda
});
$("#botonBorrar").on("click", (event) => __awaiter(void 0, void 0, void 0, function* () {
    event.preventDefault();
    const idBorrar = $("#idBorrar").val();
    if (!idBorrar) {
        alert("No ingresó ningún ID a borrar.");
        return;
    }
    try {
        // Obtener el pedido
        $.ajax({
            url: `http://localhost:3000/admin/service/pedido_venta/${idBorrar}`,
            method: "GET",
            success: (data) => __awaiter(void 0, void 0, void 0, function* () {
                console.log(data);
                if (data.length > 0) {
                    const pedidoVenta = data[0];
                    pedidoVenta.existe = 0;
                    console.log("Pedido:", pedidoVenta);
                    // Actualizar el pedido
                    yield $.ajax({
                        url: `http://localhost:3000/admin/service/pedido_venta/UPDATE/${idBorrar}`,
                        method: "PUT",
                        contentType: "application/json",
                        data: JSON.stringify(pedidoVenta)
                    });
                    location.reload();
                }
                else {
                    alert("No se encontró el pedido.");
                }
            }),
            error: () => {
                alert(`No existe el pedido de venta con ID = ${idBorrar}`);
            }
        });
    }
    catch (error) {
        console.error("Error al procesar la solicitud:", error);
        alert(`Error al intentar borrar el pedido con ID = ${idBorrar}`);
    }
}));
// Función global para redirigir a una vista de PDF del pedido
window.mostrarInfoCompleta = (pedidoId) => {
    window.location.href = `/vista/mostrarPDF.html?pedidoId=${pedidoId}`;
};
buscarPedidosVentas();
export {};
