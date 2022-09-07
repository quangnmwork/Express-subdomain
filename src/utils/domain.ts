import { Request } from "express";
import { PORT } from "../../app";

type Domain = {
  sub: string;
  domain: string;
  ext: string;
};

//@ts-ignore
export const getPortPostfix = () => (PORT === 80 ? "" : ":" + PORT);

const getDomainParts = (hostname: string): Domain => {
  let domainParts = hostname.split(".");
  const domainExt = domainParts.pop() || "";
  const domain = domainParts.pop() || "";
  const sub = domainParts.length > 0 ? domainParts.pop() || "" : "";
  return { sub, domain, ext: domainExt };
};

export const getCurrentSubdomain = (hostname: string): string => {
  const domain = getDomainParts(hostname);
  return domain.sub;
};

/**
 * Gets the full URL http://sub.domain.com:1234
 */
export const getFullUrlForSubdomain = (
  req: Request,
  subdomain: string | undefined
) => {
  let domain = getDomainParts(req.hostname);
  const sub = subdomain ? subdomain + "." : "";
  return `${req.protocol}://${sub}${domain.domain}.${
    domain.ext
  }${getPortPostfix()}`;
};

export const getFullUrlNoSubdomain = (req: Request) => {
  let domain = getDomainParts(req.hostname);
  return `${req.protocol}://${domain.domain}.${domain.ext}${getPortPostfix()}`;
};
