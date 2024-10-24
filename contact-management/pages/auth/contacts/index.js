import Contact from '../../../models/contact';
import { connectDB } from '../../../lib/db';
import { verifyToken } from '../../../lib/jwt';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' });

  await connectDB();

  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = verifyToken(token);
    if (!user) return res.status(401).json({ message: 'Not authenticated' });

    const { filter, sort } = req.query; // Filter by name, email, timezone; Sort by any field

    let whereClause = {};
    if (filter) {
      whereClause = {
        ...whereClause,
        [filter.field]: filter.value,
      };
    }

    const contacts = await Contact.findAll({
      where: whereClause,
      order: [[sort.field || 'createdAt', sort.order || 'ASC']],
    });

    return res.status(200).json(contacts);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
