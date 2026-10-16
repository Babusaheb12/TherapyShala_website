import publicFetch from './apiClient';

/**
 * 1. GET /content/legal
 * Fetch all published legal policies and CMS content for website
 */
export const getPublicLegalDocuments = async () => {
  return await publicFetch('/content/legal');
};

/**
 * 2. GET /content/legal/{type}
 * Fetch specific legal policy by type (PRIVACY, TERMS, THERAPIST_TERMS, CANCELLATION, REFUND, ABOUT_US, HELP_CENTER)
 * @param {string} type - Policy type enum
 * @param {string} locale - Optional locale e.g. 'en'
 */
export const getPublicLegalDocument = async (type, locale = 'en') => {
  const query = locale ? `?locale=${encodeURIComponent(locale)}` : '';
  return await publicFetch(`/content/legal/${encodeURIComponent(type)}${query}`);
};

/**
 * 3. GET /content/faqs
 * Fetch FAQs for website Help Center & FAQ sections
 * @param {Object} params - Query parameters e.g. { category, q, limit }
 */
export const getPublicFaqs = async (params = {}) => {
  const queryParts = [];
  if (params.category) queryParts.push(`category=${encodeURIComponent(params.category)}`);
  if (params.q) queryParts.push(`q=${encodeURIComponent(params.q)}`);
  if (params.limit) queryParts.push(`limit=${encodeURIComponent(params.limit)}`);

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  return await publicFetch(`/content/faqs${queryString}`);
};

/**
 * 4. GET /content/faqs/categories
 * Fetch FAQ categories dynamically
 */
export const getPublicFaqCategories = async () => {
  return await publicFetch('/content/faqs/categories');
};

/**
 * 5. GET /content/help-center
 * Fetch aggregated Help Center information (hotline, email, availability, categories, faqsGrouped)
 */
export const getPublicHelpCenter = async () => {
  return await publicFetch('/content/help-center');
};

/**
 * 6. GET /app-feedback
 * Fetch published customer app feedback & reviews for website showcase
 * @param {Object} params - Query parameters e.g. { category, cursor, limit }
 */
export const getPublicAppFeedback = async (params = {}) => {
  const queryParts = [];
  if (params.category && params.category !== 'ALL') queryParts.push(`category=${encodeURIComponent(params.category)}`);
  if (params.cursor) queryParts.push(`cursor=${encodeURIComponent(params.cursor)}`);
  if (params.limit) queryParts.push(`limit=${encodeURIComponent(params.limit)}`);

  const queryString = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  try {
    return await publicFetch(`/app-feedback${queryString}`);
  } catch (err) {
    try {
      return await publicFetch(`/admin/app-feedback${queryString}`);
    } catch {
      throw err;
    }
  }
};
