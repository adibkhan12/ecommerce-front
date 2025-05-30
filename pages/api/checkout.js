import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/product";
import {Order} from "@/models/Order";
const stripe = require('stripe')(process.env.STRIPE_SK);

export default async function handler(req, res){
    if (req.method !== 'POST'){
        res.json('should be a POST request');
        return;
    }
    const {
        name, email, city,
        postalCode, addressLine1,
        addressLine2,country,number
        ,cartProducts,paymentMethod,
    } = req.body;
    await mongooseConnect();
    // Support both formats: array of product IDs or array of { product, quantity }
    let line_items = [];
    if (Array.isArray(cartProducts) && cartProducts.length > 0) {
    if (typeof cartProducts[0] === 'string') {
    // Format: [id1, id2, id1]
    const productsIds = cartProducts;
    const uniqueIds = [...new Set(productsIds)];
    const productsInfos = await Product.find({ _id: uniqueIds });
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
    // Format: [{ product: id, quantity: n }]
    const productsIds = cartProducts.map(item => item.product);
    const productsInfos = await Product.find({ _id: productsIds });
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
    paid: paymentMethod === 'COD' ? false : null, // Mark as unpaid for COD
    })

    // const session = await stripe.checkout.sessions.create({
    //     line_items,
    //     mode:'payment',
    //     customer_email: email,
    //     success_url: process.env.PUBLIC_URL+'/cart?success=1',
    //     cancel_url: process.env.PUBLIC_URL+'/cart?canceled=1',
    //     metadata:{
    //         orderId: orderDoc._id.toString(),
    //         test:'ok'
    //     },
    // })
    //
    // res.json({
    //     url:session.url,
    // });

    res.status(200).json({ message: 'Order placed successfully', orderId: orderDoc._id });

}

