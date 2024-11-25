
import { Cliente } from "models/Cliente";
import { PedidoVenta } from "models/PedidoVenta";
import { PedidoVentaDetalle } from "models/PedidoVentaDetalle";
import { Producto } from "models/Producto";


    
    let detalles: PedidoVentaDetalle[] = [];
    var pedidoVenta: PedidoVenta;
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
                success: (productos)=>{
                    const producto = productos[0];
                    precioProducto = producto.precioVenta;

                    let precioSubtotal = (precioProducto*cantidadProducto);
    
                    totalPedido += precioSubtotal;


                    let detalle: PedidoVentaDetalle = {
                        id: 0,
                        pedidoVenta: pedidoVenta,
                        producto: producto,
                        cantidad: Number(cantidadProducto),
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

    async function subirVenta() {
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
                    const cliente: Cliente = await $.ajax({
                        url: `http://localhost:3000/admin/service/clientes/${idCliente}`,
                        method: "GET",
                        
                    });
    
                    // Crear y asignar valores al objeto PedidoVenta
                    const pedidoVenta: PedidoVenta = {
                        id: 0,
                        cliente: cliente, // Asignar el cliente obtenido
                        fechaPedido: fechaPedido as string,
                        nroComprobante: nroComprobante ? parseInt(nroComprobante as string) : 0,
                        formaPago: formaPago as string,
                        observaciones: observaciones as string,
                        totalPedido: totalPedido,
                        existe: 1,
                        detalles: detalles, // Detalles acumulados previamente
                    };
                    console.log("Datos al create " , pedidoVenta)
                    // Enviar el pedido al servidor
                    $.ajax({
                        url: `http://localhost:3000/admin/service/pedido_venta/CREATE`,
                        method: "POST",
                        contentType: "application/json",
                        data: JSON.stringify(pedidoVenta),
                    });
    
                    alert("El pedido y los detalles se cargaron exitosamente!!!");
                    location.reload();
                } catch (error) {
                    alert("Ocurrió un error al procesar la venta: ");
                }
            } else {
                alert("Debe completar todos los datos del pedido para poder crearlo!");
            }
        } else {
            alert("Debe agregar por lo menos 1 producto al pedido!!!");
        }
    }
    

        $("#crearPedido").on("click", (event)=>{
            event.preventDefault();


            subirVenta();

        })

    buscarClientes();
    buscarProductos();
    actualizarTotalPedido();
