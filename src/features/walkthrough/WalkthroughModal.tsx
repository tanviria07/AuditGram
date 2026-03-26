import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, ChevronDown } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { STEPS_BY_PLATFORM, TROUBLESHOOTING_ITEMS } from '../../lib/constants';

interface WalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSection?: string;
}

type Platform = 'iphone' | 'android' | 'web';
type ViewMode = 'guide' | 'no-json';

interface AccordionItemProps {
  question: string;
  answer: string;
}

function AccordionItem({ question, answer }: AccordionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
        aria-expanded={isOpen}
      >
        {question}
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-3 text-sm text-gray-500">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function WalkthroughModal({ isOpen, onClose, initialSection }: WalkthroughModalProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [platform, setPlatform] = useState<Platform>('iphone');
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>(initialSection === 'no-json' ? 'no-json' : 'guide');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setViewMode(initialSection === 'no-json' ? 'no-json' : 'guide');
      setCurrentStep(0);
      setShowTroubleshooting(false);
    }
  }, [isOpen, initialSection]);

  if (!isOpen) return null;

  const steps = STEPS_BY_PLATFORM[platform];

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else onClose();
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handlePlatformChange = (newPlatform: Platform) => {
    setPlatform(newPlatform);
    setCurrentStep(0);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="w-full max-w-md max-h-[90vh] bg-white/90 backdrop-blur-2xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-100 shrink-0">
            <h2 id="modal-title" className="text-lg font-semibold text-gray-900">
              {viewMode === 'guide' ? 'How to get your data' : 'If you don\'t see JSON'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {viewMode === 'guide' ? (
            <>
              <div className="flex justify-center gap-2 p-4 bg-slate-50/50 shrink-0">
                {(['iphone', 'android', 'web'] as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => handlePlatformChange(p)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                      platform === p
                        ? 'bg-gradient-to-r from-rose-500 to-fuchsia-500 text-white shadow-sm'
                        : 'bg-transparent text-gray-500 hover:text-gray-900'
                    }`}
                    aria-pressed={platform === p}
                  >
                    {p}
                  </button>
                ))}
              </div>

              <div className="overflow-y-auto flex-1">
                <div className="relative p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${platform}-${currentStep}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center"
                    >
                      <div className="mb-6 p-4 bg-fuchsia-50 rounded-full">{steps[currentStep].icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{steps[currentStep].title}</h3>
                      <p className="text-gray-600">{steps[currentStep].description}</p>
                      {steps[currentStep].helperText && (
                        <p className="mt-4 text-xs text-gray-500 max-w-xs">{steps[currentStep].helperText}</p>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="px-6 pb-6">
                  <button
                    onClick={() => setViewMode('no-json')}
                    className="w-full flex items-center justify-center gap-2 py-3 mb-3 text-sm font-medium text-rose-600 hover:text-rose-700 transition-colors bg-rose-50/50 rounded-xl border border-rose-100"
                  >
                    I can't find the JSON option
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setShowTroubleshooting(!showTroubleshooting)}
                    className="w-full flex items-center justify-center gap-2 py-3 text-sm font-medium text-fuchsia-600 hover:text-fuchsia-700 transition-colors bg-fuchsia-50/50 rounded-xl"
                    aria-expanded={showTroubleshooting}
                  >
                    Troubleshooting & FAQ
                    <ChevronDown className={`w-4 h-4 transition-transform ${showTroubleshooting ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showTroubleshooting && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-2"
                      >
                        <div className="p-4 bg-slate-50/50 rounded-xl border border-gray-100">
                          {TROUBLESHOOTING_ITEMS.map((item, idx) => (
                            <AccordionItem key={idx} question={item.question} answer={item.answer} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 flex flex-col gap-4 shrink-0">
                <div className="flex justify-center gap-2 mb-2">
                  {steps.map((_, idx) => (
                    <div
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentStep ? 'bg-fuchsia-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}
                  >
                    <ChevronLeft className="w-5 h-5 mr-1" /> Back
                  </Button>
                  <Button variant="primary" onClick={nextStep}>
                    {currentStep === steps.length - 1 ? 'Done' : 'Next'} <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="overflow-y-auto flex-1 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Instagram has multiple export flows</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Sometimes Instagram hides the JSON option depending on which menu you click.
                </p>
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-sm text-rose-800 mb-6">
                  <strong>"Available information download"</strong> may default to HTML-like exports.
                  <br /><br />
                  <strong>"Export your information" / "Create export"</strong> is where the format options appear.
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">How to reach "Create export":</h3>
                <ol className="list-decimal list-inside space-y-3 text-sm text-gray-700">
                  <li>Go to <strong>Accounts Center</strong></li>
                  <li>Tap <strong>Your information and permissions</strong></li>
                  <li>Tap <strong>Download your information</strong></li>
                  <li>Tap <strong>Download or transfer information</strong></li>
                  <li>Select your Instagram account</li>
                  <li>Choose <strong>Some of your information</strong></li>
                  <li>Under Connections, select <strong>Followers and Following</strong></li>
                  <li>Tap <strong>Download to device</strong></li>
                  <li><strong>IMPORTANT:</strong> Change "Format" to <strong>JSON</strong></li>
                  <li>Tap <strong>Create files</strong></li>
                </ol>
              </div>

              <div className="bg-fuchsia-50/50 border border-fuchsia-100 rounded-xl p-4 text-sm text-fuchsia-800">
                <strong>Tip:</strong> Selecting only "Followers and Following" avoids giant 1GB+ downloads and makes it ready much faster.
              </div>

              <div className="mt-8 flex justify-center">
                <Button variant="outline" onClick={() => setViewMode('guide')}>
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back to Standard Guide
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
