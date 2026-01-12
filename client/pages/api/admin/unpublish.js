import { sql } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

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
    const [business] = await sql`
      SELECT id FROM businesses WHERE user_id = ${userId}
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
}