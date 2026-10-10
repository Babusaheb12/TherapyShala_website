import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Check, Globe, ChevronDown } from 'lucide-react';
import { ALL_ISO_LANGUAGES, searchLanguages } from '../utils/languages';

/**
 * ISO-639-1 Multi-Select Component for Therapist Onboarding
 * @param {Array<string>|string} value - Selected languages (array of strings or comma-separated)
 * @param {Function} onChange - Callback when selection changes, receives updated array of language names
 */
export default function LanguageSelect({ value = [], onChange }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Normalize current value to array of trimmed language strings
  const selectedList = Array.isArray(value)
    ? value
    : typeof value === 'string' && value.trim()
    ? value.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const filteredLanguages = searchLanguages(query);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (lang) => {
    // Check if already selected by name or code
    const isSelected = selectedList.some(
      (item) =>
        item.toLowerCase() === lang.name.toLowerCase() ||
        item.toLowerCase() === lang.code.toLowerCase()
    );

    let nextList;
    if (isSelected) {
      nextList = selectedList.filter(
        (item) =>
          item.toLowerCase() !== lang.name.toLowerCase() &&
          item.toLowerCase() !== lang.code.toLowerCase()
      );
    } else {
      nextList = [...selectedList, lang.name];
    }

    if (onChange) {
      onChange(nextList);
    }
  };

  const handleRemove = (nameToRemove, e) => {
    e.stopPropagation();
    const nextList = selectedList.filter(
      (item) => item.toLowerCase() !== nameToRemove.toLowerCase()
    );
    if (onChange) {
      onChange(nextList);
    }
  };

  return (
    <div className="space-y-2 relative" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-[#0D0D12] text-xs">
          Languages Spoken (ISO-639-1) <span className="text-rose-500">*</span>
        </label>
        <span className="text-[10px] text-[#757880] flex items-center gap-1">
          <Globe className="w-3 h-3 text-[#F35271]" />
          <span>{selectedList.length} Selected</span>
        </span>
      </div>

      {/* Selected Language Chips Container */}
      <div
        onClick={() => setIsOpen(true)}
        className="min-h-[44px] p-2 rounded-xl border border-gray-200 focus-within:border-[#F35271] bg-white cursor-pointer flex flex-wrap items-center gap-1.5 transition-colors"
      >
        {selectedList.length === 0 && !isOpen && (
          <span className="text-xs text-gray-400 px-1.5 py-1">
            Search or select spoken languages (e.g. Hindi, English, Marathi)...
          </span>
        )}

        {selectedList.map((langName) => {
          // Find language metadata if matched
          const meta = ALL_ISO_LANGUAGES.find(
            (l) =>
              l.name.toLowerCase() === langName.toLowerCase() ||
              l.code.toLowerCase() === langName.toLowerCase()
          );

          return (
            <span
              key={langName}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-50 text-[#F35271] text-xs font-semibold border border-rose-100 group shadow-2xs"
            >
              {meta?.code && (
                <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-white/80 text-rose-700">
                  {meta.code}
                </span>
              )}
              <span>{meta?.name || langName}</span>
              <button
                type="button"
                onClick={(e) => handleRemove(langName, e)}
                className="hover:text-rose-800 transition-colors p-0.5 rounded cursor-pointer"
                title={`Remove ${langName}`}
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          );
        })}

        {/* Input to trigger and search */}
        <div className="flex-1 min-w-[120px] flex items-center gap-1 px-1">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={selectedList.length > 0 ? 'Add more...' : ''}
            className="w-full text-xs outline-none bg-transparent text-gray-700 placeholder-gray-400"
          />
          <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden text-xs max-h-64 flex flex-col">
          <div className="p-2 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-gray-400 ml-1" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by English name, Native script, or ISO code..."
              className="w-full bg-transparent outline-none text-xs text-gray-700"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
            {filteredLanguages.length === 0 ? (
              <div className="p-4 text-center text-gray-400">
                No ISO-639-1 language matching &ldquo;{query}&rdquo;
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = selectedList.some(
                  (item) =>
                    item.toLowerCase() === lang.name.toLowerCase() ||
                    item.toLowerCase() === lang.code.toLowerCase()
                );

                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => handleToggle(lang)}
                    className={`w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-rose-50/40 transition-colors cursor-pointer ${
                      isSelected ? 'bg-rose-50/70 font-bold text-[#F35271]' : 'text-gray-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 text-center text-[10px] font-mono uppercase px-1 py-0.5 rounded bg-gray-100 text-gray-600">
                        {lang.code}
                      </span>
                      <div>
                        <span className="text-xs font-semibold block">{lang.name}</span>
                        {lang.nativeName && lang.nativeName !== lang.name && (
                          <span className="text-[10px] text-gray-400 block font-normal">
                            {lang.nativeName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {lang.isPopular && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                          Popular
                        </span>
                      )}
                      {isSelected ? (
                        <Check className="w-4 h-4 text-[#F35271]" />
                      ) : (
                        <span className="w-4 h-4 rounded-full border border-gray-300" />
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Quick Popular Picks Footer */}
          <div className="p-2 border-t border-gray-100 bg-gray-50/80 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-[#757880] font-semibold">Quick add:</span>
            {['English', 'Hindi', 'Bengali', 'Marathi', 'Tamil', 'Telugu'].map((quickName) => {
              const isSelected = selectedList.some((s) => s.toLowerCase() === quickName.toLowerCase());
              return (
                <button
                  key={quickName}
                  type="button"
                  onClick={() => {
                    const match = ALL_ISO_LANGUAGES.find((l) => l.name === quickName);
                    if (match) handleToggle(match);
                  }}
                  className={`text-[10px] px-2 py-0.5 rounded-md border transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#F35271] text-white border-[#F35271]'
                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {isSelected ? `✓ ${quickName}` : `+ ${quickName}`}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
