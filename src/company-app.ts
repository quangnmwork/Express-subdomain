import express from "express";
import { getUserFromCookie, verifyAuthCookieAndDomain } from "./utils/cookie";
import { getFullUrlNoSubdomain, getPortPostfix } from "./utils/domain";

const companyApp = express();
companyApp.set("view engine", "ejs");

companyApp.use("/", (req, res) => {
  const [subdomain, domain, domainExt] = req.hostname.split(".");
  const originalUrl = `${
    req.protocol
  }://${domain}.${domainExt}${getPortPostfix()}`;

  if (verifyAuthCookieAndDomain(req)) {
    const user = getUserFromCookie(req);
    if (!user) throw new Error("User data could not be read, but it should.");
    res.render("pages/dashboard", { user, subdomain, domain, originalUrl });
  } else {
    res.redirect(getFullUrlNoSubdomain(req) + "/login");
  }
});

export { companyApp };
