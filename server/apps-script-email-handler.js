// ============================================================
// DHORIA ACADEMY GWADAR — Admission Form Email Handler (Secure)
// Google Apps Script — Paste this into script.google.com
// ============================================================

// Handle CORS preflight requests (required for browser fetch)
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Handle form POST submission
function doPost(e) {
  try {
    var data;

    // Support both JSON and URL-encoded form data
    if (e.postData && e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    } else {
      throw new Error('No data received.');
    }

    // 1. Honeypot check (anti-spam)
    var honeypot = data['honeypot'];
    if (honeypot && honeypot.trim() !== '') {
      throw new Error('Spam submission detected (Honeypot trigger).');
    }

    // 2. Cloudflare Turnstile CAPTCHA verification
    var turnstileToken = data['turnstileToken'];
    if (!turnstileToken) {
      throw new Error('Verification token missing. Please complete the CAPTCHA.');
    }
    if (!verifyTurnstile(turnstileToken)) {
      throw new Error('Security verification failed. Please refresh the page and try again.');
    }

    // 3. Rate-Limiting check (Max 3 submissions per 15 minutes per device)
    var clientToken = data['clientToken'];
    if (clientToken && isRateLimited(clientToken)) {
      throw new Error('Too many applications submitted from this device. Please wait 15 minutes and try again.');
    }

    // 4. Server-side inputs format validation (Regex patterns)
    var studentName  = validateInput(data['Student Name'], "Student Name", /^[a-zA-Z\s\.]{3,60}$/);
    var fatherName   = validateInput(data['Father Name'], "Father Name", /^[a-zA-Z\s\.]{3,60}$/);
    var dob          = data['Date of Birth']          || '(not provided)';
    var className    = data['Class']                  || '(not provided)';
    var bform        = validateInput(data['B-Form / CNIC Number'], "B-Form / CNIC Number", /^\d{5}-\d{7}-\d{1}$/);
    var mobile       = validateInput(data['Mobile Number'], "Mobile Number", /^\d{11}$/);
    var guardian     = validateInput(data['Guardian Mobile Number'], "Guardian Mobile Number", /^\+?[\d\s-]{10,15}$/);
    var address      = data['Address']                || '(not provided)';
    var qualification= data['Qualifications']         || '(not provided)';
    var shift        = data['Shift Timing']           || '(not provided)';
    var subDate      = data['Submission Date']        || new Date().toLocaleDateString();

    // 5. Connect to Google Sheets & Check for CNIC Duplicate Applications
    logToGoogleSheet(studentName, fatherName, dob, className, bform, mobile, guardian, address, qualification, shift);

    // 6. Build plain-text email body
    var emailBody =
      "==================================================\n" +
      "  DHORIA ACADEMY GWADAR — NEW ADMISSION APPLICATION\n" +
      "==================================================\n\n" +
      "Student Name      :  " + studentName   + "\n" +
      "Father Name       :  " + fatherName    + "\n" +
      "Date of Birth     :  " + dob           + "\n" +
      "Class             :  " + className     + "\n" +
      "B-Form / CNIC #   :  " + bform         + "\n" +
      "Mobile Number     :  " + mobile        + "\n" +
      "Guardian Mobile   :  " + guardian      + "\n" +
      "Address           :  " + address       + "\n" +
      "Qualifications    :  " + qualification + "\n" +
      "Shift Timing      :  " + shift         + "\n" +
      "Submission Date   :  " + subDate       + "\n\n" +
      "--------------------------------------------------\n" +
      "This application was submitted via Dhoria Academy\n" +
      "Gwadar Admission Form Portal (Secure Verification Active).\n" +
      "==================================================\n";

    // 7. Build HTML email body (nicely formatted table)
    var htmlBody =
      "<div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;border:2px solid #1e293b;border-radius:10px;overflow:hidden;'>" +
      "<div style='background:#1e293b;padding:20px;text-align:center;'>" +
      "<h2 style='color:#ffffff;margin:0;font-size:20px;'>DHORIA ACADEMY GWADAR</h2>" +
      "<p style='color:#94a3b8;margin:4px 0 0 0;font-size:13px;'>New Student Admission Application Received (Secure)</p>" +
      "</div>" +
      "<table style='width:100%;border-collapse:collapse;'>" +
      row("Student Name",     studentName,    "#f8fafc") +
      row("Father Name",      fatherName,     "#ffffff") +
      row("Date of Birth",    dob,            "#f8fafc") +
      row("Class",            className,      "#ffffff") +
      row("B-Form / CNIC #",  bform,          "#f8fafc") +
      row("Mobile Number",    mobile,         "#ffffff") +
      row("Guardian Mobile",  guardian,       "#f8fafc") +
      row("Address",          address,        "#ffffff") +
      row("Qualifications",   qualification,  "#f8fafc") +
      row("Shift Timing",     shift,          "#ffffff") +
      row("Submission Date",  subDate,        "#f8fafc") +
      "</table>" +
      "<div style='background:#f1f5f9;padding:12px;text-align:center;font-size:12px;color:#64748b;'>" +
      "Submitted and logged securely via Dhoria Academy Gwadar Admission Portal" +
      "</div>" +
      "</div>";

    // 8. Send the email
    GmailApp.sendEmail(
      'kabeer50930@gmail.com',
      'New Admission: ' + studentName + ' — Class ' + className,
      emailBody,
      { htmlBody: htmlBody }
    );

    // Return success response
    var output = ContentService.createTextOutput(
      JSON.stringify({ success: true, message: "Application submitted and logged successfully." })
    ).setMimeType(ContentService.MimeType.JSON);

    return output;

  } catch (err) {
    var errOutput = ContentService.createTextOutput(
      JSON.stringify({ success: false, error: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
    return errOutput;
  }
}

// Helper: build a single table row
function row(label, value, bg) {
  return "<tr style='background:" + bg + ";'>" +
         "<td style='padding:10px 16px;font-weight:bold;color:#1e293b;width:40%;border-bottom:1px solid #e2e8f0;font-size:13px;'>" + label + "</td>" +
         "<td style='padding:10px 16px;color:#374151;border-bottom:1px solid #e2e8f0;font-size:13px;'>" + value + "</td>" +
         "</tr>";
}

// Helper: Verify Turnstile token via Cloudflare Verification API
function verifyTurnstile(token) {
  try {
    // Cloudflare Turnstile Global Test Secret Key (always passes). Replace with your actual secret key.
    var secretKey = "1x00000000000000000000000000000000AA"; 
    var url = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
    
    var response = UrlFetchApp.fetch(url, {
      method: "POST",
      payload: {
        secret: secretKey,
        response: token
      }
    });
    
    var json = JSON.parse(response.getContentText());
    return json.success === true;
  } catch (err) {
    Logger.log("Turnstile validation error: " + err.message);
    return false;
  }
}

// Helper: Validate input formatting using regex patterns
function validateInput(value, fieldName, pattern) {
  if (!value || !pattern.test(value.toString().trim())) {
    throw new Error("Invalid format for field: " + fieldName + ". Please verify and retry.");
  }
  return value.toString().trim();
}

// Helper: Rate limiting check (using CacheService)
function isRateLimited(clientToken) {
  try {
    var cache = CacheService.getScriptCache();
    var cacheKey = "rl_" + clientToken;
    var countStr = cache.get(cacheKey);
    var count = countStr ? parseInt(countStr, 10) : 0;
    
    if (count >= 3) {
      return true; // Throttled!
    }
    
    // Store/increment request count in cache. Expire after 15 minutes (900 seconds)
    cache.put(cacheKey, (count + 1).toString(), 900);
    return false;
  } catch (err) {
    Logger.log("Rate limiter error: " + err.message);
    return false; // Fallback to fail-open to not break service if caching fails
  }
}

// Helper: Write application data to Google Sheets & check for duplicates
function logToGoogleSheet(studentName, fatherName, dob, className, bform, mobile, guardian, address, qualification, shift) {
  var ss;
  
  // Replace this with your Google Spreadsheet ID if running as a standalone Apps Script:
  var spreadsheetId = ""; 

  // Try to bind to active spreadsheet
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (err) {
    // Bound spreadsheet not available (standalone script execution)
  }

  // If not bound, open by ID (retrieved from properties or hardcoded)
  if (!ss) {
    var props = PropertiesService.getScriptProperties();
    var savedId = props.getProperty("SPREADSHEET_ID") || spreadsheetId;
    if (savedId && savedId !== "") {
      try {
        ss = SpreadsheetApp.openById(savedId);
      } catch (e) {
        // ID open failed
      }
    }
  }

  // Fallback: Create a new spreadsheet if none can be resolved
  if (!ss) {
    try {
      ss = SpreadsheetApp.create("Dhoria Academy Admissions Database");
      PropertiesService.getScriptProperties().setProperty("SPREADSHEET_ID", ss.getId());
    } catch (e) {
      throw new Error("Database connection error. Admin action required: Please add a SPREADSHEET_ID script property.");
    }
  }

  // Find or insert the record tracking sheet
  var sheet = ss.getSheetByName("Admissions_Records");
  if (!sheet) {
    sheet = ss.insertSheet("Admissions_Records");
    sheet.appendRow([
      "Timestamp", "Student Name", "Father Name", "Date of Birth", "Class", 
      "B-Form / CNIC", "Mobile Number", "Guardian Mobile", "Address", "Qualifications", "Shift"
    ]);
    sheet.getRange("A1:K1").setFontWeight("bold").setBackground("#1e293b").setFontColor("#ffffff");
  }

  // Prevent duplicate admissions (Verify if B-Form / CNIC already exists in the 6th column)
  var cnicToVerify = bform.trim();
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var existingCnicValues = sheet.getRange(2, 6, lastRow - 1, 1).getValues();
    for (var i = 0; i < existingCnicValues.length; i++) {
      if (existingCnicValues[i][0].toString().trim() === cnicToVerify) {
        throw new Error("Duplicate application! An admission form with B-Form/CNIC '" + cnicToVerify + "' has already been submitted.");
      }
    }
  }

  // Append new record row
  sheet.appendRow([
    new Date(),
    studentName,
    fatherName,
    dob,
    className,
    cnicToVerify,
    mobile,
    guardian,
    address,
    qualification,
    shift
  ]);
}
