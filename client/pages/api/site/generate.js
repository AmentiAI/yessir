import OpenAI from 'openai';
import { sql } from '../../../lib/db';
import { verifyToken } from '../../../lib/auth';

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

function generateFallbackContent(business, businessType) {
  return {
    pages: [
      {
        slug: 'home',
        title: 'Home',
        hero: {
          headline: `Welcome to ${business.business_name}`,
          subheadline: business.tagline || `Your trusted ${businessType.name.toLowerCase()} partner`,
          primaryCta: 'Get Started',
          secondaryCta: 'Learn More'
        },
        sections: [
          {
            type: 'features',
            title: 'Why Choose Us',
            items: [
              { title: 'Quality', description: 'Unmatched quality in everything we do', cta: 'Learn More' },
              { title: 'Experience', description: 'Years of industry expertise', cta: 'Our Story' },
              { title: 'Results', description: 'Proven track record of success', cta: 'See Results' }
            ]
          },
          {
            type: 'cta',
            title: 'Ready to Get Started?',
            description: 'Join thousands of satisfied customers',
            button: 'Start Now',
            secondaryButton: 'Schedule a Call'
          }
        ]
      },
      {
        slug: 'services',
        title: 'Services',
        hero: {
          headline: 'Our Services',
          subheadline: 'What we offer',
          primaryCta: 'Book Now',
          secondaryCta: 'Get Quote'
        },
        sections: [
          {
            type: 'services',
            title: 'What We Offer',
            items: businessType.sections.slice(0, 4).map(s => ({
              name: s,
              description: `Professional ${s.toLowerCase()} services`,
              price: null,
              cta: 'Book Service',
              secondaryCta: 'Learn More'
            }))
          },
          {
            type: 'cta',
            title: 'Not Sure What You Need?',
            description: "Let's discuss your requirements",
            button: 'Contact Us',
            secondaryButton: 'View Packages'
          }
        ]
      },
      {
        slug: 'about',
        title: 'About',
        hero: {
          headline: `About ${business.business_name}`,
          subheadline: 'Our story and mission',
          primaryCta: 'Work With Us',
          secondaryCta: 'Our Team'
        },
        sections: [
          {
            type: 'content',
            title: 'Our Story',
            content: `${business.business_name} is committed to delivering exceptional ${businessType.name.toLowerCase()} services with professionalism and care. We've been serving our community for years with dedication and excellence.`
          },
          {
            type: 'cta',
            title: 'Want to Learn More?',
            description: 'Get in touch with our team',
            button: 'Contact Us',
            secondaryButton: 'View Services'
          }
        ]
      },
      {
        slug: 'contact',
        title: 'Contact',
        hero: {
          headline: 'Get In Touch',
          subheadline: "We'd love to hear from you",
          primaryCta: 'Send Message',
          secondaryCta: 'Call Now'
        },
        sections: [
          {
            type: 'contact',
            address: business.address || '123 Main St',
            phone: business.phone || '(555) 123-4567',
            email: business.email || 'hello@example.com',
            hours: 'Mon-Fri 9am-5pm'
          },
          {
            type: 'cta',
            title: 'Prefer to Talk?',
            description: 'Schedule a free consultation',
            button: 'Book Appointment',
            secondaryButton: 'Call Us'
          }
        ]
      }
    ],
    testimonials: [
      { name: 'Satisfied Customer', text: 'Exceptional service and results!', role: 'Client', cta: 'Read More' }
    ],
    navigation: {
      items: ['Home', 'Services', 'About', 'Contact']
    }
  };
}

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
    // Get user's business
    const [business] = await sql`
      SELECT * FROM businesses WHERE user_id = ${userId}
    `;

    if (!business) {
      return res.status(404).json({ error: 'Business not found. Please complete business setup first.' });
    }

    const businessType = BUSINESS_TYPES[business.business_type_id];
    if (!businessType) {
      return res.status(400).json({ error: 'Invalid business type' });
    }

    // Generate content using OpenAI - Multi-page structure with lots of CTAs
    const prompt = `Generate a professional MULTI-PAGE website for a ${businessType.name} business called "${business.business_name}"${business.tagline ? ` with tagline "${business.tagline}"` : ''}.

Create 4-6 separate pages with lots of call-to-action buttons throughout. Return ONLY valid JSON (no markdown, no backticks, no explanations):

{
  "pages": [
    {
      "slug": "home",
      "title": "Home",
      "hero": {
        "headline": "compelling headline",
        "subheadline": "engaging subheadline",
        "primaryCta": "Get Started",
        "secondaryCta": "Learn More"
      },
      "sections": [
        {
          "type": "features",
          "title": "Why Choose Us",
          "items": [
            {
              "title": "Feature name",
              "description": "Feature description",
              "cta": "Learn More"
            }
          ]
        },
        {
          "type": "cta",
          "title": "Ready to Get Started?",
          "description": "Join thousands of satisfied customers",
          "button": "Start Now",
          "secondaryButton": "Schedule a Call"
        }
      ]
    },
    {
      "slug": "services",
      "title": "Services",
      "hero": {
        "headline": "Our Services",
        "subheadline": "What we offer",
        "primaryCta": "Book Now",
        "secondaryCta": "Get Quote"
      },
      "sections": [
        {
          "type": "services",
          "title": "What We Offer",
          "items": [
            {
              "name": "Service name from: ${businessType.sections.join(', ')}",
              "description": "Service description",
              "price": "$XX or null",
              "cta": "Book Service",
              "secondaryCta": "Learn More"
            }
          ]
        },
        {
          "type": "cta",
          "title": "Not Sure What You Need?",
          "description": "Let's discuss your requirements",
          "button": "Contact Us",
          "secondaryButton": "View Packages"
        }
      ]
    },
    {
      "slug": "about",
      "title": "About",
      "hero": {
        "headline": "About ${business.business_name}",
        "subheadline": "Our story and mission",
        "primaryCta": "Work With Us",
        "secondaryCta": "Our Team"
      },
      "sections": [
        {
          "type": "content",
          "title": "Our Story",
          "content": "2-3 paragraphs about the business, mission, values"
        },
        {
          "type": "cta",
          "title": "Want to Learn More?",
          "description": "Get in touch with our team",
          "button": "Contact Us",
          "secondaryButton": "View Services"
        }
      ]
    },
    {
      "slug": "contact",
      "title": "Contact",
      "hero": {
        "headline": "Get In Touch",
        "subheadline": "We'd love to hear from you",
        "primaryCta": "Send Message",
        "secondaryCta": "Call Now"
      },
      "sections": [
        {
          "type": "contact",
          "address": "${business.address || '123 Main St, City, ST 12345'}",
          "phone": "${business.phone || '(555) 123-4567'}",
          "email": "${business.email || 'hello@business.com'}",
          "hours": "Business hours"
        },
        {
          "type": "cta",
          "title": "Prefer to Talk?",
          "description": "Schedule a free consultation",
          "button": "Book Appointment",
          "secondaryButton": "Call Us"
        }
      ]
    }
  ],
  "testimonials": [
    {
      "name": "Customer Name",
      "text": "Testimonial quote",
      "role": "Customer role",
      "cta": "Read More"
    }
  ],
  "navigation": {
    "items": ["Home", "Services", "About", "Contact"]
  }
}`;

    let siteContent;
    try {
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
        max_tokens: 4000
      });

      const content = completion.choices[0].message.content.trim();
      const cleanContent = content.replace(/```json|```/g, '').trim();
      siteContent = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
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
        SELECT * FROM businesses WHERE user_id = ${userId}
      `;
      const businessType = BUSINESS_TYPES[business.business_type_id];
      const fallbackContent = generateFallbackContent(business, businessType);
      
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
}