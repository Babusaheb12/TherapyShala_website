/**
 * Validation utilities for SpaMate Multi-Business Module
 */

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  const cleaned = phone.replace(/[^0-9]/g, '');
  // Valid Indian mobile numbers are 10 digits or 12 digits (with 91 prefix)
  return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('91'));
};

export const validateGSTIN = (gstin) => {
  if (!gstin || typeof gstin !== 'string') return false;
  const clean = gstin.trim().toUpperCase();
  // Standard Indian GSTIN: 2 digits (state code) + 10 chars PAN + 1 entity num + 1 'Z' + 1 check digit
  const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return re.test(clean);
};

export const validatePAN = (pan) => {
  if (!pan || typeof pan !== 'string') return false;
  const clean = pan.trim().toUpperCase();
  const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return re.test(clean);
};

export const validateIFSC = (ifsc) => {
  if (!ifsc || typeof ifsc !== 'string') return false;
  const clean = ifsc.trim().toUpperCase();
  const re = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return re.test(clean);
};

export const validateAadhaar = (aadhaar) => {
  if (!aadhaar || typeof aadhaar !== 'string') return false;
  const cleaned = aadhaar.replace(/[^0-9]/g, '');
  return cleaned.length === 12;
};

export const validatePincode = (pincode) => {
  if (!pincode || typeof pincode !== 'string') return false;
  const cleaned = pincode.replace(/[^0-9]/g, '');
  return cleaned.length === 6;
};

export const validateCoordinates = (lat, lng) => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  if (isNaN(latitude) || isNaN(longitude)) return false;
  return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
};

/**
 * Step validation helper for multi-step onboarding
 */
export const validateOnboardingStep = (step, data) => {
  const errors = {};

  if (step === 1) {
    // 1. Business Basic Information
    if (!data.name || data.name.trim().length < 3) {
      errors.name = 'Business name is required (min 3 characters)';
    }
    if (!data.type) {
      errors.type = 'Please select a business type';
    }
    if (!data.description || data.description.trim().length < 20) {
      errors.description = 'Please provide a detailed bio/description (min 20 characters)';
    }
    if (!validatePhone(data.phone)) {
      errors.phone = 'Valid 10-digit business phone is required';
    }
    if (!validateEmail(data.email)) {
      errors.email = 'Valid business email is required';
    }
    if (!data.gallery || data.gallery.length < 3) {
      errors.gallery = `Minimum 3 photos required for gallery (currently ${data.gallery ? data.gallery.length : 0})`;
    } else if (data.gallery.length > 5) {
      errors.gallery = 'Maximum 5 photos allowed in gallery';
    }
  }

  if (step === 2) {
    // 2. Owner / Admin
    if (!data.ownerName || data.ownerName.trim().length < 2) {
      errors.ownerName = 'Owner/Admin full name is required';
    }
    if (!validatePhone(data.ownerPhone || data.phone)) {
      errors.ownerPhone = 'Valid 10-digit mobile number is required';
    }
    if (!validateEmail(data.ownerEmail || data.email)) {
      errors.ownerEmail = 'Valid email is required';
    }
    if (!data.isOtpVerified) {
      errors.isOtpVerified = 'Mobile OTP verification is required to proceed';
    }
  }

  if (step === 3) {
    // 3. Business Address
    if (!data.addressLine1 || data.addressLine1.trim().length < 5) {
      errors.addressLine1 = 'Street address line 1 is required';
    }
    if (!data.city || data.city.trim().length < 2) {
      errors.city = 'City is required';
    }
    if (!data.state || data.state.trim().length < 2) {
      errors.state = 'State is required';
    }
    if (!validatePincode(data.pincode)) {
      errors.pincode = 'Valid 6-digit Indian PIN code is required';
    }
    if (!validateCoordinates(data.latitude, data.longitude)) {
      errors.gps = 'Valid GPS coordinates (Latitude & Longitude) are required';
    }
  }

  if (step === 4) {
    // 4. Legal & GST
    if (data.isGstRegistered) {
      if (!validateGSTIN(data.gstin)) {
        errors.gstin = 'Valid 15-character GSTIN is required (e.g., 08AAAAA0000A1Z5)';
      }
    }
    if (!data.legalBusinessName || data.legalBusinessName.trim().length < 2) {
      errors.legalBusinessName = 'Legal business entity name is required';
    }
    if (!validatePAN(data.panNumber)) {
      errors.panNumber = 'Valid 10-character Business PAN is required (e.g., ABCDE1234F)';
    }
    if (!data.constitution) {
      errors.constitution = 'Please select a registration constitution';
    }
  }

  if (step === 5) {
    // 5. Branch Management
    if (data.isMultiBranch) {
      if (!data.branches || data.branches.length === 0) {
        errors.branches = 'At least one branch must be configured for multi-branch mode';
      } else {
        data.branches.forEach((br, idx) => {
          if (!br.name || br.name.trim().length < 2) {
            errors[`branch_${idx}_name`] = `Branch #${idx + 1} name is required`;
          }
          if (!br.city || br.city.trim().length < 2) {
            errors[`branch_${idx}_city`] = `Branch #${idx + 1} city is required`;
          }
        });
      }
    }
  }

  if (step === 6) {
    // 6. Operating Hours
    if (!data.operatingHours || data.operatingHours.length < 7) {
      errors.operatingHours = 'Operating hours must be configured for all 7 days (Monday–Sunday)';
    }
  }

  if (step === 7) {
    // 7. Bank & KYC
    if (!data.accountHolderName || data.accountHolderName.trim().length < 2) {
      errors.accountHolderName = 'Bank account holder name is required';
    }
    if (!data.accountNumber || data.accountNumber.length < 8) {
      errors.accountNumber = 'Valid bank account number is required';
    }
    if (data.accountNumber !== data.confirmAccountNumber) {
      errors.confirmAccountNumber = 'Account numbers do not match';
    }
    if (!validateIFSC(data.ifscCode)) {
      errors.ifscCode = 'Valid 11-character IFSC code is required (e.g., HDFC0001234)';
    }
    if (data.aadhaarNumber && !validateAadhaar(data.aadhaarNumber)) {
      errors.aadhaarNumber = 'Valid 12-digit Aadhaar number required';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
