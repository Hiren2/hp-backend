import jsPDF from "jspdf";
import logo from "../assets/logo.png"; // 🔥 OPTIONAL logo

export const generateInvoice = async (order) => {
  try {
    const doc = new jsPDF();

    /* ===== HEADER & LOGO ===== */
    if (logo) {
      doc.addImage(logo, "PNG", 14, 10, 40, 20); // Logo on left
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); // Premium Indigo Color
    doc.text("INVOICE", 190, 22, { align: "right" }); // Right aligned to balance header

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139); // Slate Gray
    doc.text("H&P Solutions Pvt. Ltd.", 190, 28, { align: "right" });
    doc.text("support@hpsolutions.com", 190, 33, { align: "right" });

    // Divider Line
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 40, 196, 40);

    /* ===== INVOICE & CUSTOMER INFO ===== */
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    
    // Left Side (Customer)
    doc.setFont("helvetica", "bold");
    doc.text("Invoice To:", 14, 50);
    
    doc.setFont("helvetica", "normal");
    const addr = order?.address || {};
    doc.text(`${addr.fullName || "Customer Name"}`, 14, 56);
    doc.text(`${addr.street || "-"}`, 14, 62);
    doc.text(`${addr.city || "-"}, ${addr.state || "-"} - ${addr.pincode || "-"}`, 14, 68);
    doc.text(`Phone: ${addr.phone || "-"}`, 14, 74);

    // Right Side (Order Details)
    doc.setFont("helvetica", "bold");
    doc.text("Order Details:", 120, 50);

    doc.setFont("helvetica", "normal");
    doc.text(`Invoice ID: #${order?._id?.toString().slice(-6).toUpperCase() || "N/A"}`, 120, 56);
    doc.text(`Date: ${order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}`, 120, 62);
    doc.text(`Status: ${order?.status?.toUpperCase() || "PENDING"}`, 120, 68);

    /* ===== 🔥 DYNAMIC PAYMENT STATUS BOX ===== */
    const method = order?.paymentMethod || "COD"; 
    const isPaid = order?.paymentStatus === "Paid" || order?.isPaid || method !== "COD";

    let paymentText = "";
    let paymentBgColor = [];
    let paymentTextColor = [];

    // Agar order COD hai aur Payment abhi nahi hui, to PENDING dikhayega.
    if (method.toUpperCase() === "COD" && !isPaid) {
      paymentText = "Payment Status: PENDING (Customer chose COD)";
      paymentBgColor = [254, 252, 232]; // Light Yellow
      paymentTextColor = [161, 98, 7]; // Dark Yellow/Amber
    } else {
      paymentText = `Payment Status: PAID via ${method.toUpperCase()}`;
      paymentBgColor = [240, 253, 244]; // Light Green
      paymentTextColor = [21, 128, 61]; // Dark Green
    }

    doc.setFillColor(...paymentBgColor);
    doc.rect(14, 85, 182, 12, "F");
    doc.setTextColor(...paymentTextColor);
    doc.setFont("helvetica", "bold");
    doc.text(paymentText, 20, 93);

    /* ===== TABLE HEADER ===== */
    doc.setFillColor(248, 250, 252); // Light Slate
    doc.rect(14, 105, 182, 10, "F");
    
    doc.setTextColor(51, 65, 85);
    doc.setFont("helvetica", "bold");
    doc.text("Description", 20, 112);
    
    // Amount header strictly aligned to the right edge
    const rightAlignX = 190; 
    doc.text("Amount", rightAlignX, 112, { align: "right" });

    /* ===== 🔥 DETAILED FINANCIAL BREAKDOWN ===== */
    doc.setFont("helvetica", "normal");
    const name = order?.service?.name || "Premium Service";
    
    const basePrice = order?.service?.price || 0;
    const discount = order?.discountValue || 0;
    const coupon = order?.couponCode || "";
    
    let tax = order?.taxAmount;
    let delivery = order?.deliveryCharge;
    let total = order?.totalAmount;

    // Fallback logic for old orders with missing financial breakdown
    if (!total || total === 0) {
      const discountedPrice = Math.max(0, basePrice - discount);
      tax = Math.round(discountedPrice * 0.18);
      delivery = discountedPrice === 0 ? 0 : (discountedPrice > 1000 ? 0 : 49);
      total = discountedPrice + tax + delivery;
    }

    let currentY = 122;

    // 1. Base Price
    doc.text(`${name} (Base Price)`, 20, currentY);
    doc.text(`Rs. ${basePrice}`, rightAlignX, currentY, { align: "right" });
    currentY += 8;

    // 2. Coupon Discount (If any)
    if (discount > 0) {
      doc.setTextColor(21, 128, 61); // Green Color for Discount
      doc.text(`Discount Applied ${coupon ? `(${coupon})` : ""}`, 20, currentY);
      doc.text(`- Rs. ${discount}`, rightAlignX, currentY, { align: "right" });
      doc.setTextColor(51, 65, 85); // Reset to Slate
      currentY += 8;
    }

    // 3. GST (18%)
    doc.text(`GST (18%)`, 20, currentY);
    doc.text(`+ Rs. ${tax}`, rightAlignX, currentY, { align: "right" });
    currentY += 8;

    // 4. Delivery Charges
    doc.text(`Delivery Charges`, 20, currentY);
    doc.text(delivery === 0 ? "FREE" : `+ Rs. ${delivery}`, rightAlignX, currentY, { align: "right" });
    currentY += 10;

    // Bottom Table Line
    doc.setDrawColor(226, 232, 240);
    doc.line(14, currentY, 196, currentY);
    currentY += 10;

    /* ===== TOTAL SUMMARY ===== */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42); // Very Dark Slate
    
    // 🔥 SPACING FIX: "Net Total Amount:" is pushed slightly to the left (150) and aligned right.
    // The actual price is fixed at the far right edge (190).
    // This guarantees they will never overlap and will look beautifully separated.
    doc.text("Net Total Amount:", 150, currentY, { align: "right" });
    
    doc.setTextColor(79, 70, 229); // Indigo Final Amount
    doc.text(`Rs. ${total}`, rightAlignX, currentY, { align: "right" });

    /* ===== FOOTER ===== */
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(148, 163, 184); // Muted Slate
    doc.text("Thank you for trusting H&P Solutions for your enterprise needs!", 105, 280, { align: "center" });

    return doc;

  } catch (err) {
    console.error("PDF ERROR:", err);
    throw err;
  }
};