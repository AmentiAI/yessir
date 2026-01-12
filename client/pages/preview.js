import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button } from '../components/UI'
import { BUSINESS_TYPES } from './_app'

// Disable static generation - this page requires client-side data
export const dynamic = 'force-dynamic'

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
        console.error('Failed to load preview data:', error)
        // Only try sessionStorage on client side
        if (typeof window !== 'undefined') {
          try {
            const storedDetails = JSON.parse(sessionStorage.getItem('businessDetails') || '{}')
            const storedBusiness = JSON.parse(sessionStorage.getItem('selectedBusiness') || '{}')
            const storedContent = JSON.parse(sessionStorage.getItem('siteContent') || '{}')
            
            // Only set if we have valid data
            if (storedDetails && Object.keys(storedDetails).length > 0) {
              setBusinessDetails(storedDetails)
            }
            if (storedBusiness && Object.keys(storedBusiness).length > 0) {
              setSelectedBusiness(storedBusiness)
            }
            if (storedContent && Object.keys(storedContent).length > 0) {
              setSiteContent(storedContent)
            }
          } catch (e) {
            console.error('Failed to parse sessionStorage:', e)
          }
        }
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Check if we have valid data (not just empty objects)
  const hasValidData = businessDetails && 
    Object.keys(businessDetails).length > 0 && 
    businessDetails.businessName &&
    selectedBusiness && 
    Object.keys(selectedBusiness).length > 0 &&
    siteContent && 
    Object.keys(siteContent).length > 0

  if (loading || !hasValidData) {
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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  // Render CTA button
  const renderCTA = (text, primary = true, onClick) => (
    <button
      onClick={onClick}
      style={{
        padding: primary ? '14px 28px' : '12px 24px',
        background: primary ? color : 'transparent',
        color: primary ? '#fff' : color,
        border: primary ? 'none' : `2px solid ${color}`,
        borderRadius: '10px',
        fontSize: 'clamp(14px, 4vw, 16px)',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: primary ? `0 4px 20px ${color}40` : 'none',
        transition: 'all 0.2s',
        margin: '4px',
        whiteSpace: 'nowrap',
        width: '100%',
        maxWidth: '300px'
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
          <section style={{ padding: 'clamp(60px, 10vw, 120px) clamp(20px, 5vw, 64px)', textAlign: 'center', background: `linear-gradient(180deg, ${color}08 0%, #fff 100%)`, position: 'relative', overflow: 'hidden' }}>
            {page.hero.image && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.1 }}>
                <img src={page.hero.image} alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            )}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h1 className="jakarta" style={{ fontSize: 'clamp(32px, 8vw, 56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px', color: '#18181B', letterSpacing: '-1px' }}>
                {page.hero.headline}
              </h1>
              <p style={{ fontSize: 'clamp(16px, 4vw, 20px)', color: '#52525B', maxWidth: '600px', margin: '0 auto clamp(24px, 5vw, 40px)', lineHeight: 1.7 }}>
                {page.hero.subheadline}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {page.hero.primaryCta && renderCTA(page.hero.primaryCta, true)}
                {page.hero.secondaryCta && renderCTA(page.hero.secondaryCta, false)}
              </div>
            </div>
          </section>
        )}

        {/* Page Sections */}
        {page.sections?.map((section, idx) => {
          if (section.type === 'cta') {
            return (
              <section key={idx} style={{ padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 64px)', textAlign: 'center', background: idx % 2 === 0 ? '#FAFAFA' : '#fff' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                  <h2 className="jakarta" style={{ fontSize: 'clamp(24px, 6vw, 36px)', fontWeight: 800, marginBottom: '12px', letterSpacing: '-1px' }}>
                    {section.title}
                  </h2>
                  <p style={{ fontSize: 'clamp(16px, 4vw, 18px)', color: '#52525B', marginBottom: '24px', lineHeight: 1.7 }}>
                    {section.description}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {section.button && renderCTA(section.button, true)}
                    {section.secondaryButton && renderCTA(section.secondaryButton, false)}
                  </div>
                </div>
              </section>
            )
          }

          if (section.type === 'features') {
            return (
              <section key={idx} style={{ padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 64px)', background: idx % 2 === 0 ? '#FAFAFA' : '#fff' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                  <h2 className="jakarta" style={{ fontSize: 'clamp(28px, 6vw, 36px)', fontWeight: 800, textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 48px)', letterSpacing: '-1px' }}>
                    {section.title}
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(24px, 4vw, 32px)' }}>
                    {section.items?.map((item, i) => (
                      <div key={i} style={{ padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
                        {item.image && (
                          <img src={item.image} alt={item.title || item.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }} />
                        )}
                        {!item.image && (
                          <div style={{ width: '48px', height: '48px', background: `${color}15`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                            <div style={{ width: '20px', height: '20px', background: color, borderRadius: '50%' }} />
                          </div>
                        )}
                        <h3 className="jakarta" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>{item.title || item.name}</h3>
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
              <section key={idx} style={{ padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 64px)', background: idx % 2 === 0 ? '#FAFAFA' : '#fff' }}>
                <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
                  <h2 className="jakarta" style={{ fontSize: 'clamp(28px, 6vw, 36px)', fontWeight: 800, textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 48px)', letterSpacing: '-1px' }}>
                    {section.title}
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 'clamp(24px, 4vw, 32px)' }}>
                    {section.items?.map((item, i) => (
                      <div key={i} style={{ padding: '32px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', border: `2px solid ${color}20`, overflow: 'hidden' }}>
                        {item.image && (
                          <img src={item.image} alt={item.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '12px', marginBottom: '20px' }} />
                        )}
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
              <section key={idx} style={{ padding: 'clamp(50px, 10vw, 100px) clamp(20px, 5vw, 64px)', maxWidth: '900px', margin: '0 auto' }}>
                <h2 className="jakarta" style={{ fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 800, textAlign: 'center', marginBottom: '20px', letterSpacing: '-1px' }}>
                  {section.title}
                </h2>
                <p style={{ fontSize: 'clamp(16px, 4vw, 18px)', color: '#52525B', textAlign: 'center', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                  {section.content}
                </p>
              </section>
            )
          }

          if (section.type === 'contact') {
            return (
              <section key={idx} style={{ padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 64px)' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                  <h2 className="jakarta" style={{ fontSize: 'clamp(28px, 6vw, 36px)', fontWeight: 800, marginBottom: 'clamp(24px, 5vw, 40px)' }}>Contact Information</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'clamp(20px, 4vw, 32px)', textAlign: 'left', marginBottom: 'clamp(24px, 5vw, 40px)' }}>
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
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, background: '#18181B', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '6px', height: '6px', background: '#10B981', borderRadius: '50%' }} />
          <span style={{ color: '#fff', fontSize: '12px', fontWeight: 500 }}>Preview</span>
        </div>
        <Button size="sm" onClick={() => router.push('/admin')} style={{ padding: '8px 16px', fontSize: '12px' }}>← Back</Button>
      </div>
      
      <div style={{ paddingTop: '60px' }}>
        {/* Navigation */}
        <nav style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E4E4E7', position: 'sticky', top: '60px', background: '#fff', zIndex: 100 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {businessDetails.logoUrl ? (
              <img src={businessDetails.logoUrl} alt="Logo" style={{ height: '36px', objectFit: 'contain' }} />
            ) : (
              <div style={{ width: '36px', height: '36px', background: color, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '16px' }}>
                {businessDetails.businessName?.[0] || '?'}
              </div>
            )}
            <span className="jakarta" style={{ fontSize: 'clamp(16px, 4vw, 20px)', fontWeight: 700 }}>{businessDetails.businessName || 'Business'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '8px'
              }}
            >
              <div style={{ width: '24px', height: '2px', background: '#52525B', transition: 'all 0.3s', transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
              <div style={{ width: '24px', height: '2px', background: '#52525B', transition: 'all 0.3s', opacity: isMobileMenuOpen ? 0 : 1 }} />
              <div style={{ width: '24px', height: '2px', background: '#52525B', transition: 'all 0.3s', transform: isMobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none' }} />
            </button>
          
          {/* Desktop Navigation */}
          <div className="desktop-nav" style={{ display: 'none' }}>
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
          </div>
        </nav>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div style={{
            position: 'fixed',
            top: '120px',
            left: 0,
            right: 0,
            background: '#fff',
            borderBottom: '1px solid #E4E4E7',
            zIndex: 99,
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            {navItems.map((item, idx) => {
              const pageSlug = pages.find(p => p.title === item)?.slug || item.toLowerCase()
              return (
                <a
                  key={idx}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setCurrentPage(pageSlug)
                    setIsMobileMenuOpen(false)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  style={{
                    color: currentPage === pageSlug ? color : '#52525B',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: currentPage === pageSlug ? 600 : 500,
                    padding: '12px 0',
                    borderBottom: '1px solid #F4F4F5'
                  }}
                >
                  {item}
                </a>
              )
            })}
            <div style={{ paddingTop: '8px' }}>
              {renderCTA('Contact Us', true)}
            </div>
          </div>
        )}
        
        {/* Current Page Content */}
        {isMultiPage ? renderPage(currentPageData) : (
          <div>
            <section style={{ padding: 'clamp(60px, 10vw, 120px) clamp(20px, 5vw, 64px)', textAlign: 'center', background: `linear-gradient(180deg, ${color}08 0%, #fff 100%)` }}>
              <h1 className="jakarta" style={{ fontSize: 'clamp(32px, 8vw, 56px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px', color: '#18181B', letterSpacing: '-1px' }}>
                {siteContent?.hero?.headline || 'Welcome'}
              </h1>
              <p style={{ fontSize: 'clamp(16px, 4vw, 20px)', color: '#52525B', maxWidth: '600px', margin: '0 auto clamp(24px, 5vw, 40px)', lineHeight: 1.7 }}>
                {siteContent?.hero?.subheadline}
              </p>
              {renderCTA(siteContent?.hero?.cta || 'Get Started', true)}
            </section>
          </div>
        )}

        {/* Testimonials Section (if exists) */}
        {siteContent?.testimonials && siteContent.testimonials.length > 0 && (
          <section style={{ padding: 'clamp(40px, 8vw, 80px) clamp(20px, 5vw, 64px)', background: '#FAFAFA' }}>
            <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
              <h2 className="jakarta" style={{ fontSize: 'clamp(28px, 6vw, 36px)', fontWeight: 800, textAlign: 'center', marginBottom: 'clamp(32px, 6vw, 48px)', letterSpacing: '-1px' }}>
                What Our Customers Say
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 'clamp(24px, 4vw, 32px)' }}>
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
        <footer style={{ padding: 'clamp(30px, 6vw, 40px) clamp(20px, 5vw, 64px)', borderTop: '1px solid #E4E4E7', textAlign: 'center', background: '#FAFAFA' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
            {businessDetails.logoUrl ? (
              <img src={businessDetails.logoUrl} alt="Logo" style={{ height: 'clamp(28px, 4vw, 32px)', objectFit: 'contain' }} />
            ) : (
              <div style={{ width: 'clamp(28px, 4vw, 32px)', height: 'clamp(28px, 4vw, 32px)', background: color, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 'clamp(12px, 3vw, 14px)' }}>
                {businessDetails.businessName?.[0] || '?'}
              </div>
            )}
            <span className="jakarta" style={{ fontSize: 'clamp(14px, 4vw, 16px)', fontWeight: 700 }}>{businessDetails.businessName || 'Business'}</span>
          </div>
          <p style={{ color: '#71717A', fontSize: 'clamp(12px, 3vw, 14px)' }}>© 2026 {businessDetails.businessName || 'Business'}. All rights reserved.</p>
          <p style={{ color: '#A1A1AA', fontSize: 'clamp(11px, 2.5vw, 12px)', marginTop: '6px' }}>Built with SiteForge</p>
        </footer>
      </div>
    </div>
  )
}