import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Button, Input, Card, Badge } from '../components/UI'
import { BUSINESS_TYPES } from './_app'
import { businessAPI } from '../lib/api'

export default function BrandSetup() {
  const router = useRouter()
  const { type } = router.query
  const business = BUSINESS_TYPES.find(b => b.id === type)
  
  const [logoFile, setLogoFile] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [formData, setFormData] = useState({
    businessName: '',
    tagline: '',
    description: '',
    primaryColor: business?.color || '#6366F1',
    phone: '',
    email: '',
    address: '',
  })
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    if (business) {
      setFormData(prev => ({ ...prev, primaryColor: business.color }))
    }
  }, [business])
  
  if (!business) {
    return <div>Loading...</div>
  }
  
  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setLogoPreview(reader.result)
      reader.readAsDataURL(file)
    }
  }
  
  const colors = ['#6366F1', '#8B5CF6', '#EC4899', '#EF4444', '#F59E0B', '#10B981', '#06B6D4', '#3B82F6', '#1E40AF', business.color]
  
  const handleSubmit = async () => {
    if (!formData.businessName) return
    
    setLoading(true)
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
      }
      
      if (logoFile) {
        setupData.logo = logoFile
      }
      
      const response = await businessAPI.setup(setupData)
      const businessData = response.data.business
      
      // Store in sessionStorage for next page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('businessDetails', JSON.stringify({ ...businessData, logoUrl: businessData.logoUrl || logoPreview }))
        sessionStorage.setItem('selectedBusiness', JSON.stringify(business))
      }
      
      router.push('/generating')
    } catch (error) {
      console.error('Business setup error:', error)
      alert(error.response?.data?.error || 'Failed to save business details')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div style={{ minHeight: '100vh', background: '#09090B', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: '500px', height: '500px', background: `radial-gradient(circle, ${formData.primaryColor}20 0%, transparent 60%)`, filter: 'blur(80px)', transition: 'background 0.5s' }} />
      </div>
      
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '700px', margin: '0 auto', padding: '48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <button onClick={() => router.push('/select-business')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#71717A', fontSize: '14px', cursor: 'pointer' }}>
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
  )
}