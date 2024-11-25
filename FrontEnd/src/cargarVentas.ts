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




    
    let detalles: PedidoVentaDetalle[] = [];
    let totalPedido: number = 0;


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

    function buscarProductos(){

        let productos = $("#productos");

        $.ajax({

            url: `http://localhost:3000/admin/service/productos`,
            method: "GET",
            success: (arrayProductos: Producto[])=>{

                arrayProductos.forEach((producto: Producto)=>{

                    let option: string = `<option value="${producto.id}">${producto.denominacion} | Precio: $${producto.precioVenta}</option>`;

                    productos.append(option);

                })

            },
            error: ()=>{
                alert("No se encuentran productos")
            }

        })

    }

    $("#agregarProducto").on("click", function CrearDetalle(event){
        event.preventDefault();        
    
        let idProducto = $("#productos").val();
        let cantidadProducto = parseInt($("#cantidadProducto").val() as string);

        if (idProducto && cantidadProducto) {
            
            let precioProducto = 0;
            
            $.ajax({

                url: `http://localhost:3000/admin/service/productos/${idProducto}`,
                method: "GET",
                success: (producto)=>{
                    precioProducto = producto.precioVenta;

                    let precioSubtotal = (precioProducto*cantidadProducto);
    
                    totalPedido += precioSubtotal;

                    let detalle: PedidoVentaDetalle = {
                        id: 0,
                        idpedidoventa: 0,
                        idproducto: idProducto ? parseInt(idProducto as string) : 0,
                        cantidad: cantidadProducto,
                        subtotal: precioSubtotal,
                        existe: 1
                    }
    
                    detalles.push(detalle)
    
                    actualizarTotalPedido();

                    $("#cantidadProducto").val('');
                    
                }
            })             
            


        }else{
            alert("No ingreso ninguna cantidad!!!")
        }

        
    });

              

        


    function actualizarTotalPedido(){

        $("#totalPedido").text(`${totalPedido}`)

    }

    async function subirVenta(){

        if (totalPedido != 0) {

            let id = 0;
            let idcliente = $("#clientes").val();
            let fechaPedido = $("#fechaPedido").val();
            let nroComprobante = $("#comprobantePedido").val();
            let formaPago = $("#formaPago").val();
            let observaciones = $("#observaciones").val();
            let totalPedido = parseFloat($("#totalPedido").text());
            
            if (idcliente && fechaPedido && nroComprobante && formaPago && observaciones && totalPedido) {
                
                let pedido_venta: PedidoVenta = {
                    id: id,
                    idcliente: idcliente ? parseInt(idcliente as string) : 0,
                    fechaPedido: fechaPedido as string,
                    nroComprobante: nroComprobante ? parseInt(nroComprobante as string) : 0,
                    formaPago: formaPago as string,
                    observaciones: observaciones as string,
                    totalPedido: totalPedido,
                    existe: 1
                }
                
                const response = await $.ajax({

                    url: `http://localhost:3000/admin/service/pedido_venta/CREATE`,
                    method: "POST",
                    contentType: "application/json",
                    data: JSON.stringify(pedido_venta)
                })


                id = response.id;

                for(const detalle of detalles){

                    detalle.idpedidoventa = id;

                    await $.ajax({
        
                        url: `http://localhost:3000/admin/service/pedido_venta_detalle/CREATE`,
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(detalle),
                        success: (response)=>{
                            
                        },
                        error: ()=>{
                            alert("No se pudo cargar el detalle")
                        }
        
                    })
        
                }

                alert("El pedido y los detalles se cargaron exitosamente!!!")

                location.reload();                

            }else{
                alert("Debe completar todos los datos del pedido para poder crearlo!")
            }

        }else{
            alert("Debe agregar por lo menos 1 producto al pedido!!!")
        }

    }

    $("#crearPedido").on("click", (event)=>{
        event.preventDefault();


        subirVenta();

    })

    buscarClientes();
    buscarProductos();
    actualizarTotalPedido();

})