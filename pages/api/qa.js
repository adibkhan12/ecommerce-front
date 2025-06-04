import { mongooseConnect } from '@/lib/mongoose';
import { QA } from '@/models/QA';

export default async function handler(req, res) {
  await mongooseConnect();
  if (req.method === 'GET') {
    const { product } = req.query;
    const qas = await QA.find({ product }).sort({ createdAt: -1 });
    res.status(200).json(qas);
  } else if (req.method === 'POST') {
    const { product, user, question } = req.body;
    const qa = await QA.create({ product, user, question });
    res.status(201).json(qa);
  } else if (req.method === 'PUT') {
    const { id, answer } = req.body;
    const qa = await QA.findByIdAndUpdate(id, { answer, answeredAt: new Date() }, { new: true });
    res.status(200).json(qa);
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
