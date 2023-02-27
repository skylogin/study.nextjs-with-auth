import type { NextApiRequest, NextApiResponse } from "next";
import { encode } from "@/lib/jwt";
import { serialize } from "cookie";

export default function login(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { email, password } = req.body;

  if (method !== "POST") {
    return res.status(404).end();
  }

  if (!email || !password) {
    return res.status(400).json({
      error: "Missing required params",
    });
  }

  const user = authenticateUser({ email, password });

  if (user) {
    res.setHeader(
      "Set-Cookie",
      serialize("my_auth", user, { path: "/", httpOnly: true })
    );
    return res.json({ success: true });
  } else {
    return res.status(401).json({
      success: false,
      error: "Wrong email of password",
    });
  }
}

type LoginDto = {
  email: string;
  password: string;
};

function authenticateUser(loginDto: LoginDto) {
  const { email, password } = loginDto;
  const validEmail = "test@test.com";
  const validPassword = "test123";

  if (email === validEmail && password === validPassword) {
    return encode({
      id: "f678f078-fcfe-43ca-9d20-e8c9a95209b6",
      name: "tester",
      email: "test@test.com",
    });
  }

  return null;
}
