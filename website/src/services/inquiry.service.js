import publicFetch from './apiClient';

/**
 * Submit Spa Owner onboarding inquiry to backend
 * POST /spa-owner/inquiries
 * 
 * @param {Object} payload
 * @param {string} payload.businessName - Name of the Spa or Wellness Centre
 * @param {string} payload.ownerName - Name of the owner or representative
 * @param {string} payload.email - Contact email
 * @param {string} payload.phone - Contact phone number
 * @param {number} payload.therapistCount - Number of therapists
 * @param {string[]} payload.servicesOffered - Array of service categories
 * @param {number} payload.branchCount - Number of branches
 * @param {string} payload.message - Inquiry message or requirements
 */
export const submitSpaInquiry = async (payload) => {
  const body = {
    businessName: (payload.businessName || '').trim(),
    ownerName: (payload.ownerName || '').trim(),
    email: (payload.email || '').trim().toLowerCase(),
    phone: (payload.phone || '').trim(),
    therapistCount: Math.max(1, Number(payload.therapistCount) || 1),
    servicesOffered: Array.isArray(payload.servicesOffered) ? payload.servicesOffered : [],
    branchCount: Math.max(1, Number(payload.branchCount) || 1),
    message: (payload.message || '').trim(),
  };

  const sponsorCode = (payload.sponsorCode || '').trim();
  if (sponsorCode) {
    body.sponsorCode = sponsorCode.toUpperCase();
  }

  return await publicFetch('/spa-owner/inquiries', {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

export default {
  submitSpaInquiry,
};
