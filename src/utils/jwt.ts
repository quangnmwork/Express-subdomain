import jwt, { Jwt } from "jsonwebtoken";

const sc = "T=W5#gDGq6dUO^8FC61g4rt2InfK8BEuE+H=6p5_kkx0UUo*EB*s8-RxEz$Y*5_9";
const expiresIn = Math.floor(Date.now() / 1000) + 60 * 60 * 24; // 24h
const algorithm = "HS512"; // RS*** is for public/private keys

// Authorization is the process of allowing authenticated users to access resources.
export const getToken = (payload: object): string => {
  return jwt.sign(payload, sc, { algorithm, expiresIn });
};

export const verifyToken = (token: string): boolean => {
  let isValid = true;
  jwt.verify(token, sc, { algorithms: [algorithm] }, (err, decoded) => {
    if (!decoded && err) {
      isValid = false;
    }
  });
  return isValid;
};

export const decodeToken = (token: string): object => {
  const decoded: Jwt | null = jwt.decode(token, { complete: true, json: true });
  return decoded?.payload as object;
};