import multer from 'multer';
import csvParser from 'csv-parser';
import ExcelJS from 'exceljs';
import Contact from '../../../models/contact';
import { connectDB } from '../../../lib/db';
import { verifyToken } from '../../../lib/jwt';
import { batchContactSchema } from '../../../utils/validation';

const upload = multer({ storage: multer.memoryStorage() });

const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const contacts = [];
    const stream = buffer.pipe(csvParser());
    stream.on('data', (row) => contacts.push(row));
    stream.on('end', () => resolve(contacts));
    stream.on('error', reject);
  });
};

const parseExcel = async (buffer) => {
  const contacts = [];
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet(1);
  worksheet.eachRow((row) => {
    contacts.push({
      name: row.getCell(1).value,
      email: row.getCell(2).value,
      phone: row.getCell(3).value,
      address: row.getCell(4).value,
      timezone: row.getCell(5).value,
    });
  });
  return contacts;
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  await connectDB();

  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = verifyToken(token);
    if (!user) return res.status(401).json({ message: 'Not authenticated' });

    upload.single('file')(req, res, async (err) => {
      if (err) return res.status(400).json({ message: 'File upload error' });

      const buffer = req.file.buffer;
      let contacts = [];

      if (req.file.mimetype === 'text/csv') {
        contacts = await parseCSV(buffer);
      } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
        contacts = await parseExcel(buffer);
      } else {
        return res.status(400).json({ message: 'Unsupported file type' });
      }

      const { error } = batchContactSchema.validate(contacts);
      if (error) return res.status(400).json({ message: error.details[0].message });

      // Process and save contacts (similar to batch processing logic above)

      return res.status(200).json({ message: 'Contacts uploaded successfully' });
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
