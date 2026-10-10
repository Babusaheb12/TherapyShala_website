import iso639Raw from '../data/iso_639-1.json';

// Popular languages prioritized for Indian & Global wellness/spa operations
const POPULAR_CODES = [
  'en', // English
  'hi', // Hindi
  'bn', // Bengali
  'mr', // Marathi
  'te', // Telugu
  'ta', // Tamil
  'gu', // Gujarati
  'ur', // Urdu
  'kn', // Kannada
  'ml', // Malayalam
  'or', // Odia
  'pa', // Punjabi
  'as', // Assamese
  'sa', // Sanskrit
  'fr', // French
  'es', // Spanish
  'de', // German
  'ru', // Russian
  'ar', // Arabic
  'zh', // Chinese
  'ja', // Japanese
];

// Normalize and build sorted language list
const allLanguagesList = Object.entries(iso639Raw || {}).map(([code, details]) => ({
  code: details['639-1'] || code,
  name: details.name || code,
  nativeName: details.nativeName || details.name || code,
  family: details.family || '',
  isPopular: POPULAR_CODES.includes(code),
}));

// Sort: popular first in specified order, then alphabetical by English name
export const ALL_ISO_LANGUAGES = [
  ...POPULAR_CODES.map((code) => allLanguagesList.find((l) => l.code === code)).filter(Boolean),
  ...allLanguagesList
    .filter((l) => !POPULAR_CODES.includes(l.code))
    .sort((a, b) => a.name.localeCompare(b.name)),
];

export const searchLanguages = (query = '') => {
  if (!query || !query.trim()) return ALL_ISO_LANGUAGES;
  const q = query.toLowerCase().trim();
  return ALL_ISO_LANGUAGES.filter(
    (lang) =>
      lang.name.toLowerCase().includes(q) ||
      lang.nativeName.toLowerCase().includes(q) ||
      lang.code.toLowerCase().includes(q)
  );
};

export default ALL_ISO_LANGUAGES;
