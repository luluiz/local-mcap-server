const fs = require("fs");
const path = require("path");

const generateFileList = (currentPath, relativePath) => {
  try {
    const items = fs.readdirSync(currentPath);
    const sortedItems = items
      .map((item) => {
        const itemPath = path.join(currentPath, item);
        return {
          name: item,
          path: itemPath,
          relativePath: path.join(relativePath, item),
          isDirectory: fs.statSync(itemPath).isDirectory(),
        };
      })
      .sort((a, b) => {
        if (a.isDirectory === b.isDirectory) {
          return a.name.localeCompare(b.name);
        }
        return a.isDirectory ? -1 : 1;
      });

    const filesAndFolders = sortedItems.map((item) =>
      item.isDirectory
        ? `<li>📁 <a href="/browse/${item.relativePath}">${item.name}/</a></li>`
        : `<li>📄 <a href="/files/${item.relativePath}" target="_blank">${item.name}</a>
            <button onclick="copyToClipboard('${item.relativePath}')">📋 Copy URL</button>
           </li>`
    );

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
          li { margin: 8px 0; font-size: 18px; }
          a { text-decoration: none; color: blue; }
          a:hover { text-decoration: underline; }
          button { margin-left: 10px; padding: 4px 8px; cursor: pointer; }
          .container { max-width: 800px; margin: auto; }
        </style>
        <script>
          function copyToClipboard(path) {
            const url = window.location.origin + "/files/" + path;
            navigator.clipboard.writeText(url).then(() => {
              alert("Copied: " + url);
            }).catch(err => {
              console.error("Failed to copy", err);
            });
          }
        </script>
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
