function Error({ statusCode }) {
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
      <div style={{ fontSize: '120px', marginBottom: '20px' }}>⚠️</div>
      <h1 style={{ 
        fontSize: '48px', 
        fontWeight: 800, 
        marginBottom: '16px',
        color: '#FFFFFF'
      }}>
        {statusCode ? `Error ${statusCode}` : 'An Error Occurred'}
      </h1>
      <p style={{ 
        fontSize: '18px', 
        color: '#A1A1AA', 
        marginBottom: '32px',
        maxWidth: '500px'
      }}>
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : 'An error occurred on client'}
      </p>
    </div>
  )
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error