import express from 'express';
import OpenAI from 'openai';
import { sql } from '../index.js';
import { verifyToken } from './auth.js';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Business types data
const BUSINESS_TYPES = {
  restaurant: { name: 'Restaurant & Dining', sections: ['Menu', 'Reservations', 'Gallery', 'Reviews', 'Events', 'Catering'] },
  salon: { name: 'Beauty & Wellness', sections: ['Services', 'Team', 'Booking', 'Gallery', 'Pricing', 'Products'] },
  fitness: { name: 'Fitness & Health', sections: ['Programs', 'Trainers', 'Membership', 'Schedule', 'Facilities', 'Nutrition'] },
  retail: { name: 'Retail & E-commerce', sections: ['Products', 'Collections', 'About', 'Shipping', 'Reviews', 'Contact'] },
  photography: { name: 'Creative Services', sections: ['Portfolio', 'Services', 'Packages', 'About', 'Testimonials', 'Booking'] },
  consulting: { name: 'Professional Services', sections: ['Services', 'Expertise', 'Team', 'Case Studies', 'Insights', 'Contact'] },
  medical: { name: 'Healthcare', sections: ['Services', 'Providers', 'Patient Portal', 'Insurance', 'Locations', 'Resources'] },
  realestate: { name: 'Real Estate', sections: ['Listings', 'Agents', 'Neighborhoods', 'Resources', 'Testimonials', 'Contact'] },
  education: { name: 'Education & Training', sections: ['Courses', 'Instructors', 'Programs', 'Resources', 'Enrollment', 'Alumni'] },
  hospitality: { name: 'Hospitality & Travel', sections: ['Accommodations', 'Amenities', 'Experiences', 'Dining', 'Events', 'Booking'] },
  technology: { name: 'Technology & SaaS', sections: ['Products', 'Features', 'Pricing', 'Documentation', 'Blog', 'Support'] },
  nonprofit: { name: 'Non-Profit & Charity', sections: ['Mission', 'Programs', 'Impact', 'Get Involved', 'Donate', 'Events'] },
};

// Generate site content using OpenAI
router.post('/generate', verifyToken, async (req, res) => {
  try {
    // Get user's business
    const [business] = await sql`
      SELECT * FROM businesses WHERE user_id = ${req.userId}
    `;

    if (!business) {
      return res.status(404).json({ error: 'Business not found. Please complete business setup first.' });
    }

    const businessType = BUSINESS_TYPES[business.business_type_id];
    if (!businessType) {
      return res.status(400).json({ error: 'Invalid business type' });
    }

    // Generate content using OpenAI
    const prompt = `Generate professional website content for a ${businessType.name} business called "${business.business_name}"${business.tagline ? ` with tagline "${business.tagline}"` : ''}.

Return ONLY valid JSON (no markdown, no backticks, no explanations):
{
  "hero": {
    "headline": "compelling headline for the business",
    "subheadline": "engaging subheadline that describes what they offer",
    "cta": "action button text like 'Get Started' or 'Contact Us'"
  },
  "about": {
    "title": "About section title",
    "content": "2-3 sentences about the business, its mission, and what makes it special"
  },
  "sections": [
    {
      "title": "Section name from: ${businessType.sections.join(', ')}",
      "description": "Brief section intro",
      "items": [
        {
          "name": "Service/Product name",
          "description": "Description of what this offers",
          "price": "$XX or null"
        }
      ]
    }
  ],
  "features": [
    {
      "title": "Key feature or benefit",
      "description": "Why this matters to customers"
    }
  ],
  "testimonials": [
    {
      "name": "Customer Name",
      "text": "Realistic testimonial quote about their experience",
      "role": "Customer title or role"
    }
  ],
  "contact": {
    "address": "${business.address || '123 Main St, City, ST 12345'}",
    "phone": "${business.phone || '(555) 123-4567'}",
    "email": "${business.email || 'hello@business.com'}",
    "hours": "Business hours (e.g., 'Mon-Fri 9am-5pm')"
  },
  "cta": {
    "title": "Final call to action title",
    "description": "Encouraging text to convert visitors",
    "button": "Button text"
  }
}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional website copywriter. Always return valid JSON only, no markdown formatting, no code blocks.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    let siteContent;
    try {
      const content = completion.choices[0].message.content.trim();
      // Remove any markdown code blocks if present
      const cleanContent = content.replace(/```json|```/g, '').trim();
      siteContent = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      // Fallback content
      siteContent = generateFallbackContent(business, businessType);
    }

    // Save or update site content
    const [existingSite] = await sql`
      SELECT id FROM sites WHERE business_id = ${business.id}
    `;

    let site;
    if (existingSite) {
      [site] = await sql`
        UPDATE sites
        SET content = ${JSON.stringify(siteContent)}::jsonb, updated_at = NOW()
        WHERE business_id = ${business.id}
        RETURNING *
      `;
    } else {
      [site] = await sql`
        INSERT INTO sites (business_id, content)
        VALUES (${business.id}, ${JSON.stringify(siteContent)}::jsonb)
        RETURNING *
      `;
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
    console.error('Site generation error:', error);
    
    // Return fallback content if OpenAI fails
    try {
      const [business] = await sql`
        SELECT * FROM businesses WHERE user_id = ${req.userId}
      `;
      const businessType = BUSINESS_TYPES[business.business_type_id];
      const fallbackContent = generateFallbackContent(business, businessType);
      
      // Save fallback content
      const [existingSite] = await sql`
        SELECT id FROM sites WHERE business_id = ${business.id}
      `;
      
      let site;
      if (existingSite) {
        [site] = await sql`
          UPDATE sites
          SET content = ${JSON.stringify(fallbackContent)}::jsonb, updated_at = NOW()
          WHERE business_id = ${business.id}
          RETURNING *
        `;
      } else {
        [site] = await sql`
          INSERT INTO sites (business_id, content)
          VALUES (${business.id}, ${JSON.stringify(fallbackContent)}::jsonb)
          RETURNING *
        `;
      }
      
      res.json({
        site: {
          id: site.id,
          content: site.content,
          isPublished: site.is_published,
          createdAt: site.created_at
        },
        warning: 'Generated fallback content due to API error'
      });
    } catch (fallbackError) {
      res.status(500).json({ error: 'Failed to generate site content' });
    }
  }
});

function generateFallbackContent(business, businessType) {
  return {
    hero: {
      headline: `Welcome to ${business.business_name}`,
      subheadline: business.tagline || `Your trusted ${businessType.name.toLowerCase()} partner`,
      cta: 'Get Started'
    },
    about: {
      title: 'About Us',
      content: `${business.business_name} is committed to delivering exceptional ${businessType.name.toLowerCase()} services with professionalism and care.`
    },
    sections: businessType.sections.slice(0, 3).map(s => ({
      title: s,
      description: `Our ${s.toLowerCase()} offerings`,
      items: [{ name: `Premium ${s}`, description: 'High-quality service', price: null }]
    })),
    features: [
      { title: 'Quality', description: 'Unmatched quality in everything we do' },
      { title: 'Experience', description: 'Years of industry expertise' }
    ],
    testimonials: [
      { name: 'Satisfied Customer', text: 'Exceptional service and results!', role: 'Client' }
    ],
    contact: {
      address: business.address || '123 Main St',
      phone: business.phone || '(555) 123-4567',
      email: business.email || 'hello@example.com',
      hours: 'Mon-Fri 9am-5pm'
    },
    cta: {
      title: 'Ready to Get Started?',
      description: 'Contact us today',
      button: 'Contact Us'
    }
  };
}

// Get site content
router.get('/content', verifyToken, async (req, res) => {
  try {
    const [business] = await sql`
      SELECT * FROM businesses WHERE user_id = ${req.userId}
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
});

export default router;