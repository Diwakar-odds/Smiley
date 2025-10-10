// middleware/adminMiddleware.js
// Middleware to check if user has admin role

export const adminOnly = (req, res, next) => {
  try {
    // Check if user exists (should be set by authenticateToken middleware)
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user has admin role
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // User is admin, continue to next middleware
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.status(500).json({ message: 'Server error in admin middleware' });
  }
};

export default adminOnly;
