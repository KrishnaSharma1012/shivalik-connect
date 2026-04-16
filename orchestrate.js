const fs = require('fs');
const path = require('path');

const BE_DIR = path.join(__dirname, 'backend');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
    }
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${filePath}`);
    }
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (file !== 'node_modules') processDirectory(fullPath);
        } else if (file.endsWith('.js')) {
            // Models logic
            if (fullPath.includes('models')) {
                // Post.js
                if (file === 'Post.js') {
                    replaceInFile(fullPath, [
                        { regex: /ref:\s*['"]BaseUser['"]/g, replacement: "refPath: 'authorModel'" },
                        { regex: /author:\s*\{/, replacement: "author: { type: mongoose.Schema.Types.ObjectId, refPath: 'authorModel', required: true },\n    authorModel: { type: String, enum: ['Student', 'Alumni', 'Admin'], required: true },\n    _legacyAuthor: {" }
                    ]);
                    // Fix likes refPath inside Post (complex, simple regex hack)
                    replaceInFile(fullPath, [
                        { regex: /likes:\s*\[\s*\{\s*type:\s*mongoose\.Schema\.Types\.ObjectId,\s*ref:\s*['"]BaseUser['"]\s*\}\s*\]/, replacement: "likes: [{ user: { type: mongoose.Schema.Types.ObjectId, refPath: 'likes.userModel' }, userModel: { type: String, enum: ['Student', 'Alumni', 'Admin'] } }]" },
                        { regex: /postSchema\.virtual\('likesCount'\)\.get\(function \(\) \{\s*return this\.likes\.length;\s*\}\);/, replacement: "postSchema.virtual('likesCount').get(function () { return this.likes.length; });" }
                    ]);
                }
                // Message.js
                else if (file === 'Message.js') {
                    replaceInFile(fullPath, [
                        { regex: /sender:\s*\{/, replacement: "sender: { type: mongoose.Schema.Types.ObjectId, refPath: 'senderModel', required: true },\n    senderModel: { type: String, enum: ['Student', 'Alumni', 'Admin'], required: true },\n    _legacySender: {" },
                        { regex: /receiver:\s*\{/, replacement: "receiver: { type: mongoose.Schema.Types.ObjectId, refPath: 'receiverModel', required: true },\n    receiverModel: { type: String, enum: ['Student', 'Alumni', 'Admin'], required: true },\n    _legacyReceiver: {" },
                        { regex: /ref:\s*['"]BaseUser['"]/g, replacement: "/* replaced polymorphically */" }
                    ]);
                }
                // Connection.js
                else if (file === 'Connection.js') {
                    replaceInFile(fullPath, [
                        { regex: /requester:\s*\{/, replacement: "requester: { type: mongoose.Schema.Types.ObjectId, refPath: 'requesterModel', required: true },\n    requesterModel: { type: String, enum: ['Student', 'Alumni', 'Admin'], required: true },\n    _legacyRequester: {" },
                        { regex: /recipient:\s*\{/, replacement: "recipient: { type: mongoose.Schema.Types.ObjectId, refPath: 'recipientModel', required: true },\n    recipientModel: { type: String, enum: ['Student', 'Alumni', 'Admin'], required: true },\n    _legacyRecipient: {" },
                        { regex: /ref:\s*['"]BaseUser['"]/g, replacement: "/* replaced polymorphically */" }
                    ]);
                }
                // Course/Session/Earning
                else if (file === 'Course.js' || file === 'Session.js' || file === 'Earning.js') {
                    replaceInFile(fullPath, [
                        { regex: /ref:\s*['"]BaseUser['"]/g, replacement: "ref: 'Alumni'" }, // Instructor/Host is ALWAYS Alumni
                        { regex: /student(s?):\s*\{([^}]*)ref:\s*['"]Alumni['"]([^}]*)\}/g, replacement: "student$1: {$2ref: 'Student'$3}" } // Student logic overwrite
                    ]);
                }
            }
            // Controllers & Middleware logic 
            else {
                replaceInFile(fullPath, [
                    { regex: /import BaseUser from ['"]\.\.\/models\/BaseUser\.js['"];/g, replacement: "import Student from '../models/Student.js';\nimport Alumni from '../models/Alumni.js';\nimport Admin from '../models/Admin.js';" },
                    { regex: /BaseUser\.findById\(([^)]+)\)/g, replacement: "((await Student.findById($1)) || (await Alumni.findById($1)) || (await Admin.findById($1)))" },
                    { regex: /BaseUser\.findOne\(([^)]+)\)/g, replacement: "((await Student.findOne($1)) || (await Alumni.findOne($1)) || (await Admin.findOne($1)))" },
                    { regex: /BaseUser\.find\(\)/g, replacement: "[...(await Student.find()), ...(await Alumni.find())]" }
                ]);
            }
        }
    }
}

processDirectory(BE_DIR);
console.log('Orchestration complete.');
