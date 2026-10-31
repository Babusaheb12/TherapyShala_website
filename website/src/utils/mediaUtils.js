/**
 * Resolves media asset URLs for robust rendering across environments.
 * 
 * 1. If URL is served from ngrok and contains '/media/', convert to local relative path '/media/...'
 *    so it is proxied via Vite (which automatically injects 'ngrok-skip-browser-warning: true').
 *    This prevents browsers from receiving the ngrok HTML interstitial and breaking <img> tags.
 * 2. If URL is relative or standard absolute URL (Cloudinary, S3, CDN), returns as-is.
 * 3. Gracefully handles null/undefined inputs.
 */
export const resolveMediaUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // If it's an ngrok URL pointing to /media/, route through local Vite proxy
  if (trimmed.includes('/media/')) {
    const idx = trimmed.indexOf('/media/');
    return trimmed.substring(idx);
  }

  return trimmed;
};

/**
 * Returns the best available avatar URL for a therapist object,
 * checking avatarUrl, companyPhotoUrl, appPhotoUrl, profilePhoto.
 */
export const getTherapistAvatarUrl = (therapist) => {
  if (!therapist) return '';
  const raw =
    therapist.avatarUrl ||
    therapist.companyPhotoUrl ||
    therapist.appPhotoUrl ||
    therapist.appProfilePhoto ||
    therapist.profilePhoto ||
    '';
  return resolveMediaUrl(raw);
};
