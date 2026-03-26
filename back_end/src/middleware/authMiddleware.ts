/* ==============================
   MIDDLEWARE AUTH
================================*/
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token não enviado" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token inválido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET_KEY");

    (req as any).admin = decoded;

    next();
  } catch (err) {
    console.log("ERRO JWT", err);

    return res.status(401).json({ message: "Token inválido" });
  }
};
