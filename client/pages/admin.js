import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button, Input, Card, Badge } from '../components/UI'
import { adminAPI } from '../lib/api'
import { BUSINESS_TYPES } from './_app'

export default function Admin() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [isSaving, setIsSaving] = useState(false)
  const [businessDetails, setBusinessDetails] = useState(null)
  const [selectedBusiness, setSelectedBusiness] = useState(null)
  const [siteContent, setSiteContent] = useState(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Load data from sessionStorage or API
    const loadData = async () => {
      try {
        // Try to load from API first
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
  ]
  
  const stats = [
    { label: 'Total Visitors', value: '12,847', change: '+12.5%', positive: true, icon: '👥' },
    { label: 'Page Views', value: '48,392', change: '+8.2%', positive: true, icon: '👁️' },
    { label: 'Bounce Rate', value: '32.1%', change: '-4.3%', positive: true, icon: '📉' },
    { label: 'Avg. Duration', value: '3:24', change: '+18.7%', positive: true, icon: '⏱️' },
  ]
  
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
              {businessDetails.logoUrl ? (
                <img src={businessDetails.logoUrl} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'contain', background: '#fff' }} />
              ) : (
                <div style={{ width: '40px', height: '40px', background: businessDetails.primaryColor, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{selectedBusiness.icon}</div>
              )}
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px' }}>{businessDetails.businessName}</p>
                <p style={{ fontSize: '12px', color: '#71717A' }}>{selectedBusiness.name}</p>
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
          <Button variant="primary" size="md" onClick={() => router.push('/preview')} style={{ width: '100%', marginBottom: '12px' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview Site
          </Button>
          <Button variant="ghost" size="sm" onClick={handleLogout} style={{ width: '100%', color: '#71717A' }}>Sign Out</Button>
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
                <div style={{ width: '40px', height: '40px', background: `${businessDetails.primaryColor}20`, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎯</div>
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
  )
}