/**
 * DHORIA ACADEMY GWADAR — MASTER SERVER & REST API
 * High-performance, zero-dependency Node.js HTTP server.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = path.resolve(__dirname, '..');
const DB_FILE = path.join(ROOT_DIR, 'db', 'database.json');

// MIME Type definitions
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4'
};

// Ensure db directory and file exist
function getDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading database.json:', err);
  }
  return null;
}

function saveDatabase(data) {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving database.json:', err);
    return false;
  }
}

// Request Helper to parse JSON body
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // Protect from large payloads (> 20MB)
      if (body.length > 20 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        if (!body) return resolve({});
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (err) {
        resolve({ raw: body });
      }
    });
    req.on('error', reject);
  });
}

// Send JSON Response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method.toUpperCase();

  // CORS Preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    });
    return res.end();
  }

  // =============================================================
  // REST API ENDPOINTS
  // =============================================================
  if (pathname.startsWith('/api/')) {
    
    // GET /api/data -> Get full database
    if (pathname === '/api/data' && method === 'GET') {
      const db = getDatabase();
      if (!db) return sendJson(res, 500, { error: 'Database not initialized' });
      return sendJson(res, 200, db);
    }

    // POST /api/data -> Save full database
    if (pathname === '/api/data' && method === 'POST') {
      const body = await parseRequestBody(req);
      if (!body || typeof body !== 'object') {
        return sendJson(res, 400, { error: 'Invalid data' });
      }
      const success = saveDatabase(body);
      if (success) {
        return sendJson(res, 200, { success: true, message: 'Database saved successfully' });
      } else {
        return sendJson(res, 500, { error: 'Failed to write to disk' });
      }
    }

    // POST /api/login -> Authenticate admin
    if (pathname === '/api/login' && method === 'POST') {
      const body = await parseRequestBody(req);
      const { username, password } = body;
      const db = getDatabase() || {};
      const users = db.users || [];
      const user = users.find(u => u.username === username && u.password === password && u.status === 'Active');

      if (user) {
        const token = 'tok_' + Buffer.from(user.username + ':' + Date.now()).toString('base64');
        return sendJson(res, 200, {
          success: true,
          token: token,
          user: {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            role: user.role,
            email: user.email,
            avatar: user.avatar
          }
        });
      } else {
        return sendJson(res, 401, { success: false, error: 'Invalid username or password' });
      }
    }

    // POST /api/admissions -> Submit admission application
    if (pathname === '/api/admissions' && method === 'POST') {
      const body = await parseRequestBody(req);
      const db = getDatabase() || {};
      if (!db.admissions) db.admissions = [];
      
      const year = new Date().getFullYear();
      const count = db.admissions.length + 1;
      const id = `ADM-${year}-${String(count).padStart(3, '0')}`;

      const newRecord = {
        id: id,
        studentName: body.studentName || body['Student Name'] || '',
        fatherName: body.fatherName || body['Father Name'] || '',
        dob: body.dob || body['Date of Birth'] || '',
        className: body.className || body['Class'] || 'Class 1st',
        shiftTiming: body.shiftTiming || body['Shift Timing'] || 'Evening',
        bform: body.bform || body['B-Form / CNIC Number'] || '',
        mobile: body.mobile || body['Mobile Number'] || '',
        guardianMobile: body.guardianMobile || body['Guardian Mobile Number'] || '',
        address: body.address || body['Address'] || '',
        qualification: body.qualification || body['Qualifications'] || '',
        photoUrl: body.photoUrl || 'assets/images/students.png',
        status: 'Pending',
        submissionDate: new Date().toISOString().split('T')[0],
        notes: 'Online submission received'
      };

      db.admissions.unshift(newRecord);
      
      // Log activity
      if (!db.activityLog) db.activityLog = [];
      db.activityLog.unshift({
        id: 'log-' + Date.now(),
        user: 'Portal',
        action: 'New Admission Application',
        details: `Student: ${newRecord.studentName} (${newRecord.id})`,
        timestamp: new Date().toISOString()
      });

      saveDatabase(db);
      return sendJson(res, 201, { success: true, admission: newRecord });
    }

    // POST /api/contact -> Submit contact message
    if (pathname === '/api/contact' && method === 'POST') {
      const body = await parseRequestBody(req);
      const db = getDatabase() || {};
      if (!db.messages) db.messages = [];

      const newMsg = {
        id: 'msg-' + Date.now().toString(36),
        senderName: body.senderName || body.name || 'Anonymous',
        email: body.email || '',
        phone: body.phone || '',
        subject: body.subject || 'Website Inquiry',
        message: body.message || '',
        timestamp: new Date().toISOString(),
        status: 'Unread'
      };

      db.messages.unshift(newMsg);

      if (!db.activityLog) db.activityLog = [];
      db.activityLog.unshift({
        id: 'log-' + Date.now(),
        user: 'Contact Form',
        action: 'New Message Received',
        details: `From: ${newMsg.senderName} (${newMsg.subject})`,
        timestamp: new Date().toISOString()
      });

      saveDatabase(db);
      return sendJson(res, 201, { success: true, message: newMsg });
    }

    // POST /api/upload -> Save uploaded image file to assets/images/uploads/
    if (pathname === '/api/upload' && method === 'POST') {
      try {
        const body = await parseRequestBody(req);
        const { imageBase64, filename, folder } = body;
        if (!imageBase64) {
          return sendJson(res, 400, { error: 'No image data provided' });
        }

        // Clean base64 header
        let matches = imageBase64.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
        let ext = 'jpg';
        let base64Data = imageBase64;
        if (matches && matches.length === 3) {
          ext = matches[1].toLowerCase().replace('jpeg', 'jpg');
          base64Data = matches[2];
        }

        const buffer = Buffer.from(base64Data, 'base64');
        const targetFolder = path.join(ROOT_DIR, 'assets', 'images', folder || 'uploads');
        if (!fs.existsSync(targetFolder)) {
          fs.mkdirSync(targetFolder, { recursive: true });
        }

        const cleanName = (filename ? path.basename(filename, path.extname(filename)) : 'img')
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, '-')
          .replace(/^-+|-+$/g, '');
        const finalFileName = `${cleanName}-${Date.now().toString(36)}.${ext}`;
        const filePath = path.join(targetFolder, finalFileName);

        fs.writeFileSync(filePath, buffer);

        const relUrl = `/assets/images/${folder || 'uploads'}/${finalFileName}`;
        return sendJson(res, 200, {
          success: true,
          url: relUrl,
          filename: finalFileName,
          sizeKB: +(buffer.length / 1024).toFixed(1)
        });
      } catch (err) {
        console.error('Upload error:', err);
        return sendJson(res, 500, { error: 'Failed to save uploaded image: ' + err.message });
      }
    }

    // GET /api/stats -> Get stats
    if (pathname === '/api/stats' && method === 'GET') {
      const db = getDatabase() || {};
      const admissions = db.admissions || [];
      const messages = db.messages || [];
      const staff = db.staff || [];
      const articles = db.articles || [];
      const events = db.events || [];
      const visitors = db.visitors || [];

      return sendJson(res, 200, {
        totalAdmissions: admissions.length,
        pendingAdmissions: admissions.filter(a => a.status === 'Pending').length,
        approvedAdmissions: admissions.filter(a => a.status === 'Approved').length,
        totalStaff: staff.filter(s => s.active !== false).length,
        totalArticles: articles.length,
        publishedArticles: articles.filter(a => a.status === 'Published').length,
        totalEvents: events.length,
        totalVisitors: visitors.length,
        totalMessages: messages.length,
        unreadMessages: messages.filter(m => m.status === 'Unread').length
      });
    }

    return sendJson(res, 404, { error: 'API route not found' });
  }

  // =============================================================
  // STATIC FILE SERVING
  // =============================================================
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  let filePath = path.join(ROOT_DIR, safePath);

  // If path is a directory, look for index.html inside
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>404 Not Found | Dhoria Academy</title>
          <link rel="stylesheet" href="/assets/css/styles_v13.css">
          <style>
            body { display:flex; align-items:center; justify-content:center; min-height:100vh; text-align:center; font-family:sans-serif; background:var(--bg-main,#0f172a); color:#fff; }
            .box { padding: 3rem; background:rgba(255,255,255,0.05); border-radius:1rem; border:1px solid rgba(255,255,255,0.1); }
            a { color: #38bdf8; text-decoration:none; margin-top:1rem; display:inline-block; font-weight:bold; }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>404 - Page Not Found</h1>
            <p>The requested page <code>${pathname}</code> was not found on this server.</p>
            <a href="/">Return to Dhoria Academy Home</a>
          </div>
        </body>
        </html>
      `);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log('================================================================');
  console.log(`  🌟 DHORIA ACADEMY GWADAR SERVER RUNNING ON PORT ${PORT}`);
  console.log(`  🌐 Public Website : http://localhost:${PORT}/`);
  console.log(`  🔐 Admin Panel    : http://localhost:${PORT}/admin/`);
  console.log(`  📂 Database File  : ${DB_FILE}`);
  console.log('================================================================');
});
