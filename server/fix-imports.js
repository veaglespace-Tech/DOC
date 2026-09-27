const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath, replacements) => {
  let content = fs.readFileSync(filePath, 'utf8');
  for (const { from, to } of replacements) {
    content = content.replace(new RegExp(from, 'g'), to);
  }
  fs.writeFileSync(filePath, content, 'utf8');
};

// 1. Fix controllers
replaceInFile(path.join(__dirname, 'src/controllers/auth.controller.js'), [
  { from: "'./auth.service'", to: "'../services/auth.service'" },
  { from: "'../../utils/response.util'", to: "'../utils/response.util'" }
]);

replaceInFile(path.join(__dirname, 'src/controllers/patients.controller.js'), [
  { from: "'./patients.service'", to: "'../services/patients.service'" },
  { from: "'../../utils/response.util'", to: "'../utils/response.util'" }
]);

// 2. Fix routes
replaceInFile(path.join(__dirname, 'src/routes/auth.routes.js'), [
  { from: "'./auth.controller'", to: "'../controllers/auth.controller'" },
  { from: "'../../middlewares/", to: "'../middlewares/" },
  { from: "'./auth.validator'", to: "'../validators/auth.validator'" }
]);

replaceInFile(path.join(__dirname, 'src/routes/patients.routes.js'), [
  { from: "'./patients.controller'", to: "'../controllers/patients.controller'" },
  { from: "'../../middlewares/", to: "'../middlewares/" },
  { from: "'./patients.validator'", to: "'../validators/patients.validator'" }
]);

// 3. Fix services
replaceInFile(path.join(__dirname, 'src/services/auth.service.js'), [
  { from: "'../../config/", to: "'../config/" },
  { from: "'../../utils/", to: "'../utils/" },
  { from: "'../otp/otp.service'", to: "'./otp.service'" }
]);

replaceInFile(path.join(__dirname, 'src/services/patients.service.js'), [
  { from: "'../../config/", to: "'../config/" }
]);

replaceInFile(path.join(__dirname, 'src/services/otp.service.js'), [
  { from: "'../../config/", to: "'../config/" },
  { from: "'../../utils/", to: "'../utils/" },
  { from: "'./templates/email.templates'", to: "'../templates/email.templates'" },
  { from: "'./templates/sms.templates'", to: "'../templates/sms.templates'" }
]);

// 4. Fix jobs
replaceInFile(path.join(__dirname, 'src/jobs/workers/notification.worker.js'), [
  { from: "'../../modules/otp/otp.service'", to: "'../../services/otp.service'" }
]);

console.log("Imports fixed!");
