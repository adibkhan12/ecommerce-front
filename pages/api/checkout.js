import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/product";
import { Order } from "@/models/Order";

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

  const CURRENCY = process.env.CURRENCY || 'AED';
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

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
              currency: CURRENCY,
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
              currency: CURRENCY,
            },
            quantity: item.quantity
          });
        }
      }
    }
  }

  const total = line_items.reduce((sum, item) => sum + (item.price_data.unit_amount * item.quantity), 0) / 100;

  // Create order pending
  const orderDoc = await Order.create({
    line_items,
    name,
    email,
    city,
    postal_code: postalCode,
    addressLine1,
    addressLine2,
    number,
    country,
    paid: paymentMethod === 'COD' ? false : null,
    referralSource,
    referralOther,
    paymentMethod: paymentMethod?.toUpperCase?.() === 'COD' ? 'COD' : paymentMethod,
    status: paymentMethod === 'COD' ? 'pending' : 'pending',
    currency: CURRENCY,
    amount: total,
  });

  // For COD, finalize immediately and subtract stock
  if (paymentMethod === 'COD') {
    for (const item of line_items) {
      const productName = item.price_data.product_data.name;
      const quantity = item.quantity || 1;
      const productDoc = await Product.findOne({ title: productName });
      if (productDoc) {
        productDoc.stock = Math.max(0, (productDoc.stock || 0) - quantity);
        await productDoc.save();
      }
    }

    return res.status(200).json({ message: 'Order placed successfully', orderId: orderDoc._id });
  }

  // Tamara
  if (paymentMethod === 'tamara') {
    try {
      const tamaraUrl = process.env.TAMARA_BASE_URL;
      const tamaraKey = process.env.TAMARA_API_KEY;
      const authHeader = {
        'Authorization': `Bearer ${tamaraKey}`,
        'Content-Type': 'application/json',
      };
      const items = line_items.map(li => ({
        name: li.price_data.product_data.name,
        quantity: li.quantity,
        unit_price: { amount: li.price_data.unit_amount / 100, currency: CURRENCY },
        total_amount: { amount: (li.price_data.unit_amount * li.quantity) / 100, currency: CURRENCY },
      }));
      
      // Capture raw phone and digits-only version
      const rawPhone = String(number || '');
      const digits = rawPhone.replace(/\D/g, '');
      
      // Map country names to ISO codes
      const countryCodeMap = {
        'UNITED ARAB EMIRATES': 'AE',
        'UAE': 'AE',
        'SAUDI ARABIA': 'SA',
        'KSA': 'SA',
        'KUWAIT': 'KW',
        'QATAR': 'QA',
        'BAHRAIN': 'BH',
        'OMAN': 'OM',
      };
      
      const countryInput = country || 'AE';
      let countryCode = countryCodeMap[countryInput.toUpperCase()] || countryInput.toUpperCase();
      
      // Ensure it's a 2-letter code
      if (countryCode.length > 2) {
        countryCode = countryCode.substring(0, 2).toUpperCase();
      }
      
      // Build E.164 phone number using country dialing code
      const dialingCodeMap = {
        'AE': '971',
        'SA': '966',
        'KW': '965',
        'QA': '974',
        'BH': '973',
        'OM': '968',
      };
      const dial = dialingCodeMap[countryCode] || '';
      let localDigits = digits;
      if (localDigits.startsWith('0')) {
        localDigits = localDigits.replace(/^0+/, '');
      }
      const intlPhone = rawPhone.trim().startsWith('+') ? rawPhone.trim() : (dial ? `+${dial}${localDigits}` : (digits ? `+${localDigits}` : ''));
      
      const firstName = name?.split(' ')[0] || 'Customer';
      const lastName = name?.split(' ').slice(1).join(' ') || firstName;
      const merchantUrls = {
        success: `${BASE_URL}/checkout/tamara/success?orderId=${orderDoc._id}`,
        failure: `${BASE_URL}/checkout/tamara/cancel?orderId=${orderDoc._id}`,
        cancel: `${BASE_URL}/checkout/tamara/cancel?orderId=${orderDoc._id}`,
        notification: `${BASE_URL}/api/webhooks/tamara`,
      };
      const addressBlock = {
        city,
        country_code: countryCode,
        first_name: firstName,
        last_name: lastName,
        line1: addressLine1 || '',
        line2: addressLine2 || '',
        phone_number: intlPhone,
        region: city || '',
      };

      const payload = {
        order_reference_id: String(orderDoc._id),
        total_amount: { amount: Math.round(total * 100) / 100, currency: CURRENCY },
        shipping_amount: { amount: 0, currency: CURRENCY },
        tax_amount: { amount: 0, currency: CURRENCY },
        description: `Order ${orderDoc._id}`,
        consumer: { 
          first_name: firstName, 
          last_name: lastName, 
          email, 
          phone_number: intlPhone 
        },
        items,
        merchant_url: merchantUrls,
        billing_address: addressBlock,
        shipping_address: addressBlock,
        country_code: countryCode,
        order_number: String(orderDoc._id),
      };
      
      console.log('Tamara payload:', JSON.stringify(payload, null, 2));
      console.log('Tamara URL:', tamaraUrl);
      console.log('Tamara headers:', authHeader);
      
      const r = await fetch(`${tamaraUrl}/checkout`, { method: 'POST', headers: authHeader, body: JSON.stringify(payload) });
      const responseText = await r.text();
      console.log('Tamara raw response:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse Tamara response:', e);
        return res.status(400).json({ error: 'Invalid response from Tamara' });
      }
      
      if (!r.ok) {
        console.error('Tamara error response:', data);
        console.error('Tamara error status:', r.status);
        return res.status(400).json({ error: 'Tamara session creation failed', tamara: data });
      }
      await Order.updateOne({ _id: orderDoc._id }, { provider: 'tamara', providerRef: data?.order_id || data?.id, status: 'pending' });
      const redirectUrl = data?.checkout_url || data?._links?.payment?.href || data?._links?.redirect?.href || data?.redirect_url;
      return res.status(200).json({ redirectUrl, orderId: orderDoc._id });
    } catch (e) {
      console.error('Tamara exception', e);
      return res.status(500).json({ error: 'Tamara integration error' });
    }
  }

  // Tabby
  if (paymentMethod === 'tabby') {
    try {
      const tabbyUrl = process.env.TABBY_API_URL;
      const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.TABBY_SECRET_KEY}` };
      const items = line_items.map(li => ({
        title: li.price_data.product_data.name,
        quantity: li.quantity,
        unit_price: (li.price_data.unit_amount/100).toFixed(2),
      }));
      const payload = {
        payment: {
          amount: total.toFixed(2),
          currency: CURRENCY,
          buyer: { email, phone: number, name },
          order: { reference_id: String(orderDoc._id), items },
          merchant_urls: {
            success: `${BASE_URL}/checkout/tabby/success?orderId=${orderDoc._id}`,
            cancel: `${BASE_URL}/checkout/tabby/cancel?orderId=${orderDoc._id}`,
          },
        }
      };
      const r = await fetch(`${tabbyUrl}/api/v2/checkout`, { method: 'POST', headers, body: JSON.stringify(payload) });
      const data = await r.json();
      if (!r.ok) {
        console.error('Tabby error:', data);
        return res.status(400).json({ error: 'Tabby session creation failed' });
      }
      const webUrl = data?.configuration?.available_products?.installments?.[0]?.web_url || data?.web_url;
      const ref = data?.id || data?.payment?.id;
      await Order.updateOne({ _id: orderDoc._id }, { provider: 'tabby', providerRef: ref, status: 'pending' });
      return res.status(200).json({ redirectUrl: webUrl, orderId: orderDoc._id });
    } catch (e) {
      console.error('Tabby exception', e);
      return res.status(500).json({ error: 'Tabby integration error' });
    }
  }

  return res.status(400).json({ error: 'Unsupported payment method' });
}
