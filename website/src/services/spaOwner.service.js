import { apiClient } from './apiClient.js';

/**
 * 1. POST /spa-owner/login
 * Authenticates spa owner by email and password
 *
 * @param {Object} credentials - { email: string, password: string }
 * @returns {Promise<Object>} { success, message, token, data: { id, businessName, ownerName, email, phone, spaCode, therapistCount, servicesOffered, branchCount, status, role, lastLoginAt } }
 */
export const spaOwnerLogin = async ({ email, password }) => {
  return await apiClient('/spa-owner/login', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({
      email: email?.trim(),
      password: password?.trim(),
    }),
  });
};

/**
 * 2. POST /spa-owner/forgot-password
 * Triggers password reset email with temporary password
 *
 * @param {Object} payload - { email: string }
 * @returns {Promise<Object>} { success, message }
 */
export const spaOwnerForgotPassword = async ({ email }) => {
  return await apiClient('/spa-owner/forgot-password', {
    method: 'POST',
    skipAuth: true,
    body: JSON.stringify({
      email: email?.trim(),
    }),
  });
};

/**
 * GET /spa-owner/dashboard
 * Retrieves comprehensive spa owner dashboard metrics, registered spa profile,
 * sidebar badge counters, financials, bookings/therapists summaries, and recent bookings.
 *
 * @returns {Promise<Object>} { success, message, data: { assignedCode, metrics, registeredSpa, sidebarBadges, financials, bookingsSummary, therapistsSummary, penaltiesSummary, recentBookings } }
 */
export const getSpaOwnerDashboard = async () => {
  return await apiClient('/spa-owner/dashboard', {
    method: 'GET',
  });
};
export const getOwnerDashboard = getSpaOwnerDashboard;

/**
 * 3. GET /spa-owner/profile
 * Retrieves authenticated spa owner profile
 *
 * @returns {Promise<Object>} { success, message, data: { id, businessName, ownerName, email, phone, spaCode, therapistCount, servicesOffered, branchCount, status, role, createdAt } }
 */
export const getSpaOwnerProfile = async () => {
  return await apiClient('/spa-owner/profile', {
    method: 'GET',
  });
};

/**
 * 4. GET /spa-owner/therapists
 * Retrieves therapists onboarded by authenticated spa owner
 *
 * @returns {Promise<Object>} { success, message, count, data: Array }
 */
export const getSpaOwnerTherapists = async () => {
  return await apiClient('/spa-owner/therapists', {
    method: 'GET',
  });
};

/**
 * 5. POST /spa-owner/therapists
 * Provisions and onboards a new therapist
 *
 * @param {Object} therapistData - Complete therapist payload
 * @returns {Promise<Object>} { success, message, data: Object }
 */
export const onboardTherapist = async (therapistData) => {
  return await apiClient('/spa-owner/therapists', {
    method: 'POST',
    body: JSON.stringify(therapistData),
  });
};

/**
 * 6. POST /assets/uploads
 * Uploads media assets using multipart/form-data
 *
 * @param {Object} params - { file: File, kind: string }
 * @returns {Promise<Object>} { success, message, data: { assetId, kind, url }, meta: { requestId } }
 */
export const uploadAsset = async ({ file, kind = 'SERVICE_IMAGE' }) => {
  if (!file) {
    throw new Error('Please select a file to upload.');
  }

  const formData = new FormData();
  formData.append('kind', kind);
  formData.append('file', file);

  return await apiClient('/assets/uploads', {
    method: 'POST',
    body: formData,
  });
};

/**
 * 7. GET /spa-owner/bookings
 * Retrieves all appointments linked to therapists under this spa owner
 *
 * @param {Object} params - { status, therapistId, startDate, endDate, page, limit }
 * @returns {Promise<Object>} { success, message, count, total, page, limit, data: Array }
 */
export const getSpaOwnerBookings = async (params = {}) => {
  const query = new URLSearchParams();
  
  const limit = params.limit ?? 20;
  const page = params.page ?? 1;
  query.append('limit', String(limit));
  query.append('page', String(page));

  if (params.status && params.status !== 'ALL') {
    query.append('status', String(params.status).trim());
  }

  if (params.therapistId && params.therapistId !== 'ALL') {
    query.append('therapistId', String(params.therapistId).trim());
  }

  if (params.startDate) {
    query.append('startDate', String(params.startDate).trim());
  }

  if (params.endDate) {
    query.append('endDate', String(params.endDate).trim());
  }

  const queryString = query.toString();
  const endpoint = `/spa-owner/bookings${queryString ? `?${queryString}` : ''}`;

  return await apiClient(endpoint, {
    method: 'GET',
  });
};

/**
 * Alias for getSpaOwnerBookings
 */
export const getOwnerBookings = getSpaOwnerBookings;

/**
 * 8. GET /spa-owner/bookings/{id}
 * Retrieves comprehensive booking details by publicId or ObjectId
 *
 * @param {string} id - Booking publicId or ObjectId
 * @returns {Promise<Object>} { success, message, data: Object }
 */
export const getSpaOwnerBookingDetails = async (id) => {
  if (!id) {
    throw new Error('Booking ID is required to fetch details.');
  }
  const cleanId = encodeURIComponent(String(id).trim());
  return await apiClient(`/spa-owner/bookings/${cleanId}`, {
    method: 'GET',
  });
};

/**
 * Alias for getSpaOwnerBookingDetails
 */
export const getOwnerBookingById = getSpaOwnerBookingDetails;

/**
 * 9. GET /spa-owner/commissions
 * Retrieve commission earnings history and summary for the Spa Owner
 *
 * @param {Object} params - { page, limit, therapistId }
 * @returns {Promise<Object>} { success, message, data: { summary, commissions, pagination } }
 */
export const getSpaOwnerCommissions = async (params = {}) => {
  const query = new URLSearchParams();

  const limit = params.limit ?? 20;
  const page = params.page ?? 1;
  query.append('limit', String(limit));
  query.append('page', String(page));

  if (params.therapistId && params.therapistId !== 'ALL') {
    query.append('therapistId', String(params.therapistId).trim());
  }

  const queryString = query.toString();
  const endpoint = `/spa-owner/commissions${queryString ? `?${queryString}` : ''}`;

  return await apiClient(endpoint, {
    method: 'GET',
  });
};

/**
 * Alias for getSpaOwnerCommissions
 */
export const getOwnerCommissions = getSpaOwnerCommissions;

/**
 * 10. GET /spa-owner/payout-account
 * Retrieve Spa Owner bank and UPI payout account configuration
 */
export const getSpaOwnerPayoutAccount = async () => {
  return await apiClient('/spa-owner/payout-account', {
    method: 'GET',
  });
};
export const getOwnerPayoutAccount = getSpaOwnerPayoutAccount;

/**
 * 11. PATCH /spa-owner/payout-account
 * Save or update Spa Owner bank account and UPI details (auto-upsert)
 * @param {Object} data - { accountHolderName, bankName, accountNumber, ifscCode, upiId, preferredMethod }
 */
export const updateSpaOwnerPayoutAccount = async (data = {}) => {
  return await apiClient('/spa-owner/payout-account', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};
export const updateOwnerPayoutAccount = updateSpaOwnerPayoutAccount;

/**
 * 12. POST /spa-owner/payout-requests
 * Request a payout / withdrawal from available commission balance
 * @param {Object} data - { amountRupees, payoutMethod, adminNotes }
 */
export const createSpaOwnerPayoutRequest = async (data = {}) => {
  return await apiClient('/spa-owner/payout-requests', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};
export const requestOwnerPayout = createSpaOwnerPayoutRequest;

/**
 * 13. GET /spa-owner/payouts
 * View full history of payout requests and processing statuses
 * @param {Object} params - { page, limit, status }
 */
export const getSpaOwnerPayoutHistory = async (params = {}) => {
  const query = new URLSearchParams();

  const limit = params.limit ?? 20;
  const page = params.page ?? 1;
  query.append('limit', String(limit));
  query.append('page', String(page));

  if (params.status && params.status !== 'ALL') {
    query.append('status', String(params.status).trim());
  }

  const queryString = query.toString();
  const endpoint = `/spa-owner/payouts${queryString ? `?${queryString}` : ''}`;

  return await apiClient(endpoint, {
    method: 'GET',
  });
};
export const getOwnerPayoutHistory = getSpaOwnerPayoutHistory;

/**
 * 14. GET /admin/cancellation-policy
 * Retrieve the current cancellation policy and fee configurations
 */
export const getSpaOwnerCancellationPolicy = async () => {
  return await apiClient('/admin/cancellation-policy', {
    method: 'GET',
  });
};
export const getCancellationPolicy = getSpaOwnerCancellationPolicy;
/**
 * 15. GET /spa-owner/cancellation-penalties/report
 * Retrieve Cancellation penalties report and audit records for the Spa Owner
 * @param {Object} params - { limit }
 */
export const getSpaOwnerCancellationPenaltiesReport = async (params = {}) => {
  const query = new URLSearchParams();
  const limit = params.limit ?? 100;
  query.append('limit', String(limit));

  return await apiClient(`/spa-owner/cancellation-penalties/report?${query.toString()}`, {
    method: 'GET',
  });
};
export const getCancellationPenaltiesReport = getSpaOwnerCancellationPenaltiesReport;

/**
 * GET /spa-owner/sub-owners/:codeOrId
 * Retrieves sub-spa owners / downline list by spaCode, Mongo ID, or authenticated owner
 *
 * @param {string} codeOrId - Spa Code (e.g. SPA-427939) or Mongo ID
 * @returns {Promise<Object>} { success, message, data: { sponsor, totalSubOwners, activeSubOwners, subOwners: [], pendingInquiriesCount, pendingInquiries: [] } }
 */
export const getSpaOwnerSubOwners = async (codeOrId) => {
  if (!codeOrId?.trim()) {
    throw new Error('A spa code is required to retrieve sponsored sub-spas.');
  }

  return await apiClient(
    `/spa-owner/sub-owners/${encodeURIComponent(codeOrId.trim())}`,
    { method: 'GET' }
  );
};

/**
 * Retrieves sponsored sub-spas for the supplied spa code.
 */
export const getSponsoredSpas = getSpaOwnerSubOwners;

export default {
  getSpaOwnerDashboard,
  getOwnerDashboard,
  spaOwnerLogin,
  spaOwnerForgotPassword,
  getSpaOwnerProfile,
  getSpaOwnerTherapists,
  onboardTherapist,
  uploadAsset,
  getSpaOwnerBookings,
  getOwnerBookings,
  getSpaOwnerBookingDetails,
  getOwnerBookingById,
  getSpaOwnerCommissions,
  getOwnerCommissions,
  getSpaOwnerPayoutAccount,
  getOwnerPayoutAccount,
  updateSpaOwnerPayoutAccount,
  updateOwnerPayoutAccount,
  createSpaOwnerPayoutRequest,
  requestOwnerPayout,
  getSpaOwnerPayoutHistory,
  getOwnerPayoutHistory,
  getSpaOwnerCancellationPolicy,
  getCancellationPolicy,
  getSpaOwnerCancellationPenaltiesReport,
  getCancellationPenaltiesReport,
  getSponsoredSpas,
  getSpaOwnerSubOwners,
};


