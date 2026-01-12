import express from 'express';
import { sql } from '../index.js';
import { verifyToken } from './auth.js';

const router = express.Router();

// Update site content
router.put('/content', verifyToken, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Get user's business
    const [business] = await sql`
      SELECT id FROM businesses WHERE user_id = ${req.userId}
    `;

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Update site content
    const [site] = await sql`
      UPDATE sites
      SET content = ${JSON.stringify(content)}::jsonb, updated_at = NOW()
      WHERE business_id = ${business.id}
      RETURNING *
    `;

    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    res.json({
      site: {
        id: site.id,
        content: site.content,
        isPublished: site.is_published,
        updatedAt: site.updated_at
      }
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard data
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    // Get business and site
    const [business] = await sql`
      SELECT * FROM businesses WHERE user_id = ${req.userId}
    `;

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const [site] = await sql`
      SELECT * FROM sites WHERE business_id = ${business.id}
    `;

    // Get analytics data (mock for now)
    const analytics = {
      totalVisitors: '12,847',
      pageViews: '48,392',
      bounceRate: '32.1%',
      avgDuration: '3:24'
    };

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
        address: business.address
      },
      site: site ? {
        id: site.id,
        content: site.content,
        isPublished: site.is_published
      } : null,
      analytics
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Publish site
router.post('/publish', verifyToken, async (req, res) => {
  try {
    const [business] = await sql`
      SELECT id FROM businesses WHERE user_id = ${req.userId}
    `;

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const [site] = await sql`
      UPDATE sites
      SET is_published = true, published_at = NOW(), updated_at = NOW()
      WHERE business_id = ${business.id}
      RETURNING *
    `;

    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    res.json({
      site: {
        id: site.id,
        isPublished: site.is_published,
        publishedAt: site.published_at
      }
    });
  } catch (error) {
    console.error('Publish error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Unpublish site
router.post('/unpublish', verifyToken, async (req, res) => {
  try {
    const [business] = await sql`
      SELECT id FROM businesses WHERE user_id = ${req.userId}
    `;

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const [site] = await sql`
      UPDATE sites
      SET is_published = false, updated_at = NOW()
      WHERE business_id = ${business.id}
      RETURNING *
    `;

    if (!site) {
      return res.status(404).json({ error: 'Site not found' });
    }

    res.json({
      site: {
        id: site.id,
        isPublished: site.is_published
      }
    });
  } catch (error) {
    console.error('Unpublish error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;