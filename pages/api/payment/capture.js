import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";
import { Product } from "@/models/product";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { orderId, provider } = req.query;
  if (!orderId) return res.status(400).json({ error: 'Missing orderId' });

  try {
    await mongooseConnect();

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // If already paid, be idempotent
    if (order.status === 'paid' || order.paid === true) {
      return res.status(200).json({ ok: true, orderId: order._id });
    }

    // TODO: Optionally verify provider payment using provider & order.providerRef
    // Skipping external verification here for simplicity. Use webhooks for production reliability.

    // Subtract stock on capture (only once)
    if (Array.isArray(order.line_items)) {
      for (const item of order.line_items) {
        const productName = item?.price_data?.product_data?.name;
        const quantity = item?.quantity || 1;
        if (!productName || quantity <= 0) continue;
        const productDoc = await Product.findOne({ title: productName });
        if (productDoc) {
          productDoc.stock = Math.max(0, (productDoc.stock || 0) - quantity);
          await productDoc.save();
        }
      }
    }

    order.status = 'paid';
    order.paid = true;
    if (provider && !order.provider) order.provider = provider;
    await order.save();

    return res.status(200).json({ ok: true, orderId: order._id });
  } catch (e) {
    console.error('Capture error:', e);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
