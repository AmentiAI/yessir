import React, { useState, useEffect } from 'react';
import { authAPI, businessAPI, siteAPI, adminAPI } from './api';

// Professional Business Types with comprehensive data
const BUSINESS_TYPES = [
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
];

// Font and Global Styles (same as original)
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    
    *, *::before, *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html {
      scroll-behavior: smooth;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #09090B;
      color: #FAFAFA;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    
    .jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(24px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-24px); }
      to { opacity: 1; transform: translateX(0); }
    }
    
    @keyframes scaleIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    .animate-fade-up { animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
    .animate-fade { animation: fadeIn 0.5s ease-out forwards; opacity: 0; }
    .animate-slide { animation: slideInLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
    .animate-scale { animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
    
    .glass {
      background: rgba(255, 255, 255, 0.02);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .glass-strong {
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(40px);
      -webkit-backdrop-filter: blur(40px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    
    ::-webkit-scrollbar { width: 6px; height: 6px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
    
    input:focus, textarea:focus, select:focus {
      outline: none;
      border-color: #6366F1 !important;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    
    .btn-primary {
      position: relative;
      overflow: hidden;
    }
    
    .btn-primary::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      transition: left 0.5s;
    }
    
    .btn-primary:hover::before {
      left: 100%;
    }
    
    ::selection {
      background: rgba(99, 102, 241, 0.3);
      color: #fff;
    }
  `}</style>
);

// Reusable UI Components (same as original - keeping essential ones)
const Button = ({ children, variant = 'primary', size = 'md', disabled, onClick, style, className, ...props }) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    borderRadius: '10px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    border: 'none',
    fontFamily: 'inherit',
    opacity: disabled ? 0.5 : 1,
  };
  
  const sizes = {
    sm: { padding: '8px 16px', fontSize: '13px' },
    md: { padding: '12px 24px', fontSize: '14px' },
    lg: { padding: '16px 32px', fontSize: '15px' },
    xl: { padding: '18px 40px', fontSize: '16px' },
  };
  
  const variants = {
    primary: { background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#fff', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)' },
    secondary: { background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
    ghost: { background: 'transparent', color: '#A1A1AA' },
    danger: { background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)' },
    success: { background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.2)' },
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{ ...baseStyles, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={e => { if (!disabled) e.target.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ label, error, ...props }) => (
  <div style={{ marginBottom: '20px' }}>
    {label && <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#A1A1AA', marginBottom: '8px' }}>{label}</label>}
    <input
      {...props}
      style={{
        width: '100%',
        padding: '14px 16px',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${error ? '#EF4444' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '10px',
        color: '#FAFAFA',
        fontSize: '15px',
        transition: 'all 0.2s',
        ...props.style,
      }}
    />
    {error && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>{error}</p>}
  </div>
);

const Card = ({ children, hover, onClick, style, className, ...props }) => (
  <div
    onClick={onClick}
    className={`glass ${className || ''}`}
    style={{
      padding: '24px',
      borderRadius: '16px',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}
    onMouseEnter={e => {
      if (hover) {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
      }
    }}
    onMouseLeave={e => {
      if (hover) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
        e.currentTarget.style.boxShadow = 'none';
      }
    }}
    {...props}
  >
    {children}
  </div>
);

const Badge = ({ children, color = '#6366F1', style }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    background: `${color}15`,
    border: `1px solid ${color}30`,
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: 600,
    color: color,
    ...style,
  }}>
    {children}
  </span>
);

// Landing Page (keeping original)
const LandingPage = ({ onGetStarted }) => {
  const features = [
    { icon: '🎯', title: 'Industry-Specific Templates', desc: 'Choose from 12 business categories with tailored layouts and sections designed for your specific industry needs.' },
    { icon: '🤖', title: 'AI-Powered Generation', desc: 'Our advanced AI analyzes your business and generates compelling copy, optimal layouts, and SEO-friendly content.' },
    { icon: '🎨', title: 'Full Customization', desc: 'Complete control over colors, fonts, layouts, and content. Make it uniquely yours with our intuitive editor.' },
    { icon: '📊', title: 'Analytics Dashboard', desc: 'Track visitors, engagement, and conversions with our built-in analytics. Make data-driven decisions.' },
    { icon: '🚀', title: 'Instant Deployment', desc: 'Your website goes live immediately on our global CDN. SSL included, blazing fast performance guaranteed.' },
    { icon: '🔧', title: 'Admin System', desc: 'Powerful admin panel to manage content, pages, settings, and team members. No coding required.' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#09090B', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 60%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', top: '40%', right: '-15%', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 60%)', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '30%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 60%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>
      
      <nav style={{ position: 'relative', zIndex: 100, padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚡</div>
          <span className="jakarta" style={{ fontSize: '22px', fontWeight: 800, letterSpacing: '-0.5px' }}>SiteForge</span>
          <Badge color="#10B981" style={{ marginLeft: '8px' }}>PRO</Badge>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#features" style={{ color: '#A1A1AA', textDecoration: 'none', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}>Features</a>
          <a href="#pricing" style={{ color: '#A1A1AA', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Pricing</a>
          <Button variant="secondary" size="sm" onClick={onGetStarted}>Sign In</Button>
          <Button size="sm" onClick={onGetStarted}>Get Started Free</Button>
        </div>
      </nav>
      
      <main style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '80px 48px 120px', textAlign: 'center' }}>
        <div className="animate-fade-up" style={{ animationDelay: '0s' }}>
          <Badge color="#6366F1" style={{ marginBottom: '24px' }}>
            <span style={{ width: '6px', height: '6px', background: '#6366F1', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
            AI-Powered Website Builder
          </Badge>
        </div>
        
        <h1 className="jakarta animate-fade-up" style={{ fontSize: 'clamp(40px, 7vw, 72px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-2px', animationDelay: '0.1s' }}>
          Build Professional Websites<br />
          <span style={{ background: 'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'gradient 3s ease infinite' }}>
            in Minutes, Not Months
          </span>
        </h1>
        
        <p className="animate-fade-up" style={{ fontSize: '18px', color: '#71717A', maxWidth: '640px', margin: '0 auto 40px', lineHeight: 1.7, animationDelay: '0.2s' }}>
          Tell us about your business, and our AI will generate a stunning, fully-functional website complete with an admin dashboard. No coding required.
        </p>
        
        <div className="animate-fade-up" style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.3s' }}>
          <Button size="xl" onClick={onGetStarted} className="btn-primary">
            Start Building — It's Free
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Button>
          <Button variant="secondary" size="xl">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
            Watch Demo
          </Button>
        </div>
        
        <div className="animate-fade-up" style={{ marginTop: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', animationDelay: '0.4s' }}>
          {[
            { value: '50K+', label: 'Websites Created' },
            { value: '99.9%', label: 'Uptime' },
            { value: '4.9★', label: 'Rating' },
            { value: '<3min', label: 'Build Time' },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div className="jakarta" style={{ fontSize: '24px', fontWeight: 800, color: '#FAFAFA' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: '#52525B' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </main>
      
      <section id="features" style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '80px 48px' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <Badge color="#A855F7" style={{ marginBottom: '16px' }}>Features</Badge>
          <h2 className="jakarta" style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>Everything You Need</h2>
          <p style={{ color: '#71717A', fontSize: '17px', maxWidth: '500px', margin: '0 auto' }}>Powerful tools to build, launch, and grow your online presence</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
          {features.map((feature, i) => (
            <Card key={i} hover className="animate-fade-up" style={{ animationDelay: `${0.1 * i}s` }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.15) 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px' }}>
                {feature.icon}
              </div>
              <h3 className="jakarta" style={{ fontSize: '18px', fontWeight: 700, marginBottom: '10px' }}>{feature.title}</h3>
              <p style={{ color: '#71717A', fontSize: '14px', lineHeight: 1.7 }}>{feature.desc}</p>
            </Card>
          ))}
        </div>
      </section>
      
      <section style={{ position: 'relative', zIndex: 10, maxWidth: '900px', margin: '80px auto', padding: '0 48px' }}>
        <Card style={{ padding: '64px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.05) 100%)', borderColor: 'rgba(99,102,241,0.2)' }}>
          <h2 className="jakarta" style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '16px' }}>Ready to Get Started?</h2>
          <p style={{ color: '#A1A1AA', fontSize: '17px', marginBottom: '32px' }}>Join thousands of businesses already using SiteForge</p>
          <Button size="xl" onClick={onGetStarted}>Create Your Website Now</Button>
        </Card>
      </section>
      
      <footer style={{ position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.05)', padding: '40px 48px', marginTop: '80px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>⚡</div>
            <span className="jakarta" style={{ fontSize: '16px', fontWeight: 700 }}>SiteForge</span>
          </div>
          <p style={{ color: '#52525B', fontSize: '13px' }}>© 2026 SiteForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Auth Page - Updated to use API
const AuthPage = ({ onAuth, authType, setAuthType, onBack }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', company: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const validate = () => {
    const newErrors = {};
    if (authType === 'signup' && !formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = authType === 'signup' 
        ? await authAPI.signup(formData)
        : await authAPI.login({ email: formData.email, password: formData.password });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      onAuth(authType, response.data.user);
    } catch (error) {
      const message = error.response?.data?.error || 'An error occurred';
      if (authType === 'login') {
        setErrors({ email: message });
      } else {
        setErrors({ email: message });
      }
      setLoading(false);
    }
  };
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#09090B', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', right: '20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 60%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 60%)', filter: 'blur(60px)' }} />
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px', position: 'relative', zIndex: 10 }}>
        <button onClick={onBack} style={{ position: 'absolute', top: '32px', left: '32px', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#71717A', fontSize: '14px', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </button>
        
        <div style={{ maxWidth: '480px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>⚡</div>
            <span className="jakarta" style={{ fontSize: '28px', fontWeight: 800 }}>SiteForge</span>
          </div>
          
          <h1 className="jakarta" style={{ fontSize: '44px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1.5px', marginBottom: '20px' }}>
            {authType === 'signup' ? 'Start building your dream website' : 'Welcome back'}
          </h1>
          <p style={{ fontSize: '17px', color: '#71717A', lineHeight: 1.7 }}>
            {authType === 'signup' 
              ? 'Join thousands of businesses using AI to create stunning websites in minutes.'
              : 'Sign in to continue managing your websites and projects.'
            }
          </p>
          
          {authType === 'signup' && (
            <div style={{ marginTop: '48px', display: 'flex', gap: '24px' }}>
              {['50K+ Sites', '99.9% Uptime', '24/7 Support'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#52525B', fontSize: '13px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', position: 'relative', zIndex: 10 }}>
        <Card className="animate-scale glass-strong" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
          <h2 className="jakarta" style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
            {authType === 'signup' ? 'Create your account' : 'Sign in'}
          </h2>
          <p style={{ color: '#71717A', fontSize: '14px', marginBottom: '32px' }}>
            {authType === 'signup' ? 'Get started with a free account' : 'Enter your credentials to continue'}
          </p>
          
          <form onSubmit={handleSubmit}>
            {authType === 'signup' && (
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
              />
            )}
            
            <Input
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
            />
            
            {authType === 'signup' && (
              <Input
                label="Company (Optional)"
                type="text"
                placeholder="Your company name"
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
              />
            )}
            
            <Button
              type="submit"
              disabled={loading}
              style={{ width: '100%', marginTop: '8px' }}
              size="lg"
            >
              {loading ? (
                <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : (
                authType === 'signup' ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <span style={{ color: '#71717A', fontSize: '14px' }}>
              {authType === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <button
              onClick={() => setAuthType(authType === 'signup' ? 'login' : 'signup')}
              style={{ background: 'none', border: 'none', color: '#6366F1', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            >
              {authType === 'signup' ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Business Selection (same as original)
const BusinessSelection = ({ onSelect, onBack }) => (
  <div style={{ minHeight: '100vh', background: '#09090B', position: 'relative' }}>
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '10%', left: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 60%)', filter: 'blur(80px)' }} />
    </div>
    
    <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: '48px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#71717A', fontSize: '14px', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </button>
        <Badge>Step 1 of 3</Badge>
      </div>
      
      <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '56px' }}>
        <h1 className="jakarta" style={{ fontSize: '40px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>What type of business?</h1>
        <p style={{ color: '#71717A', fontSize: '17px' }}>Select your industry and we'll customize everything for you</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {BUSINESS_TYPES.map((business, i) => (
          <Card
            key={business.id}
            hover
            onClick={() => onSelect(business)}
            className="animate-fade-up"
            style={{ padding: '28px', animationDelay: `${i * 0.03}s`, cursor: 'pointer' }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ width: '52px', height: '52px', background: business.gradient, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', flexShrink: 0 }}>
                {business.icon}
              </div>
              <div style={{ flex: 1 }}>
                <h3 className="jakarta" style={{ fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>{business.name}</h3>
                <p style={{ color: '#71717A', fontSize: '13px', lineHeight: 1.5 }}>{business.description}</p>
                <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {business.sections.slice(0, 3).map(s => (
                    <span key={s} style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '11px', color: '#A1A1AA' }}>{s}</span>
                  ))}
                  {business.sections.length > 3 && (
                    <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '11px', color: '#71717A' }}>+{business.sections.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  </div>
);

// Brand Setup - Updated to use API
const BrandSetup = ({ business, onComplete, onBack }) => {
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [formData, setFormData] = useState({
    businessName: '',
    tagline: '',
    description: '',
    primaryColor: business.color,
    phone: '',
    email: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  
  const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6', '#1E40AF', business.color];
  
  const handleSubmit = async () => {
    if (!formData.businessName) return;
    
    setLoading(true);
    try {
      const setupData = {
        businessTypeId: business.id,
        businessName: formData.businessName,
        tagline: formData.tagline,
        description: formData.description,
        primaryColor: formData.primaryColor,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
      };
      
      if (logoFile) {
        setupData.logo = logoFile;
      }
      
      const response = await businessAPI.setup(setupData);
      onComplete({ ...response.data.business, logoUrl: response.data.business.logoUrl || logoPreview });
    } catch (error) {
      console.error('Business setup error:', error);
      alert(error.response?.data?.error || 'Failed to save business details');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div style={{ minHeight: '100vh', background: '#09090B', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: '500px', height: '500px', background: `radial-gradient(circle, ${formData.primaryColor}20 0%, transparent 60%)`, filter: 'blur(80px)', transition: 'background 0.5s' }} />
      </div>
      
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '700px', margin: '0 auto', padding: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#71717A', fontSize: '14px', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </button>
          <Badge>Step 2 of 3</Badge>
        </div>
        
        <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: `${business.color}15`, borderRadius: '100px', marginBottom: '16px' }}>
            <span style={{ fontSize: '20px' }}>{business.icon}</span>
            <span style={{ fontSize: '14px', color: business.color, fontWeight: 600 }}>{business.name}</span>
          </div>
          <h1 className="jakarta" style={{ fontSize: '36px', fontWeight: 800, letterSpacing: '-1px', marginBottom: '12px' }}>Set up your brand</h1>
          <p style={{ color: '#71717A', fontSize: '16px' }}>Add your logo and business information</p>
        </div>
        
        <Card className="animate-fade-up glass-strong" style={{ padding: '40px', animationDelay: '0.1s' }}>
          <div style={{ marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#FAFAFA', marginBottom: '12px' }}>Business Logo</label>
            <div
              onClick={() => document.getElementById('logo-upload').click()}
              style={{
                width: '100%',
                height: '140px',
                border: '2px dashed rgba(255,255,255,0.1)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                cursor: 'pointer',
                transition: 'all 0.3s',
                background: logoPreview ? `url(${logoPreview}) center/contain no-repeat, rgba(255,255,255,0.02)` : 'rgba(255,255,255,0.02)',
                position: 'relative',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = formData.primaryColor}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              {!logoPreview ? (
                <>
                  <div style={{ width: '48px', height: '48px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                  </div>
                  <p style={{ color: '#71717A', fontSize: '14px' }}>Click to upload logo</p>
                  <p style={{ color: '#52525B', fontSize: '12px', marginTop: '4px' }}>PNG, JPG, SVG up to 5MB</p>
                </>
              ) : (
                <div style={{ position: 'absolute', bottom: '12px', right: '12px', padding: '6px 12px', background: 'rgba(0,0,0,0.8)', borderRadius: '8px', fontSize: '12px', color: '#A1A1AA' }}>Change</div>
              )}
            </div>
            <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <Input
                label="Business Name *"
                placeholder="Your Business Name"
                value={formData.businessName}
                onChange={e => setFormData({ ...formData, businessName: e.target.value })}
              />
            </div>
            
            <div style={{ gridColumn: 'span 2' }}>
              <Input
                label="Tagline"
                placeholder="A short, catchy tagline"
                value={formData.tagline}
                onChange={e => setFormData({ ...formData, tagline: e.target.value })}
              />
            </div>
            
            <Input
              label="Phone"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
            
            <Input
              label="Email"
              placeholder="hello@business.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
            
            <div style={{ gridColumn: 'span 2' }}>
              <Input
                label="Address"
                placeholder="123 Main Street, City, State 12345"
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>
          
          <div style={{ marginTop: '12px', marginBottom: '32px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: '#FAFAFA', marginBottom: '12px' }}>Brand Color</label>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, primaryColor: color })}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    background: color,
                    border: formData.primaryColor === color ? '3px solid #fff' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: formData.primaryColor === color ? `0 0 20px ${color}50` : 'none',
                  }}
                />
              ))}
            </div>
          </div>
          
          <Button
            size="lg"
            disabled={!formData.businessName || loading}
            onClick={handleSubmit}
            style={{ width: '100%' }}
          >
            {loading ? 'Saving...' : 'Generate My Website'}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Button>
        </Card>
      </div>
    </div>
  );
};

// Generating Page - Updated to use API
const GeneratingPage = ({ business, details, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0);
  
  const stages = [
    { label: 'Analyzing business requirements', icon: '🔍' },
    { label: 'Generating website structure', icon: '🏗️' },
    { label: 'Creating compelling content', icon: '✍️' },
    { label: 'Designing visual elements', icon: '🎨' },
    { label: 'Optimizing for performance', icon: '⚡' },
    { label: 'Finalizing your website', icon: '✨' },
  ];
  
  useEffect(() => {
    const generateSite = async () => {
      // Animate progress
      for (let i = 0; i < stages.length; i++) {
        setStage(i);
        await new Promise(r => setTimeout(r, 700));
        setProgress(((i + 1) / stages.length) * 100);
      }
      
      // Generate content via API
      try {
        const response = await siteAPI.generate();
        onComplete(response.data.site.content);
      } catch (error) {
        console.error('Site generation error:', error);
        // Continue with fallback
        onComplete({
          hero: { headline: `Welcome to ${details.businessName}`, subheadline: details.tagline || `Your trusted ${business.name.toLowerCase()} partner`, cta: 'Get Started' },
          about: { title: 'About Us', content: `${details.businessName} is committed to delivering exceptional ${business.name.toLowerCase()} services.` },
          sections: business.sections.slice(0, 3).map(s => ({ title: s, description: `Our ${s.toLowerCase()} offerings`, items: [{ name: `Premium ${s}`, description: 'High-quality service', price: null }] })),
          features: [{ title: 'Quality', description: 'Unmatched quality' }, { title: 'Experience', description: 'Years of expertise' }],
          testimonials: [{ name: 'Satisfied Customer', text: 'Exceptional service!', role: 'Client' }],
          contact: { address: details.address || '123 Main St', phone: details.phone || '(555) 123-4567', email: details.email || 'hello@example.com', hours: 'Mon-Fri 9am-5pm' },
          cta: { title: 'Ready to Get Started?', description: 'Contact us today', button: 'Contact Us' }
        });
      }
    };
    
    generateSite();
  }, [business, details, onComplete, stages.length]);
  
  return (
    <div style={{ minHeight: '100vh', background: '#09090B', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: `radial-gradient(circle, ${details.primaryColor}15 0%, transparent 60%)`, filter: 'blur(80px)' }} />
      </div>
      
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '500px', padding: '48px' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 40px' }}>
          <div style={{ position: 'absolute', inset: 0, border: '3px solid rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: details.primaryColor, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <div style={{ position: 'absolute', inset: '8px', border: '3px solid transparent', borderTopColor: `${details.primaryColor}60`, borderRadius: '50%', animation: 'spin 1.5s linear infinite reverse' }} />
          <div style={{ position: 'absolute', inset: '20px', background: `${details.primaryColor}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '40px' }}>{stages[stage]?.icon}</span>
          </div>
        </div>
        
        <h2 className="jakarta" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>Building Your Website</h2>
        <p style={{ color: '#71717A', fontSize: '16px', marginBottom: '40px', minHeight: '24px' }}>{stages[stage]?.label}</p>
        
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${details.primaryColor}, ${details.primaryColor}CC)`, borderRadius: '2px', transition: 'width 0.5s ease' }} />
        </div>
        
        <p style={{ color: '#52525B', fontSize: '13px' }}>{Math.round(progress)}% complete</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
          {stages.map((_, i) => (
            <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i <= stage ? details.primaryColor : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App Component - Updated with API integration
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('landing');
  const [authType, setAuthType] = useState('signup');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [businessDetails, setBusinessDetails] = useState(null);
  const [siteContent, setSiteContent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check for existing auth on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Try to load existing business and site
      loadUserData();
    } else {
      setLoading(false);
    }
  }, []);
  
  const loadUserData = async () => {
    try {
      // Load business
      const businessRes = await businessAPI.getMyBusiness();
      if (businessRes.data.business) {
        const businessData = businessRes.data.business;
        setBusinessDetails(businessData);
        
        // Find business type
        const businessType = BUSINESS_TYPES.find(b => b.id === businessData.businessTypeId);
        if (businessType) {
          setSelectedBusiness(businessType);
        }
        
        // Load site content
        try {
          const siteRes = await siteAPI.getContent();
          if (siteRes.data.site) {
            setSiteContent(siteRes.data.site.content);
            setPage('admin');
            return;
          }
        } catch (e) {
          // No site yet
        }
        
        setPage('select-business');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleAuth = async (type, userData) => {
    setUser(userData);
    setLoading(true);
    await loadUserData();
    if (!siteContent) {
      setPage('select-business');
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setPage('landing');
    setSelectedBusiness(null);
    setBusinessDetails(null);
    setSiteContent(null);
  };
  
  // Admin Dashboard and Preview components would continue similarly with API integration
  // For brevity, I'm including the key integration points...
  
  if (loading) {
    return (
      <>
        <GlobalStyles />
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090B' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '48px', height: '48px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
            <p style={{ color: '#71717A' }}>Loading...</p>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <GlobalStyles />
      
      {page === 'landing' && <LandingPage onGetStarted={() => setPage('auth')} />}
      
      {page === 'auth' && (
        <AuthPage 
          onAuth={handleAuth} 
          authType={authType} 
          setAuthType={setAuthType}
          onBack={() => setPage('landing')}
        />
      )}
      
      {page === 'select-business' && (
        <BusinessSelection 
          onSelect={(b) => { setSelectedBusiness(b); setPage('brand-setup'); }}
          onBack={() => setPage('auth')}
        />
      )}
      
      {page === 'brand-setup' && (
        <BrandSetup 
          business={selectedBusiness}
          onComplete={(d) => { setBusinessDetails(d); setPage('generating'); }}
          onBack={() => setPage('select-business')}
        />
      )}
      
      {page === 'generating' && (
        <GeneratingPage 
          business={selectedBusiness}
          details={businessDetails}
          onComplete={(c) => { setSiteContent(c); setPage('admin'); }}
        />
      )}
      
      {page === 'admin' && (
        <AdminDashboard 
          user={user}
          business={selectedBusiness}
          details={businessDetails}
          siteContent={siteContent}
          setSiteContent={setSiteContent}
          onLogout={handleLogout}
          onPreview={() => setPage('preview')}
        />
      )}
      
      {page === 'preview' && (
        <PreviewSite 
          business={selectedBusiness}
          details={businessDetails}
          siteContent={siteContent}
          onBack={() => setPage('admin')}
        />
      )}
    </>
  );
}

// Admin Dashboard Component - Updated with API integration
const AdminDashboard = ({ user, business, details, siteContent, setSiteContent, onLogout, onPreview }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  
  if (!business || !details || !siteContent) {
    return <div>Loading...</div>;
  }
  
  const updateContent = (path, value) => {
    setSiteContent(prev => {
      const updated = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let obj = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await adminAPI.updateContent(siteContent);
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { id: 'content', label: 'Content', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
  ];
  
  const stats = [
    { label: 'Total Visitors', value: '12,847', change: '+12.5%', positive: true, icon: '👥' },
    { label: 'Page Views', value: '48,392', change: '+8.2%', positive: true, icon: '👁️' },
    { label: 'Bounce Rate', value: '32.1%', change: '-4.3%', positive: true, icon: '📉' },
    { label: 'Avg. Duration', value: '3:24', change: '+18.7%', positive: true, icon: '⏱️' },
  ];
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#09090B' }}>
      <aside style={{ width: '260px', background: '#0C0C0E', borderRight: '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', position: 'fixed', height: '100vh' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>⚡</div>
            <span className="jakarta" style={{ fontSize: '18px', fontWeight: 700 }}>SiteForge</span>
          </div>
        </div>
        
        <div style={{ padding: '20px' }}>
          <div className="glass" style={{ padding: '16px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {details.logoUrl ? (
                <img src={details.logoUrl} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'contain', background: '#fff' }} />
              ) : (
                <div style={{ width: '40px', height: '40px', background: details.primaryColor, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{business.icon}</div>
              )}
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px' }}>{details.businessName}</p>
                <p style={{ fontSize: '12px', color: '#71717A' }}>{business.name}</p>
              </div>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }} />
              <span style={{ fontSize: '12px', color: '#10B981' }}>Published</span>
            </div>
          </div>
        </div>
        
        <nav style={{ flex: 1, padding: '0 12px' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                marginBottom: '4px',
                background: activeTab === tab.id ? 'rgba(99,102,241,0.1)' : 'transparent',
                border: 'none',
                borderRadius: '10px',
                color: activeTab === tab.id ? '#FAFAFA' : '#71717A',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ opacity: activeTab === tab.id ? 1 : 0.6 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
        
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <Button variant="primary" size="md" onClick={onPreview} style={{ width: '100%', marginBottom: '12px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview Site
          </Button>
          <Button variant="ghost" size="sm" onClick={onLogout} style={{ width: '100%', color: '#71717A' }}>Sign Out</Button>
        </div>
      </aside>
      
      <main style={{ flex: 1, marginLeft: '260px', padding: '32px 40px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 className="jakarta" style={{ fontSize: '26px', fontWeight: 700 }}>
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p style={{ color: '#71717A', fontSize: '14px', marginTop: '4px' }}>Manage your website content and settings</p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </header>
        
        {activeTab === 'overview' && (
          <div className="animate-fade">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
              {stats.map((stat, i) => (
                <Card key={i} style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <span style={{ fontSize: '13px', color: '#71717A', fontWeight: 500 }}>{stat.label}</span>
                    <span style={{ fontSize: '20px' }}>{stat.icon}</span>
                  </div>
                  <div className="jakarta" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>{stat.value}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: stat.positive ? '#10B981' : '#EF4444', fontSize: '13px', fontWeight: 600 }}>{stat.change}</span>
                    <span style={{ color: '#52525B', fontSize: '12px' }}>vs last week</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'content' && (
          <div className="animate-fade" style={{ display: 'grid', gap: '24px' }}>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', background: `${details.primaryColor}20`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎯</div>
                <div>
                  <h3 className="jakarta" style={{ fontSize: '16px', fontWeight: 700 }}>Hero Section</h3>
                  <p style={{ color: '#71717A', fontSize: '13px' }}>The main banner of your website</p>
                </div>
              </div>
              
              <Input
                label="Headline"
                value={siteContent?.hero?.headline || ''}
                onChange={e => updateContent('hero.headline', e.target.value)}
                placeholder="Enter your main headline"
              />
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#A1A1AA', marginBottom: '8px' }}>Subheadline</label>
                <textarea
                  value={siteContent?.hero?.subheadline || ''}
                  onChange={e => updateContent('hero.subheadline', e.target.value)}
                  placeholder="Enter your subheadline"
                  style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#FAFAFA', fontSize: '15px', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>
              
              <Input
                label="Call-to-Action Button"
                value={siteContent?.hero?.cta || ''}
                onChange={e => updateContent('hero.cta', e.target.value)}
                placeholder="Button text"
              />
            </Card>
            
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(16,185,129,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>ℹ️</div>
                <div>
                  <h3 className="jakarta" style={{ fontSize: '16px', fontWeight: 700 }}>About Section</h3>
                  <p style={{ color: '#71717A', fontSize: '13px' }}>Tell visitors about your business</p>
                </div>
              </div>
              
              <Input
                label="Title"
                value={siteContent?.about?.title || ''}
                onChange={e => updateContent('about.title', e.target.value)}
              />
              
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#A1A1AA', marginBottom: '8px' }}>Content</label>
                <textarea
                  value={siteContent?.about?.content || ''}
                  onChange={e => updateContent('about.content', e.target.value)}
                  style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#FAFAFA', fontSize: '15px', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>
            </Card>
            
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', background: 'rgba(59,130,246,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📞</div>
                <div>
                  <h3 className="jakarta" style={{ fontSize: '16px', fontWeight: 700 }}>Contact Information</h3>
                  <p style={{ color: '#71717A', fontSize: '13px' }}>How customers can reach you</p>
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <Input label="Phone" value={siteContent?.contact?.phone || ''} onChange={e => updateContent('contact.phone', e.target.value)} />
                <Input label="Email" value={siteContent?.contact?.email || ''} onChange={e => updateContent('contact.email', e.target.value)} />
                <Input label="Address" value={siteContent?.contact?.address || ''} onChange={e => updateContent('contact.address', e.target.value)} />
                <Input label="Hours" value={siteContent?.contact?.hours || ''} onChange={e => updateContent('contact.hours', e.target.value)} />
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

// Preview Site Component
const PreviewSite = ({ business, details, siteContent, onBack }) => {
  if (!business || !details || !siteContent) {
    return <div>Loading...</div>;
  }
  
  const color = details.primaryColor;
  
  return (
    <div style={{ background: '#fff', color: '#18181B', minHeight: '100vh' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#18181B', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }} />
          <span style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>Preview Mode</span>
        </div>
        <Button size="sm" onClick={onBack}>← Back to Dashboard</Button>
      </div>
      
      <div style={{ paddingTop: '60px' }}>
        <nav style={{ padding: '20px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E4E4E7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {details.logoUrl ? (
              <img src={details.logoUrl} alt="Logo" style={{ height: '44px', objectFit: 'contain' }} />
            ) : (
              <div style={{ width: '44px', height: '44px', background: color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '18px' }}>{details.businessName[0]}</div>
            )}
            <span className="jakarta" style={{ fontSize: '20px', fontWeight: 700 }}>{details.businessName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            {business.sections.slice(0, 4).map(s => (
              <a key={s} href="#" style={{ color: '#52525B', textDecoration: 'none', fontSize: '15px', fontWeight: 500 }}>{s}</a>
            ))}
            <button style={{ padding: '12px 28px', background: color, color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 600, cursor: 'pointer' }}>Contact Us</button>
          </div>
        </nav>
        
        <section style={{ padding: '120px 64px', textAlign: 'center', background: `linear-gradient(180deg, ${color}08 0%, #fff 100%)` }}>
          <h1 className="jakarta" style={{ fontSize: '56px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', color: '#18181B', letterSpacing: '-2px' }}>{siteContent?.hero?.headline}</h1>
          <p style={{ fontSize: '20px', color: '#52525B', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.7 }}>{siteContent?.hero?.subheadline}</p>
          <button style={{ padding: '18px 48px', background: color, color: '#fff', border: 'none', borderRadius: '10px', fontSize: '17px', fontWeight: 600, cursor: 'pointer', boxShadow: `0 4px 20px ${color}40` }}>{siteContent?.hero?.cta}</button>
        </section>
        
        <section style={{ padding: '100px 64px', maxWidth: '900px', margin: '0 auto' }}>
          <h2 className="jakarta" style={{ fontSize: '40px', fontWeight: 800, textAlign: 'center', marginBottom: '24px', letterSpacing: '-1px' }}>{siteContent?.about?.title}</h2>
          <p style={{ fontSize: '18px', color: '#52525B', textAlign: 'center', lineHeight: 1.8 }}>{siteContent?.about?.content}</p>
        </section>
        
        {siteContent?.features && (
          <section style={{ padding: '80px 64px', background: '#FAFAFA' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <h2 className="jakarta" style={{ fontSize: '36px', fontWeight: 800, textAlign: 'center', marginBottom: '48px', letterSpacing: '-1px' }}>Why Choose Us</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                {siteContent.features.map((f, i) => (
                  <div key={i} style={{ padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <div style={{ width: '48px', height: '48px', background: `${color}15`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                      <div style={{ width: '20px', height: '20px', background: color, borderRadius: '50%' }} />
                    </div>
                    <h3 className="jakarta" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>{f.title}</h3>
                    <p style={{ color: '#52525B', fontSize: '15px', lineHeight: 1.7 }}>{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        
        <section style={{ padding: '80px 64px' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h2 className="jakarta" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '40px' }}>Contact Us</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', textAlign: 'left' }}>
              {[
                { label: 'Address', value: siteContent?.contact?.address },
                { label: 'Phone', value: siteContent?.contact?.phone },
                { label: 'Email', value: siteContent?.contact?.email },
                { label: 'Hours', value: siteContent?.contact?.hours },
              ].map((item, i) => (
                <div key={i}>
                  <p style={{ color: '#71717A', fontSize: '13px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                  <p style={{ fontWeight: 600, fontSize: '15px' }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <footer style={{ padding: '40px 64px', borderTop: '1px solid #E4E4E7', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
            {details.logoUrl ? (
              <img src={details.logoUrl} alt="Logo" style={{ height: '32px', objectFit: 'contain' }} />
            ) : (
              <div style={{ width: '32px', height: '32px', background: color, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px' }}>{details.businessName[0]}</div>
            )}
            <span className="jakarta" style={{ fontSize: '16px', fontWeight: 700 }}>{details.businessName}</span>
          </div>
          <p style={{ color: '#71717A', fontSize: '14px' }}>© 2026 {details.businessName}. All rights reserved.</p>
          <p style={{ color: '#A1A1AA', fontSize: '12px', marginTop: '8px' }}>Built with SiteForge</p>
        </footer>
      </div>
    </div>
  );
};