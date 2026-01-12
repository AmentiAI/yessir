import { useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Input, Card, Badge } from '../components/UI'
import { authAPI } from '../lib/api'

export default function Auth() {
  const router = useRouter()
  const [authType, setAuthType] = useState(router.query.type || 'signup')
  const [formData, setFormData] = useState({ name: '', email: '', password: '', company: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  
  const validate = () => {
    const newErrors = {}
    if (authType === 'signup' && !formData.name) newErrors.name = 'Name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    
    setLoading(true)
    try {
      const response = authType === 'signup' 
        ? await authAPI.signup(formData)
        : await authAPI.login({ email: formData.email, password: formData.password })
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
      }
      
      router.push('/select-business')
    } catch (error) {
      const message = error.response?.data?.error || 'An error occurred'
      setErrors({ email: message })
      setLoading(false)
    }
  }
  
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#09090B', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '20%', right: '20%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 60%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', left: '20%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 60%)', filter: 'blur(60px)' }} />
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '64px', position: 'relative', zIndex: 10 }}>
        <button onClick={() => router.push('/')} style={{ position: 'absolute', top: '32px', left: '32px', display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#71717A', fontSize: '14px', cursor: 'pointer' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back
        </button>
        
        <div style={{ maxWidth: '480px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>⚡</div>
            <span className="jakarta" style={{ fontSize: '28px', fontWeight: 800 }}>SiteForge</span>
          </div>
          
          <h1 className="jakarta" style={{ fontSize: '44px', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1.5px', marginBottom: '20px' }}>
            {authType === 'signup' ? 'Start building your dream website' : 'Welcome back'}
          </h1>
          <p style={{ fontSize: '17px', color: '#71717A', lineHeight: 1.7 }}>
            {authType === 'signup' 
              ? 'Join thousands of businesses using AI to create stunning websites in minutes.'
              : 'Sign in to continue managing your websites and projects.'
            }
          </p>
          
          {authType === 'signup' && (
            <div style={{ marginTop: '48px', display: 'flex', gap: '24px' }}>
              {['50K+ Sites', '99.9% Uptime', '24/7 Support'].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#52525B', fontSize: '13px' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2"><path d="M20 6L9 17l-5-5"/></svg>
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', position: 'relative', zIndex: 10 }}>
        <Card className="animate-scale glass-strong" style={{ width: '100%', maxWidth: '420px', padding: '40px' }}>
          <h2 className="jakarta" style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
            {authType === 'signup' ? 'Create your account' : 'Sign in'}
          </h2>
          <p style={{ color: '#71717A', fontSize: '14px', marginBottom: '32px' }}>
            {authType === 'signup' ? 'Get started with a free account' : 'Enter your credentials to continue'}
          </p>
          
          <form onSubmit={handleSubmit}>
            {authType === 'signup' && (
              <Input
                label="Full Name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                error={errors.name}
              />
            )}
            
            <Input
              label="Email Address"
              type="email"
              placeholder="you@company.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              error={errors.email}
            />
            
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              error={errors.password}
            />
            
            {authType === 'signup' && (
              <Input
                label="Company (Optional)"
                type="text"
                placeholder="Your company name"
                value={formData.company}
                onChange={e => setFormData({ ...formData, company: e.target.value })}
              />
            )}
            
            <Button
              type="submit"
              disabled={loading}
              style={{ width: '100%', marginTop: '8px' }}
              size="lg"
            >
              {loading ? (
                <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              ) : (
                authType === 'signup' ? 'Create Account' : 'Sign In'
              )}
            </Button>
          </form>
          
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <span style={{ color: '#71717A', fontSize: '14px' }}>
              {authType === 'signup' ? 'Already have an account? ' : "Don't have an account? "}
            </span>
            <button
              onClick={() => setAuthType(authType === 'signup' ? 'login' : 'signup')}
              style={{ background: 'none', border: 'none', color: '#6366F1', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
            >
              {authType === 'signup' ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
}