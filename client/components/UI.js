// Reusable UI Components
export const Button = ({ children, variant = 'primary', size = 'md', disabled, onClick, style, className, type, ...props }) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    borderRadius: '10px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
    border: 'none',
    fontFamily: 'inherit',
    opacity: disabled ? 0.5 : 1,
  };
  
  const sizes = {
    sm: { padding: '8px 16px', fontSize: '13px' },
    md: { padding: '12px 24px', fontSize: '14px' },
    lg: { padding: '16px 32px', fontSize: '15px' },
    xl: { padding: '18px 40px', fontSize: '16px' },
  };
  
  const variants = {
    primary: { background: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)', color: '#fff', boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)' },
    secondary: { background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' },
    ghost: { background: 'transparent', color: '#A1A1AA' },
    danger: { background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', border: '1px solid rgba(239, 68, 68, 0.2)' },
    success: { background: 'rgba(16, 185, 129, 0.1)', color: '#10B981', border: '1px solid rgba(16, 185, 129, 0.2)' },
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-primary ${className || ''}`}
      style={{ ...baseStyles, ...sizes[size], ...variants[variant], ...style }}
      onMouseEnter={e => { if (!disabled) e.target.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; }}
      {...props}
    >
      {children}
    </button>
  );
};

export const Input = ({ label, error, ...props }) => (
  <div style={{ marginBottom: '20px' }}>
    {label && <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#A1A1AA', marginBottom: '8px' }}>{label}</label>}
    <input
      {...props}
      style={{
        width: '100%',
        padding: '14px 16px',
        background: 'rgba(255,255,255,0.03)',
        border: `1px solid ${error ? '#EF4444' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '10px',
        color: '#FAFAFA',
        fontSize: '15px',
        transition: 'all 0.2s',
        ...props.style,
      }}
    />
    {error && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '6px' }}>{error}</p>}
  </div>
);

export const Card = ({ children, hover, onClick, style, className, ...props }) => (
  <div
    onClick={onClick}
    className={`glass ${className || ''}`}
    style={{
      padding: '24px',
      borderRadius: '16px',
      transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}
    onMouseEnter={e => {
      if (hover) {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
      }
    }}
    onMouseLeave={e => {
      if (hover) {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
        e.currentTarget.style.boxShadow = 'none';
      }
    }}
    {...props}
  >
    {children}
  </div>
);

export const Badge = ({ children, color = '#6366F1', style }) => (
  <span style={{
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    background: `${color}15`,
    border: `1px solid ${color}30`,
    borderRadius: '100px',
    fontSize: '12px',
    fontWeight: 600,
    color: color,
    ...style,
  }}>
    {children}
  </span>
);