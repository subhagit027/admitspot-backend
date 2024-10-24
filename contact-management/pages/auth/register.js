import bcrypt from 'bcryptjs';
import { sendEmail } from '../../../lib/sendEmail';
import { signToken } from '../../../lib/jwt';
import User from '../../../models/user';
import { connectDB } from '../../../lib/db';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  await connectDB();

  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ email, password: hashedPassword });
    const token = signToken({ userId: user.id });

    
    await sendEmail(email, 'Verify Your Email', `Click the link to verify: /verify-email?token=${token}`);
    return res.status(201).json({ message: 'User registered, please verify your email' });
  } catch (error) {
    return res.status(400).json({ message: 'User already exists' });
  }
}
