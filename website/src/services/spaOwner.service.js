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
 * POST /spa-owner/logout
 * Logs out spa owner, revoking the token and invalidating session on server
 *
 * @returns {Promise<Object>} { success, message }
 */
export const spaOwnerLogout = async () => {
  return await apiClient('/spa-owner/logout', {
    method: 'POST',
    credentials: 'include',
    skipUnauthorizedEvent: true,
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
 * 3b. PATCH /spa-owner/profile
 * Updates authenticated spa owner profile, app showcase, and banking details
 *
 * @param {Object} data - Complete profile payload
 * @returns {Promise<Object>} { success, message, data }
 */
export const updateSpaOwnerProfile = async (data = {}) => {
  return await apiClient('/spa-owner/profile', {
    method: 'PATCH',
    body: JSON.stringify(data),
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
 * GET /spa-owner/therapists/{id}
 * Retrieves comprehensive details for a specific therapist
 *
 * @param {string} id - Therapist ID or profileId
 * @returns {Promise<Object>} { success, message, data: Object }
 */
export const getSpaOwnerTherapistById = async (id) => {
  if (!id) {
    throw new Error('Therapist ID is required to fetch details.');
  }
  const cleanId = encodeURIComponent(String(id).trim());
  return await apiClient(`/spa-owner/therapists/${cleanId}`, {
    method: 'GET',
  });
};

/**
 * PATCH /spa-owner/therapists/{id}
 * Updates specific therapist fields (e.g. dutyStatus, serviceRadiusKm, services, bio, etc.)
 *
 * @param {string} id - Therapist ID or profileId
 * @param {Object} updateData - Object containing updated fields
 * @returns {Promise<Object>} { success, message, data: Object }
 */
export const updateSpaOwnerTherapist = async (id, updateData) => {
  if (!id) {
    throw new Error('Therapist ID is required to update therapist details.');
  }
  const cleanId = encodeURIComponent(String(id).trim());
  return await apiClient(`/spa-owner/therapists/${cleanId}`, {
    method: 'PATCH',
    body: JSON.stringify(updateData),
  });
};

/**
 * PATCH /spa-owner/therapists/{id}/duty-status
 * Updates therapist duty status (ON_DUTY or OFF_DUTY)
 *
 * @param {string} id - Therapist public ID or MongoDB profile ID
 * @param {string} dutyStatus - 'ON_DUTY' | 'OFF_DUTY'
 * @returns {Promise<Object>} { success, message, data: Object }
 */
export const updateSpaOwnerTherapistDutyStatus = async (id, dutyStatus) => {
  if (!id) {
    throw new Error('Therapist ID is required to update duty status.');
  }
  const cleanId = encodeURIComponent(String(id).trim());
  const normalizedDuty = dutyStatus === 'ON_DUTY' ? 'ON_DUTY' : 'OFF_DUTY';

  try {
    return await apiClient(`/spa-owner/therapists/${cleanId}/duty-status`, {
      method: 'PATCH',
      body: JSON.stringify({ dutyStatus: normalizedDuty }),
    });
  } catch (err) {
    // If the endpoint returns 404 or fails, fallback to general PATCH /spa-owner/therapists/{id}
    if (err?.status === 404 || String(err?.message || '').includes('404')) {
      return await apiClient(`/spa-owner/therapists/${cleanId}`, {
        method: 'PATCH',
        body: JSON.stringify({ dutyStatus: normalizedDuty }),
      });
    }
    throw err;
  }
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

  const allowedKinds = [
    'SERVICE_IMAGE',
    'DEMO_VIDEO',
    'SUPPORT_ATTACHMENT',
    'AVATAR',
    'KYC_FRONT',
    'KYC_BACK',
  ];
  const safeKind = allowedKinds.includes(kind) ? kind : 'SERVICE_IMAGE';

  const formData = new FormData();
  formData.append('kind', safeKind);
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
 * Accepts a therapist job request belonging to the authenticated spa owner.
 *
 * @param {Object} params - { jobRequestId, bookingId, scheduledVisitTime }
 * @returns {Promise<Object>}
 */
export const acceptSpaOwnerJobRequest = async ({
  jobRequestId,
  bookingId,
  scheduledVisitTime,
}) => {
  if (!jobRequestId || !bookingId || !scheduledVisitTime) {
    throw new Error('Job request, booking, and scheduled visit time are required.');
  }
  const scheduledDate = new Date(scheduledVisitTime);
  if (Number.isNaN(scheduledDate.getTime()) || scheduledDate.getTime() <= Date.now()) {
    throw new Error('Scheduled visit time must be in the future.');
  }

  const cleanId = encodeURIComponent(String(jobRequestId).trim());
  return await apiClient(`/spa-owner/job-requests/${cleanId}/accept`, {
    method: 'POST',
    body: JSON.stringify({
      jobRequestId: String(jobRequestId).trim(),
      bookingId: String(bookingId).trim(),
      status: 'ACCEPTED',
      scheduledVisitTime: scheduledDate.toISOString(),
    }),
  });
};

/**
 * Declines a therapist job request belonging to the authenticated spa owner.
 *
 * @param {Object} params - { jobRequestId, reason }
 * @returns {Promise<Object>}
 */
export const declineSpaOwnerJobRequest = async ({ jobRequestId, reason }) => {
  if (!jobRequestId || !reason?.trim()) {
    throw new Error('Job request and decline reason are required.');
  }

  const cleanId = encodeURIComponent(String(jobRequestId).trim());
  return await apiClient(`/spa-owner/job-requests/${cleanId}/decline`, {
    method: 'POST',
    body: JSON.stringify({ reason: reason.trim() }),
  });
};

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

  if (params.commissionType && params.commissionType !== 'ALL') {
    query.append('commissionType', String(params.commissionType).trim());
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
    { method: 'GET', skipUnauthorizedEvent: true }
  );
};

/**
 * Retrieves sponsored sub-spas for the supplied spa code.
 */
export const getSponsoredSpas = getSpaOwnerSubOwners;
export const getSubOwners = getSpaOwnerSubOwners;

/**
 * Admin Referral Commission Configuration
 */
export const getReferralCommission = async () => {
  return await apiClient('/admin/spa-owner-referral-commission', {
    method: 'GET',
    skipUnauthorizedEvent: true,
  });
};

export const updateReferralCommission = async (percentage) => {
  return await apiClient('/admin/spa-owner-referral-commission', {
    method: 'PUT',
    body: JSON.stringify({ percentage: Number(percentage) }),
    skipUnauthorizedEvent: true,
  });
};

/**
 * GET /spa-owner/notifications?limit=20&cursor=<NEXT_CURSOR>
 * Retrieves notifications list, unreadCount, and nextCursor
 *
 * @param {Object} params - { limit: number, cursor: string }
 * @returns {Promise<Object>} { success, data: Array, meta: { unreadCount: number, nextCursor: string } }
 */
export const getSpaOwnerNotifications = async ({ limit = 20, cursor = null } = {}) => {
  const query = new URLSearchParams();
  if (limit) query.append('limit', String(limit));
  if (cursor) query.append('cursor', String(cursor).trim());

  const queryString = query.toString();
  const endpoint = `/spa-owner/notifications${queryString ? `?${queryString}` : ''}`;

  return await apiClient(endpoint, {
    method: 'GET',
  });
};

/**
 * PATCH /spa-owner/notifications/<NOTIFICATION_ID>/read
 * Marks a specific notification as read
 *
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} { success, message, data: Object }
 */
export const markSpaOwnerNotificationAsRead = async (notificationId) => {
  if (!notificationId) {
    throw new Error('Notification ID is required.');
  }
  const cleanId = encodeURIComponent(String(notificationId).trim());
  return await apiClient(`/spa-owner/notifications/${cleanId}/read`, {
    method: 'PATCH',
  });
};

/**
 * GET /categories (api/v1/categories)
 * Retrieves available therapy categories for assigning services
 *
 * @returns {Promise<Object>} { success, message, data: Array<{ id, name, slug, iconUrl }> }
 */
export const getCategories = async () => {
  return await apiClient('/categories', {
    method: 'GET',
  });
};
/**
 * GET /spa-owner/support
 * Retrieves support overview, contact details, FAQs, and support desk stats
 *
 * @returns {Promise<Object>} { success, message, data }
 */
export const getSpaOwnerSupportOverview = async () => {
  return await apiClient('/spa-owner/support', {
    method: 'GET',
  });
};

/**
 * GET /spa-owner/support/tickets
 * Retrieves all support tickets opened by the spa owner
 *
 * @param {Object} [params] - optional query params (page, limit, status)
 * @returns {Promise<Object>} { success, message, data: Array<Ticket>, count, total }
 */
export const getSpaOwnerSupportTickets = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);
  if (params.status && params.status !== 'ALL') query.append('status', params.status);
  const qStr = query.toString();
  const endpoint = `/spa-owner/support/tickets${qStr ? `?${qStr}` : ''}`;
  return await apiClient(endpoint, {
    method: 'GET',
  });
};

/**
 * POST /spa-owner/support/tickets
 * Creates a new support ticket
 *
 * @param {Object} payload - { category, priority, relatedBookingId, subject, message }
 * @returns {Promise<Object>} { success, message, data: Ticket }
 */
export const createSpaOwnerSupportTicket = async ({
  category = 'GENERAL',
  priority = 'NORMAL',
  relatedBookingId,
  subject,
  message,
}) => {
  const body = {
    category: category || 'GENERAL',
    priority: priority || 'NORMAL',
    subject: subject?.trim(),
    message: message?.trim(),
  };
  if (relatedBookingId && String(relatedBookingId).trim()) {
    body.relatedBookingId = String(relatedBookingId).trim();
  }
  return await apiClient('/spa-owner/support/tickets', {
    method: 'POST',
    body: JSON.stringify(body),
  });
};

/**
 * GET /spa-owner/support/tickets/<ID>
 * Retrieves a specific support ticket and its replies / conversation thread
 *
 * @param {string} ticketId - ticket ID
 * @returns {Promise<Object>} { success, message, data: Ticket }
 */
export const getSpaOwnerSupportTicketById = async (ticketId) => {
  const cleanId = encodeURIComponent(String(ticketId).trim());
  return await apiClient(`/spa-owner/support/tickets/${cleanId}`, {
    method: 'GET',
  });
};

/**
 * POST /spa-owner/support/tickets/<ID>/replies
 * Adds a reply message to an existing support ticket
 *
 * @param {string} ticketId - ticket ID
 * @param {Object} payload - { message: string }
 * @returns {Promise<Object>} { success, message, data: Reply }
 */
export const replySpaOwnerSupportTicket = async (ticketId, { message }) => {
  const cleanId = encodeURIComponent(String(ticketId).trim());
  return await apiClient(`/spa-owner/support/tickets/${cleanId}/replies`, {
    method: 'POST',
    body: JSON.stringify({
      message: message?.trim(),
    }),
  });
};

export default {
  getSpaOwnerNotifications,
  markSpaOwnerNotificationAsRead,
  getSpaOwnerDashboard,
  getOwnerDashboard,
  spaOwnerLogin,
  spaOwnerLogout,
  spaOwnerForgotPassword,
  getSpaOwnerProfile,
  updateSpaOwnerProfile,
  getSpaOwnerTherapists,
  getSpaOwnerTherapistById,
  updateSpaOwnerTherapist,
  updateSpaOwnerTherapistDutyStatus,
  onboardTherapist,
  uploadAsset,
  getSpaOwnerBookings,
  getOwnerBookings,
  getSpaOwnerBookingDetails,
  getOwnerBookingById,
  acceptSpaOwnerJobRequest,
  declineSpaOwnerJobRequest,
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
  getCategories,
  getSpaOwnerSupportOverview,
  getSpaOwnerSupportTickets,
  createSpaOwnerSupportTicket,
  getSpaOwnerSupportTicketById,
  replySpaOwnerSupportTicket,
};


