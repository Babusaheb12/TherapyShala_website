/**
 * SpaMate Multi-Business Domain Models & Entity Factories
 * Architecture: Organization → Branches → Users/Staff → Services → Appointments → Customers
 */

export const BUSINESS_TYPES = [
  { id: 'spa', name: 'Spa', description: 'Day spas, hydrotherapy & massage lounges' },
  { id: 'salon', name: 'Salon', description: 'Hair styling, grooming & blow dry bars' },
  { id: 'spa_salon', name: 'Spa & Salon', description: 'Combined holistic spa & hair/beauty studio' },
  { id: 'beauty_parlour', name: 'Beauty Parlour', description: 'Facials, makeup, waxing & threading services' },
  { id: 'wellness_center', name: 'Wellness Center', description: 'Holistic healing, yoga, detox & naturopathy' },
  { id: 'ayurvedic_clinic', name: 'Ayurvedic Clinic', description: 'Panchakarma, herbal remedies & dosha therapy' },
  { id: 'nail_lash_studio', name: 'Nail & Lash Studio', description: 'Nail art, extensions, lash lifts & brow tinting' },
  { id: 'other', name: 'Other', description: 'Specialized aesthetic & recovery studios' }
];

export const REGISTRATION_CONSTITUTIONS = [
  'Proprietorship',
  'Partnership',
  'LLP',
  'Private Limited Company',
  'Public Limited Company',
  'OPC',
  'Trust / Society / NGO',
  'Other'
];

export const BRANCH_STATUSES = [
  { id: 'active', label: 'Active', color: 'green' },
  { id: 'temporarily_closed', label: 'Temporarily Closed', color: 'amber' },
  { id: 'under_renovation', label: 'Under Renovation', color: 'blue' },
  { id: 'inactive', label: 'Inactive', color: 'gray' }
];

export const USER_ROLES = [
  { id: 'owner_admin', name: 'Owner / Super Admin', permissions: ['all'] },
  { id: 'branch_manager', name: 'Branch Manager', permissions: ['branch_manage', 'appointments', 'staff_view', 'billing'] },
  { id: 'receptionist', name: 'Front Desk / Receptionist', permissions: ['appointments', 'billing_create', 'customers'] },
  { id: 'therapist', name: 'Therapist / Stylist', permissions: ['appointments_own', 'schedule_view'] },
  { id: 'accountant', name: 'Accountant', permissions: ['payouts', 'gst_reports', 'invoices'] }
];

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

export const createDefaultOperatingHours = () => {
  return DAYS_OF_WEEK.map((day) => ({
    day,
    isOpen: true,
    openingTime: '09:00 AM',
    closingTime: '09:00 PM',
    breakStart: '',
    breakEnd: ''
  }));
};

/**
 * Factory for creating a Branch entity
 */
export const createBranchEntity = (data = {}) => {
  const branchId = data.id || `branch-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
  return {
    id: branchId,
    name: data.name || 'Main Flagship Branch',
    isMain: data.isMain !== undefined ? data.isMain : true,
    phone: data.phone || '',
    email: data.email || '',
    address: data.address || '',
    city: data.city || '',
    state: data.state || '',
    country: data.country || 'India',
    pincode: data.pincode || '',
    latitude: data.latitude || 26.9124,
    longitude: data.longitude || 75.7873,
    roomCapacity: parseInt(data.roomCapacity || 4, 10),
    chairCapacity: parseInt(data.chairCapacity || 6, 10),
    branchGSTIN: data.branchGSTIN || '',
    operatingHours: data.operatingHours || createDefaultOperatingHours(),
    status: data.status || 'active',
    images: data.images || [],
    staffIds: data.staffIds || [],
    serviceIds: data.serviceIds || [],
    createdAt: data.createdAt || new Date().toISOString()
  };
};

/**
 * Factory for creating a Staff Member entity
 */
export const createStaffEntity = (data = {}) => {
  return {
    id: data.id || `staff-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: data.name || '',
    role: data.role || 'Therapist',
    roleId: data.roleId || 'therapist',
    phone: data.phone || '',
    email: data.email || '',
    branchId: data.branchId || null,
    specialization: data.specialization || 'Swedish & Deep Tissue Massage',
    experienceYears: data.experienceYears || 5,
    rating: data.rating || 4.9,
    avatar: data.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    bio: data.bio || '',
    isActive: data.isActive !== undefined ? data.isActive : true
  };
};

/**
 * Factory for creating an Organization (Business) Entity
 */
export const createOrganizationEntity = (data = {}) => {
  const orgId = data.id || `org-${Date.now()}`;
  const slug = data.slug || (data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : `business-${Date.now()}`);

  return {
    // 1. Basic Info
    id: orgId,
    slug: slug,
    name: data.name || '',
    type: data.type || 'Spa & Salon',
    typeId: data.typeId || 'spa_salon',
    description: data.description || '',
    tagline: data.tagline || '',
    phone: data.phone || '',
    email: data.email || '',
    website: data.website || '',
    logo: data.logo || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=200&q=80',
    coverImage: data.coverImage || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    gallery: data.gallery && data.gallery.length > 0 ? data.gallery : [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80'
    ],

    // 2. Owner / Admin
    owner: {
      fullName: data.owner?.fullName || data.ownerName || '',
      mobile: data.owner?.mobile || data.phone || '',
      email: data.owner?.email || data.email || '',
      isOtpVerified: data.owner?.isOtpVerified || false,
      isPasswordlessEnabled: data.owner?.isPasswordlessEnabled || true,
      verifiedAt: data.owner?.verifiedAt || null
    },

    // 3. Primary Business Address
    address: {
      line1: data.address?.line1 || data.primaryAddress || '',
      line2: data.address?.line2 || data.landmark || '',
      city: data.address?.city || data.primaryCity || data.city || '',
      state: data.address?.state || data.primaryState || data.state || '',
      country: data.address?.country || 'India',
      pincode: data.address?.pincode || data.primaryPincode || '',
      latitude: data.address?.latitude || data.latitude || 26.9124,
      longitude: data.address?.longitude || data.longitude || 75.7873
    },

    // 4. Legal & GST
    legal: {
      isGstRegistered: data.legal?.isGstRegistered !== undefined ? data.legal.isGstRegistered : true,
      gstin: data.legal?.gstin || '',
      legalBusinessName: data.legal?.legalBusinessName || data.name || '',
      panNumber: data.legal?.panNumber || '',
      constitution: data.legal?.constitution || 'Private Limited Company',
      verified: data.legal?.verified || false
    },

    // 5. Branch Management
    isMultiBranch: data.isMultiBranch !== undefined ? data.isMultiBranch : (data.branches && data.branches.length > 1),
    branches: (data.branches && data.branches.length > 0)
      ? data.branches.map(b => createBranchEntity(b))
      : [createBranchEntity({
          name: `${data.name || 'Flagship'} (Main)`,
          phone: data.phone,
          email: data.email,
          address: data.primaryAddress || data.address?.line1,
          city: data.primaryCity || data.address?.city,
          state: data.primaryState || data.address?.state,
          pincode: data.primaryPincode || data.address?.pincode,
          isMain: true
        })],

    // 6. Organization Level Operating Hours
    operatingHours: data.operatingHours || createDefaultOperatingHours(),

    // 7. Bank & KYC
    kyc: {
      accountHolderName: data.kyc?.accountHolderName || data.ownerName || '',
      accountNumber: data.kyc?.accountNumber || '',
      ifscCode: data.kyc?.ifscCode || '',
      bankName: data.kyc?.bankName || '',
      upiId: data.kyc?.upiId || '',
      aadhaarNumber: data.kyc?.aadhaarNumber || '',
      aadhaarFrontDoc: data.kyc?.aadhaarFrontDoc || null,
      aadhaarBackDoc: data.kyc?.aadhaarBackDoc || null,
      panCardDoc: data.kyc?.panCardDoc || null,
      businessProofDoc: data.kyc?.businessProofDoc || null,
      cancelledChequeDoc: data.kyc?.cancelledChequeDoc || null,
      verificationStatus: data.kyc?.verificationStatus || 'Verified'
    },

    // Associated Entities (Staff, Services, Packages, Settings)
    staff: data.staff || [],
    services: data.services || [],
    packages: data.packages || [],
    rating: data.rating || 4.9,
    reviewsCount: data.reviewsCount || 128,
    featured: data.featured || false,
    startingPrice: data.startingPrice || '₹1,499',
    rawStartingPrice: data.rawStartingPrice || 1499,
    facilities: data.facilities || ['Private Suites', 'Complimentary Herbal Tea', 'Valet Parking', 'UV Sanitized'],
    createdAt: data.createdAt || new Date().toISOString(),
    status: data.status || 'Active'
  };
};
