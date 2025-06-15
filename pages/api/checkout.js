import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";
import { Order } from "@/models/Order";
const stripe = require('stripe')(process.env.STRIPE_SK);
import nodemailer from "nodemailer";

function extractProductDetails(cartProducts, productsInfos) {
  let details = [];
  if (typeof cartProducts[0] === 'string') {
    const productsIds = cartProducts;
    const uniqueIds = [...new Set(productsIds)];
    for (const productId of uniqueIds) {
      const productInfo = productsInfos.find(p => p._id.toString() === productId);
      const quantity = productsIds.filter(id => id === productId)?.length || 0;
      if (quantity > 0 && productInfo) {
        details.push({
          title: productInfo.title,
          image: productInfo.images?.[0] || '',
          price: productInfo.price,
          quantity,
        });
      }
    }
  } else if (typeof cartProducts[0] === 'object' && cartProducts[0].product) {
    for (const item of cartProducts) {
      const productInfo = productsInfos.find(p => p._id.toString() === item.product);
      if (item.quantity > 0 && productInfo) {
        details.push({
          title: productInfo.title,
          image: productInfo.images?.[0] || '',
          price: productInfo.price,
          quantity: item.quantity,
        });
      }
    }
  }
  return details;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  const {
    name, email, city,
    postalCode, addressLine1,
    addressLine2, country, number,
    cartProducts, paymentMethod,
    referralSource = "", referralOther = ""
  } = req.body;
  await mongooseConnect();

  let line_items = [];
  let productsInfos = [];
  if (Array.isArray(cartProducts) && cartProducts.length > 0) {
    if (typeof cartProducts[0] === 'string') {
      const productsIds = cartProducts;
      const uniqueIds = [...new Set(productsIds)];
      productsInfos = await Product.find({ _id: uniqueIds });
      for (const productId of uniqueIds) {
        const productInfo = productsInfos.find(p => p._id.toString() === productId);
        const quantity = productsIds.filter(id => id === productId)?.length || 0;
        if (quantity > 0 && productInfo) {
          line_items.push({
            price_data: {
              product_data: { name: productInfo.title },
              unit_amount: productInfo.price * 100,
              currency: 'AED'
            },
            quantity
          });
        }
      }
    } else if (typeof cartProducts[0] === 'object' && cartProducts[0].product) {
      const productsIds = cartProducts.map(item => item.product);
      productsInfos = await Product.find({ _id: productsIds });
      for (const item of cartProducts) {
        const productInfo = productsInfos.find(p => p._id.toString() === item.product);
        if (item.quantity > 0 && productInfo) {
          line_items.push({
            price_data: {
              product_data: { name: productInfo.title },
              unit_amount: productInfo.price * 100,
              currency: 'AED'
            },
            quantity: item.quantity
          });
        }
      }
    }
  }

  const orderDoc = await Order.create({
    line_items,
    name,
    email,
    city,
    postalCode,
    addressLine1,
    addressLine2,
    number,
    country,
    paid: paymentMethod === 'COD' ? false : null,
    referralSource,
    referralOther
  });

  // Subtract stock for each product in the order
  for (const item of line_items) {
    const productName = item.price_data.product_data.name;
    const quantity = item.quantity || 1;
    const productDoc = await Product.findOne({ title: productName });
    if (productDoc) {
      productDoc.stock = Math.max(0, (productDoc.stock || 0) - quantity);
      await productDoc.save();
    }
  }

  const total = line_items.reduce((sum, item) => sum + (item.price_data.unit_amount * item.quantity), 0) / 100;
  const productDetails = extractProductDetails(cartProducts, productsInfos);
  const itemsHtml = productDetails.map(item => `
    <tr style="border-bottom:1px solid #eee;">
      <td style="padding:10px 8px 10px 0; text-align:center;">
        <img src="${item.image}" alt="${item.title}" style="width:60px; height:60px; object-fit:contain; border-radius:8px; border:1px solid #eee;" />
      </td>
      <td style="padding:10px 8px;">
        <div style="font-weight:600; color:#222;">${item.title}</div>
        <div style="color:#888; font-size:0.98em;">AED ${item.price} x ${item.quantity}</div>
      </td>
      <td style="padding:10px 8px; text-align:right; font-weight:600; color:#ff4500;">
        AED ${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `).join('');

  const orderDetailsHtml = `
    <div style="font-family:Arial,sans-serif; max-width:520px; margin:0 auto; background:#fff; border-radius:12px; box-shadow:0 2px 12px rgba(44,62,80,0.07); padding:24px 18px;">
      <h2 style="color:#ff9900; margin-top:0;">Thank you for your order!</h2>
      <p style="color:#222; font-size:1.1em; margin-bottom:18px;">Order ID: <b>${orderDoc._id}</b></p>
      <table style="width:100%; border-collapse:collapse; margin-bottom:18px;">
        <thead>
          <tr>
            <th style="text-align:center; color:#888; font-size:0.98em; font-weight:400;">Image</th>
            <th style="text-align:left; color:#888; font-size:0.98em; font-weight:400;">Product</th>
            <th style="text-align:right; color:#888; font-size:0.98em; font-weight:400;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
      <div style="font-size:1.15em; color:#222; font-weight:700; margin-bottom:10px;">Grand Total: <span style="color:#ff4500;">AED ${total.toFixed(2)}</span></div>
      <div style="font-size:0.98em; color:#555; margin-bottom:0;">Shipping to: <b>${name}</b>, ${addressLine1}${addressLine2 ? ', ' + addressLine2 : ''}, ${city}, ${country}, ${postalCode}</div>
      <div style="font-size:0.98em; color:#555; margin-bottom:0;">Contact: ${number}</div>
      <div style="margin-top:18px;padding:14px 0 0 0;font-size:1.08rem;color:#075e54;font-weight:600;">
        For further information contact us on WhatsApp:<br/>
        <a href="https://wa.me/971566130458" style="color:#25d366;text-decoration:none;font-size:1.13rem;font-weight:700;">+971-56-6130458</a>
      </div>
    </div>
  `;

  res.status(200).json({ message: 'Order placed successfully', orderId: orderDoc._id });
}
