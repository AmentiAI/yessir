import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button, Input, Card, Badge } from '../components/UI'
import { adminAPI } from '../lib/api'
import { BUSINESS_TYPES } from './_app'

export default function Admin() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [activePage, setActivePage] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [businessDetails, setBusinessDetails] = useState(null)
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [siteContent, setSiteContent] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const dashboardRes = await adminAPI.getDashboard()
        setBusinessDetails(dashboardRes.data.business)
        setSiteContent(dashboardRes.data.site?.content)
        
        const businessType = BUSINESS_TYPES.find(b => b.id === dashboardRes.data.business.businessTypeId)
        if (businessType) {
          setSelectedBusiness(businessType)
        }
        
        // Set first page as active if multi-page
        if (dashboardRes.data.site?.content?.pages && dashboardRes.data.site.content.pages.length > 0) {
          setActivePage(dashboardRes.data.site.content.pages[0].slug)
        }
      } catch (error) {
        console.error('Error loading admin data:', error)
        
        // Try to get from sessionStorage
        try {
          const storedDetails = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('businessDetails') || '{}') : {}
          const storedBusiness = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('selectedBusiness') || '{}') : {}
          const storedContent = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('siteContent') || '{}') : {}
          
          // Only set if we have valid data
          if (storedDetails && Object.keys(storedDetails).length > 0 && storedDetails.businessName) {
            setBusinessDetails(storedDetails)
          }
          if (storedBusiness && Object.keys(storedBusiness).length > 0) {
            setSelectedBusiness(storedBusiness)
          }
          if (storedContent && Object.keys(storedContent).length > 0) {
            setSiteContent(storedContent)
            
            if (storedContent?.pages && Array.isArray(storedContent.pages) && storedContent.pages.length > 0) {
              setActivePage(storedContent.pages[0].slug)
            }
          }
        } catch (storageError) {
          console.error('Error reading sessionStorage:', storageError)
        }
        
        // If no valid data, redirect to setup
        setTimeout(() => {
          if (!businessDetails || !siteContent) {
            router.push('/select-business')
          }
        }, 2000)
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
          {!loading && !hasValidData && (
            <p style={{ color: '#EF4444', marginTop: '16px', fontSize: '14px' }}>
              Missing data. Redirecting to setup...
            </p>
          )}
        </div>
      </div>
    )
  }
  
  const isMultiPage = siteContent?.pages && Array.isArray(siteContent.pages)
  const pages = isMultiPage ? siteContent.pages : []
  const currentPageData = pages.find(p => p.slug === activePage) || pages[0]
  
  const updateContent = (path, value) => {
    setSiteContent(prev => {
      const updated = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let obj = updated
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {}
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return updated
    })
  }
  
  const updatePageContent = (pageSlug, path, value) => {
    setSiteContent(prev => {
      const updated = JSON.parse(JSON.stringify(prev))
      if (!updated.pages) return updated
      const pageIndex = updated.pages.findIndex(p => p.slug === pageSlug)
      if (pageIndex === -1) return updated
      
      const keys = path.split('.')
      let obj = updated.pages[pageIndex]
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {}
        obj = obj[keys[i]]
      }
      obj[keys[keys.length - 1]] = value
      return updated
    })
  }
  
  const updateSectionItem = (pageSlug, sectionIndex, itemIndex, field, value) => {
    setSiteContent(prev => {
      const updated = JSON.parse(JSON.stringify(prev))
      if (!updated.pages) return updated
      const pageIndex = updated.pages.findIndex(p => p.slug === pageSlug)
      if (pageIndex === -1) return updated
      
      if (updated.pages[pageIndex].sections && updated.pages[pageIndex].sections[sectionIndex]) {
        if (!updated.pages[pageIndex].sections[sectionIndex].items) {
          updated.pages[pageIndex].sections[sectionIndex].items = []
        }
        if (!updated.pages[pageIndex].sections[sectionIndex].items[itemIndex]) {
          updated.pages[pageIndex].sections[sectionIndex].items[itemIndex] = {}
        }
        updated.pages[pageIndex].sections[sectionIndex].items[itemIndex][field] = value
      }
      return updated
    })
  }
  
  const handleSave = async () => {
    setIsSaving(true)
    try {
      await adminAPI.updateContent(siteContent)
      alert('Changes saved successfully!')
    } catch (error) {
      console.error('Save error:', error)
      alert('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      sessionStorage.clear()
    }
    router.push('/')
  }
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg> },
    { id: 'content', label: 'Content', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> },
    { id: 'images', label: 'Images', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg> },
  ]
  
  const stats = [
    { label: 'Total Visitors', value: '12,847', change: '+12.5%', positive: true, icon: '👥' },
    { label: 'Page Views', value: '48,392', change: '+8.2%', positive: true, icon: '👁️' },
    { label: 'Bounce Rate', value: '32.1%', change: '-4.3%', positive: true, icon: '📉' },
    { label: 'Avg. Duration', value: '3:24', change: '+18.7%', positive: true, icon: '⏱️' },
  ]
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#09090B' }}>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 998
          }}
        />
      )}
      
      <aside 
        style={{
          width: '260px',
          background: '#0C0C0E',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          zIndex: 999,
          transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease'
        }}
      >
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 769px) {
            aside {
              transform: translateX(0) !important;
            }
          }
        `}} />
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>⚡</div>
            <span className="jakarta" style={{ fontSize: '18px', fontWeight: 700 }}>SiteForge</span>
          </div>
        </div>
        
        <div style={{ padding: '20px' }}>
          <div className="glass" style={{ padding: '16px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {businessDetails?.logoUrl ? (
                <img src={businessDetails.logoUrl} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'contain', background: '#fff' }} />
              ) : (
                <div style={{ width: '40px', height: '40px', background: businessDetails?.primaryColor || '#6366F1', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{selectedBusiness?.icon || '⚡'}</div>
              )}
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px' }}>{businessDetails?.businessName || 'Business'}</p>
                <p style={{ fontSize: '12px', color: '#71717A' }}>{selectedBusiness?.name || 'Business Type'}</p>
              </div>
            </div>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }} />
              <span style={{ fontSize: '12px', color: '#10B981' }}>Published</span>
            </div>
          </div>
        </div>
        
        <nav style={{ flex: 1, padding: '0 12px', overflowY: 'auto' }}>
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
          <Button variant="primary" size="md" onClick={() => router.push('/preview')} style={{ width: '100%', marginBottom: '12px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview Site
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} style={{ width: '100%', color: '#71717A' }}>Sign Out</Button>
        </div>
      </aside>
      
      {/* Mobile Menu Button */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        style={{
          position: 'fixed',
          top: '16px',
          left: '16px',
          zIndex: 1000,
          background: 'rgba(12,12,14,0.9)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '10px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}
      >
        <div style={{ width: '20px', height: '2px', background: '#FAFAFA', transition: 'all 0.3s', transform: isMobileMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
        <div style={{ width: '20px', height: '2px', background: '#FAFAFA', transition: 'all 0.3s', opacity: isMobileMenuOpen ? 0 : 1 }} />
        <div style={{ width: '20px', height: '2px', background: '#FAFAFA', transition: 'all 0.3s', transform: isMobileMenuOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none' }} />
      </button>
      
      <main className="admin-main" style={{ flex: 1, marginLeft: '0', padding: 'clamp(20px, 4vw, 32px) clamp(16px, 4vw, 40px)', maxWidth: '1400px', width: '100%' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'clamp(24px, 4vw, 32px)', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h1 className="jakarta" style={{ fontSize: 'clamp(20px, 5vw, 26px)', fontWeight: 700 }}>
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p style={{ color: '#71717A', fontSize: 'clamp(12px, 3vw, 14px)', marginTop: '4px' }}>Manage your website content and settings</p>
          </div>
          <Button variant="secondary" size="sm" onClick={handleSave} disabled={isSaving} style={{ whiteSpace: 'nowrap' }}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </header>
        
        {activeTab === 'overview' && (
          <div className="animate-fade">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'clamp(16px, 3vw, 20px)', marginBottom: 'clamp(24px, 4vw, 32px)' }}>
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
        
        {activeTab === 'content' && isMultiPage && (
          <div className="animate-fade">
            {/* Page Selector */}
            <div style={{ marginBottom: 'clamp(20px, 4vw, 24px)', display: 'flex', gap: 'clamp(8px, 2vw, 12px)', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '8px' }}>
              {pages.map((page) => (
                <button
                  key={page.slug}
                  onClick={() => setActivePage(page.slug)}
                  style={{
                    padding: '12px 24px',
                    background: activePage === page.slug ? (businessDetails?.primaryColor || '#6366F1') : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${activePage === page.slug ? (businessDetails?.primaryColor || '#6366F1') : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: '10px',
                    color: activePage === page.slug ? '#fff' : '#FAFAFA',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {page.title}
                </button>
              ))}
            </div>
            
            {currentPageData && (
              <div style={{ display: 'grid', gap: '24px' }}>
                {/* Hero Section Editor */}
                <Card>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                    <div style={{ width: '40px', height: '40px', background: `${businessDetails?.primaryColor || '#6366F1'}20`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎯</div>
                    <div>
                      <h3 className="jakarta" style={{ fontSize: '16px', fontWeight: 700 }}>Hero Section</h3>
                      <p style={{ color: '#71717A', fontSize: '13px' }}>Main banner for {currentPageData.title} page</p>
                    </div>
                  </div>
                  
                  {currentPageData.hero?.image && (
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#A1A1AA', marginBottom: '8px' }}>Hero Image</label>
                      <img src={currentPageData.hero.image} alt="Hero" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '10px' }} />
                      <Input
                        label="Image URL"
                        value={currentPageData.hero.image || ''}
                        onChange={e => updatePageContent(currentPageData.slug, 'hero.image', e.target.value)}
                        style={{ marginTop: '12px' }}
                      />
                    </div>
                  )}
                  
                  <Input
                    label="Headline"
                    value={currentPageData.hero?.headline || ''}
                    onChange={e => updatePageContent(currentPageData.slug, 'hero.headline', e.target.value)}
                    placeholder="Enter headline"
                  />
                  
                  <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#A1A1AA', marginBottom: '8px' }}>Subheadline</label>
                    <textarea
                      value={currentPageData.hero?.subheadline || ''}
                      onChange={e => updatePageContent(currentPageData.slug, 'hero.subheadline', e.target.value)}
                      placeholder="Enter subheadline"
                      style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#FAFAFA', fontSize: '15px', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}
                    />
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'clamp(16px, 3vw, 20px)' }}>
                    <Input
                      label="Primary CTA"
                      value={currentPageData.hero?.primaryCta || ''}
                      onChange={e => updatePageContent(currentPageData.slug, 'hero.primaryCta', e.target.value)}
                      placeholder="Button text"
                    />
                    <Input
                      label="Secondary CTA"
                      value={currentPageData.hero?.secondaryCta || ''}
                      onChange={e => updatePageContent(currentPageData.slug, 'hero.secondaryCta', e.target.value)}
                      placeholder="Button text"
                    />
                  </div>
                </Card>
                
                {/* Sections Editor */}
                {currentPageData.sections?.map((section, sectionIdx) => (
                  <Card key={sectionIdx}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                      <div style={{ width: '40px', height: '40px', background: 'rgba(99,102,241,0.15)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                        {section.type === 'features' ? '⭐' : section.type === 'services' ? '🛍️' : section.type === 'cta' ? '📢' : section.type === 'content' ? '📝' : section.type === 'contact' ? '📞' : '📄'}
                      </div>
                      <div>
                        <h3 className="jakarta" style={{ fontSize: '16px', fontWeight: 700 }}>{section.title || `${section.type} Section`}</h3>
                        <p style={{ color: '#71717A', fontSize: '13px' }}>Type: {section.type}</p>
                      </div>
                    </div>
                    
                    {section.type === 'cta' && (
                      <>
                        <Input
                          label="Title"
                          value={section.title || ''}
                          onChange={e => {
                            const updated = JSON.parse(JSON.stringify(siteContent))
                            updated.pages.find(p => p.slug === currentPageData.slug).sections[sectionIdx].title = e.target.value
                            setSiteContent(updated)
                          }}
                        />
                        <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#A1A1AA', marginBottom: '8px' }}>Description</label>
                          <textarea
                            value={section.description || ''}
                            onChange={e => {
                              const updated = JSON.parse(JSON.stringify(siteContent))
                              updated.pages.find(p => p.slug === currentPageData.slug).sections[sectionIdx].description = e.target.value
                              setSiteContent(updated)
                            }}
                            style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#FAFAFA', fontSize: '15px', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
                          />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 'clamp(16px, 3vw, 20px)' }}>
                          <Input
                            label="Primary Button"
                            value={section.button || ''}
                            onChange={e => {
                              const updated = JSON.parse(JSON.stringify(siteContent))
                              updated.pages.find(p => p.slug === currentPageData.slug).sections[sectionIdx].button = e.target.value
                              setSiteContent(updated)
                            }}
                          />
                          <Input
                            label="Secondary Button"
                            value={section.secondaryButton || ''}
                            onChange={e => {
                              const updated = JSON.parse(JSON.stringify(siteContent))
                              updated.pages.find(p => p.slug === currentPageData.slug).sections[sectionIdx].secondaryButton = e.target.value
                              setSiteContent(updated)
                            }}
                          />
                        </div>
                      </>
                    )}
                    
                    {section.type === 'content' && (
                      <>
                        <Input
                          label="Title"
                          value={section.title || ''}
                          onChange={e => {
                            const updated = JSON.parse(JSON.stringify(siteContent))
                            updated.pages.find(p => p.slug === currentPageData.slug).sections[sectionIdx].title = e.target.value
                            setSiteContent(updated)
                          }}
                        />
                        <div style={{ marginTop: '20px' }}>
                          <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#A1A1AA', marginBottom: '8px' }}>Content</label>
                          <textarea
                            value={section.content || ''}
                            onChange={e => {
                              const updated = JSON.parse(JSON.stringify(siteContent))
                              updated.pages.find(p => p.slug === currentPageData.slug).sections[sectionIdx].content = e.target.value
                              setSiteContent(updated)
                            }}
                            style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#FAFAFA', fontSize: '15px', minHeight: '150px', resize: 'vertical', fontFamily: 'inherit' }}
                          />
                        </div>
                      </>
                    )}
                    
                    {(section.type === 'features' || section.type === 'services') && section.items && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                          <label style={{ fontSize: '13px', fontWeight: 500, color: '#A1A1AA' }}>Items</label>
                        </div>
                        {section.items.map((item, itemIdx) => (
                          <Card key={itemIdx} style={{ marginBottom: '16px', padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
                            {item.image && (
                              <div style={{ marginBottom: '16px' }}>
                                <img src={item.image} alt={item.name || item.title} style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                                <Input
                                  label="Image URL"
                                  value={item.image || ''}
                                  onChange={e => updateSectionItem(currentPageData.slug, sectionIdx, itemIdx, 'image', e.target.value)}
                                  style={{ marginTop: '12px' }}
                                />
                              </div>
                            )}
                            <Input
                              label={section.type === 'services' ? 'Service Name' : 'Feature Title'}
                              value={item.name || item.title || ''}
                              onChange={e => updateSectionItem(currentPageData.slug, sectionIdx, itemIdx, section.type === 'services' ? 'name' : 'title', e.target.value)}
                            />
                            <div style={{ marginTop: '16px', marginBottom: '16px' }}>
                              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#A1A1AA', marginBottom: '8px' }}>Description</label>
                              <textarea
                                value={item.description || ''}
                                onChange={e => updateSectionItem(currentPageData.slug, sectionIdx, itemIdx, 'description', e.target.value)}
                                style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#FAFAFA', fontSize: '15px', minHeight: '80px', resize: 'vertical', fontFamily: 'inherit' }}
                              />
                            </div>
                            {section.type === 'services' && (
                              <Input
                                label="Price"
                                value={item.price || ''}
                                onChange={e => updateSectionItem(currentPageData.slug, sectionIdx, itemIdx, 'price', e.target.value)}
                                placeholder="$XX or leave empty"
                              />
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: 'clamp(12px, 2vw, 16px)', marginTop: '12px' }}>
                              <Input
                                label="CTA Button"
                                value={item.cta || ''}
                                onChange={e => updateSectionItem(currentPageData.slug, sectionIdx, itemIdx, 'cta', e.target.value)}
                              />
                              <Input
                                label="Secondary CTA"
                                value={item.secondaryCta || ''}
                                onChange={e => updateSectionItem(currentPageData.slug, sectionIdx, itemIdx, 'secondaryCta', e.target.value)}
                              />
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                    
                    {section.type === 'contact' && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                        <Input
                          label="Address"
                          value={section.address || ''}
                          onChange={e => {
                            const updated = JSON.parse(JSON.stringify(siteContent))
                            updated.pages.find(p => p.slug === currentPageData.slug).sections[sectionIdx].address = e.target.value
                            setSiteContent(updated)
                          }}
                        />
                        <Input
                          label="Phone"
                          value={section.phone || ''}
                          onChange={e => {
                            const updated = JSON.parse(JSON.stringify(siteContent))
                            updated.pages.find(p => p.slug === currentPageData.slug).sections[sectionIdx].phone = e.target.value
                            setSiteContent(updated)
                          }}
                        />
                        <Input
                          label="Email"
                          value={section.email || ''}
                          onChange={e => {
                            const updated = JSON.parse(JSON.stringify(siteContent))
                            updated.pages.find(p => p.slug === currentPageData.slug).sections[sectionIdx].email = e.target.value
                            setSiteContent(updated)
                          }}
                        />
                        <Input
                          label="Hours"
                          value={section.hours || ''}
                          onChange={e => {
                            const updated = JSON.parse(JSON.stringify(siteContent))
                            updated.pages.find(p => p.slug === currentPageData.slug).sections[sectionIdx].hours = e.target.value
                            setSiteContent(updated)
                          }}
                        />
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'images' && (
          <div className="animate-fade">
            <Card>
              <h3 className="jakarta" style={{ fontSize: 'clamp(16px, 4vw, 18px)', fontWeight: 700, marginBottom: 'clamp(20px, 4vw, 24px)' }}>Generated Images</h3>
              {siteContent?.images && siteContent.images.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 'clamp(16px, 3vw, 20px)' }}>
                  {siteContent.images.map((img, idx) => (
                    <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '12px', padding: '16px' }}>
                      <img src={img} alt={`Generated ${idx + 1}`} style={{ width: '100%', borderRadius: '8px', marginBottom: '12px' }} />
                      <Input
                        label={`Image ${idx + 1} URL`}
                        value={img}
                        onChange={e => {
                          const updated = JSON.parse(JSON.stringify(siteContent))
                          updated.images[idx] = e.target.value
                          setSiteContent(updated)
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#71717A' }}>No images generated yet. Generate your site to create images.</p>
              )}
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}