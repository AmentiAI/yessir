import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { siteAPI } from '../lib/api'

export default function Generating() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState(0)
  
  const stages = [
    { label: 'Analyzing business requirements', icon: '🔍' },
    { label: 'Generating website structure', icon: '🏗️' },
    { label: 'Creating compelling content', icon: '✍️' },
    { label: 'Designing visual elements', icon: '🎨' },
    { label: 'Optimizing for performance', icon: '⚡' },
    { label: 'Finalizing your website', icon: '✨' },
  ]
  
  useEffect(() => {
    const businessDetails = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('businessDetails') || '{}') : {}
    const selectedBusiness = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('selectedBusiness') || '{}') : {}
    
    const generateSite = async () => {
      // Animate progress
      for (let i = 0; i < stages.length; i++) {
        setStage(i)
        await new Promise(r => setTimeout(r, 700))
        setProgress(((i + 1) / stages.length) * 100)
      }
      
      // Generate content via API
      try {
        const response = await siteAPI.generate()
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('siteContent', JSON.stringify(response.data.site.content))
        }
        router.push('/admin')
      } catch (error) {
        console.error('Site generation error:', error)
        // Continue with fallback
        const fallback = {
          hero: { headline: `Welcome to ${businessDetails.businessName}`, subheadline: businessDetails.tagline || `Your trusted ${selectedBusiness.name?.toLowerCase()} partner`, cta: 'Get Started' },
          about: { title: 'About Us', content: `${businessDetails.businessName} is committed to delivering exceptional ${selectedBusiness.name?.toLowerCase()} services.` },
          sections: selectedBusiness.sections?.slice(0, 3).map(s => ({ title: s, description: `Our ${s.toLowerCase()} offerings`, items: [{ name: `Premium ${s}`, description: 'High-quality service', price: null }] })) || [],
          features: [{ title: 'Quality', description: 'Unmatched quality' }, { title: 'Experience', description: 'Years of expertise' }],
          testimonials: [{ name: 'Satisfied Customer', text: 'Exceptional service!', role: 'Client' }],
          contact: { address: businessDetails.address || '123 Main St', phone: businessDetails.phone || '(555) 123-4567', email: businessDetails.email || 'hello@example.com', hours: 'Mon-Fri 9am-5pm' },
          cta: { title: 'Ready to Get Started?', description: 'Contact us today', button: 'Contact Us' }
        }
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('siteContent', JSON.stringify(fallback))
        }
        router.push('/admin')
      }
    }
    
    generateSite()
  }, [router, stages.length])
  
  const businessDetails = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('businessDetails') || '{}') : {}
  const primaryColor = businessDetails.primaryColor || '#6366F1'
  
  return (
    <div style={{ minHeight: '100vh', background: '#09090B', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 60%)`, filter: 'blur(80px)' }} />
      </div>
      
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '500px', padding: '48px' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 40px' }}>
          <div style={{ position: 'absolute', inset: 0, border: '3px solid rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: primaryColor, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <div style={{ position: 'absolute', inset: '8px', border: '3px solid transparent', borderTopColor: `${primaryColor}60`, borderRadius: '50%', animation: 'spin 1.5s linear infinite reverse' }} />
          <div style={{ position: 'absolute', inset: '20px', background: `${primaryColor}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '40px' }}>{stages[stage]?.icon}</span>
          </div>
        </div>
        
        <h2 className="jakarta" style={{ fontSize: '28px', fontWeight: 700, marginBottom: '12px' }}>Building Your Website</h2>
        <p style={{ color: '#71717A', fontSize: '16px', marginBottom: '40px', minHeight: '24px' }}>{stages[stage]?.label}</p>
        
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '16px' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}CC)`, borderRadius: '2px', transition: 'width 0.5s ease' }} />
        </div>
        
        <p style={{ color: '#52525B', fontSize: '13px' }}>{Math.round(progress)}% complete</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
          {stages.map((_, i) => (
            <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: i <= stage ? primaryColor : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
          ))}
        </div>
      </div>
    </div>
  )
}