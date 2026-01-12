import express from 'express';
import multer from 'multer';
import { sql } from '../index.js';
import { verifyToken } from './auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure multer for logo upload
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// For now, we'll store logos as base64 in the database
// In production, upload to S3 or Cloudinary
const uploadLogo = async (file) => {
  // Convert to base64
  const base64 = file.buffer.toString('base64');
  const dataUrl = `data:${file.mimetype};base64,${base64}`;
  return dataUrl;
};

// Create or update business
router.post('/setup', verifyToken, upload.single('logo'), async (req, res) => {
  try {
    const {
      businessTypeId,
      businessName,
      tagline,
      description,
      primaryColor,
      phone,
      email,
      address
    } = req.body;

    if (!businessTypeId || !businessName) {
      return res.status(400).json({ error: 'Business type and name are required' });
    }

    let logoUrl = null;
    if (req.file) {
      logoUrl = await uploadLogo(req.file);
    }

    // Check if business already exists for this user
    const [existing] = await sql`
      SELECT id FROM businesses WHERE user_id = ${req.userId}
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
        WHERE user_id = ${req.userId}
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
          ${req.userId}, ${businessTypeId}, ${businessName}, ${tagline || null},
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
});

// Get user's business
router.get('/my-business', verifyToken, async (req, res) => {
  try {
    const [business] = await sql`
      SELECT * FROM businesses WHERE user_id = ${req.userId}
    `;

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
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
    console.error('Get business error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;