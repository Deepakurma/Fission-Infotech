import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      user: formatUser(user),
      token: generateToken(user),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return res.json({
      user: formatUser(user),
      token: generateToken(user),
    });
  } catch (error) {
    next(error);
  }
};

const me = (req, res) => {
  res.json({ user: formatUser(req.user) });
};

export { login, me, register };
