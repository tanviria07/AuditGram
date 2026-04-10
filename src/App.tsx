import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, Github } from 'lucide-react';
import { WalkthroughModal } from './features/walkthrough/WalkthroughModal';
import { UploadSection } from './features/upload/UploadSection';
import { ResultsSection } from './features/results/ResultsSection';
import { Logo } from './components/ui/Logo';
import { Button } from './components/ui/Button';
import { analyzeZipFileClientSide, analyzeJsonFiles, analyzePastedText, HtmlZipError } from './lib/instagramZip';
import { AnalysisResponse } from './types';
import { GITHUB_REPO_URL } from './lib/constants';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSection, setModalSection] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<'html' | 'general' | null>(null);
  const [results, setResults] = useState<AnalysisResponse | null>(null);

  const handleOpenWalkthrough = (section?: string) => {
    setModalSection(section);
    setIsModalOpen(true);
  };

  const handleAnalyzeZip = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setErrorType(null);
    setResults(null);

    try {
      const data = await analyzeZipFileClientSide(file);
      setResults(data);
    } catch (err) {
      if (err instanceof HtmlZipError) {
        setErrorType('html');
      } else {
        setErrorType('general');
      }
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeJson = async (followers: File, following: File) => {
    setIsLoading(true);
    setError(null);
    setErrorType(null);
    setResults(null);

    try {
      const data = await analyzeJsonFiles(followers, following);
      setResults(data);
    } catch (err) {
      setErrorType('general');
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyzeText = (followers: string, following: string) => {
    setIsLoading(true);
    setError(null);
    setErrorType(null);
    setResults(null);

    try {
      const data = analyzePastedText(followers, following);
      setResults(data);
    } catch (err) {
      setErrorType('general');
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[100svh] flex flex-col bg-slate-50 text-gray-900 font-sans selection:bg-fuchsia-500/30 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-slate-50">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, 40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-pink-300/30 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-orange-300/20 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-violet-300/30 blur-[90px]"
        />
      </div>

      <header className="w-full max-w-7xl mx-auto p-4 md:p-6 flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-9 h-9 flex items-center justify-center transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(217,70,239,0.4)]">
            <Logo className="w-full h-full" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">AuditGram</span>
        </div>
        <Button variant="secondary" onClick={() => handleOpenWalkthrough()}>
          <Info className="w-4 h-4 text-fuchsia-500 mr-2" />
          <span className="hidden sm:inline">How do I get my Instagram ZIP?</span>
          <span className="sm:hidden">Help</span>
        </Button>
      </header>

      <main className="w-full max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 flex flex-col flex-1 justify-center relative z-10">
        <AnimatePresence mode="wait">
          {!results ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
            >
              <div className="text-center md:text-left flex flex-col justify-center">
                <h1 className="font-bold tracking-tight mb-4 text-gray-900 leading-tight text-[clamp(2rem,4vw,4rem)]">
                  Discover who doesn't{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-fuchsia-500 to-orange-500">
                    follow you back.
                  </span>
                </h1>
                <p className="text-gray-600 text-[clamp(0.95rem,1.2vw,1.1rem)] max-w-xl mx-auto md:mx-0">
                  A privacy-first tool to analyze your Instagram connections. We process your data entirely in your browser and
                  never upload your information.
                </p>
              </div>

              <div className="w-full flex justify-center">
                <UploadSection
                  onAnalyzeZip={handleAnalyzeZip}
                  onAnalyzeJson={handleAnalyzeJson}
                  onAnalyzeText={handleAnalyzeText}
                  onOpenWalkthrough={handleOpenWalkthrough}
                  isLoading={isLoading}
                  error={error}
                  errorType={errorType}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <ResultsSection data={results} onReset={() => setResults(null)} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full max-w-7xl mx-auto p-4 md:p-6 flex items-center justify-between gap-4 text-gray-500 text-xs md:text-sm shrink-0 relative z-10">
        <p>&copy; {new Date().getFullYear()} AuditGram. No data stored.</p>
        <div className="flex items-center gap-4">
          <span className="hover:text-gray-800 transition-colors">Privacy-first</span>
          <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" className="hover:text-gray-800 transition-colors flex items-center gap-1">
            <Github className="w-4 h-4" /> Source
          </a>
        </div>
      </footer>

      <WalkthroughModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} initialSection={modalSection} />
    </div>
  );
}
