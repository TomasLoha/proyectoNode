$(()=>{

    type Producto = {
        id: number;
        codigoProducto: string;
        denominacion: string;
        precioVenta: number;
    }
    
    type PedidoVentaDetalle = {
        id: number
        idpedidoventa: number; // Relacionado con PedidoVenta
        idproducto: number; // Relacionado con Producto
        cantidad: number;
        subtotal: number;
        existe: number
    }
    
    type PedidoVenta = {
        id: number;
        idcliente: number; // Relacionado con Cliente
        fechaPedido: string;
        nroComprobante: number;
        formaPago: string;
        observaciones: string;
        totalPedido: number;
        existe: number
    }
    
    type Cliente = {
        id: number;
        cuit: string;
        razonSocial: string;
    }






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
            success: async(pedidoVenta: PedidoVenta)=>{

                clientes.val(pedidoVenta.idcliente)
                fechaPedido.val(pedidoVenta.fechaPedido)
                nroComprobante.val(pedidoVenta.nroComprobante)
                formaPago.val(pedidoVenta.formaPago)
                observaciones.val(pedidoVenta.observaciones)
                totalPedido.text(pedidoVenta.totalPedido)

                await $.ajax({

                    url: `http://localhost:3000/admin/service/pedido_venta_detalle`,
                    method: "GET",
                    success: async(detalles: PedidoVentaDetalle[])=>{

                        let detallesDeVenta: PedidoVentaDetalle[] = [];

                        for(let detalle of detalles){

                            if (detalle.idpedidoventa == idPedido) {
                                detallesDeVenta.push(detalle);
                            }

                        }

                        const contenedorDetalles = $("#contenedorDetalles");
                        contenedorDetalles.empty();

                        await $.ajax({

                            url: `http://localhost:3000/admin/service/productos`,
                            method: "GET",
                            success: (productos: Producto[])=>{

                                for(const detalleVenta of detallesDeVenta){

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

                                    productosDetalle.val(`${detalleVenta.idproducto}`)

        
                                }

                            }

                        })

                        

                    }

                })

            }

        })

    }

    async function actualizarPedido(){

        let idPedido = parseInt($("#idPedido").val() as string);
        let clientes = $("#clientes").val();
        let fechaPedido = $("#fechaPedido").val();
        let nroComprobante = $("#nroComprobante").val();
        let formaPago = $("#formaPago").val()
        let observaciones = $("#observaciones").val()
        let totalPedido = 0
        let detallesLlenos = true

        if (idPedido && clientes && fechaPedido && nroComprobante && formaPago && observaciones) {
            
            let detalles: PedidoVentaDetalle[] = [];

            $("#contenedorDetalles form").each(function(){

                let textoProducto = $(this).find("select[name='producto'] option:selected").text()
                let precioProducto = parseFloat(textoProducto.split("$")[1].trim()); 

                let idDetalle = parseInt($(this).find("label[name='idDetalle']").text().trim());
                let idproducto = parseInt($(this).find("select[name='producto']").val() as string);
                let cantidadVal = $(this).find("input[name='cantidad']").val();
                let cantidad = cantidadVal ? parseInt(cantidadVal as string) : 0;
                let subtotal = (cantidad*precioProducto)
                let existe = $(this).find("input[name='existe']").val();
                
                if (existe == 1) {
                    totalPedido += subtotal
                }
                //detalles validacion
                if (idproducto && cantidad) {
                    
                    let detalle: PedidoVentaDetalle = {
                        id: idDetalle,
                        idpedidoventa: idPedido,
                        idproducto: idproducto,
                        cantidad: cantidad,
                        subtotal: subtotal,
                        existe: existe as number
                    }

                    detalles.push(detalle)

                }else{
                    detallesLlenos = false
                    return alert("Todos los detalles del pedido deben tener sus campos completos!")
                }


            })

            if (detallesLlenos) {
                
                let pedido_venta: PedidoVenta = {
                    id: idPedido,
                    idcliente: clientes ? parseInt(clientes as string) : 0,
                    fechaPedido: fechaPedido as string,
                    nroComprobante: nroComprobante ? parseInt(nroComprobante as string) : 0,
                    formaPago: formaPago as string,
                    observaciones: observaciones as string,
                    totalPedido: totalPedido,
                    existe: 1 
                }            
                
                await $.ajax({
        
                    url: `http://localhost:3000/admin/service/pedido_venta/UPDATE/${idPedido}`,
                    method: "PUT",
                    contentType: "application/json",
                    data: JSON.stringify(pedido_venta),
                    success: async(response)=>{
        
                        for(let detalle of detalles){
    
                            if (detalle.id) {
                                
                                await $.ajax({
        
                                    url: `http://localhost:3000/admin/service/pedido_venta_detalle/UPDATE/${detalle.id}`,
                                    method: "PUT",
                                    contentType: "application/json",
                                    data: JSON.stringify(detalle),
                                    success: ()=>{
    
                                    },
                                    error: (error)=>{
                                        console.error(`No se pudo actualizar el detalle con id = ${detalle.id}`, error)
                                        return alert("Error al actualizar los detalles ya existentes")
                                    }
        
                                })
    
                            }else{
    
                                await $.ajax({
    
                                    url: `http://localhost:3000/admin/service/pedido_venta_detalle/CREATE`,
                                    method: "POST",
                                    contentType: "application/json",
                                    data: JSON.stringify(detalle),
                                    success: ()=>{
                                        
                                    },
                                    error: (error)=>{
                                        console.error("No se pudo crear el detalle nuevo", error)
                                        return alert("Error al crear los detalles nuevos")
                                    }
    
                                })
    
                            }
    
    
                        }
    
                        alert("El pedido de venta y sus detalles fueron actualizados")
    
                        buscarId()
        
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

        let id = $(this).closest(".detalleForm").data("id");
        $(this).closest(".detalleForm").find("input[name='existe']").val(0)

        alert(`El detalle con ID = ${id} fue borrado con exito!`)

        actualizarPedido();

    })

    buscarClientes();
    buscarIds();

})

//MODELO DE CLASES POO ARREGLADO (ACTUALIZAR PEDIDOS Y RECIBIDOS DEL BACK Y FRONT CON EL MODELO NUEVO\),
//  EL BORRADO NO DEBE SUCEDER HASTA QUE SE ACTUALIZA Y EL USER DEBE PODER REVERTIR EL BORRADO DE DETALLES
//  , EN "CARGAR" LOS DETALLES QUE SE VAYAN INGRESANDO DEBEN PODER VERSE Y ELIMINARSE EN LISTA. 