import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { siteAPI } from '../lib/api'

export default function Generating() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState(0)
  const [failed, setFailed] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#6366F1')
  
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
    
    let timeoutId
    let isCompleted = false
    
    const generateSite = async () => {
      const useFallback = () => {
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
        return fallback
      }
      
      // Set 2-minute timeout (120,000ms)
      timeoutId = setTimeout(() => {
        if (!isCompleted) {
          console.error('Site generation timed out after 2 minutes')
          isCompleted = true
          setFailed(true)
          setErrorMessage('Site generation took too long. Using fallback content instead.')
          setStage(stages.length - 1)
          setProgress(100)
          useFallback()
          
          // Redirect after showing error for 1 second
          setTimeout(() => {
            router.push('/admin')
          }, 1000)
        }
      }, 120000) // 2 minutes
      
      // Start API call immediately (don't wait for animations)
      let apiResponse = null
      let apiError = null
      
      const apiPromise = siteAPI.generate()
        .then(response => {
          if (!isCompleted) {
            apiResponse = response
          }
        })
        .catch(error => {
          if (!isCompleted) {
            apiError = error
            console.error('API call error:', error)
          }
        })
      
      // Animate progress while API call is running
      for (let i = 0; i < stages.length; i++) {
        setStage(i)
        setProgress(((i + 1) / stages.length) * 100)
        
        // Check if API completed
        if (apiResponse && !isCompleted) {
          // API completed successfully
          isCompleted = true
          clearTimeout(timeoutId)
          
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('siteContent', JSON.stringify(apiResponse.data.site.content))
          }
          
          // Complete remaining stages quickly
          for (let j = i + 1; j < stages.length; j++) {
            setStage(j)
            setProgress(((j + 1) / stages.length) * 100)
            await new Promise(r => setTimeout(r, 150))
          }
          
          router.push('/admin')
          return
        }
        
        if (apiError && !isCompleted) {
          // API failed, use fallback
          isCompleted = true
          clearTimeout(timeoutId)
          setFailed(true)
          setErrorMessage('Failed to generate site. Using fallback content instead.')
          useFallback()
          setTimeout(() => {
            router.push('/admin')
          }, 1000)
          return
        }
        
        // Wait before next stage
        await new Promise(r => setTimeout(r, 700))
      }
      
      // If animations finished, wait for API to complete (with a short timeout)
      try {
        await Promise.race([
          apiPromise,
          new Promise(resolve => setTimeout(resolve, 5000)) // Max 5 seconds after animations
        ])
        
        if (apiResponse && !isCompleted) {
          isCompleted = true
          clearTimeout(timeoutId)
          
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('siteContent', JSON.stringify(apiResponse.data.site.content))
          }
          router.push('/admin')
        } else if (apiError && !isCompleted) {
          isCompleted = true
          clearTimeout(timeoutId)
          setFailed(true)
          setErrorMessage('Failed to generate site. Using fallback content instead.')
          useFallback()
          setTimeout(() => {
            router.push('/admin')
          }, 1000)
        } else if (!isCompleted) {
          // Still waiting, but timeout will handle it
          console.log('Still waiting for API response...')
        }
      } catch (error) {
        if (!isCompleted) {
          isCompleted = true
          clearTimeout(timeoutId)
          console.error('Site generation error:', error)
          setFailed(true)
          setErrorMessage('Failed to generate site. Using fallback content instead.')
          useFallback()
          setTimeout(() => {
            router.push('/admin')
          }, 1000)
        }
      }
    }
    
    generateSite()
    
    // Cleanup timeout on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const businessDetails = JSON.parse(sessionStorage.getItem('businessDetails') || '{}')
        if (businessDetails?.primaryColor) {
          setPrimaryColor(businessDetails.primaryColor)
        }
      } catch (e) {
        // Ignore
      }
    }
  }, [])
  
  return (
    <div style={{ minHeight: '100vh', background: '#09090B', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 60%)`, filter: 'blur(80px)' }} />
      </div>
      
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '500px', padding: 'clamp(24px, 5vw, 48px)', width: '100%' }}>
        <div style={{ position: 'relative', width: 'clamp(80px, 15vw, 120px)', height: 'clamp(80px, 15vw, 120px)', margin: '0 auto clamp(24px, 5vw, 40px)' }}>
          <div style={{ position: 'absolute', inset: 0, border: '3px solid rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: primaryColor, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <div style={{ position: 'absolute', inset: '8px', border: '3px solid transparent', borderTopColor: `${primaryColor}60`, borderRadius: '50%', animation: 'spin 1.5s linear infinite reverse' }} />
          <div style={{ position: 'absolute', inset: '20px', background: `${primaryColor}15`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 'clamp(28px, 6vw, 40px)' }}>{stages[stage]?.icon}</span>
          </div>
        </div>
        
        <h2 className="jakarta" style={{ fontSize: 'clamp(24px, 5vw, 28px)', fontWeight: 700, marginBottom: '10px' }}>
          {failed ? 'Generation Failed' : 'Building Your Website'}
        </h2>
        <p style={{ color: failed ? '#EF4444' : '#71717A', fontSize: 'clamp(14px, 3vw, 16px)', marginBottom: 'clamp(24px, 5vw, 40px)', minHeight: '24px' }}>
          {failed ? errorMessage : stages[stage]?.label}
        </p>
        
        {failed && (
          <div style={{ 
            marginTop: '20px', 
            padding: '16px', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            borderRadius: '8px',
            color: '#EF4444',
            fontSize: 'clamp(12px, 2.5vw, 14px)'
          }}>
            ⚠️ Using fallback content. You can edit everything in the admin panel.
          </div>
        )}
        
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '12px' }}>
          <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${primaryColor}, ${primaryColor}CC)`, borderRadius: '2px', transition: 'width 0.5s ease' }} />
        </div>
        
        <p style={{ color: '#52525B', fontSize: 'clamp(11px, 2.5vw, 13px)' }}>{Math.round(progress)}% complete</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: 'clamp(24px, 4vw, 32px)', flexWrap: 'wrap' }}>
          {stages.map((_, i) => (
            <div key={i} style={{ width: 'clamp(6px, 1.5vw, 8px)', height: 'clamp(6px, 1.5vw, 8px)', borderRadius: '50%', background: i <= stage ? primaryColor : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
          ))}
        </div>
        
        {/* Skip button - appears after 30 seconds */}
        {!failed && progress > 50 && (
          <button
            onClick={() => {
              const businessDetails = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('businessDetails') || '{}') : {}
              const selectedBusiness = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('selectedBusiness') || '{}') : {}
              
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
            }}
            style={{
              marginTop: '32px',
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              color: '#A1A1AA',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)'
              e.target.style.color = '#FAFAFA'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.05)'
              e.target.style.color = '#A1A1AA'
            }}
          >
            Skip to Admin →
          </button>
        )}
      </div>
    </div>
  )
}