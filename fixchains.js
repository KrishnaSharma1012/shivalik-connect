const fs = require('fs');
const path = require('path');

const BE_DIR = path.join(__dirname, 'backend', 'controllers');
const MW_DIR = path.join(__dirname, 'backend', 'middleware');

function replaceInFile(filePath, replacements) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
    }
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log('Fixed:', filePath);
    }
}

function proc(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            proc(fullPath);
        } else if (file.endsWith('.js')) {
            replaceInFile(fullPath, [
                { 
                  regex: /\(await\s*\(\(await Student\.findById\(([^)]+)\)\)\s*\|\|\s*\(await Alumni\.findById\(\1\)\)\s*\|\|\s*\(await Admin\.findById\(\1\)\)\)\)\.select\(["']-password["']\)/g,
                  replacement: "((await Student.findById($1).select('-password')) || (await Alumni.findById($1).select('-password')) || (await Admin.findById($1).select('-password')))" 
                },
                { 
                  regex: /\(\(await Student\.findById\(([^)]+)\)\)\s*\|\|\s*\(await Alumni\.findById\(\1\)\)\s*\|\|\s*\(await Admin\.findById\(\1\)\)\)\.select\(["']-password["']\)/g,
                  replacement: "((await Student.findById($1).select('-password')) || (await Alumni.findById($1).select('-password')) || (await Admin.findById($1).select('-password')))" 
                },
                {
                  regex: /\[\.\.\.\(await Student\.find\(\)\),\s*\.\.\.\(await Alumni\.find\(\)\)\]\.select\(["']-password["']\)/g,
                  replacement: "[...(await Student.find().select('-password')), ...(await Alumni.find().select('-password'))]"
                }
            ]);
        }
    }
}

proc(BE_DIR);
proc(MW_DIR);
