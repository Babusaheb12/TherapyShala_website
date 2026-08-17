import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FAQ_DATA } from '../data/spaData';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-24 md:py-32 bg-[#FFEEF1] relative border-t border-[#AFB0B7]/30">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-[#F35271] font-semibold mb-3 block">
            Clear Transparency
          </span>
          <h2 className="font-serif-luxury text-4xl sm:text-5xl font-light text-[#0D0D12] tracking-tight leading-tight">
            Frequently Asked <span className="italic font-normal text-[#F35271]">Questions</span>
          </h2>
        </div>

        {/* Accordion Container */}
        <div className="space-y-4">
          {FAQ_DATA.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-[#AFB0B7]/30 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-serif-luxury text-xl font-normal text-[#0D0D12] hover:text-[#F35271] transition-colors">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full bg-[#FFEEF1] flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-[#F35271] text-white' : 'text-[#F35271]'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-sm text-[#757880] font-light leading-relaxed border-t border-[#AFB0B7]/20 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
