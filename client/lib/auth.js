import jwt from 'jsonwebtoken';

// Verify JWT token middleware for Next.js API routes
export function verifyToken(req) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return { error: 'No token provided', status: 401 };
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key-change-in-production'
    );

    return { userId: decoded.userId, email: decoded.email };
  } catch (error) {
    return { error: 'Invalid or expired token', status: 401 };
  }
}