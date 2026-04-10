import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FileArchive, Loader2, ShieldCheck, FileJson, Type, AlertCircle, HelpCircle, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

interface UploadSectionProps {
  onAnalyzeZip: (file: File) => Promise<void>;
  onAnalyzeJson: (followers: File, following: File) => Promise<void>;
  onAnalyzeText: (followers: string, following: string) => void;
  onOpenWalkthrough: (section?: string) => void;
  isLoading: boolean;
  error: string | null;
  errorType: 'html' | 'general' | null;
}

type InputMode = 'zip' | 'json' | 'text';

export function UploadSection({ onAnalyzeZip, onAnalyzeJson, onAnalyzeText, onOpenWalkthrough, isLoading, error, errorType }: UploadSectionProps) {
  const [mode, setMode] = useState<InputMode>('zip');
  const [isHovered, setIsHovered] = useState(false);
  const [followersFile, setFollowersFile] = useState<File | null>(null);
  const [followingFile, setFollowingFile] = useState<File | null>(null);
  const [followersText, setFollowersText] = useState('');
  const [followingText, setFollowingText] = useState('');

  const onDropZip = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onAnalyzeZip(acceptedFiles[0]);
      }
    },
    [onAnalyzeZip]
  );

  const { getRootProps: getZipRootProps, getInputProps: getZipInputProps, isDragActive: isZipDragActive } = useDropzone({
    onDrop: onDropZip,
    accept: { 'application/zip': ['.zip', '.ZIP'] },
    maxFiles: 1,
    disabled: isLoading,
  } as const);

  const handleJsonSubmit = () => {
    if (followersFile && followingFile) {
      onAnalyzeJson(followersFile, followingFile);
    }
  };

  const handleTextSubmit = () => {
    if (followersText && followingText) {
      onAnalyzeText(followersText, followingText);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-6">
      <div className="flex p-1 bg-white/50 backdrop-blur-md rounded-2xl border border-gray-200 shadow-sm">
        <button
          onClick={() => setMode('zip')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl transition-all ${
            mode === 'zip' ? 'bg-white text-fuchsia-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileArchive className="w-4 h-4" /> ZIP
        </button>
        <button
          onClick={() => setMode('json')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl transition-all ${
            mode === 'json' ? 'bg-white text-fuchsia-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <FileJson className="w-4 h-4" /> JSON
        </button>
        <button
          onClick={() => setMode('text')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-xl transition-all ${
            mode === 'text' ? 'bg-white text-fuchsia-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Type className="w-4 h-4" /> Paste
        </button>
      </div>

      <div className="bg-fuchsia-50/50 border border-fuchsia-100 rounded-2xl p-4 text-sm text-gray-600">
        <div className="flex items-center gap-2 font-medium text-fuchsia-800 mb-2">
          <HelpCircle className="w-4 h-4" /> What files AuditGram needs
        </div>
        <ul className="list-disc list-inside space-y-1 ml-1">
          <li><code className="bg-white px-1 py-0.5 rounded text-xs text-fuchsia-600">followers_and_following/followers_1.json</code></li>
          <li><code className="bg-white px-1 py-0.5 rounded text-xs text-fuchsia-600">followers_and_following/following.json</code></li>
        </ul>
        <p className="mt-2 text-xs text-fuchsia-700/80">Tip: If your ZIP contains mostly `.html` files, use the fix panel below.</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {mode === 'zip' && (
            <div
              className={`relative overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer ${
                isZipDragActive || isHovered
                  ? 'border-fuchsia-400 bg-white/90 shadow-[0_8px_30px_rgba(217,70,239,0.15)] scale-[1.02]'
                  : 'border-white/50 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-white/80'
              }`}
              {...getZipRootProps()}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <input {...getZipInputProps()} aria-label="Upload ZIP file" />
              <div className="p-6 md:p-10 flex flex-col items-center justify-center text-center min-h-[240px]">
                {isLoading ? (
                  <LoadingState />
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className={`p-4 rounded-full transition-colors ${isZipDragActive || isHovered ? 'bg-fuchsia-100 text-fuchsia-600' : 'bg-slate-50 text-gray-400'}`}>
                      <FileArchive className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">Upload Instagram ZIP</h3>
                      <p className="text-gray-500 text-sm">Drag and drop or click to browse</p>
                    </div>
                    <Button variant="primary" size="md">Select ZIP File</Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {mode === 'json' && (
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Followers JSON</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => setFollowersFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Following JSON</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={(e) => setFollowingFile(e.target.files?.[0] || null)}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-fuchsia-50 file:text-fuchsia-700 hover:file:bg-fuchsia-100 cursor-pointer"
                />
              </div>
              <Button
                variant="primary"
                className="w-full mt-2"
                onClick={handleJsonSubmit}
                disabled={!followersFile || !followingFile || isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Analyze JSON Files'}
              </Button>
            </div>
          )}

          {mode === 'text' && (
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Followers (one per line)</label>
                <textarea
                  value={followersText}
                  onChange={(e) => setFollowersText(e.target.value)}
                  className="w-full h-24 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-none text-sm"
                  placeholder="username1&#10;username2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Following (one per line)</label>
                <textarea
                  value={followingText}
                  onChange={(e) => setFollowingText(e.target.value)}
                  className="w-full h-24 p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent resize-none text-sm"
                  placeholder="username1&#10;username2"
                />
              </div>
              <Button
                variant="primary"
                className="w-full mt-2"
                onClick={handleTextSubmit}
                disabled={!followersText || !followingText || isLoading}
              >
                {isLoading ? 'Analyzing...' : 'Analyze Usernames'}
              </Button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            {errorType === 'html' ? (
              <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 shadow-sm">
                <div className="flex items-start gap-3 text-rose-800 mb-4">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-rose-900">HTML Format Detected</h4>
                    <p className="text-sm mt-1">{error}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="outline" className="w-full justify-between bg-white hover:bg-rose-100/50 border-rose-200 text-rose-700" onClick={() => onOpenWalkthrough()}>
                    <span>Show me how to download the correct file</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between bg-white hover:bg-rose-100/50 border-rose-200 text-rose-700" onClick={() => setMode('json')}>
                    <span>I already have followers_1.json and following.json</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between bg-white hover:bg-rose-100/50 border-rose-200 text-rose-700" onClick={() => onOpenWalkthrough('no-json')}>
                    <span>I cannot find the JSON option</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm text-center shadow-sm">
                {error}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-center gap-2 text-gray-500 text-xs md:text-sm">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <p>Processed locally in your browser. No data leaves your device.</p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="flex flex-col items-center gap-4"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-fuchsia-500 blur-xl opacity-20 rounded-full animate-pulse" />
        <Loader2 className="w-12 h-12 text-fuchsia-500 animate-spin relative z-10" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Analyzing your data locally...</h3>
      <p className="text-gray-500 text-xs max-w-xs">
        This happens entirely in your browser. Your file is never uploaded to any server.
      </p>
    </motion.div>
  );
}
