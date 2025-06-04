import { mongooseConnect } from '@/lib/mongoose';
import { Category } from '@/models/Category';

export default async function handler(req, res) {
  await mongooseConnect();
  if (req.method === 'GET') {
    const categories = await Category.find({}, 'name _id');
    res.status(200).json(categories);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
