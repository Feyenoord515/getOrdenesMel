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
      const response = await axios.get(import.meta.env.VITE_ENDPOINT);
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
        const response = await axios.get(import.meta.env.VITE_ENDPOINT);
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
App.propTypes = {
  currentUser: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
};

export default App;
