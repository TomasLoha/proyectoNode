import { Cliente } from "models/Cliente";
import { PedidoVenta } from "models/PedidoVenta";
import { PedidoVentaDetalle } from "models/PedidoVentaDetalle";
import { Producto } from "models/Producto";

    let pedidoVentaGlobal: PedidoVenta;

    function buscarClientes(){

        let clientes = $("#clientes");

        $.ajax({

            url: `http://localhost:3000/admin/service/clientes`,
            method: "GET",
            success: (arrayClientes: Cliente[])=>{

                arrayClientes.forEach((cliente: Cliente)=>{

                    let option: string = `<option value="${cliente.id}">${cliente.razonSocial}</option>`;

                    clientes.append(option);

                })

            },
            error: ()=>{
                alert("No se encuentran clientes")
            }

        })

    }

    function buscarIds(){

        let idPedido = $("#idPedido")
        idPedido.empty();

        $.ajax({

            url: `http://localhost:3000/admin/service/pedido_venta`,
            method: "GET",
            success: (data: PedidoVenta[])=>{

                data.forEach((pedidoVenta)=>{

                    let opcion = `<option value="${pedidoVenta.id}">${pedidoVenta.id}</option>`
                    idPedido.append(opcion)

                })  
                
            }

        })

    }

    $("#buscarId").on("click", (event)=>{
        event.preventDefault();

        buscarId()

    })

    async function buscarId(){

        let idPedido = $("#idPedido").val();
        let clientes = $("#clientes");
        let fechaPedido = $("#fechaPedido");
        let nroComprobante = $("#nroComprobante");
        let formaPago = $("#formaPago")
        let observaciones = $("#observaciones")
        let totalPedido = $("#totalPedido")

        await $.ajax({

            url: `http://localhost:3000/admin/service/pedido_venta/${idPedido}`,
            method: "GET",
            success: async(data)=>{

                let pedidoVenta: PedidoVenta = data[0]

                pedidoVentaGlobal = pedidoVenta;

                clientes.val(pedidoVenta.cliente.id)
                fechaPedido.val(pedidoVenta.fechaPedido)
                nroComprobante.val(pedidoVenta.nroComprobante)
                formaPago.val(pedidoVenta.formaPago)
                observaciones.val(pedidoVenta.observaciones)
                totalPedido.text(pedidoVenta.totalPedido)

                const contenedorDetalles = $("#contenedorDetalles");
                contenedorDetalles.empty();

                await $.ajax({

                    url: `http://localhost:3000/admin/service/productos`,
                    method: "GET",
                    success: (productos: Producto[])=>{

                        for(const detalleVenta of pedidoVenta.detalles){

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

                            </form>`

                            contenedorDetalles.append(formDetalle);
                            
                            let productosDetalle = $(`#productos${detalleVenta.id}`)

                            productos.forEach((producto: Producto)=>{

                                let opcionProducto = `<option value="${producto.id}">${producto.denominacion} | Precio:$${producto.precioVenta}</option>`
                                productosDetalle.append(opcionProducto)

                            })

                            productosDetalle.val(`${detalleVenta.producto.id}`)


                        }

                    }

                })

            }

        })

    }

    async function actualizarPedido(){

        let idPedido = parseInt($("#idPedido").val() as string);
        let idcliente = $("#clientes").val();
        let fechaPedido = $("#fechaPedido").val();
        let nroComprobante = $("#nroComprobante").val();
        let formaPago = $("#formaPago").val()
        let observaciones = $("#observaciones").val()
        let totalPedido = 0
        let detallesLlenos = true

        if (idPedido && idcliente && fechaPedido && nroComprobante && formaPago && observaciones) {
            
            let detalles: PedidoVentaDetalle[] = [];

            let forms = $("#contenedorDetalles form").toArray();

            for (const form of forms) {
                
                const $form = $(form)
                let textoProducto = $form.find("select[name='producto'] option:selected").text()
                let precioProducto = parseFloat(textoProducto.split("$")[1].trim()); 
    
                let idDetalle = parseInt($form.find("label[name='idDetalle']").text().trim());
                let idproducto = parseInt($form.find("select[name='producto']").val() as string);
                let productos: Producto[] = await $.ajax({
                    url: `http://localhost:3000/admin/service/productos/${idproducto}`,
                    method: "GET"
                })
                let producto = productos[0]
                let cantidadVal = $form.find("input[name='cantidad']").val();
                let cantidad = cantidadVal ? parseInt(cantidadVal as string) : 0;
                let subtotal = (cantidad*precioProducto)
                let existe = $form.find("input[name='existe']").val();
                
                if (existe == 1) {
                    totalPedido += subtotal
                }
                //detalles validacion
                if (idproducto && cantidad) {
                    
                    let detalle: PedidoVentaDetalle = {
                        id: idDetalle,
                        pedidoVenta: pedidoVentaGlobal,
                        producto: producto,
                        cantidad: cantidad,
                        subtotal: subtotal,
                        existe: existe as number
                    }
    
                    detalles.push(detalle)
    
                }else{
                    detallesLlenos = false
                    return alert("Todos los detalles del pedido deben tener sus campos completos!")
                }
            }            

            if (detallesLlenos) {

                let cliente: Cliente = await $.ajax({
                    url: `http://localhost:3000/admin/service/clientes/${idcliente}`,
                    method: "GET"
                })
                
                let pedido_venta: PedidoVenta = {
                    id: idPedido,
                    cliente: cliente,
                    fechaPedido: fechaPedido as string,
                    nroComprobante: nroComprobante ? parseInt(nroComprobante as string) : 0,
                    formaPago: formaPago as string,
                    observaciones: observaciones as string,
                    totalPedido: totalPedido,
                    existe: 1,
                    detalles: detalles
                }            
                
                await $.ajax({
        
                    url: `http://localhost:3000/admin/service/pedido_venta/UPDATE/${idPedido}`,
                    method: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(pedido_venta),
                    success: async(response)=>{
    
                        alert("El pedido de venta y sus detalles fueron actualizados")
    
                        await buscarId()
        
                    },
                    error: (error)=>{
                        console.error(`Ocurrio un error al intentar actualizar:`, error)
                    }
        
                })
                
            }

        }else{
            alert("Todos los campos deben estar llenos para actualizar el pedido")
        }

    }

    $("#actualizarPedido").on("click", (event)=>{
        event.preventDefault();

        actualizarPedido();

    })

    $("#agregarDetalle").on("click", (event)=>{
        event.preventDefault();

        let contenedorDetalles = $("#contenedorDetalles")

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
                        `

        contenedorDetalles.append(formDetalle);

        $.ajax({

            url: "http://localhost:3000/admin/service/productos",
            method: "GET",
            success: (productos: Producto[])=>{

                $(".detalleFormAgregado").each(function(){

                    let productosSelect = $(this).find("select[name='producto']");

                    productos.forEach((producto: Producto)=>{

                        let opcionProducto = `<option value="${producto.id}">${producto.denominacion} | Precio:$${producto.precioVenta}</option>`
                        productosSelect.append(opcionProducto)

                    })
        
                })

            }

        })

        

    })


    $(document).on("click", ".cerrarForm", function (event) {
        event.preventDefault();
        $(this).closest("form").remove(); // Elimina el formulario
    });
    $(document).on("click", ".borrarDetalle", async function(event){
        event.preventDefault()

        let form = $(this).closest(".detalleForm")

        let id = form.data("id");
        let existe = form.find("input[name='existe']")

        if (existe.val() == 1) {
         
            existe.val(0)
            form.css("background-color", "grey")
            $(this).text("Recuperar")

        }else{

            existe.val(1)
            form.css("background-color", "#fff5c4")
            $(this).text("Borrar")

        }

    })

    buscarClientes();
    buscarIds();

//MODELO DE CLASES POO ARREGLADO (ACTUALIZAR PEDIDOS Y RECIBIDOS DEL BACK Y FRONT CON EL MODELO NUEVO\),
//  EL BORRADO NO DEBE SUCEDER HASTA QUE SE ACTUALIZA Y EL USER DEBE PODER REVERTIR EL BORRADO DE DETALLES
//  , EN "CARGAR" LOS DETALLES QUE SE VAYAN INGRESANDO DEBEN PODER VERSE Y ELIMINARSE EN LISTA. 