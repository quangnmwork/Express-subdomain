import { Request } from "express";
import { User } from "../services/UserService";
import { getCurrentSubdomain } from "./domain";
import { decodeToken, verifyToken } from "./jwt";

export const JWT_COOKIE_NAME = "auth";

const getTokenFromCookie = (fullCookie: string | undefined): string | null => {
  if (!fullCookie) return null;
  const cookies = fullCookie.split(";").map((str) => str.trim());

  const cookiePrefix = JWT_COOKIE_NAME + "=";
  const tokens = cookies.filter((c) => c.startsWith(cookiePrefix));
  if (tokens.length === 0) return null;
  return tokens[0].replace(cookiePrefix, "");
};

export const getUserFromCookie = (req: Request): User | null => {
  const token = getTokenFromCookie(req.headers.cookie);
  if (!token || !verifyToken(token)) return null;
  return decodeToken(token) as User;
};

export const verifyAuthCookieAndDomain = (req: Request): boolean => {
  const token = getTokenFromCookie(req.headers.cookie);
  if (!token) return false;
  const cookieUser = decodeToken(token) as User;
  if (!cookieUser) return false;
  const subdomain = cookieUser.subdomain || "";
  const currentSubdomain = getCurrentSubdomain(req.hostname);
  return subdomain == currentSubdomain;
};
