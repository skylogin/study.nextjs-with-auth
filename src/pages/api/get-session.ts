import { parse } from "cookie";
import { NextApiRequest, NextApiResponse } from "next";
import { decode } from "@/lib/jwt";

export default function GetSession(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(404).end();
  }

  const { my_auth } = parse(req.headers.cookie || "");

  if (!my_auth) {
    return res.json({ loggedIn: false });
  }

  return res.json({
    loggedIn: true,
    user: decode(my_auth),
  });
}
