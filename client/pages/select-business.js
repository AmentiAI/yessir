import { useRouter } from 'next/router'
import { Card, Badge } from '../components/UI'
import { BUSINESS_TYPES } from './_app'

export default function SelectBusiness() {
  const router = useRouter()
  
  return (
    <div style={{ minHeight: '100vh', background: '#09090B', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '10%', left: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 60%)', filter: 'blur(80px)' }} />
      </div>
      
      <div style={{ position: 'relative', zIndex: 10, maxWidth: '1200px', margin: '0 auto', padding: 'clamp(24px, 5vw, 48px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(32px, 6vw, 48px)', flexWrap: 'wrap', gap: '12px' }}>
          <button onClick={() => router.push('/auth')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#71717A', fontSize: 'clamp(12px, 3vw, 14px)', cursor: 'pointer' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back
          </button>
          <Badge style={{ fontSize: 'clamp(10px, 2.5vw, 12px)' }}>Step 1 of 3</Badge>
        </div>
        
        <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: 'clamp(40px, 7vw, 56px)' }}>
          <h1 className="jakarta" style={{ fontSize: 'clamp(28px, 6vw, 40px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: '10px' }}>What type of business?</h1>
          <p style={{ color: '#71717A', fontSize: 'clamp(15px, 3vw, 17px)' }}>Select your industry and we'll customize everything for you</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))', gap: 'clamp(12px, 3vw, 16px)' }}>
          {BUSINESS_TYPES.map((business, i) => (
            <Card
              key={business.id}
              hover
              onClick={() => router.push({ pathname: '/brand-setup', query: { type: business.id } })}
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
  )
}