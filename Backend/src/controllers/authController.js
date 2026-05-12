const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = require("../config/db");
const asyncWrapper = require("../utils/asyncWrapper");
const { createError } = require("../utils/errorHandler");

const cookieName = "token";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
});

const signToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw createError("JWT_SECRET is not configured", 500);
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

const toSafeUser = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const register = asyncWrapper(async (req, res) => {
  const { email, password, name } = req.body || {};

  if (!email || !password) {
    throw createError("Email and password are required", 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (existingUser) {
    throw createError("Email is already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      password: hashedPassword,
      name: name ? String(name).trim() : null,
    },
  });

  res.status(201).json({ user: toSafeUser(user) });
});

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    throw createError("Email and password are required", 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    throw createError("Invalid credentials", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw createError("Invalid credentials", 401);
  }

  const token = signToken(user.id);
  res.cookie(cookieName, token, getCookieOptions());
  res.status(200).json({ token, user: toSafeUser(user) });
});

const logout = asyncWrapper(async (_req, res) => {
  res.clearCookie(cookieName, getCookieOptions());
  res.status(200).json({ message: "Logged out successfully" });
});

module.exports = {
  register,
  login,
  logout,
  cookieName,
  getCookieOptions,
  signToken,
};
