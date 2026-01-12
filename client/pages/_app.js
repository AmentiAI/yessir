import '../styles/globals.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { authAPI, businessAPI, siteAPI } from '../lib/api'

// Business Types
export const BUSINESS_TYPES = [
  { id: 'restaurant', name: 'Restaurant & Dining', icon: '🍽️', color: '#DC2626', gradient: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)', sections: ['Menu', 'Reservations', 'Gallery', 'Reviews', 'Events', 'Catering'], description: 'Full-service restaurants, cafes, bars' },
  { id: 'salon', name: 'Beauty & Wellness', icon: '✨', color: '#9333EA', gradient: 'linear-gradient(135deg, #9333EA 0%, #7C3AED 100%)', sections: ['Services', 'Team', 'Booking', 'Gallery', 'Pricing', 'Products'], description: 'Salons, spas, wellness centers' },
  { id: 'fitness', name: 'Fitness & Health', icon: '💪', color: '#059669', gradient: 'linear-gradient(135deg, #059669 0%, #047857 100%)', sections: ['Programs', 'Trainers', 'Membership', 'Schedule', 'Facilities', 'Nutrition'], description: 'Gyms, studios, personal training' },
  { id: 'retail', name: 'Retail & E-commerce', icon: '🛍️', color: '#0284C7', gradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)', sections: ['Products', 'Collections', 'About', 'Shipping', 'Reviews', 'Contact'], description: 'Online stores, boutiques, shops' },
  { id: 'photography', name: 'Creative Services', icon: '📷', color: '#DB2777', gradient: 'linear-gradient(135deg, #DB2777 0%, #BE185D 100%)', sections: ['Portfolio', 'Services', 'Packages', 'About', 'Testimonials', 'Booking'], description: 'Photography, design, videography' },
  { id: 'consulting', name: 'Professional Services', icon: '💼', color: '#1E40AF', gradient: 'linear-gradient(135deg, #1E40AF 0%, #1E3A8A 100%)', sections: ['Services', 'Expertise', 'Team', 'Case Studies', 'Insights', 'Contact'], description: 'Consulting, legal, accounting' },
  { id: 'medical', name: 'Healthcare', icon: '🏥', color: '#0D9488', gradient: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)', sections: ['Services', 'Providers', 'Patient Portal', 'Insurance', 'Locations', 'Resources'], description: 'Medical practices, clinics, dental' },
  { id: 'realestate', name: 'Real Estate', icon: '🏠', color: '#D97706', gradient: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)', sections: ['Listings', 'Agents', 'Neighborhoods', 'Resources', 'Testimonials', 'Contact'], description: 'Agencies, brokers, property management' },
  { id: 'education', name: 'Education & Training', icon: '🎓', color: '#7C3AED', gradient: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)', sections: ['Courses', 'Instructors', 'Programs', 'Resources', 'Enrollment', 'Alumni'], description: 'Schools, tutoring, online courses' },
  { id: 'hospitality', name: 'Hospitality & Travel', icon: '🏨', color: '#EA580C', gradient: 'linear-gradient(135deg, #EA580C 0%, #C2410C 100%)', sections: ['Accommodations', 'Amenities', 'Experiences', 'Dining', 'Events', 'Booking'], description: 'Hotels, resorts, travel agencies' },
  { id: 'technology', name: 'Technology & SaaS', icon: '💻', color: '#4F46E5', gradient: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)', sections: ['Products', 'Features', 'Pricing', 'Documentation', 'Blog', 'Support'], description: 'Software, apps, tech startups' },
  { id: 'nonprofit', name: 'Non-Profit & Charity', icon: '❤️', color: '#E11D48', gradient: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)', sections: ['Mission', 'Programs', 'Impact', 'Get Involved', 'Donate', 'Events'], description: 'Charities, foundations, NGOs' },
]

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />
}