import Joi from 'joi';
import Contact from '../../../models/contact';
import { connectDB } from '../../../lib/db';
import { verifyToken } from '../../../lib/jwt';
import { contactSchema } from '../../../utils/validation'; // Contact validation schema

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ message: 'Method not allowed' });

  await connectDB();

  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = verifyToken(token);
    if (!user) return res.status(401).json({ message: 'Not authenticated' });

    const { id } = req.query; // Assuming the ID of the contact is passed in the query

    const { error } = contactSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const contact = await Contact.update(req.body, { where: { id, deleted: false } });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });

    return res.status(200).json({ message: 'Contact updated successfully' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
