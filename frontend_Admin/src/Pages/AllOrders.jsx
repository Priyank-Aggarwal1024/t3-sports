import React, { useEffect, useState } from "react";
import { useOrders } from "../contexts/OrdersContext.jsx";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaFileAlt, FaFileExcel, FaFilter, FaUserAlt } from "react-icons/fa"; // Import FontAwesome icons
import { exportToExcel } from "react-json-to-excel";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import useProducts from "../contexts/useProducts.js";
import * as XLSX from "xlsx";
import useWarehouse from "../contexts/useWarehouse.js";

// const exportOrdersToExcel = (orders, products, customers, warehouses = []) => {
//   try {
//     // Create a well-formatted dataset with all required fields
//     const formattedData = orders.map((order) => {
//       const customer = order.customer || {};

//       // Find warehouse data if available
//       const warehouse =
//         warehouses.find((w) => w._id === order.warehouse_id) || {};

//       // Process each product in the order
//       const orderProducts = order.products.map((product) => {
//         const productDetails = products.find((p) => p._id == product._id) || {};

//         return {
//           // Order Information
//           "Order #": order.order_number,
//           "Order Date": new Date(order.dateOfOrder).toLocaleDateString(),
//           Status: order.status,
//           "Order Type": order.ordertype,
//           Platform: order.platform,
//           "Other Platform": order.other_platform || "N/A",

//           // Customer Information
//           "Customer Name": `${customer.fname || ""} ${
//             customer.lname || ""
//           }`.trim(),
//           "Customer ID": customer.customerId || "N/A",
//           Phone: customer.phone || "N/A",
//           Email: customer.email || "N/A",
//           "Customer Type": customer.customertype || "N/A",
//           "Other Customer Type": customer.othercustomertype || "N/A",
//           Sport: customer.sport || "N/A",
//           "Other Sport": customer.othersport || "N/A",

//           // Product Information
//           "Product Name": product.productName,
//           Quantity: product.quantity,
//           "Unit Price": product.price,
//           "Product Total": product.price * product.quantity,

//           // Address Information (from customer object)
//           Address: customer.address || "N/A",
//           City: customer.city || "N/A",
//           State: customer.state || "N/A",
//           Pincode: customer.pincode || "N/A",
//           Country: customer.country || "N/A",

//           // Payment & Shipping Details
//           "Payment Method": order.payment_method,
//           "Payment Status": order.payment_status,
//           "Shipping Type": order.shipping_type,
//           "Tax Amount": order.taxAmount || 0,
//           "Total Amount": order.totalAmount,

//           // Weight Information
//           "Actual Weight (g)": order.weight || 0,
//           "Volumetric Weight (g)": order.volumetricWeight || 0,

//           // Warehouse Information
//           "Warehouse ID": order.warehouse_id || "N/A",
//           "Warehouse Name": warehouse.name || "N/A",
//           "Warehouse Email": warehouse.email || "N/A",
//           "Warehouse Address": warehouse.address || "N/A",

//           // Notes
//           "Order Notes": order.note || "N/A",
//         };
//       });

//       return orderProducts;
//     });

//     // Flatten the array of arrays
//     const flattenedData = formattedData.flat();

//     // Create a workbook and worksheet
//     const wb = XLSX.utils.book_new();
//     const ws = XLSX.utils.json_to_sheet(flattenedData);

//     // Set column widths for better readability
//     const columnWidths = [
//       { wch: 15 }, // Order #
//       { wch: 12 }, // Order Date
//       { wch: 12 }, // Status
//       { wch: 12 }, // Order Type
//       { wch: 10 }, // Platform
//       { wch: 15 }, // Other Platform
//       { wch: 20 }, // Customer Name
//       { wch: 15 }, // Customer ID
//       { wch: 15 }, // Phone
//       { wch: 25 }, // Email
//       { wch: 15 }, // Customer Type
//       { wch: 15 }, // Other Customer Type
//       { wch: 15 }, // Sport
//       { wch: 15 }, // Other Sport
//       { wch: 30 }, // Product Name
//       { wch: 10 }, // Quantity
//       { wch: 12 }, // Unit Price
//       { wch: 14 }, // Product Total
//       { wch: 35 }, // Address
//       { wch: 15 }, // City
//       { wch: 15 }, // State
//       { wch: 10 }, // Pincode
//       { wch: 12 }, // Country
//       { wch: 15 }, // Payment Method
//       { wch: 15 }, // Payment Status
//       { wch: 15 }, // Shipping Type
//       { wch: 12 }, // Tax Amount
//       { wch: 14 }, // Total Amount
//       { wch: 18 }, // Actual Weight
//       { wch: 20 }, // Volumetric Weight
//       { wch: 20 }, // Warehouse ID
//       { wch: 20 }, // Warehouse Name
//       { wch: 25 }, // Warehouse Location
//       { wch: 20 }, // Warehouse Contact
//       { wch: 25 }, // Order Notes
//     ];

//     ws["!cols"] = columnWidths;

//     // Define section colors
//     const colors = {
//       header: { bg: "4472C4", font: "FFFFFF" }, // Blue header
//       orderInfo: { bg: "E2EFDA", font: "000000" }, // Light green
//       customerInfo: { bg: "FFF2CC", font: "000000" }, // Light yellow
//       productInfo: { bg: "DAEEF3", font: "000000" }, // Light blue
//       addressInfo: { bg: "FCE4D6", font: "000000" }, // Light orange
//       paymentInfo: { bg: "E9D9F2", font: "000000" }, // Light purple
//       weightInfo: { bg: "F2F2F2", font: "000000" }, // Light gray
//       warehouseInfo: { bg: "DEEBF6", font: "000000" }, // Light blue
//       otherInfo: { bg: "DDEBF7", font: "000000" }, // Very light blue
//     };

//     // Get the range of data
//     const range = XLSX.utils.decode_range(ws["!ref"]);

//     // Style the header row
//     for (let C = range.s.c; C <= range.e.c; ++C) {
//       const address = XLSX.utils.encode_cell({ r: 0, c: C });
//       if (!ws[address]) continue;
//       ws[address].s = {
//         font: { bold: true, color: { rgb: colors.header.font } },
//         fill: { fgColor: { rgb: colors.header.bg } },
//         border: {
//           top: { style: "thin", color: { rgb: "000000" } },
//           bottom: { style: "thin", color: { rgb: "000000" } },
//           left: { style: "thin", color: { rgb: "000000" } },
//           right: { style: "thin", color: { rgb: "000000" } },
//         },
//         alignment: { horizontal: "center", vertical: "center", wrapText: true },
//       };
//     }

//     // Style the data rows with colors based on sections
//     for (let R = range.s.r + 1; R <= range.e.r; ++R) {
//       // Order Information (columns 0-5)
//       for (let C = 0; C <= 5; ++C) {
//         const address = XLSX.utils.encode_cell({ r: R, c: C });
//         if (!ws[address]) continue;
//         ws[address].s = {
//           fill: { fgColor: { rgb: colors.orderInfo.bg } },
//           border: {
//             left: { style: "thin" },
//             right: { style: "thin" },
//             bottom: { style: "thin" },
//           },
//           alignment: { horizontal: "left", vertical: "center" },
//         };
//       }

//       // Customer Information (columns 6-13)
//       for (let C = 6; C <= 13; ++C) {
//         const address = XLSX.utils.encode_cell({ r: R, c: C });
//         if (!ws[address]) continue;
//         ws[address].s = {
//           fill: { fgColor: { rgb: colors.customerInfo.bg } },
//           border: {
//             left: { style: "thin" },
//             right: { style: "thin" },
//             bottom: { style: "thin" },
//           },
//           alignment: { horizontal: "left", vertical: "center" },
//         };
//       }

//       // Product Information (columns 14-17)
//       for (let C = 14; C <= 17; ++C) {
//         const address = XLSX.utils.encode_cell({ r: R, c: C });
//         if (!ws[address]) continue;
//         ws[address].s = {
//           fill: { fgColor: { rgb: colors.productInfo.bg } },
//           border: {
//             left: { style: "thin" },
//             right: { style: "thin" },
//             bottom: { style: "thin" },
//           },
//           alignment: { horizontal: "left", vertical: "center" },
//         };

//         // Format numbers
//         if (C === 16 || C === 17) {
//           // Unit Price & Product Total
//           ws[address].z = '"₹"#,##0.00';
//         }
//       }

//       // Address Information (columns 18-22)
//       for (let C = 18; C <= 22; ++C) {
//         const address = XLSX.utils.encode_cell({ r: R, c: C });
//         if (!ws[address]) continue;
//         ws[address].s = {
//           fill: { fgColor: { rgb: colors.addressInfo.bg } },
//           border: {
//             left: { style: "thin" },
//             right: { style: "thin" },
//             bottom: { style: "thin" },
//           },
//           alignment: { horizontal: "left", vertical: "center", wrapText: true },
//         };
//       }

//       // Payment & Shipping Details (columns 23-27)
//       for (let C = 23; C <= 27; ++C) {
//         const address = XLSX.utils.encode_cell({ r: R, c: C });
//         if (!ws[address]) continue;
//         ws[address].s = {
//           fill: { fgColor: { rgb: colors.paymentInfo.bg } },
//           border: {
//             left: { style: "thin" },
//             right: { style: "thin" },
//             bottom: { style: "thin" },
//           },
//           alignment: { horizontal: "left", vertical: "center" },
//         };

//         // Format currency
//         if ([26, 27].includes(C)) {
//           // Money fields
//           ws[address].z = '"₹"#,##0.00';
//         }
//       }

//       // Weight Information (columns 28-29)
//       for (let C = 28; C <= 29; ++C) {
//         const address = XLSX.utils.encode_cell({ r: R, c: C });
//         if (!ws[address]) continue;
//         ws[address].s = {
//           fill: { fgColor: { rgb: colors.weightInfo.bg } },
//           border: {
//             left: { style: "thin" },
//             right: { style: "thin" },
//             bottom: { style: "thin" },
//           },
//           alignment: { horizontal: "right", vertical: "center" },
//         };
//         // Format numbers with units
//         ws[address].z = '#,##0.00 "g"';
//       }

//       // Warehouse Information (columns 30-33)
//       for (let C = 30; C <= 33; ++C) {
//         const address = XLSX.utils.encode_cell({ r: R, c: C });
//         if (!ws[address]) continue;
//         ws[address].s = {
//           fill: { fgColor: { rgb: colors.warehouseInfo.bg } },
//           border: {
//             left: { style: "thin" },
//             right: { style: "thin" },
//             bottom: { style: "thin" },
//           },
//           alignment: { horizontal: "left", vertical: "center", wrapText: true },
//         };
//       }

//       // Notes (column 34)
//       const notesCell = XLSX.utils.encode_cell({ r: R, c: 34 });
//       if (ws[notesCell]) {
//         ws[notesCell].s = {
//           fill: { fgColor: { rgb: colors.otherInfo.bg } },
//           border: {
//             left: { style: "thin" },
//             right: { style: "thin" },
//             bottom: { style: "thin" },
//           },
//           alignment: { horizontal: "left", vertical: "center", wrapText: true },
//         };
//       }
//     }

//     // Create a summary page
//     const orderSummary = createSummarySheet(orders, warehouses);
//     XLSX.utils.book_append_sheet(wb, orderSummary, "Order Summary");

//     // Add the main data worksheet to the workbook
//     XLSX.utils.book_append_sheet(wb, ws, "Orders Detail");

//     // Generate the Excel file and trigger download
//     XLSX.writeFile(
//       wb,
//       `Orders_Export_${new Date().toISOString().split("T")[0]}.xlsx`
//     );

//     return true;
//   } catch (error) {
//     console.error("Error exporting to Excel:", error);
//     toast.error("Failed to export data to Excel");
//     return false;
//   }
// };

// Function to create a summary sheet with key metrics

const exportOrdersToExcel = (orders, products, customers, warehouses = []) => {
  try {
    // Create a well-formatted dataset with all required fields
    const transformedOrders = orders.map((order) => ({
      "Order number": order.order_number,
      "Order date": order.dateOfOrder?.split("T")[0] || "N/A",
      "Order note": order.note || "",
      Platform: order.platform || "N/A",
      "Shipping type": order.shipping_type || "N/A",
      "Order status": order.status || "N/A",

      "Customer name": `${order?.customer?.fname || ""} ${
        order?.customer?.lname || ""
      }`.trim(),
      "Customer type": order.customer?.customertype || "N/A",
      Sport: order.customer?.sport || "N/A",
      Phone: order.customer?.phone || "N/A",
      "Customer email": order.customer?.email || "N/A",
      City: order?.customer?.city || "N/A",
      State: order?.customer?.state || "N/A",
      Country: order?.customer?.country || "N/A",
      Pincode: order?.customer?.pincode || "N/A",

      "Product name": order.products
        .map((product) => product.productName)
        .join(", "),
      "Product size": order.products
        .map(
          (product) => products.find((p) => p._id == product._id)?.size || "N/A"
        )
        .join(", "),
      Quantity: order.products.map((product) => product.quantity).join(", "),
      "Unit price": order.products.map((product) => product.price).join(", "),
      Subtotal: order.products
        .map((product) => product.price * product.quantity)
        .join(", "),

      "Warehouse name": order?.warehouse_id?.name || "N/A",
      "Warehouse address": order?.warehouse_id?.address || "N/A",
      "Warehouse email": order?.warehouse_id?.email || "N/A",

      "Shipping address":
        order?.shippingDetails?.shippingAddress?.address || "N/A",
      "Shipping city": order?.shippingDetails?.shippingAddress?.city || "N/A",
      "Shipping state": order?.shippingDetails?.shippingAddress?.state || "N/A",
      "Shipping pincode":
        order?.shippingDetails?.shippingAddress?.pincode || "N/A",
      "Shipping country":
        order?.shippingDetails?.shippingAddress?.country || "N/A",
      "Shipping charges": order?.shippingDetails?.shippingCharges || 0,
      "COD charges": order?.shippingDetails?.codCharges || 0,

      "Payment status": order.payment_status || "N/A",
      "Payment method": order.payment_method || "N/A",
      "Total amount": order.totalAmount || 0,
    }));

    // Flatten the array of arrays
    const flattenedData = transformedOrders.flat();

    // Create a workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(flattenedData);

    // Calculate column widths based on the data content
    const columnWidths = [];
    const range = XLSX.utils.decode_range(ws["!ref"]);

    // Iterate through each column to calculate the maximum length of data
    for (let C = range.s.c; C <= range.e.c; ++C) {
      let maxLength = 0;

      // Check header (row 0) and data rows to determine max length
      for (let R = range.s.r; R <= range.e.r; ++R) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cellValue = ws[cellAddress] ? ws[cellAddress].v : "";

        // Update the max length if necessary
        if (cellValue && cellValue.length > maxLength) {
          maxLength = cellValue.length;
        }
      }

      // Add padding (usually 2-5 chars for better appearance)
      columnWidths.push({ wch: maxLength + 2 });
    }

    // Apply dynamic column widths to the sheet
    ws["!cols"] = columnWidths;

    // Define section colors for different categories
    const colors = {
      header: { bg: "4472C4", font: "FFFFFF" }, // Blue header
      orderInfo: { bg: "E2EFDA", font: "000000" }, // Light green
      customerInfo: { bg: "FFF2CC", font: "000000" }, // Light yellow
      productInfo: { bg: "DAEEF3", font: "000000" }, // Light blue
      addressInfo: { bg: "FCE4D6", font: "000000" }, // Light orange
      paymentInfo: { bg: "E9D9F2", font: "000000" }, // Light purple
      weightInfo: { bg: "F2F2F2", font: "000000" }, // Light gray
      warehouseInfo: { bg: "DEEBF6", font: "000000" }, // Light blue
      otherInfo: { bg: "DDEBF7", font: "000000" }, // Very light blue
    };

    // Style the header row
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[address]) continue;
      ws[address].s = {
        font: { bold: true, color: { rgb: colors.header.font } },
        fill: { fgColor: { rgb: colors.header.bg } },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
      };
    }

    // Style the data rows with colors based on sections (Order Info, Customer Info, etc.)
    for (let R = range.s.r + 1; R <= range.e.r; ++R) {
      for (let C = 0; C <= 33; ++C) {
        const address = XLSX.utils.encode_cell({ r: R, c: C });
        if (!ws[address]) continue;

        let sectionColor = colors.orderInfo.bg;
        if (C >= 6 && C <= 13) sectionColor = colors.customerInfo.bg;
        if (C >= 14 && C <= 17) sectionColor = colors.productInfo.bg;
        if (C >= 18 && C <= 22) sectionColor = colors.addressInfo.bg;
        if (C >= 23 && C <= 27) sectionColor = colors.paymentInfo.bg;
        if (C === 28 || C === 29) sectionColor = colors.weightInfo.bg;
        if (C >= 30 && C <= 33) sectionColor = colors.warehouseInfo.bg;
        if (C === 34) sectionColor = colors.otherInfo.bg;

        ws[address].s = {
          fill: { fgColor: { rgb: sectionColor } },
          border: {
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
          },
          alignment: { horizontal: "left", vertical: "center", wrapText: true },
        };
      }
    }

    // Create a summary page
    const orderSummary = createSummarySheet(orders, warehouses);
    XLSX.utils.book_append_sheet(wb, orderSummary, "Order Summary");

    // Add the main data worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Orders Detail");

    // Generate the Excel file and trigger download
    XLSX.writeFile(
      wb,
      `Orders_Export_${new Date().toISOString().split("T")[0]}.xlsx`
    );

    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    toast.error("Failed to export data to Excel");
    return false;
  }
};

const createSummarySheet = (orders, warehouses = []) => {
  // Calculate summary data
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );
  const averageOrderValue = totalRevenue / totalOrders;

  // Count orders by status
  const ordersByStatus = {};
  orders.forEach((order) => {
    if (!ordersByStatus[order.status]) {
      ordersByStatus[order.status] = 0;
    }
    ordersByStatus[order.status]++;
  });

  // Count orders by platform
  const ordersByPlatform = {};
  orders.forEach((order) => {
    const platform = order.platform || "Unknown";
    if (!ordersByPlatform[platform]) {
      ordersByPlatform[platform] = 0;
    }
    ordersByPlatform[platform]++;
  });

  // Count orders by warehouse
  const ordersByWarehouse = {};
  orders.forEach((order) => {
    const warehouseId = order.warehouse_id._id;
    const warehouse = warehouses.find((w) => w._id === warehouseId) || {};
    const warehouseName = warehouse.name || warehouseId || "Unknown";

    if (!ordersByWarehouse[warehouseName]) {
      ordersByWarehouse[warehouseName] = 0;
    }
    ordersByWarehouse[warehouseName]++;
  });

  // Create the summary data
  const summaryData = [
    ["Order Export Summary", ""],
    ["Date Range", `${new Date().toLocaleDateString()}`],
    ["", ""],
    ["Key Metrics", ""],
    ["Total Orders", totalOrders],
    ["Total Revenue", totalRevenue],
    ["Average Order Value", averageOrderValue],
    ["", ""],
    ["Orders by Status", "Count"],
    ...Object.entries(ordersByStatus).map(([status, count]) => [status, count]),
    ["", ""],
    ["Orders by Platform", "Count"],
    ...Object.entries(ordersByPlatform).map(([platform, count]) => [
      platform,
      count,
    ]),
    ["", ""],
    ["Orders by Warehouse", "Count"],
    ...Object.entries(ordersByWarehouse).map(([warehouse, count]) => [
      warehouse,
      count,
    ]),
  ];
  // Create worksheet from the summary data
  const ws = XLSX.utils.aoa_to_sheet(summaryData);

  // Style the summary sheet
  const range = XLSX.utils.decode_range(ws["!ref"]);

  // Set column widths
  ws["!cols"] = [{ wch: 25 }, { wch: 20 }];

  // Style the title
  const titleCell = XLSX.utils.encode_cell({ r: 0, c: 0 });
  ws[titleCell].s = {
    font: { bold: true, size: 14, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "4472C4" } },
    alignment: { horizontal: "center" },
  };
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

  // Style section headers
  [3, 8, 11, 14].forEach((row) => {
    const cell = XLSX.utils.encode_cell({ r: row, c: 0 });
    ws[cell].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { fgColor: { rgb: "4472C4" } },
    };
    if (row === 8 || row === 11 || row === 14) {
      const countCell = XLSX.utils.encode_cell({ r: row, c: 1 });
      ws[countCell].s = {
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "4472C4" } },
      };
    }
  });

  // Style metrics
  for (let i = 4; i <= 6; i++) {
    const labelCell = XLSX.utils.encode_cell({ r: i, c: 0 });
    const valueCell = XLSX.utils.encode_cell({ r: i, c: 1 });

    ws[labelCell].s = {
      font: { bold: true },
      fill: { fgColor: { rgb: "E2EFDA" } },
      border: { bottom: { style: "thin" } },
    };

    ws[valueCell].s = {
      alignment: { horizontal: "right" },
      fill: { fgColor: { rgb: "E2EFDA" } },
      border: { bottom: { style: "thin" } },
    };

    // Format currency for revenue and AOV
    if (i === 5 || i === 6) {
      ws[valueCell].z = '"₹"#,##0.00';
    }
  }

  // Style status section
  for (let i = 9; i < 11; i++) {
    if (summaryData[i] && summaryData[i][0]) {
      const labelCell = XLSX.utils.encode_cell({ r: i, c: 0 });
      const valueCell = XLSX.utils.encode_cell({ r: i, c: 1 });

      ws[labelCell].s = {
        fill: { fgColor: { rgb: "FFF2CC" } },
        border: { bottom: { style: "thin" } },
      };

      ws[valueCell].s = {
        alignment: { horizontal: "right" },
        fill: { fgColor: { rgb: "FFF2CC" } },
        border: { bottom: { style: "thin" } },
      };
    }
  }

  // Style platform section
  for (let i = 12; i < 14; i++) {
    if (summaryData[i] && summaryData[i][0]) {
      const labelCell = XLSX.utils.encode_cell({ r: i, c: 0 });
      const valueCell = XLSX.utils.encode_cell({ r: i, c: 1 });

      ws[labelCell].s = {
        fill: { fgColor: { rgb: "DAEEF3" } },
        border: { bottom: { style: "thin" } },
      };

      ws[valueCell].s = {
        alignment: { horizontal: "right" },
        fill: { fgColor: { rgb: "DAEEF3" } },
        border: { bottom: { style: "thin" } },
      };
    }
  }

  // Style warehouse section
  for (let i = 15; i < summaryData.length; i++) {
    if (summaryData[i] && summaryData[i][0]) {
      const labelCell = XLSX.utils.encode_cell({ r: i, c: 0 });
      const valueCell = XLSX.utils.encode_cell({ r: i, c: 1 });

      ws[labelCell].s = {
        fill: { fgColor: { rgb: "DEEBF6" } },
        border: { bottom: { style: "thin" } },
      };

      ws[valueCell].s = {
        alignment: { horizontal: "right" },
        fill: { fgColor: { rgb: "DEEBF6" } },
        border: { bottom: { style: "thin" } },
      };
    }
  }

  return ws;
};

const AllOrders = () => {
  const { orders, loading, error, fetchOrders } = useOrders();
  const { products } = useProducts();
  const { warehouses } = useWarehouse();
  const [filterBy, setFilterBy] = useState("");
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [ordersPerPage] = useState(15);

  const totalPages = Math.ceil(orders?.length / ordersPerPage);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [searchText, setSearchText] = useState("");
  const [updateOrderId, setUpdateOrderId] = useState("");
  const [status, setStatus] = useState("");
  const [trackinglink, setTrackingLink] = useState("");

  const [filteredOrders, setFilteredOrders] = useState(orders);
  const changePage = (page) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
  };
  const handleChangeFilterBy = ({ target }) => {
    setFilterBy(target.value);
  };
  const filterHandler = () => {
    if (filterBy == "date") {
      if (!fromDate || !toDate) {
        setFilteredOrders(orders);
        return;
      }

      const filtered = orders.filter((order) => {
        const orderDate = new Date(order.dateOfOrder);
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        return orderDate >= startDate && orderDate <= endDate;
      });

      setFilteredOrders(filtered);
    }
    if (filterBy == "orderid") {
      const filtered = orders.filter((order) => {
        const isOrderNumberMatch = orderNumber
          ? String(order.order_number).includes(orderNumber.trim())
          : true;

        // Check if orderDate is within the range
        return isOrderNumberMatch;
      });

      setFilteredOrders(filtered);
    }
    if (filterBy == "cname") {
      const regex = new RegExp(searchText, "i");

      const filtered = orders.filter((order) => {
        return (
          regex.test(order?.customer?.fname) ||
          regex.test(order?.customer?.lname)
        );
      });

      setFilteredOrders(filtered);
    }
  };
  const currentOrders = filteredOrders?.slice(
    currentPage * ordersPerPage,
    (currentPage + 1) * ordersPerPage
  );
  const handleSaveOrder = async () => {
    if (!status) {
      alert("Select valid status");
      setUpdateOrderId("");
      return;
    }
    try {
      const response = await axios.put(`/api/orders/update/${updateOrderId}`, {
        status,
        trackinglink,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchOrders();
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
    setUpdateOrderId("");
  };
  useEffect(() => {
    let tl = orders
      ? orders.find((order) => {
          if (order._id == updateOrderId) {
            return order;
          }
        })
      : "";
    setTrackingLink(tl?.trackinglink || "");
  }, [updateOrderId]);
  useEffect(() => {
    console.log(status);
  }, []);
  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);
  const filterAndTransformOrders = () => {
    const transformedOrders = orders.flatMap((order) =>
      order.products.map((product) => ({
        orderNumber: order.order_number,
        orderType: order.ordertype,
        date: order.dateOfOrder.split("T")[0], // Extract only date
        customerName: `${order?.customer?.fname || ""} ${
          order?.customer?.lname || ""
        }`,
        customerType: order.customer?.customertype || "N/A",
        sport: order.customer?.sport || "N/A",
        productName: product.productName,
        productSize: products.find((p) => p._id == product._id)?.size || "N/A", // Default if missing
        quantity: product.quantity,
        "each price": product.price,
        subtotal: product.price * product.quantity,
        city: order?.customer?.city || "N/A",
        state: order?.customer?.state || "N/A",
      }))
    );
    console.log(transformedOrders);
    return transformedOrders;
  };
  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error fetching orders: {error}</p>;

  // If no orders, show a message
  if (!Array.isArray(orders) || orders.length === 0) {
    return <p>No orders found.</p>;
  }
  return (
    <div className="bg-white dark:bg-darkPrimary min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-text dark:text-white mb-6">
            Order List
          </h2>

          {/* Filters Section */}
          <div className="bg-lightSecondary dark:bg-darkSecondary rounded-lg p-4 shadow-md mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Filter Type Selection */}
              <div className="flex flex-col xs:flex-row items-start xs:items-center gap-4">
                <label
                  htmlFor="filter-by"
                  className="text-secondary dark:text-white font-medium min-w-32"
                >
                  Filter by:
                </label>
                <select
                  id="filter-by"
                  name="filter-by"
                  onChange={handleChangeFilterBy}
                  className="w-full max-w-xs rounded-md border border-gray-300 dark:border-gray-600 px-4 py-2 bg-white dark:bg-black text-secondary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option
                    value=""
                    className="dark:bg-darkPrimary dark:text-white"
                  >
                    Select Filter Option
                  </option>
                  <option
                    value="date"
                    className="dark:bg-darkPrimary dark:text-white"
                  >
                    Dates
                  </option>
                  <option
                    value="orderid"
                    className="dark:bg-darkPrimary dark:text-white"
                  >
                    Order ID
                  </option>
                  <option
                    value="cname"
                    className="dark:bg-darkPrimary dark:text-white"
                  >
                    Customer Name
                  </option>
                </select>
              </div>

              {/* Filter Input Fields */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {filterBy === "date" ? (
                  <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="fromDate"
                        className="text-secondary dark:text-white whitespace-nowrap"
                      >
                        From:
                      </label>
                      <input
                        type="date"
                        id="fromDate"
                        value={fromDate}
                        onChange={(e) => setFromDate(e.target.value)}
                        className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-secondary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label
                        htmlFor="toDate"
                        className="text-secondary dark:text-white whitespace-nowrap"
                      >
                        To:
                      </label>
                      <input
                        type="date"
                        id="toDate"
                        value={toDate}
                        onChange={(e) => setToDate(e.target.value)}
                        className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-secondary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                ) : filterBy === "orderid" ? (
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      id="orderNumber"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="Enter Order ID"
                      className="w-full p-2 pl-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-secondary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <FaFileAlt
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
                      size={18}
                    />
                  </div>
                ) : (
                  filterBy === "cname" && (
                    <div className="relative flex-grow">
                      <input
                        type="text"
                        id="searchtext"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Enter Customer Name"
                        className="w-full p-2 pl-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-secondary dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <FaUserAlt
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary"
                        size={18}
                      />
                    </div>
                  )
                )}

                <button
                  onClick={filterHandler}
                  className="py-2 px-6 bg-primary hover:bg-blue-600 text-white rounded-md shadow transition duration-200 flex items-center gap-2"
                >
                  <FaFilter size={14} />
                  <span>Apply Filter</span>
                </button>
              </div>
            </div>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Showing {currentPage * ordersPerPage + 1} to{" "}
              {Math.min((currentPage + 1) * ordersPerPage, orders.length)} of{" "}
              {orders.length} orders
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="p-2 rounded-l-md bg-lightSecondary dark:bg-darkSecondary text-secondary dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition duration-200"
                >
                  <IoIosArrowBack size={16} />
                </button>
                <span className="px-4 py-2 bg-white dark:bg-black text-secondary dark:text-white border-t border-b border-gray-300 dark:border-gray-600">
                  {currentPage + 1}
                </span>
                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages - 1}
                  className="p-2 rounded-r-md bg-lightSecondary dark:bg-darkSecondary text-secondary dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition duration-200"
                >
                  <IoIosArrowForward size={16} />
                </button>
              </div>
              <button
                onClick={() =>
                  exportOrdersToExcel(
                    orders,
                    products,
                    orders.map((o) => o.customer),
                    warehouses
                  )
                }
                className="flex items-center gap-2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md shadow transition duration-200"
              >
                <FaFileExcel size={16} />
                <span className="hidden sm:inline">Export to Excel</span>
              </button>
            </div>
          </div>

          {/* Orders Table - Desktop */}
          <div className="hidden md:block overflow-hidden rounded-lg shadow">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-lightSecondary dark:bg-secondary">
                  <tr>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      #
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-black">
                  {currentOrders.map((order, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 transition duration-150"
                    >
                      <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                        {index + 1 + currentPage * ordersPerPage}
                      </td>
                      <td className="py-4 px-4">
                        <Link
                          to={`/show-order/${order._id}`}
                          className="text-primary hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                          {order.order_number}
                        </Link>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {`${order.customer?.fname} ${order.customer?.lname}`}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {order.customer?.phone}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm font-medium text-gray-900 dark:text-white">
                        ₹{order.totalAmount}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.dateOfOrder).toLocaleDateString(
                          "en-GB"
                        )}
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {updateOrderId !== order._id ? (
                          <span
                            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === "cancelled"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                : order.status === "booked"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                : order.status === "new"
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                : order.status === "delivered"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : order.status === "shipped"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            }`}
                          >
                            {order.status}
                          </span>
                        ) : (
                          <select
                            id="status"
                            name="status"
                            onChange={({ target }) => setStatus(target.value)}
                            className="w-full text-sm rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1 bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option
                              value=""
                              className="dark:bg-darkPrimary dark:text-white"
                            >
                              Select Status
                            </option>
                            <option
                              value="packaging"
                              className="dark:bg-darkPrimary dark:text-white"
                            >
                              Packaging
                            </option>
                            <option
                              value="shipped"
                              className="dark:bg-darkPrimary dark:text-white"
                            >
                              Shipped
                            </option>
                            <option
                              value="delivered"
                              className="dark:bg-darkPrimary dark:text-white"
                            >
                              Delivered
                            </option>
                            <option
                              value="returned"
                              className="dark:bg-darkPrimary dark:text-white"
                            >
                              Returned
                            </option>
                            <option
                              value="customer unavailable"
                              className="dark:bg-darkPrimary dark:text-white"
                            >
                              Customer Unavailable
                            </option>
                          </select>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
                          onClick={() => {
                            // Add functionality to show more details in a modal or expandable section
                          }}
                        >
                          <details className="text-sm">
                            <summary className="cursor-pointer text-primary hover:underline focus:outline-none">
                              View Details
                            </summary>
                            <div className="mt-2 pl-2 text-gray-600 dark:text-gray-300 border-l-2 border-gray-300 dark:border-gray-600">
                              <div className="grid grid-cols-2 gap-1 text-xs">
                                <span className="font-medium">Weight:</span>
                                <span>{`${order.weight || "0"}g`}</span>

                                <span className="font-medium">Payment:</span>
                                <span>{order.payment_method}</span>

                                <span className="font-medium">Type:</span>
                                <span>{order.ordertype}</span>

                                <span className="font-medium">Tracking:</span>
                                <span>
                                  {updateOrderId !== order._id ? (
                                    order?.trackinglink ? (
                                      <Link
                                        to={order.trackinglink}
                                        target="_blank"
                                        className="text-primary hover:underline"
                                      >
                                        Track
                                      </Link>
                                    ) : (
                                      "No Link"
                                    )
                                  ) : (
                                    <input
                                      type="text"
                                      value={trackinglink}
                                      onChange={(e) =>
                                        setTrackingLink(e.target.value)
                                      }
                                      className="w-full p-1 text-xs border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary"
                                      placeholder="Add tracking URL"
                                    />
                                  )}
                                </span>
                              </div>
                            </div>
                          </details>
                        </button>
                      </td>
                      <td className="py-4 px-4 text-sm">
                        {updateOrderId !== order._id ? (
                          <button
                            className="px-3 py-1 bg-primary hover:bg-blue-600 text-white rounded text-xs transition duration-200"
                            onClick={() => setUpdateOrderId(order._id)}
                          >
                            Update
                          </button>
                        ) : (
                          <button
                            onClick={handleSaveOrder}
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition duration-200"
                          >
                            Save
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Orders Cards - Mobile */}
          <div className="md:hidden space-y-4">
            {currentOrders.map((order, index) => (
              <div
                key={index}
                className="bg-white dark:bg-black border border-gray-200 dark:border-gray-700 rounded-lg shadow overflow-hidden"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <Link
                      to={`/show-order/${order._id}`}
                      className="text-primary hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                    >
                      #{order.order_number}
                    </Link>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(order.dateOfOrder).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      order.status === "cancelled"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : order.status === "booked"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : order.status === "new"
                        ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                        : order.status === "delivered"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : order.status === "shipped"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {`${order.customer?.fname} ${order.customer?.lname}`}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {order.customer?.phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        ₹{order.totalAmount}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {order.payment_method}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-300">
                    <div>
                      <span className="font-medium">Order Type: </span>
                      {order.ordertype}
                    </div>
                    <div>
                      <span className="font-medium">Weight: </span>
                      {`${order.weight || "0"}g`}
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium">Tracking: </span>
                      {updateOrderId !== order._id ? (
                        order?.trackinglink ? (
                          <Link
                            to={order.trackinglink}
                            target="_blank"
                            className="text-primary hover:underline"
                          >
                            Track Order
                          </Link>
                        ) : (
                          "No tracking link"
                        )
                      ) : (
                        <input
                          type="text"
                          value={trackinglink}
                          onChange={(e) => setTrackingLink(e.target.value)}
                          className="w-full mt-1 p-2 text-xs border rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-primary"
                          placeholder="Add tracking URL"
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                  {updateOrderId !== order._id ? (
                    <button
                      className="w-full py-2 bg-primary hover:bg-blue-600 text-white rounded text-sm font-medium transition duration-200"
                      onClick={() => setUpdateOrderId(order._id)}
                    >
                      Update Status
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <select
                        id="status-mobile"
                        name="status"
                        onChange={({ target }) => setStatus(target.value)}
                        className="w-full text-sm rounded-md border border-gray-300 dark:border-gray-600 p-2 bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option
                          value=""
                          className="dark:bg-darkPrimary dark:text-white"
                        >
                          Select Status
                        </option>
                        <option
                          value="packaging"
                          className="dark:bg-darkPrimary dark:text-white"
                        >
                          Packaging
                        </option>
                        <option
                          value="shipped"
                          className="dark:bg-darkPrimary dark:text-white"
                        >
                          Shipped
                        </option>
                        <option
                          value="delivered"
                          className="dark:bg-darkPrimary dark:text-white"
                        >
                          Delivered
                        </option>
                        <option
                          value="returned"
                          className="dark:bg-darkPrimary dark:text-white"
                        >
                          Returned
                        </option>
                        <option
                          value="customer unavailable"
                          className="dark:bg-darkPrimary dark:text-white"
                        >
                          Customer Unavailable
                        </option>
                      </select>

                      <button
                        onClick={handleSaveOrder}
                        className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition duration-200"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination - Mobile */}
          <div className="mt-6 flex justify-center md:hidden">
            <div className="flex items-center">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2 rounded-l-md bg-lightSecondary dark:bg-darkSecondary text-secondary dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition duration-200"
              >
                <IoIosArrowBack size={16} />
              </button>
              <span className="px-4 py-2 bg-white dark:bg-black text-secondary dark:text-white border-t border-b border-gray-300 dark:border-gray-600">
                {currentPage + 1} / {totalPages}
              </span>
              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-r-md bg-lightSecondary dark:bg-darkSecondary text-secondary dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 transition duration-200"
              >
                <IoIosArrowForward size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
