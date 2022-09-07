import express from "express";
import bodyParser from "body-parser";
import { UserService } from "./services/UserService";
import { getFullUrlForSubdomain } from "./utils/domain";
import { getToken } from "./utils/jwt";
import cookieParser from "cookie-parser";
import { getUserFromCookie, JWT_COOKIE_NAME } from "./utils/cookie";

const blogApp = express();
blogApp.use("/", express.static("blog"));

const ejsApp = express();
ejsApp.set("view engine", "ejs");
ejsApp.use(bodyParser.urlencoded({ extended: false }));
ejsApp.use(cookieParser());

const userService = new UserService();
ejsApp.get("/login", (req, res) => {
  res.render("original/login");
});
ejsApp.post("/login", (req, res) => {
  const { email, password } = req.body;
  const isValid = userService.login(email, password);
  if (isValid) {
    const user = userService.getUser(email, password);
    if (!user) throw new Error("Cannot get user detail");
    const jwtToken = getToken({ ...user });

    res.cookie(JWT_COOKIE_NAME, jwtToken, {
      expires: new Date(Date.now() + 60 * 60 * 24 * 1000), // < 1d
      domain: "." + req.hostname,
    });
    res.redirect(getFullUrlForSubdomain(req, user?.subdomain));
  } else {
    res.render("original/login", {
      isValid,
    });
  }
});

ejsApp.use("/register", (req, res) => {
  res.render("original/register");
});

ejsApp.get("/logout", (req, res) => {
  res.clearCookie(JWT_COOKIE_NAME, {
    domain: "." + req.hostname,
  });
  res.redirect("/");
});

ejsApp.use("/", (req, res) => {
  const user = getUserFromCookie(req);
  const fullUrlSubdomain = user
    ? getFullUrlForSubdomain(req, user?.subdomain)
    : "";
  res.render("original/index", { user, fullUrlSubdomain });
});

export { blogApp, ejsApp };
