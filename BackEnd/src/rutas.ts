import express from 'express';

import {getClientes,
        getClientesid,
        

} from './controller/clienteController';

import {getProductos,
        getProductosid,
} from './controller/productoController';

import { getPedidosVenta,
        getPedidosVentaid,
        crearPedidosVenta,
        updatePedidoVenta,
        getPedidosVentaSinFiltro
} from './controller/pedidoVentaController';

import {getPedidosVentaDetalle,
        getPedidosVentaDetalleid,
} from './controller/PedidoVentaDetalleController';

const router = express.Router();

//cliente

router.get('/clientes',getClientes);
router.get('/clientes/:id',getClientesid);

//producto

router.get('/productos',getProductos);
router.get('/productos/:id',getProductosid);


//pedido Venta

router.get('/pedido_venta',getPedidosVenta);
router.get('/pedido_venta/SINFILTRO',getPedidosVentaSinFiltro);
router.get('/pedido_venta/:id',getPedidosVentaid);
router.post('/pedido_venta/CREATE',crearPedidosVenta);
router.put('/pedido_venta/UPDATE/:id',updatePedidoVenta);

//pedido Venta Detalle

router.get('/pedido_venta_detalle',getPedidosVentaDetalle);
router.get('/pedido_venta_detalle/:id',getPedidosVentaDetalleid);

export default router;