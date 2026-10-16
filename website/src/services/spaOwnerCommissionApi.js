import { apiClient } from './apiClient.js';

/**
 * Admin: Get referral commission
 * Method: GET
 * Endpoint: /admin/spa-owner-referral-commission
 */
export const getReferralCommission = async () => {
  return await apiClient('/admin/spa-owner-referral-commission', {
    method: 'GET',
  });
};

/**
 * Admin: Update referral commission
 * Method: PUT
 * Endpoint: /admin/spa-owner-referral-commission
 * Body: { percentage: number }
 */
export const updateReferralCommission = async (percentage) => {
  return await apiClient('/admin/spa-owner-referral-commission', {
    method: 'PUT',
    body: JSON.stringify({
      percentage: Number(percentage),
    }),
  });
};

/**
 * Spa Owner: Commission history & summary
 * Method: GET
 * Endpoint: /spa-owner/commissions?page=1&limit=20
 */
export const getSpaOwnerCommissions = async (page = 1, limit = 20, params = {}) => {
  const query = new URLSearchParams();
  query.append('page', String(page ?? 1));
  query.append('limit', String(limit ?? 20));

  if (params?.commissionType && params.commissionType !== 'ALL') {
    query.append('commissionType', String(params.commissionType).trim());
  }
  if (params?.therapistId && params.therapistId !== 'ALL') {
    query.append('therapistId', String(params.therapistId).trim());
  }

  const qs = query.toString();
  return await apiClient(`/spa-owner/commissions${qs ? `?${qs}` : ''}`, {
    method: 'GET',
  });
};

/**
 * Spa Owner: Sub-owner details
 * Method: GET
 * Endpoint: /spa-owner/sub-owners/:identifier
 */
export const getSubOwners = async (spaCode) => {
  if (!spaCode || !String(spaCode).trim()) {
    throw new Error('A spa code is required to retrieve sub-owners.');
  }
  return await apiClient(
    `/spa-owner/sub-owners/${encodeURIComponent(String(spaCode).trim())}`,
    { method: 'GET' }
  );
};

export default {
  getReferralCommission,
  updateReferralCommission,
  getSpaOwnerCommissions,
  getSubOwners,
};
