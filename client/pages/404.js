import { useRouter } from 'next/router'
import { Button } from '../components/UI'

export default function Custom404() {
  const router = useRouter()
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#09090B',
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{ fontSize: '120px', marginBottom: '20px' }}>🔍</div>
      <h1 style={{ 
        fontSize: '48px', 
        fontWeight: 800, 
        marginBottom: '16px',
        color: '#FFFFFF'
      }}>
        Page Not Found
      </h1>
      <p style={{ 
        fontSize: '18px', 
        color: '#A1A1AA', 
        marginBottom: '32px',
        maxWidth: '500px'
      }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button onClick={() => router.push('/')}>
        Go Home
      </Button>
    </div>
  )
}