var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//@ts-ignore
const { jsPDF } = window.jspdf;
let pedidoId = obtenerId();
function obtenerId() {
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get("pedidoId");
    if (pedidoId) {
        return pedidoId;
    }
    else {
        alert("No se encontró ningún ID en los params");
        return 0;
    }
}
function buscarVenta() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `http://localhost:3000/admin/service/pedido_venta/${pedidoId}`,
                method: "GET",
                success: (venta) => {
                    const pedido = venta[0];
                    resolve(pedido);
                },
                error: () => {
                    alert("No se pudo recuperar la información del pedido");
                    reject(new Error("No se pudo recuperar la información del pedido"));
                }
            });
        });
    });
}
function buscarProducto(detalle) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `http://localhost:3000/admin/service/productos/${detalle.producto.id}`,
                method: "GET",
                success: (producto) => {
                    const pedido = producto[0];
                    resolve(pedido);
                },
                error: () => {
                    alert(`Ocurrió un error al intentar obtener el producto con id ${detalle.producto.id}`);
                    reject(new Error(`Ocurrió un error al intentar obtener el producto con id ${detalle.producto.id}`));
                }
            });
        });
    });
}
function generarPDF(venta, detalles, productos) {
    const doc = new jsPDF();
    let altura = 10;
    let espacioEntreLine = 5.5;
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text(`Información de la venta con ID: ${venta.id}`, 10, altura);
    altura += espacioEntreLine;
    doc.setFontSize(14);
    doc.text(`Cliente: ${venta.cliente.razonSocial}`, 10, altura); // Usamos el cliente desde PedidoVenta
    altura += espacioEntreLine;
    doc.text(`Fecha: ${venta.fechaPedido}`, 10, altura);
    altura += espacioEntreLine;
    doc.text(`Número comprobante: ${venta.nroComprobante}`, 10, altura);
    altura += espacioEntreLine;
    doc.text(`Forma pago: ${venta.formaPago}`, 10, altura);
    altura += espacioEntreLine;
    doc.text(`Observaciones: ${venta.observaciones}`, 10, altura);
    altura += espacioEntreLine;
    doc.text(`Total del Pedido: $${venta.totalPedido}`, 10, altura);
    altura += espacioEntreLine;
    doc.setFontSize(16);
    doc.text(`-------------------------------------------------------------------------------------------------`, 10, altura);
    altura += espacioEntreLine;
    doc.text(`Detalles de la venta:`, 10, altura);
    altura += espacioEntreLine;
    altura += espacioEntreLine;
    doc.text(`Producto`, 50, altura);
    doc.text(`Cantidad`, 130, altura);
    doc.text(`Subtotal`, 164, altura);
    altura += espacioEntreLine;
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    for (let i = 0; i < detalles.length; i++) {
        doc.text(`Detalle: ${detalles[i].id}`, 10, altura);
        altura += espacioEntreLine;
        doc.text(`${productos[i].denominacion} $${productos[i].precioVenta} c/u`, 40, altura);
        doc.text(`${detalles[i].cantidad}`, 140, altura);
        doc.text(`$${detalles[i].subtotal}`, 167, altura);
        altura += espacioEntreLine;
        if (i + 1 == detalles.length) {
            doc.text(`--------------------------------------------------------------------------------------------------------------------------------------`, 10, altura);
            altura += espacioEntreLine;
        }
        else {
            doc.text(`-------------------------------------------------------------------------------------------------------`, 10, altura);
            altura += espacioEntreLine;
        }
    }
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("TOTAL:", 10, altura);
    doc.text(`$${venta.totalPedido}`, 165, altura);
    const pdfBlob = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfBlob);
    console.log(pdfBlob);
    console.log(pdfUrl);
    const embed = document.createElement("embed");
    embed.src = pdfUrl;
    embed.type = "application/pdf";
    embed.id = "pdfEmbed";
    embed.width = "100%";
    embed.height = "100%";
    const pdfViewer = document.getElementById("pdfViewer");
    if (pdfViewer) {
        pdfViewer.innerHTML = "";
        pdfViewer.appendChild(embed);
    }
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        let pedido_venta = yield buscarVenta();
        let pedido_venta_detalles = pedido_venta.detalles; // Los detalles vienen con el PedidoVenta
        let productos = [];
        console.log(pedido_venta);
        for (const detalle of pedido_venta_detalles) {
            productos.push(yield buscarProducto(detalle));
        }
        generarPDF(pedido_venta, pedido_venta_detalles, productos); // Usamos el cliente de PedidoVenta directamente
    });
}
main();
export {};
