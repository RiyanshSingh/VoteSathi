const fs = require('fs');
const { steps, translations } = JSON.parse(fs.readFileSync('parsed_steps.json', 'utf8'));

// 1. Update mockData.ts
let mockData = fs.readFileSync('src/data/mockData.ts', 'utf8');

// Replace the export const steps: Step[] = [ ... ]; block
const stepsRegex = /export const steps: Step\[\] = \[[\s\S]*?\];/;
const newStepsCode = 'export const steps: Step[] = ' + JSON.stringify(steps, null, 2).replace(/"([^"]+)":/g, '$1:') + ';';

mockData = mockData.replace(stepsRegex, newStepsCode);
fs.writeFileSync('src/data/mockData.ts', mockData);

// 2. Update LanguageContext.tsx
let langCtx = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');

// We need to insert the English translations into the "en" block.
// The "en" block has a large object of translations. We can find the end of it or just replace the old steps block.
// The easiest way is to find "step.proc1.title" and replace everything until "Election Process": "Election Process"

const translationEntries = Object.entries(translations).map(([k, v]) => `    "${k}": ${JSON.stringify(v)},`).join('\n');

// Since we added these translations recently, we can use a regex to replace the block
const enStartRegex = /\/\/ Stable step keys - Election Process[\s\S]*?(?=\s*"Election Process": "Election Process")/g;

// We need to replace the English block and also the Hindi block.
// Since Hindi is translated, we should probably generate translated text for Hindi.
// But the user didn't provide Hindi translations for these new 60 cards.
// For now, let's just inject the English ones into the English block.

// We can just inject translationEntries right after "tool.faq": "FAQs",
const injectRegexEn = /"tool\.faq": "FAQs",/g;

langCtx = langCtx.replace(/"tool\.faq": "FAQs",/g, '"tool.faq": "FAQs",\n' + translationEntries);

// Wait, the old ones are still there. We should remove them.
const oldEnRegex = /\/\/ Stable step keys - Election Process[\s\S]*?"step\.res6\.desc": "The winning candidate is issued a \\"Certificate of Election\\" \(Form 21C\/21D\) by the RO\.",/g;
langCtx = langCtx.replace(oldEnRegex, '');

// Also remove them from Hindi block to avoid duplicates, or just let them be overridden.
// Actually, it's safer to just replace the old keys completely.

fs.writeFileSync('src/context/LanguageContext.tsx', langCtx);
console.log('Injection complete');
