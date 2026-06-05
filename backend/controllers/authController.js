const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const insertUser = `
      INSERT INTO users (name, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, streak_count
    `;
    const result = await db.query(insertUser, [name, email, passwordHash]);
    const user = result.rows[0];

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const userQuery = `SELECT id, name, email, password_hash FROM users WHERE email = $1`;
    const result = await db.query(userQuery, [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ user: { id: user.id, name: user.name, email: user.email }, token });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, register };
