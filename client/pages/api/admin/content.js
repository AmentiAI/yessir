import { sql } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify token
  const auth = verifyToken(req);
  if (auth.error) {
    return res.status(auth.status).json({ error: auth.error });
  }
  const userId = auth.userId;

  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Get user's business
    const [business] = await sql`
      SELECT id FROM businesses WHERE user_id = ${userId}
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
}