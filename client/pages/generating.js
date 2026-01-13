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
  const [debugInfo, setDebugInfo] = useState({
    status: 'Initializing...',
    apiCallStarted: false,
    apiCallCompleted: false,
    apiError: null,
    timeoutReached: false,
    sessionStorageData: null,
    currentTime: new Date().toISOString()
  })
  
  const stages = [
    { label: 'Analyzing business requirements', icon: '🔍' },
    { label: 'Generating website structure', icon: '🏗️' },
    { label: 'Creating compelling content', icon: '✍️' },
    { label: 'Designing visual elements', icon: '🎨' },
    { label: 'Optimizing for performance', icon: '⚡' },
    { label: 'Finalizing your website', icon: '✨' },
  ]
  
  useEffect(() => {
    // Get primary color from sessionStorage
    if (typeof window !== 'undefined') {
      try {
        const businessDetails = JSON.parse(sessionStorage.getItem('businessDetails') || '{}')
        const selectedBusiness = JSON.parse(sessionStorage.getItem('selectedBusiness') || '{}')
        const siteContent = sessionStorage.getItem('siteContent')
        
        console.log('🔍 [DEBUG] SessionStorage Data:', {
          businessDetails,
          selectedBusiness,
          hasSiteContent: !!siteContent,
          siteContentLength: siteContent?.length || 0
        })
        
        setDebugInfo(prev => ({
          ...prev,
          sessionStorageData: {
            hasBusinessDetails: Object.keys(businessDetails).length > 0,
            hasSelectedBusiness: Object.keys(selectedBusiness).length > 0,
            hasSiteContent: !!siteContent,
            businessName: businessDetails.businessName
          }
        }))
        
        if (businessDetails?.primaryColor) {
          setPrimaryColor(businessDetails.primaryColor)
        }
      } catch (e) {
        console.error('❌ [DEBUG] Error reading sessionStorage:', e)
      }
    }
  }, [])
  
  useEffect(() => {
    console.log('🚀 [DEBUG] Generating component mounted, starting site generation...')
    
    let isMounted = true
    let timeoutId
    let animationInterval
    const startTime = Date.now()
    
    const generateSite = async () => {
      console.log('📝 [DEBUG] generateSite function called')
      
      const businessDetails = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('businessDetails') || '{}') : {}
      const selectedBusiness = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('selectedBusiness') || '{}') : {}
      
      console.log('📋 [DEBUG] Business Details:', {
        businessName: businessDetails.businessName,
        businessType: selectedBusiness.name,
        hasBusinessDetails: Object.keys(businessDetails).length > 0,
        hasSelectedBusiness: Object.keys(selectedBusiness).length > 0
      })
      
      const useFallback = () => {
        console.log('⚠️ [DEBUG] Using fallback content')
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
          console.log('💾 [DEBUG] Saving fallback content to sessionStorage')
          sessionStorage.setItem('siteContent', JSON.stringify(fallback))
          console.log('✅ [DEBUG] Fallback content saved, size:', JSON.stringify(fallback).length, 'bytes')
        }
        return fallback
      }
      
      // Set timeout (2 minutes)
      console.log('⏱️ [DEBUG] Setting 2-minute timeout')
      timeoutId = setTimeout(() => {
        if (isMounted && !failed) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
          console.error(`⏰ [DEBUG] Site generation timed out after ${elapsed} seconds (2 minutes)`)
          setDebugInfo(prev => ({ ...prev, timeoutReached: true, status: 'Timeout reached' }))
          setFailed(true)
          setErrorMessage('Site generation took too long. Using fallback content instead.')
          setStage(stages.length - 1)
          setProgress(100)
          useFallback()
          
          setTimeout(() => {
            if (isMounted) {
              console.log('🔄 [DEBUG] Redirecting to admin after timeout')
              router.push('/admin')
            }
          }, 1000)
        }
      }, 120000)
      
      // Animate progress
      console.log('🎬 [DEBUG] Starting animation')
      let currentStage = 0
      animationInterval = setInterval(() => {
        if (isMounted && currentStage < stages.length) {
          console.log(`🎯 [DEBUG] Animation stage ${currentStage + 1}/${stages.length}: ${stages[currentStage].label}`)
          setStage(currentStage)
          setProgress(((currentStage + 1) / stages.length) * 100)
          setDebugInfo(prev => ({ ...prev, status: `Animating: ${stages[currentStage].label}` }))
          currentStage++
        } else {
          if (animationInterval) {
            console.log('✅ [DEBUG] Animation completed')
            clearInterval(animationInterval)
          }
        }
      }, 700)
      
      // Start API call
      console.log('🌐 [DEBUG] Starting API call to siteAPI.generate()')
      setDebugInfo(prev => ({ ...prev, apiCallStarted: true, status: 'Calling API...' }))
      const apiStartTime = Date.now()
      
      try {
        const response = await siteAPI.generate()
        const apiDuration = ((Date.now() - apiStartTime) / 1000).toFixed(2)
        
        console.log('✅ [DEBUG] API call successful!', {
          duration: `${apiDuration}s`,
          hasResponse: !!response,
          hasData: !!response?.data,
          hasSite: !!response?.data?.site,
          hasContent: !!response?.data?.site?.content,
          contentKeys: response?.data?.site?.content ? Object.keys(response.data.site.content) : [],
          contentSize: response?.data?.site?.content ? JSON.stringify(response.data.site.content).length : 0
        })
        
        if (!isMounted) {
          console.log('⚠️ [DEBUG] Component unmounted, aborting')
          return
        }
        
        // Clear timeout and interval
        if (timeoutId) {
          console.log('🧹 [DEBUG] Clearing timeout')
          clearTimeout(timeoutId)
        }
        if (animationInterval) {
          console.log('🧹 [DEBUG] Clearing animation interval')
          clearInterval(animationInterval)
        }
        
        // Complete animation
        console.log('🎯 [DEBUG] Completing animation')
        setStage(stages.length - 1)
        setProgress(100)
        setDebugInfo(prev => ({ 
          ...prev, 
          apiCallCompleted: true, 
          status: 'API call completed successfully',
          apiDuration: `${apiDuration}s`
        }))
        
        // Save to sessionStorage
        if (typeof window !== 'undefined') {
          console.log('💾 [DEBUG] Saving site content to sessionStorage')
          const contentString = JSON.stringify(response.data.site.content)
          sessionStorage.setItem('siteContent', contentString)
          console.log('✅ [DEBUG] Site content saved to sessionStorage, size:', contentString.length, 'bytes')
          setDebugInfo(prev => ({ ...prev, sessionStorageData: { ...prev.sessionStorageData, hasSiteContent: true, contentSize: contentString.length } }))
        }
        
        // Redirect after brief delay
        setTimeout(() => {
          if (isMounted) {
            console.log('🔄 [DEBUG] Redirecting to admin page (success)')
            router.push('/admin')
          }
        }, 500)
      } catch (error) {
        const apiDuration = ((Date.now() - apiStartTime) / 1000).toFixed(2)
        
        console.error('❌ [DEBUG] Site generation error:', {
          error,
          message: error?.message,
          response: error?.response,
          status: error?.response?.status,
          data: error?.response?.data,
          duration: `${apiDuration}s`
        })
        
        if (!isMounted) {
          console.log('⚠️ [DEBUG] Component unmounted, aborting error handling')
          return
        }
        
        // Clear timeout and interval
        if (timeoutId) {
          console.log('🧹 [DEBUG] Clearing timeout after error')
          clearTimeout(timeoutId)
        }
        if (animationInterval) {
          console.log('🧹 [DEBUG] Clearing animation interval after error')
          clearInterval(animationInterval)
        }
        
        // Use fallback
        console.log('⚠️ [DEBUG] Using fallback content due to error')
        setFailed(true)
        setErrorMessage('Failed to generate site. Using fallback content instead.')
        setStage(stages.length - 1)
        setProgress(100)
        setDebugInfo(prev => ({ 
          ...prev, 
          apiError: error?.message || 'Unknown error',
          status: 'API call failed, using fallback',
          apiDuration: `${apiDuration}s`
        }))
        useFallback()
        
        // Redirect after brief delay
        setTimeout(() => {
          if (isMounted) {
            console.log('🔄 [DEBUG] Redirecting to admin page (error/fallback)')
            router.push('/admin')
          }
        }, 1000)
      }
    }
    
    generateSite()
    
    return () => {
      console.log('🧹 [DEBUG] Component unmounting, cleaning up')
      isMounted = false
      if (timeoutId) {
        console.log('🧹 [DEBUG] Clearing timeout on unmount')
        clearTimeout(timeoutId)
      }
      if (animationInterval) {
        console.log('🧹 [DEBUG] Clearing animation interval on unmount')
        clearInterval(animationInterval)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  
  return (
    <div style={{ minHeight: '100vh', background: '#09090B', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 60%)`, filter: 'blur(80px)' }} />
      </div>
      
      <div style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '500px', padding: 'clamp(24px, 5vw, 48px)', width: '100%' }}>
        <div style={{ position: 'relative', width: 'clamp(80px, 15vw, 120px)', height: 'clamp(80px, 15vw, 120px)', margin: '0 auto clamp(24px, 5vw, 40px)' }}>
          <div style={{ position: 'absolute', inset: 0, border: '3px solid rgba(255,255,255,0.05)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', inset: 0, border: '3px solid transparent', borderTopColor: primaryColor, borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <div style={{ position: 'absolute', inset: '20%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 'clamp(32px, 6vw, 48px)' }}>
            {stages[stage]?.icon || '✨'}
          </div>
        </div>
        
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, marginBottom: 'clamp(12px, 3vw, 20px)', color: '#FAFAFA' }}>
          {failed ? 'Generation Failed' : 'Building Your Site'}
        </h1>
        
        <p style={{ fontSize: 'clamp(16px, 3vw, 18px)', color: '#A1A1AA', marginBottom: 'clamp(24px, 5vw, 40px)' }}>
          {failed ? errorMessage : stages[stage]?.label || 'Initializing...'}
        </p>
        
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden', marginBottom: 'clamp(16px, 3vw, 24px)' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: primaryColor, transition: 'width 0.3s ease', borderRadius: '2px' }} />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: 'clamp(24px, 4vw, 32px)', flexWrap: 'wrap' }}>
          {stages.map((_, i) => (
            <div key={i} style={{ width: 'clamp(6px, 1.5vw, 8px)', height: 'clamp(6px, 1.5vw, 8px)', borderRadius: '50%', background: i <= stage ? primaryColor : 'rgba(255,255,255,0.1)', transition: 'all 0.3s' }} />
          ))}
        </div>
        
        {failed && (
          <button
            onClick={() => {
              console.log('🔄 [DEBUG] Manual redirect to admin clicked')
              router.push('/admin')
            }}
            style={{
              marginTop: '32px',
              padding: '12px 24px',
              background: primaryColor,
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.opacity = '0.9'
            }}
            onMouseLeave={(e) => {
              e.target.style.opacity = '1'
            }}
          >
            Continue to Admin →
          </button>
        )}
        
        {/* Debug Panel */}
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0,0,0,0.9)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          padding: '16px',
          maxWidth: '400px',
          fontSize: '12px',
          fontFamily: 'monospace',
          color: '#fff',
          zIndex: 1000,
          maxHeight: '300px',
          overflow: 'auto'
        }}>
          <div style={{ fontWeight: 700, marginBottom: '8px', color: primaryColor }}>🐛 DEBUG INFO</div>
          <div style={{ marginBottom: '4px' }}>Status: <span style={{ color: failed ? '#EF4444' : '#10B981' }}>{debugInfo.status}</span></div>
          <div style={{ marginBottom: '4px' }}>Progress: {progress.toFixed(1)}%</div>
          <div style={{ marginBottom: '4px' }}>Stage: {stage + 1}/{stages.length}</div>
          <div style={{ marginBottom: '4px' }}>API Started: {debugInfo.apiCallStarted ? '✅' : '❌'}</div>
          <div style={{ marginBottom: '4px' }}>API Completed: {debugInfo.apiCallCompleted ? '✅' : '❌'}</div>
          {debugInfo.apiDuration && <div style={{ marginBottom: '4px' }}>API Duration: {debugInfo.apiDuration}</div>}
          {debugInfo.apiError && <div style={{ marginBottom: '4px', color: '#EF4444' }}>API Error: {debugInfo.apiError}</div>}
          {debugInfo.timeoutReached && <div style={{ marginBottom: '4px', color: '#F59E0B' }}>⏰ Timeout Reached</div>}
          {debugInfo.sessionStorageData && (
            <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ marginBottom: '4px', fontWeight: 600 }}>SessionStorage:</div>
              <div style={{ marginBottom: '2px' }}>Business: {debugInfo.sessionStorageData.hasBusinessDetails ? '✅' : '❌'}</div>
              <div style={{ marginBottom: '2px' }}>Business Type: {debugInfo.sessionStorageData.hasSelectedBusiness ? '✅' : '❌'}</div>
              <div style={{ marginBottom: '2px' }}>Site Content: {debugInfo.sessionStorageData.hasSiteContent ? '✅' : '❌'}</div>
              {debugInfo.sessionStorageData.businessName && <div style={{ marginBottom: '2px' }}>Name: {debugInfo.sessionStorageData.businessName}</div>}
              {debugInfo.sessionStorageData.contentSize && <div style={{ marginBottom: '2px' }}>Content Size: {debugInfo.sessionStorageData.contentSize} bytes</div>}
            </div>
          )}
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', color: '#71717A' }}>
            Check console for detailed logs
          </div>
        </div>
      </div>
    </div>
  )
}
