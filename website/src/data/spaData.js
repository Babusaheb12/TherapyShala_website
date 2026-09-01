// Comprehensive Multi-Business Spa & Salon Marketplace Data Layer

export const CITY_LOCATIONS = [
  "All Cities",
  "Jaipur",
  "Bangalore",
  "Mumbai",
  "Goa",
  "Delhi NCR",
  "Hyderabad",
  "Pune"
];

export const BUSINESS_TYPES = [
  { id: "all", name: "All Types" },
  { id: "spa", name: "Spa" },
  { id: "salon", name: "Salon" },
  { id: "spa_salon", name: "Spa & Salon" },
  { id: "beauty_parlour", name: "Beauty Parlour" },
  { id: "wellness_center", name: "Wellness Center" },
  { id: "ayurvedic_clinic", name: "Ayurvedic Clinic" },
  { id: "nail_lash_studio", name: "Nail & Lash Studio" },
  { id: "other", name: "Other" }
];

export const SERVICE_CATEGORIES = [
  { id: "all", name: "All Rituals" },
  { id: "massage", name: "Massage & Bodywork" },
  { id: "facial", name: "Facials & Skin renewal" },
  { id: "hair", name: "Hair Care & Styling" },
  { id: "hydrotherapy", name: "Hydrotherapy & Baths" },
  { id: "wellness", name: "Ayurvedic & Holistic" },
  { id: "packages", name: "Passes & Bundles" }
];

const createStandardOperatingHours = (open = "09:00 AM", close = "09:30 PM", closedDay = null) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return days.map(day => ({
    day,
    isOpen: day !== closedDay,
    openingTime: open,
    closingTime: close
  }));
};

export const BUSINESSES_DATA = [
  {
    id: "biz-aura-luxe",
    slug: "aura-luxe-jaipur",
    name: "Aura Luxe Wellness Sanctuary",
    tagline: "Private Hydro-Suites, Volcanic Stones & Botanical Aromatherapy",
    type: "Spa & Salon",
    typeId: "spa_salon",
    city: "Jaipur",
    state: "Rajasthan",
    address: {
      line1: "Plot 18, Tonk Road, Near Rambagh Palace",
      line2: "Opposite Central Park Gate 2",
      city: "Jaipur",
      state: "Rajasthan",
      country: "India",
      pincode: "302015",
      latitude: 26.8924,
      longitude: 75.8073
    },
    shortLocation: "Tonk Road, Jaipur",
    phone: "+91 98765 99881",
    email: "concierge@auraluxewellness.com",
    website: "https://auraluxewellness.com",
    rating: 4.96,
    reviewsCount: 412,
    startingPrice: "₹1,999",
    rawStartingPrice: 1999,
    isOpen: true,
    openingHours: "09:00 AM - 09:30 PM",
    workingDays: "Monday - Sunday (7 Days)",
    operatingSchedule: createStandardOperatingHours("09:00 AM", "09:30 PM"),
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=200&q=80",
    description: "Aura Luxe is Jaipur's flagship wellness sanctuary featuring soundproof thermal hydrotherapy suites, heated volcanic stone chambers, and organic European botanical elixirs.",
    owner: {
      fullName: "Devika Singhania",
      mobile: "+91 98765 99881",
      email: "devika@auraluxewellness.com",
      isOtpVerified: true,
      isPasswordlessEnabled: true
    },
    legal: {
      isGstRegistered: true,
      gstin: "08AABCA1234F1Z9",
      legalBusinessName: "Aura Luxe Wellness Private Limited",
      panNumber: "AABCA1234F",
      constitution: "Private Limited Company",
      verified: true
    },
    isMultiBranch: true,
    branches: [
      {
        id: "branch-aura-tonk",
        name: "Aura Luxe - Rambagh Palace Flagship",
        isMain: true,
        phone: "+91 98765 99881",
        email: "rambagh@auraluxewellness.com",
        address: "Plot 18, Tonk Road, Near Rambagh Palace",
        city: "Jaipur",
        state: "Rajasthan",
        pincode: "302015",
        latitude: 26.8924,
        longitude: 75.8073,
        roomCapacity: 8,
        chairCapacity: 12,
        branchGSTIN: "08AABCA1234F1Z9",
        status: "active",
        operatingHours: createStandardOperatingHours("09:00 AM", "09:30 PM")
      },
      {
        id: "branch-aura-vaishali",
        name: "Aura Luxe - Vaishali Nagar Boutique",
        isMain: false,
        phone: "+91 98765 99882",
        email: "vaishali@auraluxewellness.com",
        address: "Queens Road, Vaishali Nagar",
        city: "Jaipur",
        state: "Rajasthan",
        pincode: "302021",
        latitude: 26.9048,
        longitude: 75.7483,
        roomCapacity: 5,
        chairCapacity: 8,
        branchGSTIN: "08AABCA1234F1Z9",
        status: "active",
        operatingHours: createStandardOperatingHours("10:00 AM", "09:00 PM")
      }
    ],
    kyc: {
      accountHolderName: "Aura Luxe Wellness Pvt Ltd",
      accountNumber: "50200049281920",
      ifscCode: "HDFC0000054",
      bankName: "HDFC Bank Ltd",
      upiId: "auraluxe@hdfcbank",
      aadhaarNumber: "XXXX-XXXX-9120",
      verificationStatus: "Verified"
    },
    gallery: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=800&q=80"
    ],
    facilities: [
      "Private Hydrotherapy Tubs",
      "UV-C Sterilized Suites",
      "Couples Massage Sanctuary",
      "Complimentary Herbal Elixir Tasting",
      "Valet Parking"
    ],
    popularServices: [
      "Volcanic Stone Therapy",
      "Rose Botanical Spa Facial",
      "Thermal Milk Bath"
    ],
    services: [
      {
        id: 101,
        title: "Deep Tissue & Volcanic Hot Stone Therapy",
        category: "Massage",
        categoryId: "massage",
        duration: "90 mins",
        price: "₹2,999",
        rawPrice: 2999,
        gstRate: 0.18,
        discount: "15% OFF",
        description: "Targeted deep pressure friction combined with warm basalt volcanic stones and organic lavender elixirs.",
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 102,
        title: "Signature Rose Botanical Spa Facial",
        category: "Facial",
        categoryId: "facial",
        duration: "75 mins",
        price: "₹2,499",
        rawPrice: 2499,
        gstRate: 0.18,
        discount: "",
        description: "Deep botanical hydration infused with organic damask rose essence and calming jade roller drainage.",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 103,
        title: "Thermal Hydrotherapy & Herbal Milk Bath",
        category: "Hydrotherapy",
        categoryId: "hydrotherapy",
        duration: "60 mins",
        price: "₹1,999",
        rawPrice: 1999,
        gstRate: 0.18,
        discount: "",
        description: "Warm mineral milk soak infused with wild lavender blossoms in a private hydro-jet jacuzzi suite.",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
      }
    ],
    packages: [
      {
        id: "pkg-aura-1",
        name: "Triple Rejuvenation Pass (3 Sessions)",
        subtitle: "3x Full Body Therapies of Choice",
        sessionsCount: 3,
        validity: "Valid for 60 Days",
        price: "₹6,999",
        regularPrice: "₹8,997",
        savings: "Save ₹1,998",
        description: "Mix & match between Volcanic Hot Stone, Rose Facial, or Thermal Baths."
      }
    ],
    staff: [
      {
        id: 1,
        name: "Dr. Genevieve Moreau",
        role: "Master Spa Director",
        specialization: "Aesthetic Skin & Deep Tissue",
        experience: "14 Yrs Exp",
        rating: 5.0,
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
        bio: "Certified European CIDESCO master practitioner with deep expertise in neuromuscular release."
      },
      {
        id: 2,
        name: "Isabella Rossi",
        role: "Senior Massage Specialist",
        specialization: "Volcanic Hot Stone & Swedish",
        experience: "10 Yrs Exp",
        rating: 4.96,
        avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
        bio: "Specializes in basalt stone heat retention therapy and myofascial recovery."
      }
    ]
  },
  {
    id: "biz-glamour-botanica",
    slug: "glamour-botanica-bangalore",
    name: "Glamour Botanica Couture Hair & Beauty",
    tagline: "Organic Balayage, Korean Glass Skin & Hair Botox Studios",
    type: "Salon",
    typeId: "salon",
    city: "Bangalore",
    state: "Karnataka",
    address: {
      line1: "100 Feet Road, Indiranagar",
      line2: "Near Metro Pillar 84",
      city: "Bangalore",
      state: "Karnataka",
      country: "India",
      pincode: "560038",
      latitude: 12.9719,
      longitude: 77.6412
    },
    shortLocation: "Indiranagar, Bangalore",
    phone: "+91 98844 11223",
    email: "hello@glamourbotanica.com",
    website: "https://glamourbotanica.com",
    rating: 4.92,
    reviewsCount: 380,
    startingPrice: "₹1,499",
    rawStartingPrice: 1499,
    isOpen: true,
    openingHours: "10:00 AM - 09:00 PM",
    workingDays: "Tuesday - Sunday (Closed Mondays)",
    operatingSchedule: createStandardOperatingHours("10:00 AM", "09:00 PM", "Monday"),
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=200&q=80",
    description: "Glamour Botanica is Bangalore's premier salon specializing in ammonia-free botanical hair coloring, Olaplex hair botox, luxury gel nails, and Korean glass-skin facials.",
    owner: {
      fullName: "Vikramaditya Oberoi",
      mobile: "+91 98844 11223",
      email: "vikram@glamourbotanica.com",
      isOtpVerified: true,
      isPasswordlessEnabled: true
    },
    legal: {
      isGstRegistered: true,
      gstin: "29AABCU4321D1Z2",
      legalBusinessName: "Botanica Salons & Aesthetics LLP",
      panNumber: "AABCU4321D",
      constitution: "LLP",
      verified: true
    },
    isMultiBranch: false,
    branches: [
      {
        id: "branch-glamour-indiranagar",
        name: "Indiranagar Flagship Studio",
        isMain: true,
        phone: "+91 98844 11223",
        email: "indiranagar@glamourbotanica.com",
        address: "100 Feet Road, Indiranagar",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560038",
        latitude: 12.9719,
        longitude: 77.6412,
        roomCapacity: 4,
        chairCapacity: 14,
        branchGSTIN: "29AABCU4321D1Z2",
        status: "active",
        operatingHours: createStandardOperatingHours("10:00 AM", "09:00 PM", "Monday")
      }
    ],
    kyc: {
      accountHolderName: "Botanica Salons & Aesthetics LLP",
      accountNumber: "00090210004918",
      ifscCode: "ICIC0000009",
      bankName: "ICICI Bank Ltd",
      upiId: "glamourbotanica@icici",
      aadhaarNumber: "XXXX-XXXX-4432",
      verificationStatus: "Verified"
    },
    gallery: [
      "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80"
    ],
    facilities: [
      "Private Hair Spa Pods",
      "Dyson Styling Stations",
      "OPI Couture Nail Bar",
      "Complimentary Cold Pressed Juices",
      "Wi-Fi & Work Lounges"
    ],
    popularServices: [
      "Organic Keratin Hair Botox",
      "Korean Glass Skin Facial",
      "Couture Gel Nail Art"
    ],
    services: [
      {
        id: 201,
        title: "Organic Keratin & Caviar Hair Botox",
        category: "Hair",
        categoryId: "hair",
        duration: "120 mins",
        price: "₹3,999",
        rawPrice: 3999,
        gstRate: 0.18,
        discount: "20% OFF",
        description: "Intense frizz control, fiber rebuilding, and diamond shine infused with plant keratin and caviar proteins.",
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 202,
        title: "Korean 9-Step Glass Skin Hydra-Facial",
        category: "Facial",
        categoryId: "facial",
        duration: "75 mins",
        price: "₹2,899",
        rawPrice: 2899,
        gstRate: 0.18,
        discount: "",
        description: "Ultrasonic vacuum blackhead extraction, snail mucin collagen infusion, and cryo-sculpting therapy.",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80"
      }
    ],
    packages: [
      {
        id: "pkg-glam-1",
        name: "Bridal Glow Head-to-Toe Pass (4 Sessions)",
        subtitle: "Complete Pre-Wedding Radiance",
        sessionsCount: 4,
        validity: "Valid for 90 Days",
        price: "₹11,999",
        regularPrice: "₹15,500",
        savings: "Save ₹3,501",
        description: "Includes Hair Botox, 2x Glass Skin Facials, and Deluxe Gel Manicure/Pedicure."
      }
    ],
    staff: [
      {
        id: 21,
        name: "Aaria Tanaka",
        role: "Master Hair Stylist & Colorist",
        specialization: "French Balayage & Hair Botox",
        experience: "11 Yrs Exp",
        rating: 4.98,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        bio: "Trained in Tokyo and London with extensive mastery in textured hair nourishment."
      }
    ]
  },
  {
    id: "biz-kerala-ayur",
    slug: "kerala-ayurveda-mumbai",
    name: "Kerala Traditional Ayur-Shala Sanctuary",
    tagline: "Authentic Kalaripayattu Massage, Shirodhara & Herbal Steam",
    type: "Ayurvedic Clinic",
    typeId: "ayurvedic_clinic",
    city: "Mumbai",
    state: "Maharashtra",
    address: {
      line1: "Linking Road, Bandra West",
      line2: "Opposite National College",
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
      pincode: "400050",
      latitude: 19.0607,
      longitude: 72.8362
    },
    shortLocation: "Bandra West, Mumbai",
    phone: "+91 98200 44556",
    email: "contact@keralaayurshala.com",
    website: "https://keralaayurshala.com",
    rating: 4.95,
    reviewsCount: 290,
    startingPrice: "₹2,199",
    rawStartingPrice: 2199,
    isOpen: true,
    openingHours: "08:00 AM - 08:30 PM",
    workingDays: "Monday - Sunday (7 Days)",
    operatingSchedule: createStandardOperatingHours("08:00 AM", "08:30 PM"),
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=200&q=80",
    description: "Centuries-old Ayurvedic medicine protocols practiced by certified Vaidyas using warm medicated tailams and handcrafted neem wood droni tables.",
    owner: {
      fullName: "Vaidya Madhavan Nambiar",
      mobile: "+91 98200 44556",
      email: "vaidya@keralaayurshala.com",
      isOtpVerified: true,
      isPasswordlessEnabled: true
    },
    legal: {
      isGstRegistered: true,
      gstin: "27AABCK9988E1Z1",
      legalBusinessName: "Kerala Ayur-Shala Holistic Care Enterprises",
      panNumber: "AABCK9988E",
      constitution: "Partnership",
      verified: true
    },
    isMultiBranch: false,
    branches: [
      {
        id: "branch-ayur-bandra",
        name: "Bandra West Ayurvedic Clinic",
        isMain: true,
        phone: "+91 98200 44556",
        email: "bandra@keralaayurshala.com",
        address: "Linking Road, Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400050",
        latitude: 19.0607,
        longitude: 72.8362,
        roomCapacity: 6,
        chairCapacity: 4,
        branchGSTIN: "27AABCK9988E1Z1",
        status: "active",
        operatingHours: createStandardOperatingHours("08:00 AM", "08:30 PM")
      }
    ],
    kyc: {
      accountHolderName: "Kerala Ayur-Shala Holistic Care",
      accountNumber: "34901928392019",
      ifscCode: "SBIN0000300",
      bankName: "State Bank of India",
      upiId: "keralaayur@sbi",
      aadhaarNumber: "XXXX-XXXX-6712",
      verificationStatus: "Verified"
    },
    gallery: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
    ],
    facilities: [
      "Handcrafted Teakwood Droni Tables",
      "Herbaceous Steam Chambers",
      "Nadi Pariksha Ayurvedic Consultation",
      "Freshly Brewed Kashayam & Teas"
    ],
    popularServices: [
      "Abhyangam Full Body Therapy",
      "Medicated Shirodhara",
      "Kizhi Herbal Potli Compress"
    ],
    services: [
      {
        id: 301,
        title: "Authentic Medicated Shirodhara & Scalp Therapy",
        category: "Wellness",
        categoryId: "wellness",
        duration: "75 mins",
        price: "₹2,799",
        rawPrice: 2799,
        gstRate: 0.18,
        discount: "",
        description: "Continuous rhythmic stream of warm herbal Brahmi oil over the third eye to alleviate chronic insomnia and anxiety.",
        image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80"
      },
      {
        id: 302,
        title: "Traditional Abhyangam Full Body Therapy",
        category: "Massage",
        categoryId: "massage",
        duration: "60 mins",
        price: "₹2,199",
        rawPrice: 2199,
        gstRate: 0.18,
        discount: "",
        description: "Synchronized strokes with warm herbal tailam to detoxify the lymphatic channels and improve joint mobility.",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
      }
    ],
    packages: [
      {
        id: "pkg-ayur-1",
        name: "5-Day Panchakarma & Mind Reset Pass",
        subtitle: "5 Days Intensive Rejuvenation",
        sessionsCount: 5,
        validity: "Valid for 30 Days",
        price: "₹10,499",
        regularPrice: "₹13,995",
        savings: "Save ₹3,496",
        description: "Includes 3x Abhyangam with steam and 2x Shirodhara sessions with doctor pulse diagnosis."
      }
    ],
    staff: [
      {
        id: 31,
        name: "Acharya Rajesh Nambiar",
        role: "Senior Vaidya Specialist",
        specialization: "Shirodhara & Marma Therapy",
        experience: "16 Yrs Exp",
        rating: 5.0,
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
        bio: "Direct disciple from Kottakkal Arya Vaidya Sala with authentic classical training."
      }
    ]
  },
  {
    id: "biz-saffron-goa",
    slug: "saffron-coastal-spa-goa",
    name: "Saffron Coastal Spa & Wellness Pavilion",
    tagline: "Oceanfront Vichy Showers, Coconut Scrubs & Balinese Rituals",
    type: "Spa",
    typeId: "spa",
    city: "Goa",
    state: "Goa",
    address: {
      line1: "Candolim Beach Road",
      line2: "Near Fort Aguada Viewpoint",
      city: "Goa",
      state: "Goa",
      country: "India",
      pincode: "403515",
      latitude: 15.5178,
      longitude: 73.7661
    },
    shortLocation: "Candolim Beach, Goa",
    phone: "+91 98330 77889",
    email: "stay@saffroncoastalgoa.com",
    website: "https://saffroncoastalgoa.com",
    rating: 4.98,
    reviewsCount: 350,
    startingPrice: "₹2,499",
    rawStartingPrice: 2499,
    isOpen: true,
    openingHours: "09:00 AM - 10:00 PM",
    workingDays: "Monday - Sunday (7 Days)",
    operatingSchedule: createStandardOperatingHours("09:00 AM", "10:00 PM"),
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80",
    logo: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=200&q=80",
    description: "Overlooking the Arabian Sea, Saffron Coastal Spa provides therapeutic sea salt exfoliations, virgin coconut oil Balinese massage, and warm vichy showers.",
    owner: {
      fullName: "Ananya Deshmukh",
      mobile: "+91 98330 77889",
      email: "ananya@saffroncoastalgoa.com",
      isOtpVerified: true,
      isPasswordlessEnabled: true
    },
    legal: {
      isGstRegistered: true,
      gstin: "30AABCS7766M1Z8",
      legalBusinessName: "Saffron Coastal Hospitality LLP",
      panNumber: "AABCS7766M",
      constitution: "LLP",
      verified: true
    },
    isMultiBranch: false,
    branches: [
      {
        id: "branch-saffron-candolim",
        name: "Candolim Ocean Pavilion",
        isMain: true,
        phone: "+91 98330 77889",
        email: "candolim@saffroncoastalgoa.com",
        address: "Candolim Beach Road",
        city: "Goa",
        state: "Goa",
        pincode: "403515",
        latitude: 15.5178,
        longitude: 73.7661,
        roomCapacity: 7,
        chairCapacity: 6,
        branchGSTIN: "30AABCS7766M1Z8",
        status: "active",
        operatingHours: createStandardOperatingHours("09:00 AM", "10:00 PM")
      }
    ],
    kyc: {
      accountHolderName: "Saffron Coastal Hospitality LLP",
      accountNumber: "91802004819201",
      ifscCode: "UTIB0000120",
      bankName: "Axis Bank Ltd",
      upiId: "saffrongao@axisbank",
      aadhaarNumber: "XXXX-XXXX-1982",
      verificationStatus: "Verified"
    },
    gallery: [
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
    ],
    facilities: [
      "Ocean Breeze Open-Air Pavilions",
      "Vichy 7-Jet Shower Suites",
      "Organic Virgin Coconut Oil Elixirs",
      "Sunset Herbal Mocktail Lounge"
    ],
    popularServices: [
      "Balinese Deep Muscle Therapy",
      "Sea Salt Body Polish & Vichy",
      "Coconut Cream Hydration Soak"
    ],
    services: [
      {
        id: 401,
        title: "Balinese Deep Muscle Ocean Therapy",
        category: "Massage",
        categoryId: "massage",
        duration: "75 mins",
        price: "₹2,599",
        rawPrice: 2599,
        gstRate: 0.18,
        discount: "10% OFF",
        description: "A blend of acupressure, gentle stretching, and rhythmic palm friction with warm coconut frangipani oil.",
        image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80"
      }
    ],
    packages: [
      {
        id: "pkg-goa-1",
        name: "Couples Coastal Sunset Escape (2 Persons)",
        subtitle: "Side-by-Side Oceanfront Rituals",
        sessionsCount: 2,
        validity: "Valid for 60 Days",
        price: "₹6,499",
        regularPrice: "₹7,998",
        savings: "Save ₹1,499",
        description: "Includes side-by-side Balinese massages followed by private Jacuzzi soak and tropical fruit platter."
      }
    ],
    staff: [
      {
        id: 41,
        name: "Charlotte Vance",
        role: "Lead Balinese Specialist",
        specialization: "Balinese & Hydrotherapy",
        experience: "9 Yrs Exp",
        rating: 4.95,
        avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=200&q=80",
        bio: "Specializes in ocean mineral scrubs, vichy lymphatic showers, and soothing sound bowls."
      }
    ]
  }
];

// Helper to retrieve all businesses including user-registered ones from localStorage
export function getAllBusinesses() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('therapyshala_spamate_businesses') || localStorage.getItem('therapyshala_custom_businesses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const registeredSlugs = new Set(parsed.map(p => p.slug || p.id));
          const filteredSeed = BUSINESSES_DATA.filter(b => !registeredSlugs.has(b.slug) && !registeredSlugs.has(b.id));
          return [...parsed, ...filteredSeed];
        }
      } catch (e) {
        console.error("Failed to parse custom businesses:", e);
      }
    }
  }
  return BUSINESSES_DATA;
}

// Helper to save newly registered business to localStorage
export function saveRegisteredBusiness(newBusiness) {
  if (typeof window !== 'undefined') {
    const storageKeys = ['therapyshala_spamate_businesses', 'therapyshala_custom_businesses'];
    storageKeys.forEach((key) => {
      const saved = localStorage.getItem(key);
      let list = [];
      if (saved) {
        try {
          list = JSON.parse(saved);
        } catch {
          list = [];
        }
      }
      list = [newBusiness, ...list.filter(b => b.id !== newBusiness.id && b.slug !== newBusiness.slug)];
      localStorage.setItem(key, JSON.stringify(list));
    });
  }
}

// Flat Services Aggregator
export const SERVICES_DATA = [
  {
    id: 1,
    title: "Deep Tissue & Volcanic Hot Stone Therapy",
    category: "Massage",
    categoryId: "massage",
    price: "₹2,999",
    rawPrice: 2999,
    duration: "90 mins",
    rating: 5.0,
    reviewsCount: 412,
    popular: true,
    businessName: "Aura Luxe Wellness",
    businessSlug: "aura-luxe-jaipur",
    businessCity: "Jaipur",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Therapeutic deep pressure targeting muscle tension combined with warm volcanic stones and lavender oils.",
    gstAmount: "₹540",
    totalPrice: "₹3,539",
    benefits: [
      "Rapidly melts deep chronic muscular tightness",
      "Increases vascular and lymphatic circulation",
      "Reduces physical stress hormones like cortisol",
      "Enhances deep REM sleep cycles"
    ]
  },
  {
    id: 2,
    title: "Signature Rose Botanical Spa Facial",
    category: "Facials",
    categoryId: "facial",
    price: "₹2,499",
    rawPrice: 2499,
    duration: "75 mins",
    rating: 4.9,
    reviewsCount: 320,
    popular: true,
    businessName: "Aura Luxe Wellness",
    businessSlug: "aura-luxe-jaipur",
    businessCity: "Jaipur",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Organic damask rose hydration, custom enzyme peels, and LED light renewal therapy.",
    gstAmount: "₹450",
    totalPrice: "₹2,949",
    benefits: [
      "Restores cellular moisture barrier",
      "Brightens tired, dull complexion",
      "Stimulates natural collagen synthesis",
      "Gentle lymphatic drainage depuffs eyes"
    ]
  },
  {
    id: 3,
    title: "Organic Keratin & Caviar Hair Botox",
    category: "Hair Care",
    categoryId: "hair",
    price: "₹3,999",
    rawPrice: 3999,
    duration: "120 mins",
    rating: 4.98,
    reviewsCount: 280,
    popular: true,
    businessName: "Glamour Botanica Couture",
    businessSlug: "glamour-botanica-bangalore",
    businessCity: "Bangalore",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Intense frizz control, fiber rebuilding, and diamond shine infused with plant keratin and caviar proteins.",
    gstAmount: "₹720",
    totalPrice: "₹4,719",
    benefits: [
      "100% Formaldehyde-free organic formula",
      "Eliminates 95% of frizz for up to 4 months",
      "Restores brittle bleached and colored hair",
      "Silky high-gloss finish"
    ]
  },
  {
    id: 4,
    title: "Authentic Medicated Shirodhara Ritual",
    category: "Ayurvedic",
    categoryId: "wellness",
    price: "₹2,799",
    rawPrice: 2799,
    duration: "75 mins",
    rating: 4.95,
    reviewsCount: 195,
    popular: false,
    businessName: "Kerala Traditional Ayur-Shala",
    businessSlug: "kerala-ayurveda-mumbai",
    businessCity: "Mumbai",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Continuous stream of warm botanical Brahmi oil over the third eye to restore deep neurological calmness.",
    gstAmount: "₹504",
    totalPrice: "₹3,303",
    benefits: [
      "Relieves chronic insomnia and mental fatigue",
      "Nourishes hair roots and scalp circulation",
      "Calms hyperactive nervous system",
      "Harmonizes Vata dosha"
    ]
  },
  {
    id: 5,
    title: "Balinese Deep Muscle Ocean Therapy",
    category: "Massage",
    categoryId: "massage",
    price: "₹2,599",
    rawPrice: 2599,
    duration: "75 mins",
    rating: 4.92,
    reviewsCount: 310,
    popular: false,
    businessName: "Saffron Coastal Spa",
    businessSlug: "saffron-coastal-spa-goa",
    businessCity: "Goa",
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=800&q=80",
    shortDescription: "A blend of acupressure, gentle stretching, and rhythmic palm friction with warm coconut frangipani oil.",
    gstAmount: "₹468",
    totalPrice: "₹3,067",
    benefits: [
      "Improves joint flexibility and tendon elasticity",
      "Relieves sports fatigue and jet lag",
      "Tropical aromatherapy lifts spirits"
    ]
  },
  {
    id: 6,
    title: "Thermal Hydrotherapy & Herbal Milk Bath",
    category: "Hydrotherapy",
    categoryId: "hydrotherapy",
    price: "₹1,999",
    rawPrice: 1999,
    duration: "60 mins",
    rating: 4.88,
    reviewsCount: 220,
    popular: false,
    businessName: "Aura Luxe Wellness",
    businessSlug: "aura-luxe-jaipur",
    businessCity: "Jaipur",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    shortDescription: "Warm mineral milk soak infused with organic lavender and rose petals in a private jacuzzi suite.",
    gstAmount: "₹360",
    totalPrice: "₹2,359",
    benefits: [
      "Softens dry skin with natural lactic acid",
      "Hydro-jets stimulate peripheral circulation",
      "Complete private relaxation"
    ]
  }
];

export const SERVICE_PACKAGES = [
  {
    id: "pkg-1",
    name: "Triple Rejuvenation Pass (3 Sessions)",
    category: "Massage & Hydrotherapy",
    businessName: "Aura Luxe Wellness",
    businessSlug: "aura-luxe-jaipur",
    businessCity: "Jaipur",
    packagePrice: "₹6,999",
    regularPrice: "₹8,997",
    savingsText: "Save ₹1,998",
    discountPercent: "22% OFF",
    sessionsCount: 3,
    validityText: "Valid for 60 Days",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    description: "Mix & match between Volcanic Hot Stone, Rose Facial, or Thermal Milk Baths with complimentary consultation.",
    includedServices: [
      "1x Volcanic Hot Stone Therapy (90 mins)",
      "1x Signature Rose Botanical Facial (75 mins)",
      "1x Thermal Hydrotherapy Bath (60 mins)"
    ]
  },
  {
    id: "pkg-2",
    name: "Bridal Glow Head-to-Toe Pass (4 Sessions)",
    category: "Bridal & Hair Spa",
    businessName: "Glamour Botanica Couture",
    businessSlug: "glamour-botanica-bangalore",
    businessCity: "Bangalore",
    packagePrice: "₹11,999",
    regularPrice: "₹15,500",
    savingsText: "Save ₹3,501",
    discountPercent: "25% OFF",
    sessionsCount: 4,
    validityText: "Valid for 90 Days",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
    description: "Complete pre-wedding radiance program for bridal hair, glass skin, and luxury gel manicure.",
    includedServices: [
      "1x Organic Keratin Hair Botox (120 mins)",
      "2x Korean Glass Skin Hydra-Facials (75 mins each)",
      "1x OPI Couture Gel Manicure & Pedicure"
    ]
  },
  {
    id: "pkg-3",
    name: "5-Day Panchakarma Reset Pass",
    category: "Ayurvedic Healing",
    businessName: "Kerala Traditional Ayur-Shala",
    businessSlug: "kerala-ayurveda-mumbai",
    businessCity: "Mumbai",
    packagePrice: "₹10,499",
    regularPrice: "₹13,995",
    savingsText: "Save ₹3,496",
    discountPercent: "25% OFF",
    sessionsCount: 5,
    validityText: "Valid for 30 Days",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    description: "Intensive 5-day detox program featuring warm medicated tailams and Nadi Pariksha consultation.",
    includedServices: [
      "3x Traditional Abhyangam with Herbal Steam (60 mins)",
      "2x Medicated Shirodhara with Scalp Spa (75 mins)"
    ]
  }
];

export const PROMOTIONS_DATA = [
  {
    id: "promo-1",
    code: "WELCOME500",
    title: "₹500 Off First Sanctuary Appointment",
    discount: "Flat ₹500 Discount",
    validTill: "Valid for New Customers",
    badge: "NEW CLIENT EXCLUSIVE",
    description: "Apply on any service or package booking above ₹1,499 across all verified centers."
  },
  {
    id: "promo-2",
    code: "SPALUXE20",
    title: "20% Off All Weekday Bookings",
    discount: "20% Discount",
    validTill: "Mon - Thu Appointments",
    badge: "WEEKDAY ESCAPE",
    description: "Enjoy peaceful weekday mornings and afternoons with an exclusive 20% discount on all spa rituals."
  }
];

export const GIFT_VOUCHERS_DATA = [
  { id: "vouch-1", denomination: "₹2,500", title: "Sanctuary Essential Gift Pass" },
  { id: "vouch-2", denomination: "₹5,000", title: "Signature Luxury Wellness Pass" },
  { id: "vouch-3", denomination: "₹10,000", title: "Royal VIP Retreat Pass" }
];

export const MOCK_USER_PROFILE = {
  name: "Ananya Sharma",
  email: "ananya.sharma@example.com",
  phone: "+91 98765 43210",
  tier: "VIP Platinum Guest",
  totalVisits: 8
};

export const MOCK_USER_APPOINTMENTS = [
  {
    id: "TS-2026-8941",
    businessName: "Aura Luxe Wellness Sanctuary",
    businessSlug: "aura-luxe-jaipur",
    businessAddress: "Tonk Road, Jaipur",
    serviceTitle: "Deep Tissue & Volcanic Hot Stone Therapy",
    serviceCategory: "Massage",
    therapistName: "Isabella Rossi",
    therapistAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    date: "2026-09-05",
    time: "11:00 AM",
    price: "₹2,999",
    status: "CONFIRMED",
    paymentStatus: "Pay at Center",
    canCancel: true,
    canReschedule: true
  },
  {
    id: "TS-2026-7812",
    businessName: "Glamour Botanica Couture",
    businessSlug: "glamour-botanica-bangalore",
    businessAddress: "Indiranagar, Bangalore",
    serviceTitle: "Korean Glass Skin Hydra-Facial",
    serviceCategory: "Facial",
    therapistName: "Aaria Tanaka",
    therapistAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    date: "2026-08-18",
    time: "03:30 PM",
    price: "₹2,899",
    status: "COMPLETED",
    paymentStatus: "Paid Online",
    canCancel: false,
    canReschedule: false
  }
];

export const MOCK_USER_PACKAGES = [
  {
    id: "PKG-PASS-904",
    packageName: "Triple Rejuvenation Pass (3 Sessions)",
    businessName: "Aura Luxe Wellness Sanctuary",
    businessSlug: "aura-luxe-jaipur",
    remainingSessions: 2,
    totalSessions: 3,
    expiryDate: "2026-10-31"
  }
];

// Legacy / Component Compatibility Exports
export const PARTNERS_DATA = [
  { name: "VOGUE SPA & WELLNESS", logo: "VOGUE" },
  { name: "ELLE SPA", logo: "ELLE" },
  { name: "HARPER'S BAZAAR", logo: "BAZAAR" },
  { name: "LUXURY SPA AWARDS 2026", logo: "LUXURY AWARDS" },
];

export const WHY_CHOOSE_US = [
  {
    id: "01",
    title: "Master Certified Specialists",
    description: "Every therapist undergoes strict accreditation in European spa and Ayurvedic protocols.",
    icon: "Award"
  },
  {
    id: "02",
    title: "100% Organic Botanical Oils",
    description: "Cruelty-free, vegan-certified botanical elixirs harvested from sustainable eco-farms.",
    icon: "Sparkles"
  },
  {
    id: "03",
    title: "Clinical Sanctuary Hygiene",
    description: "UV-C medical sterilization, single-use organic linen, and private sanitized treatment suites.",
    icon: "ShieldCheck"
  },
  {
    id: "04",
    title: "Instant Real-Time Booking",
    description: "Seamlessly select your favorite specialist, view real-time calendar availability, and book in seconds.",
    icon: "Smartphone"
  }
];

export const APP_SCREENS = [
  {
    id: "screen1",
    title: "Spa Therapy Finder",
    subtitle: "Browse 500+ curated luxury spa therapies across India",
    screenImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    activeTab: "Explore",
    featureHighlight: "Filter by city, duration, therapist rating, and instant thermal slot availability."
  },
  {
    id: "screen2",
    title: "Specialist Selection",
    subtitle: "Handpick your preferred certified master specialist",
    screenImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    activeTab: "Specialists",
    featureHighlight: "Read verified guest reviews and specialized body therapy badges."
  },
  {
    id: "screen3",
    title: "Live Real-Time Calendar",
    subtitle: "Book session in 3 taps with calendar sync",
    screenImage: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
    activeTab: "Schedule",
    featureHighlight: "Instant calendar export & appointment reminders."
  },
  {
    id: "screen4",
    title: "TherapyShala VIP Rewards",
    subtitle: "Earn points with every appointment",
    screenImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
    activeTab: "Rewards",
    featureHighlight: "Unlock complimentary hydrotherapy upgrades and priority slots."
  }
];

export const GALLERY_DATA = [
  {
    id: 1,
    title: "Thermal Hydrotherapy Sanctuary",
    category: "Hydrotherapy",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80",
    size: "tall"
  },
  {
    id: 2,
    title: "Volcanic Hot Stone Suite",
    category: "Massage Suites",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80",
    size: "normal"
  },
  {
    id: 3,
    title: "Botanical Zen Garden Lounge",
    category: "Spa Sanctuary",
    image: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=900&q=80",
    size: "tall"
  },
  {
    id: 4,
    title: "Herbal Milk Bath & Rose Petal Soak",
    category: "Hydrotherapy",
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=900&q=80",
    size: "normal"
  },
  {
    id: 5,
    title: "Aromatherapy Deep Muscle Suite",
    category: "Massage Suites",
    image: "https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=900&q=80",
    size: "wide"
  },
  {
    id: 6,
    title: "Tranquil Botanical Relaxation Suite",
    category: "Spa Sanctuary",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=900&q=80",
    size: "normal"
  }
];

export const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Dr. Genevieve Moreau",
    role: "Wellness Editor, Vogue India",
    comment: "TherapyShala has redefined how clients discover authentic, verified spa sanctuaries across India. The transparency and instant booking are unmatched.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
  },
  {
    id: 2,
    name: "Vikramaditya Rathore",
    role: "Verified Guest, Jaipur",
    comment: "Booked a volcanic stone session at Aura Luxe through TherapyShala in 2 minutes. The therapist was world-class and the suite was spotlessly clean.",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
  }
];

export const PRICING_PACKAGES = [
  {
    id: "basic",
    name: "Essential Sanctuary Pass",
    subtitle: "Ideal for monthly wellness restoration",
    price: "₹4,999",
    billing: "per month",
    badge: null,
    highlight: false,
    features: [
      "1x Monthly Therapy of choice (60m)",
      "Complimentary skin & body consultation",
      "10% discount on all partner products",
      "24/7 online appointment booking",
      "Complimentary herbal tea tasting"
    ],
    buttonText: "Get Started"
  },
  {
    id: "premium",
    name: "Signature Network Pass",
    subtitle: "Our most popular multi-center pass",
    price: "₹8,999",
    billing: "per month",
    badge: "MOST POPULAR",
    highlight: true,
    features: [
      "2x Monthly Therapies of choice (75m each)",
      "1x Free Hydrotherapy Bath Add-on",
      "20% discount across all partner centers",
      "Priority VIP slot reservations",
      "Private VIP suite upgrade option",
      "Free guest pass once per quarter"
    ],
    buttonText: "Claim Pass"
  },
  {
    id: "luxury",
    name: "Royal VIP Concierge Pass",
    subtitle: "Unrestricted holistic wellness luxury",
    price: "₹14,999",
    billing: "per month",
    badge: "UNLIMITED LUXURY",
    highlight: false,
    features: [
      "Unlimited 90m Spa Therapies & Baths",
      "Dedicated Senior Specialist allocated",
      "30% discount on all retail collections",
      "24/7 Concierge priority booking",
      "Full access to Hydrotherapy & Sauna suites"
    ],
    buttonText: "Join Royal Club"
  }
];

export const BOOKING_STEPS = [
  {
    step: "01",
    title: "Discover Centers",
    description: "Browse verified spas, salons, and wellness retreats with transparent prices and authentic reviews."
  },
  {
    step: "02",
    title: "Select Ritual & Specialist",
    description: "Pick your preferred therapy and choose from accredited master therapists."
  },
  {
    step: "03",
    title: "Reserve Slot Instantly",
    description: "View real-time calendar availability and secure your appointment with zero booking fees."
  },
  {
    step: "04",
    title: "Indulge & Rejuvenate",
    description: "Arrive at the sanctuary for your private suite session. Complimentary herbal elixirs await you."
  }
];

export const FAQ_DATA = [
  {
    question: "What is TherapyShala and how does it work?",
    answer: "TherapyShala is India's premier multi-business marketplace connecting clients with verified luxury Spas, Salons, Wellness Centers, and Ayurvedic Retreats. Clients can search by city, compare prices, read verified reviews, and book real-time appointments."
  },
  {
    question: "Can any Spa or Salon register their business on TherapyShala?",
    answer: "Yes! Any verified Spa, Salon, Aesthetic Lounge, or Wellness Center can click 'List Your Business' to complete our 10-step onboarding, customize their services and pricing, and start receiving customer appointments immediately."
  },
  {
    question: "Are there any upfront listing fees for business owners?",
    answer: "No, listing your business on TherapyShala is 100% free with zero upfront setup fees."
  },
  {
    question: "What is the cancellation and rescheduling policy?",
    answer: "We offer complimentary rescheduling or cancellation up to 6 hours prior to your scheduled appointment directly through your account portal."
  },
  {
    question: "Are the staff and therapies verified for hygiene and safety?",
    answer: "Yes, every partner center undergoes our strict TherapyShala Hygiene & Sanitation Audit, ensuring certified therapists, sterile suites, and organic botanical products."
  }
];

export const THERAPISTS_LIST = [
  { id: 1, name: "Dr. Genevieve Moreau", specialization: "Master Facial Spa Specialist", experience: "14 Yrs Exp", rating: 5.0, avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80" },
  { id: 2, name: "Isabella Rossi", specialization: "Deep Tissue & Volcanic Stone Master", experience: "10 Yrs Exp", rating: 4.96, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80" },
  { id: 3, name: "Aaria Tanaka", specialization: "Master Hair Stylist & Colorist", experience: "11 Yrs Exp", rating: 4.98, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
  { id: 4, name: "Acharya Rajesh Nambiar", specialization: "Shirodhara & Ayurvedic Specialist", experience: "16 Yrs Exp", rating: 5.0, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
];
