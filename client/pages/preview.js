import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from '../components/UI'
import { BUSINESS_TYPES } from './_app'

export default function Preview() {
  const router = useRouter()
  const [businessDetails, setBusinessDetails] = useState(null)
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [siteContent, setSiteContent] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Load from sessionStorage or API
    const loadData = async () => {
      try {
        // Try API first
        const { adminAPI } = await import('../lib/api')
        const dashboardRes = await adminAPI.getDashboard()
        setBusinessDetails(dashboardRes.data.business)
        setSiteContent(dashboardRes.data.site?.content)
        
        const businessType = BUSINESS_TYPES.find(b => b.id === dashboardRes.data.business.businessTypeId)
        if (businessType) {
          setSelectedBusiness(businessType)
        }
      } catch (error) {
        // Fallback to sessionStorage
        const storedDetails = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('businessDetails') || '{}') : {}
        const storedBusiness = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('selectedBusiness') || '{}') : {}
        const storedContent = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('siteContent') || '{}') : {}
        
        setBusinessDetails(storedDetails)
        setSelectedBusiness(storedBusiness)
        setSiteContent(storedContent)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])
  
  if (loading || !businessDetails || !selectedBusiness || !siteContent) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090B' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid rgba(99,102,241,0.3)', borderTopColor: '#6366F1', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#71717A' }}>Loading...</p>
        </div>
      </div>
    )
  }
  
  const color = businessDetails.primaryColor || '#6366F1'
  
  return (
    <div style={{ background: '#fff', color: '#18181B', minHeight: '100vh' }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#18181B', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }} />
          <span style={{ color: '#fff', fontSize: '14px', fontWeight: 500 }}>Preview Mode</span>
        </div>
        <Button size="sm" onClick={() => router.push('/admin')}>← Back to Dashboard</Button>
      </div>
      
      <div style={{ paddingTop: '60px' }}>
        <nav style={{ padding: '20px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E4E4E7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {businessDetails.logoUrl ? (
              <img src={businessDetails.logoUrl} alt="Logo" style={{ height: '44px', objectFit: 'contain' }} />
            ) : (
              <div style={{ width: '44px', height: '44px', background: color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '18px' }}>{businessDetails.businessName[0]}</div>
            )}
            <span className="jakarta" style={{ fontSize: '20px', fontWeight: 700 }}>{businessDetails.businessName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            {selectedBusiness.sections?.slice(0, 4).map(s => (
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
            {businessDetails.logoUrl ? (
              <img src={businessDetails.logoUrl} alt="Logo" style={{ height: '32px', objectFit: 'contain' }} />
            ) : (
              <div style={{ width: '32px', height: '32px', background: color, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px' }}>{businessDetails.businessName[0]}</div>
            )}
            <span className="jakarta" style={{ fontSize: '16px', fontWeight: 700 }}>{businessDetails.businessName}</span>
          </div>
          <p style={{ color: '#71717A', fontSize: '14px' }}>© 2026 {businessDetails.businessName}. All rights reserved.</p>
          <p style={{ color: '#A1A1AA', fontSize: '12px', marginTop: '8px' }}>Built with SiteForge</p>
        </footer>
      </div>
    </div>
  )
}