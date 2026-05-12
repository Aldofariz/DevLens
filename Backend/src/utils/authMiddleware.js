const jwt = require("jsonwebtoken");
const { createError } = require("./errorHandler");

const getTokenFromRequest = (req) => {
  if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }

  const authHeader = req.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  return null;
};

const authMiddleware = (req, _res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return next(createError("Authentication required", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    return next();
  } catch (_error) {
    return next(createError("Invalid or expired token", 401));
  }
};

authMiddleware.getTokenFromRequest = getTokenFromRequest;

module.exports = authMiddleware;
