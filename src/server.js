require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const browseHandler = require("./browseHandler");

const PORT = process.env.PORT || 8081;
const HOST = process.env.HOST || "localhost";
const BASE_FOLDER = process.env.BASE_FOLDER || "/";

/**
 * MIDDLEWARES
 */
const app = express();
app.use((req, _res, next) => {
  const timestamp = new Date().toISOString().split(".")[0];
  const clientIp =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  console.log(`[${timestamp}] ${clientIp} - ${req.method} ${req.url}`);
  next();
});
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: "*",
    exposedHeaders: ["Accept-Ranges", "Content-Range", "Content-Length"],
    credentials: true,
  })
);
app.use(express.static(BASE_FOLDER, { acceptRanges: true }));
app.use((_req, res, next) => {
  res.setHeader("Accept-Ranges", "bytes");
  next();
});

/**
 * ROUTES
 */

app.get("/browse/*", browseHandler);

app.get("/files/*", (req, res) => {
  let relativePath = req.params[0];
  let filePath = path.join(BASE_FOLDER, relativePath);

  if (!filePath.startsWith(BASE_FOLDER)) {
    return res.status(403).send("Forbidden");
  }

  res.sendFile(filePath);
});

app.get("/", (_req, res) => {
  res.redirect("/browse/");
});

app.listen(PORT, () => {
  console.clear();
  console.log(`🚀 Server running: http://${HOST}:${PORT}/browse/ \n`);
});
