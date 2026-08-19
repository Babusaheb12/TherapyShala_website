import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getPublicLegalDocument, getPublicLegalDocuments } from '../services/content.service';
import { X, RefreshCw, AlertCircle, Shield, FileText } from 'lucide-react';

// Format plain text or simple markdown headers safely
const formatLegalContent = (text) => {
  if (!text) return null;

  const lines = text.split('\n');
  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={idx} className="h-3" />;

    if (trimmed.startsWith('# ')) {
      return (
        <h1 key={idx} className="font-serif-luxury text-2xl md:text-3xl text-[#0D0D12] font-semibold mt-6 mb-3">
          {trimmed.replace('# ', '')}
        </h1>
      );
    }
    if (trimmed.startsWith('## ')) {
      return (
        <h2 key={idx} className="font-serif-luxury text-xl md:text-2xl text-[#0D0D12] font-semibold mt-5 mb-2 border-b border-[#AFB0B7]/20 pb-1">
          {trimmed.replace('## ', '')}
        </h2>
      );
    }
    if (trimmed.startsWith('### ')) {
      return (
        <h3 key={idx} className="font-serif-luxury text-lg text-[#0D0D12] font-semibold mt-4 mb-2">
          {trimmed.replace('### ', '')}
        </h3>
      );
    }
    if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
      return (
        <li key={idx} className="ml-5 list-disc text-sm text-[#757880] leading-relaxed my-1">
          {trimmed.replace(/^[* -]\s+/, '')}
        </li>
      );
    }

    return (
      <p key={idx} className="text-sm text-[#757880] font-light leading-relaxed my-2">
        {trimmed}
      </p>
    );
  });
};

export default function LegalModal({ isOpen, onClose, docType = 'PRIVACY', docTitle = 'Policy' }) {
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
        const res = await getPublicLegalDocument(docType);
        const payload = res?.data || res;
        if (payload && payload.type === docType && payload.content) {
          docPayload = payload;
        }
      } catch {
        // Silently catch and fallback to list endpoint
      }

      // 2. Search exact docType in GET /content/legal list
      if (!docPayload) {
        try {
          const listRes = await getPublicLegalDocuments();
          const list = Array.isArray(listRes?.data)
            ? listRes.data
            : Array.isArray(listRes)
            ? listRes
            : [];
          docPayload = list.find((d) => d.type === docType || d.id === docType) || null;
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
  }, [docType]);

  useEffect(() => {
    if (isOpen) {
      fetchDoc();
    }
  }, [isOpen, fetchDoc]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#FAF6F0] rounded-3xl border border-[#AFB0B7]/40 shadow-2xl w-full max-w-3xl overflow-hidden max-h-[85vh] flex flex-col relative"
        >
          {/* Modal Header */}
          <div className="p-6 border-b border-[#AFB0B7]/30 flex items-center justify-between bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#FFEEF1] flex items-center justify-center text-[#F35271]">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-xl text-[#0D0D12] font-semibold">
                  {documentData?.title || docTitle}
                </h3>
                {documentData && (documentData.version || documentData.effectiveAt) ? (
                  <p className="text-[11px] text-[#757880] font-light">
                    {documentData.version && `Version ${documentData.version}`}
                    {documentData.version && documentData.effectiveAt && ' • '}
                    {documentData.effectiveAt && `Effective: ${documentData.effectiveAt}`}
                  </p>
                ) : (
                  <span className="text-[10px] uppercase font-bold text-[#F35271]">Live API Content</span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-[#0D0D12] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-4">
            {loading ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-[#F35271] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-[#757880] font-medium">Fetching policy from server...</p>
              </div>
            ) : notFoundInApi ? (
              <div className="py-12 px-6 text-center space-y-4 bg-white rounded-2xl border border-[#AFB0B7]/30 shadow-xs">
                <FileText className="w-10 h-10 text-[#F35271] mx-auto opacity-70" />
                <div className="space-y-1">
                  <h4 className="font-serif-luxury text-xl text-[#0D0D12]">
                    {docTitle} Not Published Yet
                  </h4>
                  <p className="text-xs text-[#757880] font-light leading-relaxed max-w-md mx-auto">
                    The backend API does not have a published record for <strong className="font-semibold text-[#0D0D12]">{docTitle}</strong> yet.
                    As soon as an administrator adds and publishes this document in the Admin Panel, it will automatically appear here live.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={fetchDoc}
                    className="px-5 py-2.5 bg-[#F35271] text-white text-xs font-semibold rounded-full hover:bg-[#E04362] transition-colors inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Re-check Backend API
                  </button>
                </div>
              </div>
            ) : errorMsg ? (
              <div className="py-12 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
                <p className="text-sm font-medium text-rose-700">{errorMsg}</p>
                <button
                  type="button"
                  onClick={fetchDoc}
                  className="px-4 py-2 bg-[#F35271] text-white text-xs font-semibold rounded-full hover:bg-[#E04362] transition-colors inline-flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Retry Connection
                </button>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none">
                {formatLegalContent(documentData?.content)}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t border-[#AFB0B7]/30 bg-white flex justify-end shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#F35271] hover:bg-[#E04362] text-white text-xs font-semibold rounded-full transition-colors shadow-sm"
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
