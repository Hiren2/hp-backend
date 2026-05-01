import jsPDF from "jspdf";
import logo from "../assets/logo.png"; 

export const generateInvoice = async (order) => {
  try {
    const doc = new jsPDF();

    
    if (logo) {
      doc.addImage(logo, "PNG", 14, 10, 40, 20); 
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); 
    doc.text("INVOICE", 190, 22, { align: "right" }); 

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139); 
    doc.text("H&P Solutions Pvt. Ltd.", 190, 28, { align: "right" });
    doc.text("support@hpsolutions.com", 190, 33, { align: "right" });

    
    doc.setDrawColor(226, 232, 240);
    doc.line(14, 40, 196, 40);

    
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);
    
    
    doc.setFont("helvetica", "bold");
    doc.text("Invoice To:", 14, 50);
    
    doc.setFont("helvetica", "normal");
    const addr = order?.address || {};
    doc.text(`${addr.fullName || "Customer Name"}`, 14, 56);
    doc.text(`${addr.street || "-"}`, 14, 62);
    doc.text(`${addr.city || "-"}, ${addr.state || "-"} - ${addr.pincode || "-"}`, 14, 68);
    doc.text(`Phone: ${addr.phone || "-"}`, 14, 74);

    
    doc.setFont("helvetica", "bold");
    doc.text("Order Details:", 120, 50);

    doc.setFont("helvetica", "normal");
    doc.text(`Invoice ID: #${order?._id?.toString().slice(-6).toUpperCase() || "N/A"}`, 120, 56);
    doc.text(`Date: ${order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}`, 120, 62);
    doc.text(`Status: ${order?.status?.toUpperCase() || "PENDING"}`, 120, 68);

    
    const method = order?.paymentMethod || "COD"; 
    const isPaid = order?.paymentStatus === "Paid" || order?.isPaid || method !== "COD";

    let paymentText = "";
    let paymentBgColor = [];
    let paymentTextColor = [];

    
    if (method.toUpperCase() === "COD" && !isPaid) {
      paymentText = "Payment Status: PENDING (Customer chose COD)";
      paymentBgColor = [254, 252, 232]; 
      paymentTextColor = [161, 98, 7]; 
    } else {
      paymentText = `Payment Status: PAID via ${method.toUpperCase()}`;
      paymentBgColor = [240, 253, 244]; 
      paymentTextColor = [21, 128, 61]; 
    }

    doc.setFillColor(...paymentBgColor);
    doc.rect(14, 85, 182, 12, "F");
    doc.setTextColor(...paymentTextColor);
    doc.setFont("helvetica", "bold");
    doc.text(paymentText, 20, 93);

    
    doc.setFillColor(248, 250, 252); 
    doc.rect(14, 105, 182, 10, "F");
    
    doc.setTextColor(51, 65, 85);
    doc.setFont("helvetica", "bold");
    doc.text("Description", 20, 112);
    
    
    const rightAlignX = 190; 
    doc.text("Amount", rightAlignX, 112, { align: "right" });

    
    doc.setFont("helvetica", "normal");
    const name = order?.service?.name || "Premium Service";
    
    const basePrice = order?.service?.price || 0;
    const discount = order?.discountValue || 0;
    const coupon = order?.couponCode || "";
    
    let tax = order?.taxAmount;
    let delivery = order?.deliveryCharge;
    let total = order?.totalAmount;

    
    if (!total || total === 0) {
      const discountedPrice = Math.max(0, basePrice - discount);
      tax = Math.round(discountedPrice * 0.18);
      delivery = discountedPrice === 0 ? 0 : (discountedPrice > 1000 ? 0 : 49);
      total = discountedPrice + tax + delivery;
    }

    let currentY = 122;

    
    doc.text(`${name} (Base Price)`, 20, currentY);
    doc.text(`Rs. ${basePrice}`, rightAlignX, currentY, { align: "right" });
    currentY += 8;

    
    if (discount > 0) {
      doc.setTextColor(21, 128, 61); 
      doc.text(`Discount Applied ${coupon ? `(${coupon})` : ""}`, 20, currentY);
      doc.text(`- Rs. ${discount}`, rightAlignX, currentY, { align: "right" });
      doc.setTextColor(51, 65, 85); 
      currentY += 8;
    }

    
    doc.text(`GST (18%)`, 20, currentY);
    doc.text(`+ Rs. ${tax}`, rightAlignX, currentY, { align: "right" });
    currentY += 8;

    
    doc.text(`Delivery Charges`, 20, currentY);
    doc.text(delivery === 0 ? "FREE" : `+ Rs. ${delivery}`, rightAlignX, currentY, { align: "right" });
    currentY += 10;

    
    doc.setDrawColor(226, 232, 240);
    doc.line(14, currentY, 196, currentY);
    currentY += 10;

    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42); 
    
    
    
    
    doc.text("Net Total Amount:", 150, currentY, { align: "right" });
    
    doc.setTextColor(79, 70, 229); 
    doc.text(`Rs. ${total}`, rightAlignX, currentY, { align: "right" });

    
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(148, 163, 184); 
    doc.text("Thank you for trusting H&P Solutions for your enterprise needs!", 105, 280, { align: "center" });

    return doc;

  } catch (err) {
    console.error("PDF ERROR:", err);
    throw err;
  }
};