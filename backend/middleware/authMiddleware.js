const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }
    // Verify token here...
    next();
  };
  
  module.exports = authMiddleware;
  