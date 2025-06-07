import { mongooseConnect } from '@/lib/mongoose';
import { Review } from '@/models/Review';

export default async function handler(req, res) {
  await mongooseConnect();
  if (req.method === 'GET') {
    const { product, products } = req.query;
    // Batch fetch: /api/reviews?products=ID1,ID2,ID3
    if (products) {
      const ids = products.split(',');
      const allReviews = await Review.find({ product: { $in: ids } }).sort({ createdAt: -1 });
      // Group by product
      const reviewsByProduct = {};
      ids.forEach(id => {
        reviewsByProduct[id] = [];
      });
      allReviews.forEach(r => {
        const pid = r.product.toString();
        if (!reviewsByProduct[pid]) reviewsByProduct[pid] = [];
        reviewsByProduct[pid].push(r);
      });
      return res.status(200).json(reviewsByProduct);
    }
    // Single product fallback
    if (product) {
      const reviews = await Review.find({ product }).sort({ createdAt: -1 });
      return res.status(200).json(reviews);
    }
    return res.status(400).json({ error: 'Missing product(s) parameter' });
  } else if (req.method === 'POST') {
    const { product, user, rating, text, images } = req.body;
    const review = await Review.create({ product, user, rating, text, images });
    res.status(201).json(review);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
