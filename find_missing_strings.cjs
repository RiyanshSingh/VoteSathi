const fs = require('fs');
const mockDataContent = fs.readFileSync('src/data/mockData.ts', 'utf8');

const descMatches = mockDataContent.matchAll(/description:\s*['"`](.*?)['"`]/g);
const allDescs = [];
for (const m of descMatches) allDescs.push(m[1]);

const titleMatches = mockDataContent.matchAll(/title:\s*['"`](.*?)['"`]/g);
const allTitles = [];
for (const m of titleMatches) allTitles.push(m[1]);

const langContextFile = fs.readFileSync('src/context/LanguageContext.tsx', 'utf8');
const translationsMatch = langContextFile.match(/const translations: Record<Language, Record<string, string>> = (\{[\s\S]*?\});/);
const translations = eval('(' + translationsMatch[1] + ')');

const englishObj = translations['English'];
const missingDescs = allDescs.filter(d => !englishObj[d]);
const missingTitles = allTitles.filter(t => !englishObj[t]);

console.log('Missing Descriptions:', missingDescs);
console.log('Missing Titles:', missingTitles);
