const jwt = require("jsonwebtoken");

const auth = (...roles) => {
  return (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      return next();
    } catch (_err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

module.exports = auth;