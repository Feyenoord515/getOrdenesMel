import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import axios from "axios";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Chip,
  Typography,
  CircularProgress,
  Box,
  Button,
} from "@mui/material";
import { Refresh, CheckCircle, Cancel } from "@mui/icons-material";

function App({ currentUser, onLogout }) {

  const [orders, setOrders] = useState([]);
  const [renderData, setRenderData] = useState([]);
  const [totalItems, setTotalItems] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("https://mcdistri.distrinando.com.ar/endpoint");
      setOrders(response.data.ordersIds); // Datos paginados
      setTotalItems(response.data.totalItems); // Total sin paginar
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("https://mcdistri.distrinando.com.ar/endpoint");
        setOrders(response.data.ordersIds); // Datos paginados
        setTotalItems(response.data.totalItems); // Total sin paginar
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders(); // Llamar siempre que cambie la página o las filas por página

    const intervalId = setInterval(() => {
      fetchOrders();
    }, 30 * 60 * 1000); // 30 minutos en milisegundos

    return () => clearInterval(intervalId); // Limpiar el intervalo al desmontar
  }, [page, rowsPerPage]);
  console.log(orders?orders:null)
  const ordenarPorFechaDesc = (ordenes) =>
    [...ordenes].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

  useEffect(() => {
    if (orders.length > 0) {
      const procesarDatosParaRender = () => {
        const agruparPorPackId = (ordenes) => {
          const grupos = {};

          ordenes.forEach((orden) => {
            const packId = orden.PackIdMeli
              ? orden.PackIdMeli.id
              : "Individual";

            if (!grupos[packId]) {
              grupos[packId] = [];
            }

            grupos[packId].push(orden);
          });

          return grupos;
        };

        const ordenesAgrupadas = agruparPorPackId(orders);
        const elementosParaRender = [];

        // Procesar las órdenes individuales
        if (ordenesAgrupadas["Individual"]) {
          ordenesAgrupadas["Individual"].forEach((orden) => {
            console.log(orden)
            elementosParaRender.push({
              packId: "Individual",
              orderId: orden.id,
              createdAt: orden.date_created.split("T")[0],
              status: orden.status,
              totalAmount: orden.total_amount,
              currency: orden.currency_id,
              sapOrder:
  orden.statusIdsap.order1.length > 0
    ? orden.statusIdsap.order1[0].DocEntry
    : orden.statusIdsap.order2.length > 0
    ? orden.statusIdsap.order2[0].DocEntry
    : "Sin Datos",
sapInvoice:
  orden.statusIdsap.invoice1.length > 0
    ? orden.statusIdsap.invoice1[0].DocEntry
    : orden.statusIdsap.invoice2.length > 0
    ? orden.statusIdsap.invoice2[0].DocEntry
    : "Sin Datos",
sapDate:
  orden.statusIdsap.order1.length > 0
    ? orden.statusIdsap.order1[0].DocDate
    : orden.statusIdsap.order2.length > 0
    ? orden.statusIdsap.order2[0].DocDate
    : "Sin Datos",
sapTotal:
  orden.statusIdsap.order1.length > 0
    ? orden.statusIdsap.order1[0].DocTotal
    : orden.statusIdsap.order2.length > 0
    ? orden.statusIdsap.order2[0].DocTotal
    : "Sin Datos",
sapStatus:
  orden.statusIdsap.order1.length > 0
    ? orden.statusIdsap.order1[0].DocumentStatus
    : orden.statusIdsap.order2.length > 0
    ? orden.statusIdsap.order2[0].DocumentStatus
    : "Sin Datos",
            });
          });
        }

        // Procesar las órdenes por PackId
        Object.keys(ordenesAgrupadas)
          .filter((packId) => packId !== "Individual")
          .forEach((packId) => {
            const ordenesDelPack = ordenesAgrupadas[packId];
            const totalPackAmount = ordenesDelPack.reduce(
              (sum, orden) => sum + orden.total_amount,
              0
            );

            elementosParaRender.push({
              packId,
              orderIds: ordenesDelPack.map((orden) => orden.id),
              createdAt: ordenesDelPack[0].date_created.split("T")[0],
              status: ordenesDelPack[0].status,
              totalAmount: totalPackAmount,
              currency: ordenesDelPack[0].currency_id,
              sapOrder:
              ordenesDelPack[0].statusIdsap.order1.length > 0
                ? ordenesDelPack[0].statusIdsap.order1[0].DocEntry
                : ordenesDelPack[0].statusIdsap.order2.length > 0
                ? ordenesDelPack[0].statusIdsap.order2[0].DocEntry
                : "Sin Datos",
            sapInvoice:
              ordenesDelPack[0].statusIdsap.invoice1.length > 0
                ? ordenesDelPack[0].statusIdsap.invoice1[0].DocEntry
                : ordenesDelPack[0].statusIdsap.invoice2.length > 0
                ? ordenesDelPack[0].statusIdsap.invoice2[0].DocEntry
                : "Sin Datos",
            sapDate:
              ordenesDelPack[0].statusIdsap.order1.length > 0
                ? ordenesDelPack[0].statusIdsap.order1[0].DocDate
                : ordenesDelPack[0].statusIdsap.order2.length > 0
                ? ordenesDelPack[0].statusIdsap.order2[0].DocDate
                : "Sin Datos",
            sapTotal:
              ordenesDelPack[0].statusIdsap.order1.length > 0
                ? ordenesDelPack[0].statusIdsap.order1[0].DocTotal
                : ordenesDelPack[0].statusIdsap.order2.length > 0
                ? ordenesDelPack[0].statusIdsap.order2[0].DocTotal
                : "Sin Datos",
            sapStatus:
              ordenesDelPack[0].statusIdsap.order1.length > 0
                ? ordenesDelPack[0].statusIdsap.order1[0].DocumentStatus
                : ordenesDelPack[0].statusIdsap.order2.length > 0
                ? ordenesDelPack[0].statusIdsap.order2[0].DocumentStatus
                : "Sin Datos",
            });
          });

        setRenderData(elementosParaRender);
      };

      procesarDatosParaRender();
    }
  }, [orders]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const ordenesOrdenadas = ordenarPorFechaDesc(renderData);
console.log(ordenesOrdenadas)
  return (
    <div style={{ padding: "20px", backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <CircularProgress color="primary" />
        </Box>
      ) : (
        <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <Typography variant="h4" style={{ color: "#1976d2" }}>
          Órdenes Mercado Libre - 361°
        </Typography>
        <IconButton
          onClick={fetchOrders} 
          style={{ backgroundColor: "#1976d2", color: "white" }}
        >
          <Refresh />
        </IconButton>
      {/* <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}> */}
      <Typography
                variant="subtitle1"
                style={{
                  color: "#1976d2", // Cambiado para que coincida con el color principal
                  marginRight: "10px",
                  display: "inline-block",
                  fontWeight: "bold", // Añadido para resaltar el texto
                  fontSize: "1rem", // Ajuste del tamaño de fuente
                }}
              >
                {`Usuario: ${currentUser}`}
              </Typography>
              <Button
                variant="contained"
                color="error"
                onClick={onLogout}
                style={{ padding: "8px 16px" }}
              >
                Salir
              </Button>
            {/* </div> */}
      </div>
      <div style={{ overflowX: "auto" }}>
        <TableContainer component={Paper} style={{ borderRadius: "10px" }}>
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "#1976d2" }}>
                {[
                  "Pack ID",
                  "Order ID",
                  "Created At",
                  "Status",
                  "Total",
                  "SAP Order",
                  "SAP Invoice",
                  "SAP Fecha",
                  "SAP Importe",
                  "SAP Estado",
                ].map((header, index) => (
                  <TableCell key={index} style={{ color: "white", fontWeight: "bold" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {ordenesOrdenadas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell>{row.packId}</TableCell>
                  <TableCell>{Array.isArray(row.orderIds) && row.orderIds.length > 1 ? (
                    <ol>
                      {row.orderIds.map((orderId, idx) => (
                        <li key={idx}>{orderId}</li>
                      ))}
                    </ol>
                  ) : (
                    row.orderId || "N/A"
                  )}</TableCell>
                  <TableCell>{row.createdAt}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.status === "paid" ? "success" : "error"}
                      icon={row.status === "paid" ? <CheckCircle /> : <Cancel />}
                    />
                  </TableCell>
                  <TableCell>{`${row.totalAmount} ${row.currency}`}</TableCell>
                  <TableCell>{row.sapOrder}</TableCell>
                  <TableCell>{row.sapInvoice}</TableCell>
                  <TableCell>{row.sapDate}</TableCell>
                  <TableCell>{row.sapTotal}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.sapStatus}
                      color={row.sapStatus === "bost_Open" ? "success" : "error"}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={totalItems} // Total de elementos
          rowsPerPage={rowsPerPage} // Filas por página
          page={page} // Página actual
          onPageChange={handleChangePage} // Cambio de página
          onRowsPerPageChange={handleChangeRowsPerPage} // Cambio de filas por página
        />
        </TableContainer>
      </div>
      </>
      )}
    </div>
  );
}




// import { useEffect, useState } from "react";
// import axios from "axios";

// function App() {
//   const [orders, setOrders] = useState([]);
//   const [renderData, setRenderData] = useState([]);

//   useEffect(() => {
//     if (orders.length === 0) {
//       const fetchOrders = async () => {
//         try {
//           console.time("fetchOrders");
//           const response = await axios.get("http://localhost:1853/orders");
//           setOrders(response.data);
//           console.timeEnd("fetchOrders");
//         } catch (error) {
//           console.error("Error fetching orders:", error);
//         }
//       };
//       fetchOrders();
//     }
//   }, [orders]);

//   const ordenarPorFechaDesc = (ordenes) =>
//     [...ordenes].sort(
//       (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//     );

//   useEffect(() => {
//     if (orders.length > 0) {
//       const procesarDatosParaRender = () => {
//         const agruparPorPackId = (ordenes) => {
//           const grupos = {};

//           ordenes.forEach((orden) => {
//             const packId = orden.PackIdMeli
//               ? orden.PackIdMeli.id
//               : "Individual";

//             if (!grupos[packId]) {
//               grupos[packId] = [];
//             }

//             grupos[packId].push(orden);
//           });

//           return grupos;
//         };

//         const ordenesAgrupadas = agruparPorPackId(orders);
//         const elementosParaRender = [];

//         // Procesar las órdenes individuales
//         if (ordenesAgrupadas["Individual"]) {
//           ordenesAgrupadas["Individual"].forEach((orden) => {
//             elementosParaRender.push({
//               packId: "Individual",
//               orderId: orden.id,
//               createdAt: orden.date_created.split("T")[0],
//               status: orden.status,
//               totalAmount: orden.total_amount,
//               currency: orden.currency_id,
//               sapOrder:
//                 orden.statusIdsap.order.length > 0
//                   ? orden.statusIdsap.order[0].DocEntry
//                   : "Sin Datos",
//               sapInvoice:
//                 orden.statusIdsap.invoice.length > 0
//                   ? orden.statusIdsap.invoice[0].DocEntry
//                   : "Sin Datos",
//               sapDate:
//                 orden.statusIdsap.order.length > 0
//                   ? orden.statusIdsap.order[0].DocDate
//                   : "Sin Datos",
//               sapTotal:
//                 orden.statusIdsap.order.length > 0
//                   ? orden.statusIdsap.order[0].DocTotal
//                   : "Sin Datos",
//               sapStatus:
//                 orden.statusIdsap.order.length > 0
//                   ? orden.statusIdsap.order[0].DocumentStatus
//                   : "Sin Datos",
//             });
//           });
//         }

//         // Procesar las órdenes por PackId
//         Object.keys(ordenesAgrupadas)
//           .filter((packId) => packId !== "Individual")
//           .forEach((packId) => {
//             const ordenesDelPack = ordenesAgrupadas[packId];
//             const totalPackAmount = ordenesDelPack.reduce(
//               (sum, orden) => sum + orden.total_amount,
//               0
//             );

//             elementosParaRender.push({
//               packId,
//               orderIds: ordenesDelPack.map((orden) => orden.id),
//               createdAt: ordenesDelPack[0].date_created.split("T")[0],
//               status: ordenesDelPack[0].status,
//               totalAmount: totalPackAmount,
//               currency: ordenesDelPack[0].currency_id,
//               sapOrder:
//                 ordenesDelPack[0].statusIdsap.order.length > 0
//                   ? ordenesDelPack[0].statusIdsap.order[0].DocEntry
//                   : "Sin Datos",
//               sapInvoice:
//                 ordenesDelPack[0].statusIdsap.invoice.length > 0
//                   ? ordenesDelPack[0].statusIdsap.invoice[0].DocEntry
//                   : "Sin Datos",
//               sapDate:
//                 ordenesDelPack[0].statusIdsap.order.length > 0
//                   ? ordenesDelPack[0].statusIdsap.order[0].DocDate
//                   : "Sin Datos",
//               sapTotal:
//                 ordenesDelPack[0].statusIdsap.order.length > 0
//                   ? ordenesDelPack[0].statusIdsap.order[0].DocTotal
//                   : "Sin Datos",
//               sapStatus:
//                 ordenesDelPack[0].statusIdsap.order.length > 0
//                   ? ordenesDelPack[0].statusIdsap.order[0].DocumentStatus
//                   : "Sin Datos",
//             });
//           });

//         setRenderData(elementosParaRender);
//       };

//       procesarDatosParaRender();
//     }
//   }, [orders]);

//   const ordenesOrdenadas = ordenarPorFechaDesc(renderData);

//   return (
//     <div className="bg-gray-100 min-h-screen w-auto p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold text-blue-700">
//           Órdenes de Mercado Libre
//         </h1>
//         <button
//           onClick={() => window.location.reload()}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
//         >
//           Recargar Datos
//         </button>
//       </div>
//       <table className="w-full border-collapse bg-white shadow-md">
//         <thead className="bg-blue-500 text-white">
//           <tr>
//             <th className="border p-3">Pack ID</th>
//             <th className="border p-3">Order ID</th>
//             <th className="border p-3">Created At</th>
//             <th className="border p-3">Status</th>
//             <th className="border p-3">Total</th>
//             <th className="border p-3">SAP-order</th>
//             <th className="border p-3">SAP-Invoice</th>
//             <th className="border p-3">SAP-Fecha</th>
//             <th className="border p-3">SAP-Importe</th>
//             <th className="border p-3">SAP-Estado</th>
//           </tr>
//         </thead>
//         <tbody>
//           {ordenesOrdenadas.map((row, index) => (
//             <tr
//               key={index}
//               className="hover:bg-gray-100 transition duration-300"
//             >
//               <td className="border p-3">{row.packId}</td>
//               <td className="border p-3">
//                 {Array.isArray(row.orderIds) && row.orderIds.length > 1 ? (
//                   <ul>
//                     {row.orderIds.map((orderId, idx) => (
//                       <li key={idx}>{orderId}</li>
//                     ))}
//                   </ul>
//                 ) : (
//                   row.orderId || "N/A"
//                 )}
//               </td>
//               <td className="border p-3">{row.createdAt}</td>
//               <td
//                 className={`border p-3 ${
//                   row.status === "paid"
//                     ? "text-green-600"
//                     : "text-red-600"
//                 }`}
//               >
//                 {row.status}
//               </td>
//               <td className="border p-3">
//                 {row.totalAmount} {row.currency}
//               </td>
//               <td className="border p-3">{row.sapOrder}</td>
//               <td className="border p-3">{row.sapInvoice}</td>
//               <td className="border p-3">{row.sapDate}</td>
//               <td className="border p-3">{row.sapTotal}</td>
//               <td className={`border p-3 ${
//                   row.sapStatus === "bost_Open"
//                     ? "text-green-600"
//                     : "text-red-600"
//                 }`}>{row.sapStatus}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

App.propTypes = {
  currentUser: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default App;

// import { useEffect, useState } from "react";
// import axios from "axios";

// function App() {
//   const [orders, setOrders] = useState([]);
//   const [renderData, setRenderData] = useState([]);

//   useEffect(() => {
//     if (orders.length === 0) {
//       const fetchOrders = async () => {
//         try {
//           const response = await axios.get("http://localhost:1853/orders");
//           setOrders(response.data);
//         } catch (error) {
//           console.error("Error fetching orders:", error);
//         }
//       };
//       fetchOrders();
//     }
//   }, [orders]);
//   const ordenarPorFechaDesc = (ordenes) =>
//     [...ordenes].sort(
//       (a, b) => new Date(b.createdAt) - new Date(a.createdAt));


//   useEffect(() => {
//     if (orders.length > 0) {
//       const procesarDatosParaRender = () => {
       
//         const agruparPorPackId = (ordenes) => {
//           const grupos = {};

//           ordenes.forEach((orden) => {
//             const packId = orden.PackIdMeli
//               ? orden.PackIdMeli.id
//               : "Individual";

//             if (!grupos[packId]) {
//               grupos[packId] = [];
//             }

//             grupos[packId].push(orden);
//           });

//           return grupos;
//         };

      
//         const ordenesAgrupadas = agruparPorPackId(orders);

//         const elementosParaRender = [];

//         // Procesar las órdenes individuales
//         if (ordenesAgrupadas["Individual"]) {
//           ordenesAgrupadas["Individual"].forEach((orden) => {
//             elementosParaRender.push({
//               packId: "Individual",
//               orderId: orden.id,
//               createdAt: orden.date_created.split("T")[0],
//               status: orden.status,
//               totalAmount: orden.total_amount,
//               currency: orden.currency_id,
//               sapOrder:
//                 orden.statusIdsap.order.length > 0
//                   ? orden.statusIdsap.order[0].DocEntry
//                   : "Sin Datos",
//               sapInvoice:
//                 orden.statusIdsap.invoice.length > 0
//                   ? orden.statusIdsap.invoice[0].DocEntry
//                   : "Sin Datos",
//               sapDate:
//                 orden.statusIdsap.order.length > 0
//                   ? orden.statusIdsap.order[0].DocDate
//                   : "Sin Datos",
//               sapTotal:
//                 orden.statusIdsap.order.length > 0
//                   ? orden.statusIdsap.order[0].DocTotal
//                   : "Sin Datos",
//               sapStatus:
//                 orden.statusIdsap.order.length > 0
//                   ? orden.statusIdsap.order[0].DocumentStatus
//                   : "Sin Datos",
//             });
//           });
//         }

//         // Procesar las órdenes por PackId
//         Object.keys(ordenesAgrupadas)
//           .filter((packId) => packId !== "Individual")
//           .forEach((packId) => {
//             const ordenesDelPack = ordenesAgrupadas[packId];
//             const totalPackAmount = ordenesDelPack.reduce(
//               (sum, orden) => sum + orden.total_amount,
//               0
//             );

//             elementosParaRender.push({
//               packId,
//               orderIds: ordenesDelPack.map((orden) => orden.id),
//               createdAt: ordenesDelPack[0].date_created.split("T")[0],
//               status: ordenesDelPack[0].status,
//               totalAmount: totalPackAmount,
//               currency: ordenesDelPack[0].currency_id,
//               sapOrder:
//                 ordenesDelPack[0].statusIdsap.order.length > 0
//                   ? ordenesDelPack[0].statusIdsap.order[0].DocEntry
//                   : "Sin Datos",
//               sapInvoice:
//                 ordenesDelPack[0].statusIdsap.invoice.length > 0
//                   ? ordenesDelPack[0].statusIdsap.invoice[0].DocEntry
//                   : "Sin Datos",
//               sapDate:
//                 ordenesDelPack[0].statusIdsap.order.length > 0
//                   ? ordenesDelPack[0].statusIdsap.order[0].DocDate
//                   : "Sin Datos",
//               sapTotal:
//                 ordenesDelPack[0].statusIdsap.order.length > 0
//                   ? ordenesDelPack[0].statusIdsap.order[0].DocTotal
//                   : "Sin Datos",
//               sapStatus:
//                 ordenesDelPack[0].statusIdsap.order.length > 0
//                   ? ordenesDelPack[0].statusIdsap.order[0].DocumentStatus
//                   : "Sin Datos",
//             });
//           });

//         setRenderData(elementosParaRender);
//       };

//       procesarDatosParaRender();
//     }
//   }, [orders]);
  
//   const ordenesOrdenadas = ordenarPorFechaDesc(renderData);
 
//   return (
//     <div className="bg-blue-200 min-h-screen w-auto p-4">
//       <h1 className="text-xl text-green-700 font-bold  mb-4">Órdenes de Mercado Libre</h1>
//       <table className="w-full table-auto bg-red-500">
//         <thead>
//           <tr>
//             <th className="border p-2">Pack ID</th>
//             <th className="border p-2">Order ID</th>
//             <th className="border p-2">Created At</th>
//             <th className="border p-2">Status</th>
//             <th className="border p-2">Total</th>
//             <th className="border p-2">SAP-order</th>
//             <th className="border p-2">SAP-Invoice</th>
//             <th className="border p-2">SAP-Fecha</th>
//             <th className="border p-2">SAP-Importe</th>
//             <th className="border p-2">SAP-Estado</th>
//           </tr>
//         </thead>
//         <tbody>
//         {ordenesOrdenadas.map((row, index) => (
//             <tr key={index} className="bg-gray-50 hover:bg-gray-100">
//               <td className="border p-2">{row.packId}</td>
//               <td className="border p-2">
//         {Array.isArray(row.orderIds) && row.orderIds.length > 1 ? (
//           <ul>
//             {row.orderIds.map((orderId, idx) => (
//               <li key={idx}>{orderId}</li>
//             ))}
//           </ul>
//         ) : (
//           row.orderId || (Array.isArray(row.orderIds) ? row.orderIds[0] : "N/A")
//         )}
//       </td>
//               <td className="border p-2">{row.createdAt}</td>
//               <td className={`border p-2 ${
//                   row.status === "paid" ? "text-green-500" : "text-red-500"
//                 }`}>{row.status}</td>
//               <td className="border p-2">
//                 {row.totalAmount} {row.currency}
//               </td>
//               <td className="border p-2">{row.sapOrder}</td>
//               <td className="border p-2">{row.sapInvoice}</td>
//               <td className="border p-2">{row.sapDate}</td>
//               <td className="border p-2">{row.sapTotal}</td>
//               <td className="border p-2">{row.sapStatus}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
  
// }

// export default App;
