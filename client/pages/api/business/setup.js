import { IncomingForm } from 'formidable';
import { sql } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';
import fs from 'fs';

// Convert file to base64
const uploadLogo = async (filePath, mimetype) => {
  const fileBuffer = fs.readFileSync(filePath);
  const base64 = fileBuffer.toString('base64');
  const dataUrl = `data:${mimetype};base64,${base64}`;
  return dataUrl;
};

// Disable body parser to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify token
  const auth = verifyToken(req);
  if (auth.error) {
    return res.status(auth.status).json({ error: auth.error });
  }
  const userId = auth.userId;

  try {
    // Parse form data with formidable
    const form = new IncomingForm({
      maxFileSize: 5 * 1024 * 1024, // 5MB
      keepExtensions: true,
    });

    const [fields, files] = await form.parse(req);

    // Extract form fields
    const businessTypeId = fields.businessTypeId?.[0];
    const businessName = fields.businessName?.[0];
    const tagline = fields.tagline?.[0];
    const description = fields.description?.[0];
    const primaryColor = fields.primaryColor?.[0];
    const phone = fields.phone?.[0];
    const email = fields.email?.[0];
    const address = fields.address?.[0];

    if (!businessTypeId || !businessName) {
      return res.status(400).json({ error: 'Business type and name are required' });
    }

    let logoUrl = null;
    const logoFile = files.logo?.[0];
    if (logoFile) {
      // Validate file type
      if (!logoFile.mimetype?.startsWith('image/')) {
        return res.status(400).json({ error: 'Only image files are allowed' });
      }
      logoUrl = await uploadLogo(logoFile.filepath, logoFile.mimetype);
      // Clean up temp file
      fs.unlinkSync(logoFile.filepath);
    }

    // Check if business already exists for this user
    const [existing] = await sql`
      SELECT id FROM businesses WHERE user_id = ${userId}
    `;

    let business;
    if (existing) {
      // Update existing business
      [business] = await sql`
        UPDATE businesses
        SET 
          business_type_id = ${businessTypeId},
          business_name = ${businessName},
          tagline = ${tagline || null},
          description = ${description || null},
          primary_color = ${primaryColor || '#6366F1'},
          logo_url = ${logoUrl},
          phone = ${phone || null},
          email = ${email || null},
          address = ${address || null},
          updated_at = NOW()
        WHERE user_id = ${userId}
        RETURNING *
      `;
    } else {
      // Create new business
      [business] = await sql`
        INSERT INTO businesses (
          user_id, business_type_id, business_name, tagline, description,
          primary_color, logo_url, phone, email, address
        )
        VALUES (
          ${userId}, ${businessTypeId}, ${businessName}, ${tagline || null},
          ${description || null}, ${primaryColor || '#6366F1'}, ${logoUrl},
          ${phone || null}, ${email || null}, ${address || null}
        )
        RETURNING *
      `;
    }

    res.json({
      business: {
        id: business.id,
        businessTypeId: business.business_type_id,
        businessName: business.business_name,
        tagline: business.tagline,
        description: business.description,
        primaryColor: business.primary_color,
        logoUrl: business.logo_url,
        phone: business.phone,
        email: business.email,
        address: business.address,
        createdAt: business.created_at
      }
    });
  } catch (error) {
    console.error('Business setup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}