import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicLegalDocument, getPublicLegalDocuments } from '../services/content.service';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Shield, ArrowLeft, RefreshCw, AlertCircle, FileText, Calendar } from 'lucide-react';

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

  const [documentData, setDocumentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFoundInApi, setNotFoundInApi] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDoc = useCallback(async () => {
    setLoading(true);
    setErrorMsg('');
    setNotFoundInApi(false);
    setDocumentData(null);

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
      } else {
        setNotFoundInApi(true);
      }
    } catch {
      setErrorMsg('Unable to connect to live API server. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  }, [currentType]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchDoc();
  }, [fetchDoc]);

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#1F1B18] font-sans flex flex-col justify-between">
      {/* Navbar */}
      <Navbar />

      {/* Main Page Header */}
      <main className="flex-1 pt-32 pb-24 px-6 md:px-12 lg:px-20 max-w-5xl mx-auto w-full">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
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

          {documentData && (documentData.version || documentData.effectiveAt) ? (
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
          ) : (
            <div className="pt-3 border-t border-[#AFB0B7]/20">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F35271]">
                Live Backend API Source of Truth
              </span>
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
          ) : notFoundInApi ? (
            <div className="py-16 px-6 text-center space-y-5">
              <FileText className="w-12 h-12 text-[#F35271] mx-auto opacity-70" />
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="font-serif-luxury text-2xl text-[#0D0D12] font-semibold">
                  {currentTitle} Not Published Yet
                </h3>
                <p className="text-sm text-[#757880] font-light leading-relaxed">
                  The backend API does not have a published record for <strong className="font-semibold text-[#0D0D12]">{currentTitle}</strong> yet.
                  As soon as an administrator adds and publishes this document in the Admin Panel, it will automatically appear here live.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={fetchDoc}
                  className="px-6 py-3 bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all shadow-md inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Re-check Backend API
                </button>
              </div>
            </div>
          ) : errorMsg ? (
            <div className="py-16 text-center space-y-4">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <p className="text-sm font-medium text-rose-700">{errorMsg}</p>
              <button
                type="button"
                onClick={fetchDoc}
                className="px-6 py-3 bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all inline-flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Retry Connection
              </button>
            </div>
          ) : (
            <article className="prose prose-lg max-w-none">
              {formatLegalContent(documentData?.content)}
            </article>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
