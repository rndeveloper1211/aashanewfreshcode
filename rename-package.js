const fs = require('fs');
const path = require('path');

// Paths
const SRC_DIR = path.join(__dirname, 'src');
const EN_JSON_PATH = path.join(__dirname, 'src', 'utils', 'languageUtils', 'en.json');
const OUTPUT_FILE = path.join(__dirname, 'missing_texts.json');

// Regex
const textTagRegex = /<Text[^>]*>([\s\S]*?)<\/Text>/g;
const translateRegex = /translate\(['"][^'"]+['"]\)/;
const dynamicRegex = /{.*?}/g;
const tagRemoveRegex = /<[^>]+>/g;
const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

function getHardcodedTexts(dir, results = new Set()) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            getHardcodedTexts(filePath, results);
        } else if (stats.isFile() && /\.(js|jsx|ts|tsx)$/.test(file)) {
            const content = fs.readFileSync(filePath, 'utf8');

            let match;
          while ((match = textTagRegex.exec(content)) !== null) {
    let rawText = match[1].trim();

    // ❌ Ignore translate()
    if (translateRegex.test(rawText)) continue;

    // ❌ Ignore pure JS expressions like {new Date(...) }
    if (/^\{[\s\S]*\}$/.test(rawText)) continue;

    // Remove nested JSX tags
    let cleanText = rawText.replace(tagRemoveRegex, '');

    // Remove dynamic values {item.xyz}
    cleanText = cleanText.replace(dynamicRegex, '');

    // Normalize spaces
    cleanText = cleanText.replace(/\s+/g, ' ').trim();

    if (!cleanText) continue;

    // ❌ Ignore emoji/icons
    if (emojiRegex.test(cleanText)) continue;

    // ❌ Ignore JSX/code garbage
    if (/onPress|style=|=>|keyboardType|maxLength|ref=|value=/.test(cleanText)) continue;

    // ❌ Ignore numbers/symbols
    if (/^[₹0-9\s.,%()\-]+$/.test(cleanText)) continue;

    results.add(cleanText);
}
        }
    });

    return results;
}

function saveMissingTexts() {
    console.log('--- Finding Unused Hardcoded Texts ---');

    const texts = getHardcodedTexts(SRC_DIR);

    // Load en.json
    let enData = {};
    if (fs.existsSync(EN_JSON_PATH)) {
        enData = JSON.parse(fs.readFileSync(EN_JSON_PATH, 'utf8'));
    }

    const cleanTexts = [...new Set([...texts].map(t => t.trim()))]
        .filter(t => t.length > 0)
        .sort();

    const missingJson = {};

    cleanTexts.forEach(text => {
        if (!enData.hasOwnProperty(text)) {
            missingJson[text] = text;
        }
    });

    if (Object.keys(missingJson).length > 0) {
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(missingJson, null, 2), 'utf8');

        console.log(`\n📄 Missing texts: ${Object.keys(missingJson).length}`);
        console.log('✅ Saved to missing_texts.json');
    } else {
        console.log('✅ No missing texts found');
    }
}

saveMissingTexts();