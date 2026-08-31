import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicLegalDocument, getPublicLegalDocuments } from '../services/content.service';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, ArrowLeft, RefreshCw, AlertCircle, FileText, Calendar, CheckCircle2 } from 'lucide-react';

const SLUG_TO_TYPE_MAP = {
  privacy: { type: 'PRIVACY', title: 'Privacy Policy' },
  'privacy-policy': { type: 'PRIVACY', title: 'Privacy Policy' },
  terms: { type: 'TERMS', title: 'Terms & Conditions' },
  'terms-and-conditions': { type: 'TERMS', title: 'Terms & Conditions' },
  'therapist-terms': { type: 'THERAPIST_TERMS', title: 'Therapist Terms' },
  cancellation: { type: 'CANCELLATION', title: 'Cancellation Policy' },
  'cancellation-policy': { type: 'CANCELLATION', title: 'Cancellation Policy' },
  refund: { type: 'REFUND', title: 'Refund Policy' },
  'refund-policy': { type: 'REFUND', title: 'Refund Policy' },
  about: { type: 'ABOUT_US', title: 'About Us' },
  'about-us': { type: 'ABOUT_US', title: 'About Us' },
};

const DEFAULT_LEGAL_DOCS = {
  PRIVACY: {
    title: 'Privacy Policy',
    version: '1.2',
    effectiveAt: '2026-01-01',
    content: `# Privacy Policy
## 1. Introduction & Overview
Welcome to TherapyShala. We are committed to safeguarding the privacy and personal data of our users, guests, therapists, and partner businesses. This Privacy Policy explains how we collect, process, utilize, and protect your information when you access our multi-business marketplace platform and associated applications.

## 2. Information We Collect
We collect personal information necessary to deliver seamless wellness discovery and appointment booking services:
* **Account Information:** Name, email address, contact phone number, and gender preferences.
* **Appointment & Booking Records:** Service selections, appointment dates, therapist preferences, and transaction records.
* **Business Registration Data:** Business name, owner identity, registered address, GSTIN, PAN, and service menus.
* **Device & Usage Data:** Browser specifications, IP address, and platform navigation patterns.

## 3. How We Use Your Information
Your data is used strictly for legitimate business and booking fulfillment purposes:
* Facilitating real-time appointment confirmations between customers and verified spa/salon centers.
* Sending transactional SMS notifications and calendar reminders (.ics).
* Processing secure payouts and financial invoices.
* Continuously auditing and improving platform security, hygiene protocols, and service quality.

## 4. Data Security & Storage
We employ industry-standard encryption protocols (SSL/TLS) and UV-C medical data privacy standards. We do not sell, rent, or trade your personal information to third-party advertisers.

## 5. Your Data Rights
You retain the right to inspect, update, or request the deletion of your personal data at any time through your Customer Account portal or by writing to privacy@therapyshala.com.`
  },
  TERMS: {
    title: 'Terms & Conditions',
    version: '1.4',
    effectiveAt: '2026-01-01',
    content: `# Terms & Conditions
## 1. Acceptance of Terms
By accessing or using TherapyShala, you agree to be bound by these Terms & Conditions. If you do not agree, please refrain from using our marketplace services.

## 2. Marketplace & Discovery Platform
TherapyShala operates as a multi-business marketplace connecting independent verified Spas, Salons, and Wellness Centers with customers. Each partner business is independently responsible for the in-person delivery of scheduled services.

## 3. Customer Appointments & Cancellations
* Appointments booked online are confirmed in real-time.
* Rescheduling or cancellation is complimentary up to 6 hours prior to the scheduled slot.
* Late arrivals exceeding 15 minutes may result in reduced service duration or cancellation subject to center policies.

## 4. Partner Business Obligations
Partner businesses listed on TherapyShala warrant that all therapists and facilities comply with state licensing, sanitation audits, and pricing transparency.`
  },
  CANCELLATION: {
    title: 'Cancellation & Rescheduling Policy',
    version: '1.1',
    effectiveAt: '2026-01-01',
    content: `# Cancellation Policy
## 1. Flexible 6-Hour Cancellation Window
We understand schedules change. TherapyShala offers free online cancellation and rescheduling up to **6 hours** prior to your appointment time.

## 2. Late Cancellations & No-Shows
* Cancellations made within 6 hours of the appointment are eligible for 80% store credit towards your next appointment.
* Failure to attend a scheduled session without prior notice will forfeit the booking deposit.`
  },
  REFUND: {
    title: 'Refund Policy',
    version: '1.1',
    effectiveAt: '2026-01-01',
    content: `# Refund Policy
## 1. Online Booking Refunds
Refunds for eligible cancellations processed via our platform are credited back to the original payment method within 5–7 business days.

## 2. Treatment Satisfaction Guarantee
If you experience service quality discrepancies that do not meet TherapyShala verified standards, contact support@therapyshala.com within 24 hours for audit and dispute resolution.`
  },
  ABOUT_US: {
    title: 'About TherapyShala',
    version: '1.0',
    effectiveAt: '2026-01-01',
    content: `# About TherapyShala
## India's Premier Multi-Business Spa & Salon Platform
TherapyShala was founded with a singular mission: to make holistic luxury wellness, therapeutic massage, and aesthetic beauty rituals transparent, accessible, and bookable in real time.

We empower independent Spas, Salons, Ayurvedic Retreats, and Aesthetic Lounges across India with state-of-the-art business management tools while providing customers with a trustworthy discovery ecosystem.`
  }
};

// Format plain text or simple markdown headers safely
const formatLegalContent = (text) => {
  if (!text) return null;

  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={idx} className="h-3" />;

    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={idx} className="font-serif-luxury text-3xl md:text-4xl text-[#0D0D12] font-semibold mt-8 mb-4">
          {trimmed.replace('# ', '')}
        </h1>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={idx} className="font-serif-luxury text-2xl md:text-3xl text-[#0D0D12] font-semibold mt-6 mb-3 border-b border-[#AFB0B7]/20 pb-2">
          {trimmed.replace('## ', '')}
        </h2>
      );
    }
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className="font-serif-luxury text-xl text-[#0D0D12] font-semibold mt-5 mb-2">
          {trimmed.replace('### ', '')}
        </h3>
      );
    }
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      return (
        <li key={idx} className="ml-6 list-disc text-base text-[#757880] leading-relaxed my-2 font-light">
          {trimmed.replace(/^[* -]\s+/, '')}
        </li>
      );
    }

    return (
      <p key={idx} className="text-base text-[#757880] font-light leading-relaxed my-3">
        {trimmed}
      </p>
    );
  });
};

export default function CmsPage({ docTypeOverride, docTitleOverride }) {
  const { slug } = useParams();

  const slugKey = (slug || '').toLowerCase();
  const mapped = SLUG_TO_TYPE_MAP[slugKey] || {
    type: (docTypeOverride || slugKey || 'PRIVACY').toUpperCase(),
    title: docTitleOverride || (slug ? slug.replace(/-/g, ' ').toUpperCase() : 'Legal Policy'),
  };

  const currentType = docTypeOverride || mapped.type;
  const currentTitle = docTitleOverride || mapped.title;

  const defaultFallback = DEFAULT_LEGAL_DOCS[currentType] || DEFAULT_LEGAL_DOCS.PRIVACY;

  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiveFromApi, setIsLiveFromApi] = useState(false);

  const fetchDoc = useCallback(async () => {
    setLoading(true);
    try {
      let docPayload = null;

      // 1. Try GET /content/legal/{type}
      try {
        const res = await getPublicLegalDocument(currentType);
        const payload = res?.data || res;
        if (payload && payload.type === currentType && payload.content) {
          docPayload = payload;
        }
      } catch {
        // Silently catch and fallback to list endpoint
      }

      // 2. Search exact currentType in GET /content/legal list
      if (!docPayload) {
        try {
          const listRes = await getPublicLegalDocuments();
          const list = Array.isArray(listRes?.data)
            ? listRes.data
            : Array.isArray(listRes)
            ? listRes
            : [];
          docPayload = list.find((d) => d.type === currentType || d.id === currentType) || null;
        } catch {
          // Silently catch list error
        }
      }

      if (docPayload && docPayload.content) {
        setDocumentData(docPayload);
        setIsLiveFromApi(true);
      } else {
        setDocumentData(defaultFallback);
      }
    } catch {
      setDocumentData(defaultFallback);
    } finally {
      setLoading(false);
    }
  }, [currentType]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDoc();
  }, [fetchDoc]);

  return (
    <div className="min-h-screen bg-[#FFFDFD] text-[#0D0D12] font-sans flex flex-col justify-between">
      <Navbar />

      {/* Main Page Header */}
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 lg:px-16 xl:px-20 max-w-[1720px] mx-auto w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#F35271] hover:text-[#E04362] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

       
        </div>

        {/* Header Hero Banner */}
        <div className="bg-white rounded-3xl border border-[#AFB0B7]/30 p-8 md:p-12 mb-10 shadow-xs relative overflow-hidden">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-[#FFEEF1] flex items-center justify-center text-[#F35271] shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F35271] block">
                Official Legal Policy
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl font-semibold text-[#0D0D12]">
                {documentData?.title || currentTitle}
              </h1>
            </div>
          </div>

          {documentData && (documentData.version || documentData.effectiveAt) && (
            <div className="flex items-center gap-6 pt-4 border-t border-[#AFB0B7]/20 text-xs text-[#757880] font-light">
              {documentData.version && (
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#F35271]" />
                  <span>Version {documentData.version}</span>
                </div>
              )}
              {documentData.effectiveAt && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[#F35271]" />
                  <span>Effective Date: {documentData.effectiveAt}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="bg-white rounded-3xl border border-[#AFB0B7]/30 p-8 md:p-12 shadow-sm min-h-[400px]">
          {loading ? (
            <div className="py-24 text-center space-y-4">
              <div className="w-10 h-10 border-4 border-[#F35271] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm font-medium text-[#757880]">Loading policy from live server...</p>
            </div>
          ) : (
            <article className="prose prose-lg max-w-none">
              {formatLegalContent(documentData?.content)}
            </article>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
