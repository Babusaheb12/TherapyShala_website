import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { saveRegisteredBusiness } from '../../data/spaData';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { 
  Building2, MapPin, Clock, Scissors, Package, User, 
  DoorOpen, FileSpreadsheet, Eye, Send, CheckCircle2, 
  Plus, Trash2, ArrowRight, ArrowLeft, Sparkles, Star, 
  ShieldCheck, Phone, Mail, Globe, Tag, Info, Layers
} from 'lucide-react';

const ONBOARDING_STEPS = [
  { step: 1, title: "Business Info", icon: Building2, desc: "Name, category & branding" },
  { step: 2, title: "Location & Branches", icon: MapPin, desc: "Addresses & cities" },
  { step: 3, title: "Business Hours", icon: Clock, desc: "Operating schedule" },
  { step: 4, title: "Services", icon: Scissors, desc: "Treatments & pricing" },
  { step: 5, title: "Packages", icon: Package, desc: "Multi-session passes" },
  { step: 6, title: "Staff / Therapists", icon: User, desc: "Certified specialists" },
  { step: 7, title: "Rooms & Resources", icon: DoorOpen, desc: "Suites & hydro-tubs" },
  { step: 8, title: "GST & Details", icon: FileSpreadsheet, desc: "Tax & payout info" },
  { step: 9, title: "Live Preview", icon: Eye, desc: "Review public profile" },
  { step: 10, title: "Submit & Activate", icon: Send, desc: "Go live on platform" }
];

export default function ListYourBusinessPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [generatedSlug, setGeneratedSlug] = useState('');

  // Master Business Form State
  const [formData, setFormData] = useState({
    // 1. Business Info
    name: 'Aura Luxe Wellness Sanctuary',
    type: 'Spa & Wellness Center',
    typeId: 'spa',
    tagline: 'Private Hydro-Suites, Volcanic Stones & Botanical Aromatherapy',
    ownerName: 'Devika Singhania',
    phone: '+91 98765 99881',
    email: 'contact@auraluxewellness.com',
    website: 'https://auraluxewellness.com',
    description: 'Aura Luxe is a bespoke day spa sanctuary offering holistic Swedish body recovery, therapeutic volcanic hot stones, organic Kerala Ayurvedic therapies, and Korean glow facials.',
    coverImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=200&q=80',

    // 2. Location & Branches
    primaryCity: 'Jaipur',
    primaryState: 'Rajasthan',
    primaryAddress: 'Plot 18, Tonk Road, Near Rambagh Palace, Jaipur, Rajasthan 302015',
    primaryPincode: '302015',
    landmark: 'Opposite Central Park Gate 2',
    branches: [
      { id: 1, city: 'Jaipur (Main Flagship)', address: 'Tonk Road, Jaipur 302015', phone: '+91 98765 99881' }
    ],

    // 3. Business Hours
    openingHours: '09:00 AM - 09:30 PM',
    workingDays: 'Monday - Sunday (Open 7 Days)',
    holidaySchedule: 'Open on public holidays with prior online reservation',

    // 4. Services Menu
    services: [
      {
        id: Date.now() + 1,
        title: 'Deep Muscle Volcanic Stone Therapy',
        category: 'Massage',
        categoryId: 'massage',
        duration: '75 mins',
        price: '₹2,299',
        rawPrice: 2299,
        gstRate: 0.18,
        discount: '15% OFF',
        description: 'Targeted deep tissue friction with warm basalt volcanic stones to melt chronic muscular tension.',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80'
      },
      {
        id: Date.now() + 2,
        title: 'Rose Petal Glow Radiance Facial',
        category: 'Facial',
        categoryId: 'facial',
        duration: '60 mins',
        price: '₹1,699',
        rawPrice: 1699,
        gstRate: 0.18,
        discount: '',
        description: 'Organic rose petal infusion, ultrasound serum penetration, and calming jade roller facial drainage.',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=600&q=80'
      }
    ],

    // 5. Packages
    packages: [
      {
        id: `pkg-${Date.now()}`,
        name: 'Ultimate Sanctuary Reset Pass (3 Sessions)',
        subtitle: '3x Full Body Therapies of Choice',
        sessionsCount: 3,
        validity: 'Valid for 60 Days',
        price: '₹5,499',
        regularPrice: '₹6,897',
        savings: 'Save ₹1,398',
        description: 'Includes 2x Deep Muscle Stone Therapies and 1x Rose Glow Facial with complimentary herbal tea tasting.'
      }
    ],

    // 6. Staff / Therapists
    staff: [
      {
        id: Date.now() + 10,
        name: 'Deepak Sharma',
        role: 'Master Massage Specialist',
        specialization: 'Deep Tissue & Hot Stone',
        experience: '8 Yrs Exp',
        rating: 4.96,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        bio: 'Certified in neuromuscular therapy and orthopedic trigger point relief.'
      }
    ],

    // 7. Rooms & Resources
    rooms: [
      { id: 1, name: 'Royal Basalt Couple Suite', type: 'Couple Suite with Hydro-Tub', capacity: 2 },
      { id: 2, name: 'Ayurvedic Shirodhara Chamber', type: 'Specialty Ayurvedic Room', capacity: 1 },
      { id: 3, name: 'Zen Aromatherapy Suite', type: 'Single Therapy Room', capacity: 1 }
    ],

    // 8. GST & Business Details
    gstin: '08AAAAA1234A1Z5',
    pan: 'AAAAA1234A',
    bankAccountName: 'Aura Luxe Wellness Private Limited',
    bankAccountNumber: '98765432101234',
    ifscCode: 'HDFC0001234',
    cancellationTerms: 'Free cancellation up to 6 hours before scheduled appointment.'
  });

  // Modal Sub-States for inline creation
  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({
    title: '', category: 'Massage', duration: '60 mins', price: '', discount: '', description: ''
  });

  const [showAddPackage, setShowAddPackage] = useState(false);
  const [newPackage, setNewPackage] = useState({
    name: '', sessionsCount: 3, validity: 'Valid for 60 Days', price: '', regularPrice: '', description: ''
  });

  const [showAddStaff, setShowAddStaff] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '', role: 'Senior Therapist', specialization: 'Deep Tissue & Swedish', experience: '5 Yrs Exp', bio: ''
  });

  const [showAddRoom, setShowAddRoom] = useState(false);
  const [newRoom, setNewRoom] = useState({
    name: '', type: 'Single Suite', capacity: 1
  });

  const [showAddBranch, setShowAddBranch] = useState(false);
  const [newBranch, setNewBranch] = useState({
    city: '', address: '', phone: ''
  });

  // Change Handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add Service
  const handleAddService = (e) => {
    e.preventDefault();
    if (!newService.title || !newService.price) return;
    const rawPrice = parseInt(newService.price.replace(/[^0-9]/g, '')) || 1499;
    const added = {
      id: Date.now(),
      title: newService.title,
      category: newService.category,
      categoryId: newService.category.toLowerCase().split(' ')[0],
      duration: newService.duration,
      price: `₹${rawPrice.toLocaleString('en-IN')}`,
      rawPrice,
      gstRate: 0.18,
      discount: newService.discount,
      description: newService.description || 'Personalized therapeutic session by certified master specialists.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
    };
    setFormData(prev => ({ ...prev, services: [...prev.services, added] }));
    setNewService({ title: '', category: 'Massage', duration: '60 mins', price: '', discount: '', description: '' });
    setShowAddService(false);
  };

  // Add Package
  const handleAddPackage = (e) => {
    e.preventDefault();
    if (!newPackage.name || !newPackage.price) return;
    const added = {
      id: `pkg-${Date.now()}`,
      name: newPackage.name,
      subtitle: `${newPackage.sessionsCount} Sessions Pass`,
      sessionsCount: parseInt(newPackage.sessionsCount) || 3,
      validity: newPackage.validity || 'Valid for 60 Days',
      price: `₹${parseInt(newPackage.price).toLocaleString('en-IN')}`,
      regularPrice: newPackage.regularPrice ? `₹${parseInt(newPackage.regularPrice).toLocaleString('en-IN')}` : '',
      savings: newPackage.regularPrice ? `Save ₹${parseInt(newPackage.regularPrice) - parseInt(newPackage.price)}` : '',
      description: newPackage.description || 'Multi-session pass with bundled savings.'
    };
    setFormData(prev => ({ ...prev, packages: [...prev.packages, added] }));
    setNewPackage({ name: '', sessionsCount: 3, validity: 'Valid for 60 Days', price: '', regularPrice: '', description: '' });
    setShowAddPackage(false);
  };

  // Add Staff
  const handleAddStaff = (e) => {
    e.preventDefault();
    if (!newStaff.name) return;
    const added = {
      id: Date.now(),
      name: newStaff.name,
      role: newStaff.role,
      specialization: newStaff.specialization,
      experience: newStaff.experience,
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      bio: newStaff.bio || 'Certified specialist dedicated to guest comfort and rejuvenation.'
    };
    setFormData(prev => ({ ...prev, staff: [...prev.staff, added] }));
    setNewStaff({ name: '', role: 'Senior Therapist', specialization: 'Deep Tissue & Swedish', experience: '5 Yrs Exp', bio: '' });
    setShowAddStaff(false);
  };

  // Add Room
  const handleAddRoom = (e) => {
    e.preventDefault();
    if (!newRoom.name) return;
    const added = {
      id: Date.now(),
      name: newRoom.name,
      type: newRoom.type,
      capacity: parseInt(newRoom.capacity) || 1
    };
    setFormData(prev => ({ ...prev, rooms: [...prev.rooms, added] }));
    setNewRoom({ name: '', type: 'Single Suite', capacity: 1 });
    setShowAddRoom(false);
  };

  // Add Branch
  const handleAddBranch = (e) => {
    e.preventDefault();
    if (!newBranch.city || !newBranch.address) return;
    const added = {
      id: Date.now(),
      city: newBranch.city,
      address: newBranch.address,
      phone: newBranch.phone || formData.phone
    };
    setFormData(prev => ({ ...prev, branches: [...prev.branches, added] }));
    setNewBranch({ city: '', address: '', phone: '' });
    setShowAddBranch(false);
  };

  // Final Submit Handler
  const handleFinalSubmit = () => {
    const bizSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const fullBusinessObject = {
      id: `biz-${bizSlug}`,
      slug: bizSlug,
      name: formData.name,
      tagline: formData.tagline || formData.description.slice(0, 70),
      type: formData.type,
      typeId: formData.type.toLowerCase().split(' ')[0],
      city: formData.primaryCity,
      state: formData.primaryState,
      address: formData.primaryAddress,
      shortLocation: `${formData.primaryCity}`,
      phone: formData.phone,
      email: formData.email,
      website: formData.website,
      rating: 5.0,
      reviewsCount: 1,
      startingPrice: formData.services.length > 0 ? formData.services[0].price : '₹1,499',
      rawStartingPrice: formData.services.length > 0 ? formData.services[0].rawPrice : 1499,
      isOpen: true,
      openingHours: formData.openingHours,
      workingDays: formData.workingDays,
      featured: true,
      logo: formData.logo,
      coverImage: formData.coverImage,
      description: formData.description,
      facilities: [
        "Private Sanitized Suites",
        "Hydrotherapy & Steam Lounges",
        "100% Organic Essential Oils",
        "Complimentary Consultation & Herbal Teas",
        "Dedicated Valet Parking"
      ],
      popularServices: formData.services.map(s => s.title),
      services: formData.services,
      packages: formData.packages,
      staff: formData.staff,
      rooms: formData.rooms,
      branches: formData.branches,
      gstin: formData.gstin,
      reviews: [
        {
          id: `rev-${Date.now()}`,
          author: "TherapyShala Quality Audit",
          rating: 5,
          date: "Just now",
          comment: "Verified facility with certified staff and sterile treatment suites.",
          service: "Registration Verified"
        }
      ],
      gallery: [
        formData.coverImage,
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80"
      ]
    };

    saveRegisteredBusiness(fullBusinessObject);
    setGeneratedSlug(bizSlug);
    setIsSubmitted(true);

    confetti({
      particleCount: 140,
      spread: 90,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="min-h-screen bg-[#FFFDFD] text-[#0D0D12]">
      <Navbar />

      <main className="pt-24 pb-20">
        
        {/* Onboarding Wizard Header */}
        <div className="bg-[#FFEEF1] border-b border-[#AFB0B7]/25 py-8 mb-10">
          <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 lg:px-16 xl:px-20">
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-[#F35271] font-bold block mb-1">
                  SpaMate • Spa & Salon Onboarding
                </span>
                <h1 className="font-serif-luxury text-3xl md:text-4xl text-[#0D0D12]">
                  {isSubmitted ? 'Business Profile Live!' : 'Register Your Spa / Salon on TherapyShala'}
                </h1>
              </div>

              {!isSubmitted && (
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-[#F35271]/30 shadow-sm text-xs text-[#757880]">
                  <span>Step <strong>{currentStep}</strong> of 10</span>
                  <span className="text-[#F35271] font-bold">({ONBOARDING_STEPS[currentStep - 1]?.title})</span>
                </div>
              )}
            </div>

            {/* Stepper Tabs */}
            {!isSubmitted && (
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2 items-center">
                {ONBOARDING_STEPS.map((s) => {
                  const isDone = currentStep > s.step;
                  const isCurrent = currentStep === s.step;
                  const Icon = s.icon;
                  return (
                    <button
                      key={s.step}
                      type="button"
                      onClick={() => {
                        if (isDone || isCurrent) setCurrentStep(s.step);
                      }}
                      className={`flex flex-col gap-1.5 p-2 rounded-xl text-left transition-all ${
                        isDone 
                          ? 'text-[#168821] bg-white/60' 
                          : isCurrent 
                            ? 'text-[#F35271] bg-white shadow-sm ring-2 ring-[#F35271]/30' 
                            : 'text-[#757880] opacity-60'
                      }`}
                    >
                      <div className={`h-1.5 rounded-full transition-all duration-300 ${
                        isDone ? 'bg-[#168821]' : isCurrent ? 'bg-[#F35271]' : 'bg-[#AFB0B7]/40'
                      }`} />
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-bold">{s.step}.</span>
                        <span className="text-[10px] font-semibold truncate hidden sm:inline">{s.title}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

          </div>
        </div>

        {/* Wizard Container */}
        <div className="w-full max-w-[1200px] mx-auto px-6 md:px-12">
          
          {!isSubmitted ? (
            <div className="space-y-8">
              
              {/* STEP 1: BUSINESS INFORMATION */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#AFB0B7]/25 shadow-md space-y-6"
                >
                  <div className="border-b border-[#AFB0B7]/20 pb-4">
                    <span className="text-xs uppercase tracking-widest text-[#F35271] font-bold">
                      Step 1 of 10
                    </span>
                    <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#0D0D12] mt-1">
                      Business Identity & Branding
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Business / Salon Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Aura Luxe Wellness"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Business Category / Type *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none cursor-pointer"
                      >
                        <option value="Spa & Wellness Center">Spa & Wellness Center</option>
                        <option value="Salon & Hair Studio">Salon & Hair Studio</option>
                        <option value="Beauty Parlour & Nail Bar">Beauty Parlour & Nail Bar</option>
                        <option value="Ayurvedic Treatment Center">Ayurvedic Treatment Center</option>
                        <option value="Massage & Recovery Center">Massage & Recovery Center</option>
                        <option value="Aesthetic & Skin Lounge">Aesthetic & Skin Lounge</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Tagline / Catchphrase
                      </label>
                      <input
                        type="text"
                        name="tagline"
                        value={formData.tagline}
                        onChange={handleChange}
                        placeholder="e.g. Private Hydro-Suites & Botanical Aromatherapy"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Owner / Director Name *
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        placeholder="e.g. Devika Singhania"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Official Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Official Business Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="contact@business.com"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Business Bio & Atmosphere Description
                      </label>
                      <textarea
                        rows={3}
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your sanctuary atmosphere, therapies offered, equipment, and specialty suites..."
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none resize-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Cover Photo High-Res Image URL
                      </label>
                      <input
                        type="url"
                        name="coverImage"
                        value={formData.coverImage}
                        onChange={handleChange}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-8 py-3.5 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-lg transition-all flex items-center gap-2"
                    >
                      <span>Next: Location & Branches</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2: LOCATION & BRANCHES */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#AFB0B7]/25 shadow-md space-y-6"
                >
                  <div className="border-b border-[#AFB0B7]/20 pb-4">
                    <span className="text-xs uppercase tracking-widest text-[#F35271] font-bold">
                      Step 2 of 10
                    </span>
                    <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#0D0D12] mt-1">
                      Primary Location & Multi-Branch Setup
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Primary City *
                      </label>
                      <input
                        type="text"
                        name="primaryCity"
                        value={formData.primaryCity}
                        onChange={handleChange}
                        placeholder="e.g. Jaipur, Bangalore, Mumbai"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        State *
                      </label>
                      <input
                        type="text"
                        name="primaryState"
                        value={formData.primaryState}
                        onChange={handleChange}
                        placeholder="e.g. Rajasthan, Karnataka"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Complete Street Address & Building *
                      </label>
                      <input
                        type="text"
                        name="primaryAddress"
                        value={formData.primaryAddress}
                        onChange={handleChange}
                        placeholder="Shop No, Building Name, Street / Road"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        name="primaryPincode"
                        value={formData.primaryPincode}
                        onChange={handleChange}
                        placeholder="e.g. 302001"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Prominent Landmark
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        value={formData.landmark}
                        onChange={handleChange}
                        placeholder="e.g. Opposite Metro Station / Mall"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>
                  </div>

                  {/* Branches list */}
                  <div className="pt-4 border-t border-[#AFB0B7]/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0D12]">
                        Registered Branches ({formData.branches.length})
                      </h4>
                      <button
                        type="button"
                        onClick={() => setShowAddBranch(true)}
                        className="text-xs font-bold text-[#F35271] hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> + Add Another Branch
                      </button>
                    </div>

                    {formData.branches.map((b) => (
                      <div key={b.id} className="p-3 bg-[#FFF8F9] rounded-xl border border-[#F35271]/20 flex justify-between text-xs">
                        <div>
                          <strong>{b.city}</strong>: {b.address}
                        </div>
                      </div>
                    ))}
                  </div>

                  {showAddBranch && (
                    <form onSubmit={handleAddBranch} className="p-4 bg-[#FFEEF1] rounded-2xl border border-[#F35271]/30 space-y-3">
                      <h5 className="text-xs font-bold text-[#0D0D12]">New Branch Details</h5>
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="City / Area"
                          value={newBranch.city}
                          onChange={(e) => setNewBranch({ ...newBranch, city: e.target.value })}
                          className="p-2 bg-white rounded-lg text-xs outline-none"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Full Street Address"
                          value={newBranch.address}
                          onChange={(e) => setNewBranch({ ...newBranch, address: e.target.value })}
                          className="p-2 bg-white rounded-lg text-xs outline-none"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setShowAddBranch(false)} className="text-xs text-[#757880]">Cancel</button>
                        <button type="submit" className="px-4 py-1.5 bg-[#F35271] text-white rounded-lg text-xs font-semibold">Save Branch</button>
                      </div>
                    </form>
                  )}

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 rounded-full border border-[#AFB0B7]/40 text-xs font-semibold uppercase tracking-wider text-[#0D0D12] hover:bg-[#FFEEF1] flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-8 py-3 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-lg flex items-center gap-2"
                    >
                      <span>Next: Business Hours</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: BUSINESS HOURS */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#AFB0B7]/25 shadow-md space-y-6"
                >
                  <div className="border-b border-[#AFB0B7]/20 pb-4">
                    <span className="text-xs uppercase tracking-widest text-[#F35271] font-bold">
                      Step 3 of 10
                    </span>
                    <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#0D0D12] mt-1">
                      Business Hours & Operating Schedule
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Operating Daily Hours *
                      </label>
                      <input
                        type="text"
                        name="openingHours"
                        value={formData.openingHours}
                        onChange={handleChange}
                        placeholder="09:00 AM - 09:30 PM"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Working Days *
                      </label>
                      <input
                        type="text"
                        name="workingDays"
                        value={formData.workingDays}
                        onChange={handleChange}
                        placeholder="Monday - Sunday (Open 7 Days)"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Holiday / Special Schedule Policy
                      </label>
                      <input
                        type="text"
                        name="holidaySchedule"
                        value={formData.holidaySchedule}
                        onChange={handleChange}
                        placeholder="Open on all national holidays with prior online reservation"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-3 rounded-full border border-[#AFB0B7]/40 text-xs font-semibold uppercase tracking-wider text-[#0D0D12] hover:bg-[#FFEEF1] flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="px-8 py-3 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-lg flex items-center gap-2"
                    >
                      <span>Next: Services Menu</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: SERVICES MENU */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#AFB0B7]/25 shadow-md space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-[#AFB0B7]/20 pb-4 flex-wrap gap-4">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#F35271] font-bold">
                        Step 4 of 10
                      </span>
                      <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#0D0D12] mt-1">
                        Services Menu ({formData.services.length} Listed)
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddService(true)}
                      className="px-5 py-2.5 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-md flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Service</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.services.map((srv) => (
                      <div key={srv.id} className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F35271]/20 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#F35271] uppercase">{srv.category} • {srv.duration}</span>
                          <h4 className="font-serif-luxury text-base text-[#0D0D12]">{srv.title}</h4>
                          <span className="font-bold text-sm text-[#0D0D12]">{srv.price}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, services: prev.services.filter(s => s.id !== srv.id) }))}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {showAddService && (
                    <form onSubmit={handleAddService} className="p-6 rounded-3xl bg-[#FFEEF1]/60 border-2 border-[#F35271]/30 space-y-4">
                      <h3 className="font-serif-luxury text-lg text-[#0D0D12]">Add New Service</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-[#0D0D12] block mb-1">Service Title *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Swedish Relaxation Massage"
                            value={newService.title}
                            onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                            className="w-full p-2.5 bg-white border rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#0D0D12] block mb-1">Category *</label>
                          <select
                            value={newService.category}
                            onChange={(e) => setNewService({ ...newService, category: e.target.value })}
                            className="w-full p-2.5 bg-white border rounded-xl text-xs outline-none"
                          >
                            <option value="Massage">Massage</option>
                            <option value="Facial">Facial</option>
                            <option value="Hair">Hair</option>
                            <option value="Beauty & Nails">Beauty & Nails</option>
                            <option value="Wellness & Ayurvedic">Wellness & Ayurvedic</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#0D0D12] block mb-1">Duration *</label>
                          <input
                            type="text"
                            placeholder="e.g. 60 mins"
                            value={newService.duration}
                            onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                            className="w-full p-2.5 bg-white border rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#0D0D12] block mb-1">Price (₹) *</label>
                          <input
                            type="number"
                            required
                            placeholder="e.g. 1999"
                            value={newService.price}
                            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                            className="w-full p-2.5 bg-white border rounded-xl text-xs outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setShowAddService(false)} className="text-xs text-[#757880]">Cancel</button>
                        <button type="submit" className="px-5 py-2 rounded-full bg-[#0D0D12] hover:bg-[#F35271] text-white text-xs uppercase font-semibold">Save</button>
                      </div>
                    </form>
                  )}

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="px-6 py-3 rounded-full border border-[#AFB0B7]/40 text-xs font-semibold uppercase tracking-wider text-[#0D0D12] hover:bg-[#FFEEF1] flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      className="px-8 py-3 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-lg flex items-center gap-2"
                    >
                      <span>Next: Packages</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 5: PACKAGES */}
              {currentStep === 5 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#AFB0B7]/25 shadow-md space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-[#AFB0B7]/20 pb-4 flex-wrap gap-4">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#F35271] font-bold">
                        Step 5 of 10
                      </span>
                      <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#0D0D12] mt-1">
                        Treatment Packages & Passes ({formData.packages.length})
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddPackage(true)}
                      className="px-5 py-2.5 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-md flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Package</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.packages.map((pkg) => (
                      <div key={pkg.id} className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F35271]/20 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-bold text-[#F35271] uppercase">{pkg.sessionsCount} Sessions • {pkg.validity}</span>
                          <h4 className="font-serif-luxury text-lg text-[#0D0D12]">{pkg.name}</h4>
                          <span className="font-bold text-sm text-[#0D0D12]">{pkg.price}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, packages: prev.packages.filter(p => p.id !== pkg.id) }))}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {showAddPackage && (
                    <form onSubmit={handleAddPackage} className="p-6 rounded-3xl bg-[#FFEEF1]/60 border-2 border-[#F35271]/30 space-y-4">
                      <h3 className="font-serif-luxury text-lg text-[#0D0D12]">Add Treatment Package</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-[#0D0D12] block mb-1">Package Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Bridal 5-Session Glow Pass"
                            value={newPackage.name}
                            onChange={(e) => setNewPackage({ ...newPackage, name: e.target.value })}
                            className="w-full p-2.5 bg-white border rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#0D0D12] block mb-1">Sessions Count *</label>
                          <input
                            type="number"
                            required
                            value={newPackage.sessionsCount}
                            onChange={(e) => setNewPackage({ ...newPackage, sessionsCount: e.target.value })}
                            className="w-full p-2.5 bg-white border rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#0D0D12] block mb-1">Package Price (₹) *</label>
                          <input
                            type="number"
                            required
                            placeholder="e.g. 4999"
                            value={newPackage.price}
                            onChange={(e) => setNewPackage({ ...newPackage, price: e.target.value })}
                            className="w-full p-2.5 bg-white border rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#0D0D12] block mb-1">Regular Total Price (₹)</label>
                          <input
                            type="number"
                            placeholder="e.g. 6500"
                            value={newPackage.regularPrice}
                            onChange={(e) => setNewPackage({ ...newPackage, regularPrice: e.target.value })}
                            className="w-full p-2.5 bg-white border rounded-xl text-xs outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setShowAddPackage(false)} className="text-xs text-[#757880]">Cancel</button>
                        <button type="submit" className="px-5 py-2 rounded-full bg-[#0D0D12] hover:bg-[#F35271] text-white text-xs uppercase font-semibold">Save</button>
                      </div>
                    </form>
                  )}

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(4)}
                      className="px-6 py-3 rounded-full border border-[#AFB0B7]/40 text-xs font-semibold uppercase tracking-wider text-[#0D0D12] hover:bg-[#FFEEF1] flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(6)}
                      className="px-8 py-3 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-lg flex items-center gap-2"
                    >
                      <span>Next: Staff / Therapists</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 6: STAFF / THERAPISTS */}
              {currentStep === 6 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#AFB0B7]/25 shadow-md space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-[#AFB0B7]/20 pb-4 flex-wrap gap-4">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#F35271] font-bold">
                        Step 6 of 10
                      </span>
                      <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#0D0D12] mt-1">
                        Staff & Master Specialists ({formData.staff.length})
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddStaff(true)}
                      className="px-5 py-2.5 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-md flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Staff Member</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {formData.staff.map((st) => (
                      <div key={st.id} className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F35271]/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={st.avatar} alt={st.name} className="w-12 h-12 rounded-full object-cover" />
                          <div>
                            <h4 className="font-serif-luxury text-base text-[#0D0D12]">{st.name}</h4>
                            <span className="text-xs text-[#F35271] font-semibold">{st.role} • {st.experience}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, staff: prev.staff.filter(s => s.id !== st.id) }))}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {showAddStaff && (
                    <form onSubmit={handleAddStaff} className="p-6 rounded-3xl bg-[#FFEEF1]/60 border-2 border-[#F35271]/30 space-y-4">
                      <h3 className="font-serif-luxury text-lg text-[#0D0D12]">Add Staff / Specialist</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-[#0D0D12] block mb-1">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Rahul Sharma"
                            value={newStaff.name}
                            onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                            className="w-full p-2.5 bg-white border rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#0D0D12] block mb-1">Role / Designation *</label>
                          <input
                            type="text"
                            placeholder="e.g. Senior Massage Specialist"
                            value={newStaff.role}
                            onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                            className="w-full p-2.5 bg-white border rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#0D0D12] block mb-1">Experience</label>
                          <input
                            type="text"
                            placeholder="e.g. 6 Yrs Exp"
                            value={newStaff.experience}
                            onChange={(e) => setNewStaff({ ...newStaff, experience: e.target.value })}
                            className="w-full p-2.5 bg-white border rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#0D0D12] block mb-1">Specialization</label>
                          <input
                            type="text"
                            placeholder="e.g. Swedish, Deep Tissue, Facials"
                            value={newStaff.specialization}
                            onChange={(e) => setNewStaff({ ...newStaff, specialization: e.target.value })}
                            className="w-full p-2.5 bg-white border rounded-xl text-xs outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setShowAddStaff(false)} className="text-xs text-[#757880]">Cancel</button>
                        <button type="submit" className="px-5 py-2 rounded-full bg-[#0D0D12] hover:bg-[#F35271] text-white text-xs uppercase font-semibold">Save</button>
                      </div>
                    </form>
                  )}

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(5)}
                      className="px-6 py-3 rounded-full border border-[#AFB0B7]/40 text-xs font-semibold uppercase tracking-wider text-[#0D0D12] hover:bg-[#FFEEF1] flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(7)}
                      className="px-8 py-3 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-lg flex items-center gap-2"
                    >
                      <span>Next: Rooms & Resources</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 7: ROOMS & RESOURCES */}
              {currentStep === 7 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#AFB0B7]/25 shadow-md space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-[#AFB0B7]/20 pb-4 flex-wrap gap-4">
                    <div>
                      <span className="text-xs uppercase tracking-widest text-[#F35271] font-bold">
                        Step 7 of 10
                      </span>
                      <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#0D0D12] mt-1">
                        Suites, Rooms & Resources ({formData.rooms.length})
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowAddRoom(true)}
                      className="px-5 py-2.5 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-md flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Room</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.rooms.map((room) => (
                      <div key={room.id} className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F35271]/20 flex items-center justify-between">
                        <div>
                          <h4 className="font-serif-luxury text-base text-[#0D0D12]">{room.name}</h4>
                          <span className="text-xs text-[#757880]">{room.type} • Capacity: {room.capacity} Person(s)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, rooms: prev.rooms.filter(r => r.id !== room.id) }))}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {showAddRoom && (
                    <form onSubmit={handleAddRoom} className="p-6 rounded-3xl bg-[#FFEEF1]/60 border-2 border-[#F35271]/30 space-y-4">
                      <h3 className="font-serif-luxury text-lg text-[#0D0D12]">Add Room / Suite</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-bold text-[#0D0D12] block mb-1">Room Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. VIP Hydro-Tub Suite"
                            value={newRoom.name}
                            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                            className="w-full p-2.5 bg-white border rounded-xl text-xs outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-bold text-[#0D0D12] block mb-1">Room Type *</label>
                          <select
                            value={newRoom.type}
                            onChange={(e) => setNewRoom({ ...newRoom, type: e.target.value })}
                            className="w-full p-2.5 bg-white border rounded-xl text-xs outline-none"
                          >
                            <option value="Single Therapy Suite">Single Therapy Suite</option>
                            <option value="Couple Suite with Hydro-Tub">Couple Suite with Hydro-Tub</option>
                            <option value="Ayurvedic Chamber">Ayurvedic Chamber</option>
                            <option value="Hair Styling & Botox Station">Hair Styling & Botox Station</option>
                            <option value="Facial & Aesthetics Pod">Facial & Aesthetics Pod</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setShowAddRoom(false)} className="text-xs text-[#757880]">Cancel</button>
                        <button type="submit" className="px-5 py-2 rounded-full bg-[#0D0D12] hover:bg-[#F35271] text-white text-xs uppercase font-semibold">Save</button>
                      </div>
                    </form>
                  )}

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(6)}
                      className="px-6 py-3 rounded-full border border-[#AFB0B7]/40 text-xs font-semibold uppercase tracking-wider text-[#0D0D12] hover:bg-[#FFEEF1] flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(8)}
                      className="px-8 py-3 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-lg flex items-center gap-2"
                    >
                      <span>Next: GST & Payout Details</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 8: GST & BUSINESS DETAILS */}
              {currentStep === 8 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-[#AFB0B7]/25 shadow-md space-y-6"
                >
                  <div className="border-b border-[#AFB0B7]/20 pb-4">
                    <span className="text-xs uppercase tracking-widest text-[#F35271] font-bold">
                      Step 8 of 10
                    </span>
                    <h2 className="font-serif-luxury text-2xl md:text-3xl text-[#0D0D12] mt-1">
                      GST, Tax & Payout Bank Details
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        GSTIN Number (Optional/If Applicable)
                      </label>
                      <input
                        type="text"
                        name="gstin"
                        value={formData.gstin}
                        onChange={handleChange}
                        placeholder="08AAAAA1234A1Z5"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Business / Owner PAN *
                      </label>
                      <input
                        type="text"
                        name="pan"
                        value={formData.pan}
                        onChange={handleChange}
                        placeholder="ABCDE1234F"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Bank Account Beneficiary Name *
                      </label>
                      <input
                        type="text"
                        name="bankAccountName"
                        value={formData.bankAccountName}
                        onChange={handleChange}
                        placeholder="e.g. Aura Luxe Wellness Pvt Ltd"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Bank Account Number *
                      </label>
                      <input
                        type="password"
                        name="bankAccountNumber"
                        value={formData.bankAccountNumber}
                        onChange={handleChange}
                        placeholder="••••••••••••••"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        IFSC Code *
                      </label>
                      <input
                        type="text"
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleChange}
                        placeholder="HDFC0001234"
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none uppercase"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] block mb-1.5">
                        Cancellation & Rescheduling Terms
                      </label>
                      <input
                        type="text"
                        name="cancellationTerms"
                        value={formData.cancellationTerms}
                        onChange={handleChange}
                        placeholder="Free cancellation up to 6 hours before appointment."
                        className="w-full p-3.5 bg-white border border-[#AFB0B7]/40 rounded-xl text-sm focus:border-[#F35271] outline-none"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(7)}
                      className="px-6 py-3 rounded-full border border-[#AFB0B7]/40 text-xs font-semibold uppercase tracking-wider text-[#0D0D12] hover:bg-[#FFEEF1] flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(9)}
                      className="px-8 py-3 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-lg flex items-center gap-2"
                    >
                      <span>Next: Live Profile Preview</span> <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 9: LIVE PROFILE PREVIEW */}
              {currentStep === 9 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border-2 border-[#F35271]/30 shadow-xl space-y-8">
                    <div className="flex items-center justify-between border-b border-[#AFB0B7]/20 pb-4">
                      <div>
                        <span className="text-xs uppercase tracking-widest text-[#168821] font-bold bg-[#168821]/10 px-3 py-1 rounded-full inline-block mb-1">
                          Step 9: Live Profile Preview
                        </span>
                        <h2 className="font-serif-luxury text-3xl text-[#0D0D12]">
                          {formData.name}
                        </h2>
                      </div>
                      <span className="px-3.5 py-1 rounded-full bg-[#FFEEF1] text-xs font-bold text-[#F35271] uppercase">
                        {formData.type}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#0D0D12]">
                      <div className="p-4 rounded-2xl bg-[#FFF8F9]">
                        <span className="text-[#757880] block">Flagship Location:</span>
                        <strong>{formData.primaryAddress}, {formData.primaryCity} - {formData.primaryPincode}</strong>
                      </div>
                      <div className="p-4 rounded-2xl bg-[#FFF8F9]">
                        <span className="text-[#757880] block">Timings & Contact:</span>
                        <strong>{formData.openingHours} • {formData.phone}</strong>
                      </div>
                    </div>

                    {/* Services */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-3">
                        Services Catalog ({formData.services.length})
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {formData.services.map((s, idx) => (
                          <div key={idx} className="p-3 bg-white border border-[#AFB0B7]/20 rounded-xl flex justify-between text-xs">
                            <span className="font-semibold">{s.title} ({s.duration})</span>
                            <span className="font-bold text-[#F35271]">{s.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Staff */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#0D0D12] mb-3">
                        Specialists Team ({formData.staff.length})
                      </h4>
                      <div className="flex gap-4 flex-wrap">
                        {formData.staff.map((st, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 bg-[#FFF8F9] rounded-xl text-xs">
                            <img src={st.avatar} alt={st.name} className="w-8 h-8 rounded-full object-cover" />
                            <span><strong>{st.name}</strong> ({st.role})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-[#AFB0B7]/20 flex justify-between items-center">
                      <button
                        type="button"
                        onClick={() => setCurrentStep(8)}
                        className="px-6 py-3 rounded-full border border-[#AFB0B7]/40 text-xs font-semibold uppercase tracking-wider text-[#0D0D12] hover:bg-[#FFEEF1] flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> <span>Back</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCurrentStep(10)}
                        className="px-8 py-3 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-lg flex items-center gap-2"
                      >
                        <span>Proceed to Final Submit</span> <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 10: SUBMISSION */}
              {currentStep === 10 && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-[2.5rem] p-8 md:p-12 border-2 border-[#F35271]/30 shadow-xl text-center space-y-6 max-w-2xl mx-auto"
                >
                  <div className="w-16 h-16 rounded-full bg-[#FFEEF1] text-[#F35271] mx-auto flex items-center justify-center">
                    <Send className="w-8 h-8" />
                  </div>

                  <div>
                    <span className="text-xs uppercase tracking-widest text-[#F35271] font-bold">
                      Step 10: Platform Activation
                    </span>
                    <h2 className="font-serif-luxury text-3xl text-[#0D0D12] mt-1">
                      Ready to Go Live?
                    </h2>
                    <p className="text-xs sm:text-sm text-[#757880] font-light mt-2 max-w-md mx-auto leading-relaxed">
                      By submitting, your business <strong>{formData.name}</strong> will be published immediately on TherapyShala for discovery, customer reviews, and appointments.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#FFF8F9] border border-[#F35271]/20 text-xs text-[#757880] space-y-1 text-left">
                    <div className="flex items-center gap-2 text-[#0D0D12] font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#168821]" /> Zero Setup Fee & 100% Free Listing
                    </div>
                    <div className="flex items-center gap-2 text-[#0D0D12] font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#168821]" /> 24/7 Automated Real-Time Booking Calendar
                    </div>
                    <div className="flex items-center gap-2 text-[#0D0D12] font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-[#168821]" /> Instant SMS & Calendar Notifications
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(9)}
                      className="px-6 py-3 rounded-full border border-[#AFB0B7]/40 text-xs font-semibold uppercase tracking-wider text-[#0D0D12]"
                    >
                      Back to Preview
                    </button>

                    <button
                      type="button"
                      onClick={handleFinalSubmit}
                      className="px-10 py-4 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-[0_10px_30px_rgba(243,82,113,0.4)] transition-all flex items-center gap-2"
                    >
                      <span>Publish & Activate Business</span>
                      <Sparkles className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

            </div>
          ) : (
            /* SUCCESS CONFIRMATION STATE */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[3rem] p-10 md:p-16 border border-[#AFB0B7]/25 shadow-2xl text-center space-y-8"
            >
              <div className="w-24 h-24 rounded-full bg-[#FFEEF1] text-[#F35271] mx-auto flex items-center justify-center shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div>
                <span className="text-xs uppercase tracking-widest text-[#168821] font-bold bg-[#168821]/10 px-4 py-1 rounded-full inline-block mb-3">
                  Onboarding Complete
                </span>
                <h2 className="font-serif-luxury text-3xl sm:text-4xl text-[#0D0D12]">
                  Welcome to TherapyShala!
                </h2>
                <p className="text-sm text-[#757880] font-light mt-2 max-w-lg mx-auto leading-relaxed">
                  Your business <strong>{formData.name}</strong> is now live and ready to receive client appointments.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <Link
                  to={`/business/${generatedSlug}`}
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold uppercase tracking-wider shadow-lg transition-all"
                >
                  View Your Live Public Profile
                </Link>
                <Link
                  to="/explore"
                  className="w-full sm:w-auto px-8 py-4 rounded-full border border-[#AFB0B7]/40 text-[#0D0D12] hover:border-[#F35271] text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Explore All Spas & Salons
                </Link>
              </div>
            </motion.div>
          )}

        </div>

      </main>

      <Footer />
    </div>
  );
}
