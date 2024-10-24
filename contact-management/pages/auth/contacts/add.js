import Contact from '../../../models/contact';
import { connectDB } from '../../../lib/db';
import { verifyToken } from '../../../lib/jwt';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  await connectDB();

  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = verifyToken(token);

    if (!user) return res.status(401).json({ message: 'Not authenticated' });

    const { name, email, phone, address, timezone } = req.body;
    const contact = await Contact.create({ name, email, phone, address, timezone });

    return res.status(201).json(contact);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
