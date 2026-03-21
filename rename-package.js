const fs = require('fs');
const path = require('path');

// Config Paths
const SRC_DIR = path.join(__dirname, 'src');
const EN_JSON_PATH = path.join(__dirname, 'src', 'utils', 'languageUtils', 'en.json');

// Regex to find translate("ANY_KEY") or translate('ANY_KEY')
const translateRegex = /translate\(['"]([^'"]+)['"]\)/g;

function getAllTranslateKeys(dir, keys = new Set()) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            getAllTranslateKeys(filePath, keys);
        } else if (stats.isFile() && /\.(js|jsx|ts|tsx)$/.test(file)) {
            const content = fs.readFileSync(filePath, 'utf8');
            let match;
            while ((match = translateRegex.exec(content)) !== null) {
                keys.add(match[1]); // match[1] is the key name
            }
        }
    });
    return keys;
}

function syncEnJson() {
    console.log('--- Starting Sync Process ---');

    // 1. Get all keys from src
    const foundKeys = getAllTranslateKeys(SRC_DIR);
    console.log(`🔍 Total unique keys found in code: ${foundKeys.size}`);

    // 2. Read existing en.json
    let enData = {};
    if (fs.existsSync(EN_JSON_PATH)) {
        enData = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf8'));
    } else {
        console.log('⚠️ en.json not found, creating a new one.');
    }

    // 3. Find missing keys and add them
    let addedCount = 0;
    foundKeys.forEach(key => {
        if (!enData.hasOwnProperty(key)) {
            // Hum key ko hi value bana dete hain taaki aap baad mein translate kar sakein
            enData[key] = key.replace(/_/g, ' '); 
            console.log(`➕ Adding missing key: ${key}`);
            addedCount++;
        }
    });

    if (addedCount > 0) {
        // 4. Save updated en.json (with alphabetical sorting)
        const sortedEnData = {};
        Object.keys(enData).sort().forEach(k => {
            sortedEnData[k] = enData[k];
        });

        fs.writeFileSync(EN_JSON_PATH, JSON.stringify(sortedEnData, null, 2), 'utf8');
        console.log(`\n✅ Success: ${addedCount} new keys added to en.json`);
    } else {
        console.log('\n✨ Everything is up to date. No missing keys found.');
    }
}

syncEnJson();