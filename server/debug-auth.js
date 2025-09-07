// Debug script to test authentication
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Get JWT_SECRET from env
dotenv.config({ path: "../.env" });
const JWT_SECRET = process.env.JWT_SECRET;

console.log("JWT_SECRET exists:", !!JWT_SECRET);

// Test token verification for user ID 1
if (JWT_SECRET) {
  const testToken = jwt.sign({ userId: 1 }, JWT_SECRET, { expiresIn: "24h" });
  console.log("Generated test token:", testToken);

  // Verify the token
  try {
    const decoded = jwt.verify(testToken, JWT_SECRET);
    console.log("Token verification successful:", decoded);
  } catch (error) {
    console.log("Token verification failed:", error.message);
  }
} else {
  console.log("JWT_SECRET is missing from environment variables");
}
