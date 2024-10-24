import Joi from 'joi';
import Contact from '../../../models/contact';
import { connectDB } from '../../../lib/db';
import { verifyToken } from '../../../lib/jwt';
import { batchContactSchema } from '../../../utils/validation';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  await connectDB();

  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = verifyToken(token);
    if (!user) return res.status(401).json({ message: 'Not authenticated' });

    const { error } = batchContactSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const contacts = req.body;
    const results = [];

    for (const contact of contacts) {
      const existingContact = await Contact.findOne({ where: { email: contact.email } });
      if (existingContact) {
        // Update existing contact
        await Contact.update(contact, { where: { id: existingContact.id } });
        results.push({ message: `Updated contact: ${contact.email}` });
      } else {
        // Create new contact
        await Contact.create(contact);
        results.push({ message: `Added new contact: ${contact.email}` });
      }
    }

    return res.status(200).json({ results });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
