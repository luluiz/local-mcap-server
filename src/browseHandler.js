const fs = require("fs");
const path = require("path");

const generateFileList = (currentPath, relativePath) => {
  try {
    const items = fs.readdirSync(currentPath);

    const filesAndFolders = items.map((item) => {
      const itemPath = path.join(currentPath, item);
      const relativeItemPath = path.join(relativePath, item);
      const isDirectory = fs.statSync(itemPath).isDirectory();

      return isDirectory
        ? `<li>📁 <a href="/browse/${relativeItemPath}">${item}/</a></li>`
        : `<li>📄 <a href="/files/${relativeItemPath}" target="_blank">${item}</a></li>`;
    });

    return filesAndFolders.join("");
  } catch (error) {
    return `<p style="color: red;">Error to list files: ${error.message}</p>`;
  }
};

const browseHandler = (req, res) => {
  let relativePath = req.params[0] || "";
  let currentPath = path.join(req.baseFolder, relativePath);

  if (!currentPath.startsWith(req.baseFolder)) {
    return res.status(403).send("Forbidden");
  }

  if (!fs.existsSync(currentPath)) {
    return res.status(404).send("Directory not found");
  }

  let parentPath = path.dirname(relativePath);
  let backButton = relativePath
    ? `<li>⬅️ <a href="/browse/${parentPath}">Back</a></li>`
    : "";

  let fileList = generateFileList(currentPath, relativePath);

  res.send(`
    <html>
      <head>
        <title>Available Files</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          ul { list-style: none; padding: 0; }
          li { margin: 8px 0; font-size: 18px; }s
          a { text-decoration: none; color: blue; }
          a:hover { text-decoration: underline; }
          .container { max-width: 800px; margin: auto; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>📂 Files in: /${relativePath || ""}</h1>
          <ul>${backButton}${fileList}</ul>
        </div>
      </body>
    </html>
  `);
};

module.exports = browseHandler;
