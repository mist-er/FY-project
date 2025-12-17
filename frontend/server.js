const http = require('http');
const fs = require('fs');
const path = require('path');

// Helper function to find file with case-insensitive matching
function findFileCaseInsensitive(basePath) {
  try {
    // First try exact match
    if (fs.existsSync(basePath)) {
      return basePath;
    }
    
    // If not found, try case-insensitive search
    const dir = path.dirname(basePath);
    const fileName = path.basename(basePath);
    const ext = path.extname(fileName);
    const nameWithoutExt = path.basename(fileName, ext);
    
    if (fs.existsSync(dir)) {
      const files = fs.readdirSync(dir);
      const found = files.find(file => 
        file.toLowerCase() === fileName.toLowerCase()
      );
      if (found) {
        return path.join(dir, found);
      }
    }
  } catch (error) {
    // Ignore errors
  }
  return basePath;
}

const server = http.createServer((req, res) => {
  // Remove query strings
  let urlPath = req.url.split('?')[0];
  
  // Default to index.html
  if (urlPath === '/' || urlPath === '') {
    urlPath = '/pages/index.html';
  }
  
  // Normalize the path
  let filePath = '.' + urlPath;
  
  // Normalize path separators
  filePath = path.normalize(filePath);
  
  // Security: prevent directory traversal (but allow normalized paths)
  const normalizedPath = path.resolve(filePath);
  const serverRoot = path.resolve('.');
  if (!normalizedPath.startsWith(serverRoot)) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 - Forbidden</h1>', 'utf-8');
    return;
  }

  // Handle case-insensitive file names
  filePath = findFileCaseInsensitive(filePath);

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
  };

  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // Check if file exists
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If file not found, try looking in pages directory for HTML files
      if (extname === '.html' && !filePath.includes('/pages/')) {
        const pagesPath = path.join('.', 'pages', path.basename(filePath));
        const normalizedPagesPath = findFileCaseInsensitive(pagesPath);
        
        fs.access(normalizedPagesPath, fs.constants.F_OK, (pagesErr) => {
          if (!pagesErr) {
            // File found in pages directory, serve it
            fs.readFile(normalizedPagesPath, (error, content) => {
              if (error) {
                console.error(`Error reading file: ${normalizedPagesPath}`, error);
                res.writeHead(500);
                res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
              } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
              }
            });
            return;
          }
          
          // File not found in pages either
          console.error(`404: ${req.url} -> ${filePath} (also tried: ${normalizedPagesPath})`);
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(`<h1>404 - File Not Found</h1><p>Requested: ${req.url}</p><p>Path: ${filePath}</p>`, 'utf-8');
        });
        return;
      }
      
      // File not found and not an HTML file in root
      console.error(`404: ${req.url} -> ${filePath}`);
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`<h1>404 - File Not Found</h1><p>Requested: ${req.url}</p><p>Path: ${filePath}</p>`, 'utf-8');
      return;
    }

    // Read and serve the file
    fs.readFile(filePath, (error, content) => {
      if (error) {
        console.error(`Error reading file: ${filePath}`, error);
        res.writeHead(500);
        res.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf-8');
      }
    });
  });
});

const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Frontend server running at http://localhost:${PORT}/`);
  console.log('Open your browser and go to: http://localhost:8000/pages/index.html');
});
