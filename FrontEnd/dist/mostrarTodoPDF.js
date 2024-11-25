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
function buscarPedidos() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `http://localhost:3000/admin/service/pedido_venta`,
                method: "GET",
                success: (ventas) => {
                    resolve(ventas);
                },
                error: () => {
                    alert("No se pudo recuperar la información de los pedidos");
                    reject(new Error("No se pudo recuperar la información de los pedidos"));
                },
            });
        });
    });
}
function buscarProducto(productoId) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: `http://localhost:3000/admin/service/productos/${productoId}`,
                method: "GET",
                success: (producto) => {
                    resolve(producto[0]);
                },
                error: () => {
                    alert(`No se pudo recuperar el producto con id ${productoId}`);
                    reject(new Error(`No se pudo recuperar el producto con id ${productoId}`));
                },
            });
        });
    });
}
function generarPDF(ventas) {
    return __awaiter(this, void 0, void 0, function* () {
        const doc = new jsPDF();
        const espacioEntreLine = 5.5;
        for (let index = 0; index < ventas.length; index++) {
            const venta = ventas[index];
            let altura = 10;
            // Si no es el primer pedido, agregamos una nueva página
            if (index > 0) {
                doc.addPage();
            }
            // Información de la venta
            doc.setFont("times", "bold");
            doc.setFontSize(18);
            doc.text(`Información de la venta con ID: ${venta.id}`, 10, altura);
            altura += espacioEntreLine;
            doc.setFontSize(14);
            // Información del cliente
            doc.text(`Cliente: ${venta.cliente.razonSocial}`, 10, altura);
            altura += espacioEntreLine;
            doc.text(`Fecha: ${venta.fechaPedido}`, 10, altura);
            altura += espacioEntreLine;
            doc.text(`Número comprobante: ${venta.nroComprobante}`, 10, altura);
            altura += espacioEntreLine;
            doc.text(`Forma de pago: ${venta.formaPago}`, 10, altura);
            altura += espacioEntreLine;
            doc.text(`Observaciones: ${venta.observaciones}`, 10, altura);
            altura += espacioEntreLine;
            doc.text(`Total del Pedido: $${venta.totalPedido}`, 10, altura);
            altura += espacioEntreLine;
            // Separador
            doc.setFontSize(16);
            doc.text(`-------------------------------------------------------------------------------------------------`, 10, altura);
            altura += espacioEntreLine;
            doc.text(`Detalles de la venta:`, 10, altura);
            altura += espacioEntreLine;
            // Encabezado de los detalles
            doc.text(`Producto`, 50, altura);
            doc.text(`Cantidad`, 130, altura);
            doc.text(`Subtotal`, 164, altura);
            altura += espacioEntreLine;
            doc.setFont("times", "normal");
            doc.setFontSize(12);
            // Obtenemos todos los productos de los detalles de la venta
            const productosPromises = venta.detalles.map(detalle => buscarProducto(Number(detalle.producto.id)));
            const productos = yield Promise.all(productosPromises); // Esperamos a que todos los productos sean obtenidos
            // Detalles de cada producto
            venta.detalles.forEach((detalle, i) => {
                const producto = productos[i]; // Ya tenemos los productos listos
                doc.text(`${producto.denominacion} $${producto.precioVenta} c/u`, 40, altura);
                doc.text(`${detalle.cantidad}`, 140, altura);
                doc.text(`$${detalle.subtotal}`, 167, altura);
                altura += espacioEntreLine;
                // Línea separadora después de cada detalle
                if (i + 1 === venta.detalles.length) {
                    doc.text(`--------------------------------------------------------------------------------------------------------------------------------------`, 10, altura);
                }
                else {
                    doc.text(`-------------------------------------------------------------------------------------------------------`, 10, altura);
                }
                altura += espacioEntreLine;
            });
            // Total al final del pedido
            doc.setFont("times", "bold");
            doc.setFontSize(18);
            doc.text("TOTAL:", 10, altura);
            doc.text(`$${venta.totalPedido}`, 165, altura);
            altura += espacioEntreLine;
        }
        // Generar el PDF y mostrarlo en el visor
        const pdfBlob = doc.output("blob");
        const pdfUrl = URL.createObjectURL(pdfBlob);
        const embed = document.createElement("embed");
        embed.src = pdfUrl;
        embed.type = "application/pdf";
        embed.id = "pdfEmbed";
        embed.width = "100%";
        embed.height = "100%";
        const pdfViewer = document.getElementById("pdfViewer2");
        if (pdfViewer) {
            pdfViewer.innerHTML = "";
            pdfViewer.appendChild(embed);
        }
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const ventas = yield buscarPedidos();
        generarPDF(ventas);
    });
}
main();
export {};
