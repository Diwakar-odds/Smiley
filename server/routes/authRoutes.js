// 👉 Register
export async function registerUser(req, res) {
  try {
    const { name, mobile, email, password } = req.body;
    if (!name || !mobile || !password) {
      return res
        .status(400)
        .json({ message: "Name, mobile, and password required" });
    }

    const existingUser = await User.findOne({ $or: [{ mobile }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, mobile, email, password: hashedPassword });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
}

// 👉 Profile (Protected)
export async function getProfile(req, res) {
  res.json({ user: req.user });
}
