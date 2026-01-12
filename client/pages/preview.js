import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from '../components/UI'
import { BUSINESS_TYPES } from './_app'

export default function Preview() {
  const router = useRouter()
  const [businessDetails, setBusinessDetails] = useState(null)
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [siteContent, setSiteContent] = useState(null)
  const [currentPage, setCurrentPage] = useState('home')
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const { adminAPI } = await import('../lib/api')
        const dashboardRes = await adminAPI.getDashboard()
        setBusinessDetails(dashboardRes.data.business)
        setSiteContent(dashboardRes.data.site?.content)
        
        const businessType = BUSINESS_TYPES.find(b => b.id === dashboardRes.data.business.businessTypeId)
        if (businessType) {
          setSelectedBusiness(businessType)
        }
      } catch (error) {
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
  
  // Handle both old single-page and new multi-page formats
  const isMultiPage = siteContent?.pages && Array.isArray(siteContent.pages)
  const pages = isMultiPage ? siteContent.pages : []
  const currentPageData = pages.find(p => p.slug === currentPage) || pages[0]
  const navItems = siteContent?.navigation?.items || (isMultiPage ? pages.map(p => p.title) : ['Home', 'Services', 'About', 'Contact'])

  // Render CTA button
  const renderCTA = (text, primary = true, onClick) => (
    <button
      onClick={onClick}
      style={{
        padding: primary ? '16px 36px' : '14px 32px',
        background: primary ? color : 'transparent',
        color: primary ? '#fff' : color,
        border: primary ? 'none' : `2px solid ${color}`,
        borderRadius: '10px',
        fontSize: '16px',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: primary ? `0 4px 20px ${color}40` : 'none',
        transition: 'all 0.2s',
        margin: '0 8px'
      }}
      onMouseEnter={(e) => {
        if (!primary) {
          e.target.style.background = `${color}10`
        }
      }}
      onMouseLeave={(e) => {
        if (!primary) {
          e.target.style.background = 'transparent'
        }
      }}
    >
      {text}
    </button>
  )

  // Render page content
  const renderPage = (page) => {
    if (!page) return null

    return (
      <div key={page.slug}>
        {/* Hero Section */}
        {page.hero && (
          <section style={{ padding: '120px 64px', textAlign: 'center', background: `linear-gradient(180deg, ${color}08 0%, #fff 100%)` }}>
            <h1 className="jakarta" style={{ fontSize: '56px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', color: '#18181B', letterSpacing: '-2px' }}>
              {page.hero.headline}
            </h1>
            <p style={{ fontSize: '20px', color: '#52525B', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.7 }}>
              {page.hero.subheadline}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {page.hero.primaryCta && renderCTA(page.hero.primaryCta, true)}
              {page.hero.secondaryCta && renderCTA(page.hero.secondaryCta, false)}
            </div>
          </section>
        )}

        {/* Page Sections */}
        {page.sections?.map((section, idx) => {
          if (section.type === 'cta') {
            return (
              <section key={idx} style={{ padding: '80px 64px', textAlign: 'center', background: idx % 2 === 0 ? '#FAFAFA' : '#fff' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                  <h2 className="jakarta" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-1px' }}>
                    {section.title}
                  </h2>
                  <p style={{ fontSize: '18px', color: '#52525B', marginBottom: '32px', lineHeight: 1.7 }}>
                    {section.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {section.button && renderCTA(section.button, true)}
                    {section.secondaryButton && renderCTA(section.secondaryButton, false)}
                  </div>
                </div>
              </section>
            )
          }

          if (section.type === 'features') {
            return (
              <section key={idx} style={{ padding: '80px 64px', background: idx % 2 === 0 ? '#FAFAFA' : '#fff' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                  <h2 className="jakarta" style={{ fontSize: '36px', fontWeight: 800, textAlign: 'center', marginBottom: '48px', letterSpacing: '-1px' }}>
                    {section.title}
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                    {section.items?.map((item, i) => (
                      <div key={i} style={{ padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                        <div style={{ width: '48px', height: '48px', background: `${color}15`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                          <div style={{ width: '20px', height: '20px', background: color, borderRadius: '50%' }} />
                        </div>
                        <h3 className="jakarta" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>{item.title}</h3>
                        <p style={{ color: '#52525B', fontSize: '15px', lineHeight: 1.7, marginBottom: '16px' }}>{item.description}</p>
                        {item.cta && renderCTA(item.cta, false)}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
          }

          if (section.type === 'services') {
            return (
              <section key={idx} style={{ padding: '80px 64px', background: idx % 2 === 0 ? '#FAFAFA' : '#fff' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                  <h2 className="jakarta" style={{ fontSize: '36px', fontWeight: 800, textAlign: 'center', marginBottom: '48px', letterSpacing: '-1px' }}>
                    {section.title}
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
                    {section.items?.map((item, i) => (
                      <div key={i} style={{ padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: `2px solid ${color}20` }}>
                        <h3 className="jakarta" style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px', color: color }}>
                          {item.name}
                        </h3>
                        <p style={{ color: '#52525B', fontSize: '15px', lineHeight: 1.7, marginBottom: '16px' }}>{item.description}</p>
                        {item.price && (
                          <p style={{ fontSize: '24px', fontWeight: 700, color: color, marginBottom: '20px' }}>{item.price}</p>
                        )}
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          {item.cta && renderCTA(item.cta, true)}
                          {item.secondaryCta && renderCTA(item.secondaryCta, false)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )
          }

          if (section.type === 'content') {
            return (
              <section key={idx} style={{ padding: '100px 64px', maxWidth: '900px', margin: '0 auto' }}>
                <h2 className="jakarta" style={{ fontSize: '40px', fontWeight: 800, textAlign: 'center', marginBottom: '24px', letterSpacing: '-1px' }}>
                  {section.title}
                </h2>
                <p style={{ fontSize: '18px', color: '#52525B', textAlign: 'center', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {section.content}
                </p>
              </section>
            )
          }

          if (section.type === 'contact') {
            return (
              <section key={idx} style={{ padding: '80px 64px' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                  <h2 className="jakarta" style={{ fontSize: '36px', fontWeight: 800, marginBottom: '40px' }}>Contact Information</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '32px', textAlign: 'left', marginBottom: '40px' }}>
                    {[
                      { label: 'Address', value: section.address },
                      { label: 'Phone', value: section.phone },
                      { label: 'Email', value: section.email },
                      { label: 'Hours', value: section.hours },
                    ].map((item, i) => (
                      <div key={i}>
                        <p style={{ color: '#71717A', fontSize: '13px', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{item.label}</p>
                        <p style={{ fontWeight: 600, fontSize: '15px' }}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    {renderCTA('Send Message', true)}
                    {renderCTA('Call Now', false)}
                  </div>
                </div>
              </section>
            )
          }

          return null
        })}
      </div>
    )
  }

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
        {/* Navigation */}
        <nav style={{ padding: '20px 64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E4E4E7', position: 'sticky', top: '60px', background: '#fff', zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {businessDetails.logoUrl ? (
              <img src={businessDetails.logoUrl} alt="Logo" style={{ height: '44px', objectFit: 'contain' }} />
            ) : (
              <div style={{ width: '44px', height: '44px', background: color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '18px' }}>
                {businessDetails.businessName[0]}
              </div>
            )}
            <span className="jakarta" style={{ fontSize: '20px', fontWeight: 700 }}>{businessDetails.businessName}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            {navItems.map((item, idx) => {
              const pageSlug = pages.find(p => p.title === item)?.slug || item.toLowerCase()
              return (
                <a
                  key={idx}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(pageSlug)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  style={{
                    color: currentPage === pageSlug ? color : '#52525B',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: currentPage === pageSlug ? 600 : 500,
                    borderBottom: currentPage === pageSlug ? `2px solid ${color}` : '2px solid transparent',
                    paddingBottom: '4px',
                    transition: 'all 0.2s'
                  }}
                >
                  {item}
                </a>
              )
            })}
            {renderCTA('Contact Us', true)}
          </div>
        </nav>
        
        {/* Current Page Content */}
        {isMultiPage ? renderPage(currentPageData) : (
          <div>
            <section style={{ padding: '120px 64px', textAlign: 'center', background: `linear-gradient(180deg, ${color}08 0%, #fff 100%)` }}>
              <h1 className="jakarta" style={{ fontSize: '56px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', color: '#18181B', letterSpacing: '-2px' }}>
                {siteContent?.hero?.headline || 'Welcome'}
              </h1>
              <p style={{ fontSize: '20px', color: '#52525B', maxWidth: '600px', margin: '0 auto 40px', lineHeight: 1.7 }}>
                {siteContent?.hero?.subheadline}
              </p>
              {renderCTA(siteContent?.hero?.cta || 'Get Started', true)}
            </section>
          </div>
        )}

        {/* Testimonials Section (if exists) */}
        {siteContent?.testimonials && siteContent.testimonials.length > 0 && (
          <section style={{ padding: '80px 64px', background: '#FAFAFA' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <h2 className="jakarta" style={{ fontSize: '36px', fontWeight: 800, textAlign: 'center', marginBottom: '48px', letterSpacing: '-1px' }}>
                What Our Customers Say
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                {siteContent.testimonials.map((t, i) => (
                  <div key={i} style={{ padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
                    <p style={{ fontSize: '16px', color: '#52525B', lineHeight: 1.7, marginBottom: '20px', fontStyle: 'italic' }}>
                      "{t.text}"
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '4px' }}>{t.name}</p>
                        <p style={{ color: '#71717A', fontSize: '13px' }}>{t.role}</p>
                      </div>
                      {t.cta && renderCTA(t.cta, false)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        
        {/* Footer */}
        <footer style={{ padding: '40px 64px', borderTop: '1px solid #E4E4E7', textAlign: 'center', background: '#FAFAFA' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
            {businessDetails.logoUrl ? (
              <img src={businessDetails.logoUrl} alt="Logo" style={{ height: '32px', objectFit: 'contain' }} />
            ) : (
              <div style={{ width: '32px', height: '32px', background: color, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '14px' }}>
                {businessDetails.businessName[0]}
              </div>
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