import express from "express";
import vhost from "vhost";
import { companyApp } from "./src/company-app";
import { blogApp, ejsApp } from "./src/internal-apps";
export const PORT = 3000;

const mainApp = express();
mainApp.set("subdomain offset", 1);

/* SERVING STATIC RESOURCES */
// !IMPORTANT DONOT use default routing, it will override `vhost` middleware
// mainApp.use("/", express.static("public"));

// http://blog.localhost.local:3000/
mainApp.use(vhost("blog.*.*", blogApp)); // OR:
// mainApp.use(vhost("blog.*.*", express.static("blog")));

// http://localhost.local:3000/
mainApp.use(vhost("*.*", express.static("public")));
/* END SERVING STATIC RESOURCES */

// Do not know how `vhost` distingush between the same "*.*" pattern.
// Maybe when static resourse app fails to resolve, it falls back to this ejsApp
mainApp.use(vhost("*.*", ejsApp));

/**
 * http://my-comp.localhost.local:3000/
 */
mainApp.use(vhost("*.*.*", companyApp));

mainApp.listen(PORT, () => {
  console.log(`Example app listening at http://localhost.local:${PORT}`);
});
