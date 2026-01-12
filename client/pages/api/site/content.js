import { sql } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
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
      SELECT * FROM businesses WHERE user_id = ${userId}
    `;

    if (!business) {
      return res.status(404).json({ error: 'Business not found' });
    }

    const [site] = await sql`
      SELECT * FROM sites WHERE business_id = ${business.id}
    `;

    if (!site) {
      return res.status(404).json({ error: 'Site not found. Please generate your site first.' });
    }

    res.json({
      site: {
        id: site.id,
        content: site.content,
        isPublished: site.is_published,
        createdAt: site.created_at
      }
    });
  } catch (error) {
    console.error('Get site content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}