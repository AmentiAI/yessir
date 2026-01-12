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
    // Get business and site
    const [business] = await sql`
      SELECT * FROM businesses WHERE user_id = ${userId}
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
}