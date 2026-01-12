import { useRouter } from 'next/router'
import { Button, Card, Badge } from '../components/UI'
import { BUSINESS_TYPES } from './_app'

export default function Home() {
  const router = useRouter()
  
  const features = [
    { icon: '🎯', title: 'Industry-Specific Templates', desc: 'Choose from 12 business categories with tailored layouts and sections designed for your specific industry needs.' },
    { icon: '🤖', title: 'AI-Powered Generation', desc: 'Our advanced AI analyzes your business and generates compelling copy, optimal layouts, and SEO-friendly content.' },
    { icon: '🎨', title: 'Full Customization', desc: 'Complete control over colors, fonts, layouts, and content. Make it uniquely yours with our intuitive editor.' },
    { icon: '📊', title: 'Analytics Dashboard', desc: 'Track visitors, engagement, and conversions with our built-in analytics. Make data-driven decisions.' },
    { icon: '🚀', title: 'Instant Deployment', desc: 'Your website goes live immediately on our global CDN. SSL included, blazing fast performance guaranteed.' },
    { icon: '🔧', title: 'Admin System', desc: 'Powerful admin panel to manage content, pages, settings, and team members. No coding required.' },
  ]

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
          <Button variant="secondary" size="sm" onClick={() => router.push('/auth')}>Sign In</Button>
          <Button size="sm" onClick={() => router.push('/auth')}>Get Started Free</Button>
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
          <Button size="xl" onClick={() => router.push('/auth')} className="btn-primary">
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
          <Button size="xl" onClick={() => router.push('/auth')}>Create Your Website Now</Button>
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
  )
}