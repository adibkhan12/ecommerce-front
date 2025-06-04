import { mongooseConnect } from '@/lib/mongoose';
import { Review } from '@/models/Review';

export default async function handler(req, res) {
  await mongooseConnect();
  if (req.method === 'GET') {
    const { product } = req.query;
    const reviews = await Review.find({ product }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } else if (req.method === 'POST') {
    const { product, user, rating, text, images } = req.body;
    const review = await Review.create({ product, user, rating, text, images });
    res.status(201).json(review);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
