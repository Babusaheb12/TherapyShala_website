import { useState } from 'react';
import { User } from 'lucide-react';
import { resolveMediaUrl } from '../../utils/mediaUtils';

export default function BookingTherapistAvatar({ therapist, className = 'w-8 h-8' }) {
  const avatarUrl = resolveMediaUrl(therapist?.avatarUrl);
  const [failedUrl, setFailedUrl] = useState(null);
  const showPhoto = Boolean(avatarUrl && avatarUrl !== failedUrl);

  return (
    <div className={`relative rounded-full bg-rose-50 text-[#F35271] flex items-center justify-center overflow-hidden shrink-0 ${className}`}>
      {!showPhoto && <User className="w-1/2 h-1/2" aria-hidden="true" />}
      {showPhoto && (
        <img
          key={avatarUrl}
          src={avatarUrl}
          alt={therapist?.fullName || therapist?.name || 'Therapist profile'}
          className="block w-full h-full object-cover"
          onError={() => setFailedUrl(avatarUrl)}
        />
      )}
    </div>
  );
}
