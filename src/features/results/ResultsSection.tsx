import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowUpDown, Copy, Download, ExternalLink, Users, UserMinus, Heart } from 'lucide-react';
import { AnalysisResponse } from '../../types';
import { Button } from '../../components/ui/Button';

interface ResultsSectionProps {
  data: AnalysisResponse;
  onReset: () => void;
}

type TabType = 'nonfollowers' | 'fans' | 'mutuals';

export function ResultsSection({ data, onReset }: ResultsSectionProps) {
  const [activeTab, setActiveTab] = useState<TabType>('nonfollowers');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleCopy = () => {
    const text = data[activeTab].join('\n');
    navigator.clipboard.writeText(text).catch(() => {
      // Ignore clipboard errors
    });
  };

  const handleExport = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' + data[activeTab].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredData = data[activeTab]
    .filter((username) => username.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => (sortOrder === 'asc' ? a.localeCompare(b) : b.localeCompare(a)));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto flex flex-col gap-8"
    >
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <SummaryCard title="Followers" count={data.counts.followers} icon={<Users className="w-5 h-5 text-indigo-500" />} />
        <SummaryCard title="Following" count={data.counts.following} icon={<Users className="w-5 h-5 text-indigo-500" />} />
        <SummaryCard title="Non-followers" count={data.counts.nonfollowers} icon={<UserMinus className="w-5 h-5 text-rose-500" />} />
        <SummaryCard title="Fans" count={data.counts.fans} icon={<Heart className="w-5 h-5 text-fuchsia-500" />} />
        <SummaryCard title="Mutuals" count={data.counts.mutuals} icon={<Users className="w-5 h-5 text-orange-500" />} />
      </div>

      <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-sm rounded-3xl overflow-hidden flex flex-col">
        <div className="flex border-b border-gray-100">
          <TabButton
            active={activeTab === 'nonfollowers'}
            onClick={() => setActiveTab('nonfollowers')}
            label="Non-followers"
            count={data.counts.nonfollowers}
          />
          <TabButton
            active={activeTab === 'fans'}
            onClick={() => setActiveTab('fans')}
            label="Fans"
            count={data.counts.fans}
          />
          <TabButton
            active={activeTab === 'mutuals'}
            onClick={() => setActiveTab('mutuals')}
            label="Mutuals"
            count={data.counts.mutuals}
          />
        </div>

        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search usernames..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/50 border border-gray-200 rounded-full py-2 pl-9 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all"
              aria-label="Search usernames"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <Button variant="ghost" size="sm" onClick={() => setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))} aria-label="Toggle sort order" className="p-2 rounded-full bg-white/50 border border-gray-200 shadow-sm">
              <ArrowUpDown className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopy} aria-label="Copy to clipboard" title="Copy to clipboard" className="p-2 rounded-full bg-white/50 border border-gray-200 shadow-sm">
              <Copy className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleExport} aria-label="Export to CSV" title="Export to CSV" className="p-2 rounded-full bg-white/50 border border-gray-200 shadow-sm">
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto max-h-[60vh]">
          <AnimatePresence mode="popLayout">
            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredData.map((username) => (
                  <motion.div
                    key={username}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between p-3 bg-white/40 border border-gray-100 rounded-2xl hover:bg-white/80 hover:shadow-sm transition-all group"
                  >
                    <span className="text-sm font-medium text-gray-800 truncate pr-2">@{username}</span>
                    <a
                      href={`https://instagram.com/${username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-fuchsia-500 hover:bg-fuchsia-50 rounded-full transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                      aria-label={`Open ${username}'s Instagram profile`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center text-gray-500">
                No users found.
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex justify-center">
        <Button variant="outline" onClick={onReset}>
          Analyze another file
        </Button>
      </div>
    </motion.div>
  );
}

function SummaryCard({ title, count, icon }: { title: string; count: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white/50 p-4 rounded-3xl flex flex-col items-center justify-center text-center gap-2 shadow-sm">
      <div className="p-2 bg-slate-50 rounded-full">{icon}</div>
      <div>
        <div className="text-2xl font-bold text-gray-900">{count.toLocaleString()}</div>
        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 text-sm font-medium transition-colors border-b-2 ${
        active
          ? 'border-fuchsia-500 text-gray-900 bg-fuchsia-50/50'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50/50'
      }`}
      aria-pressed={active}
    >
      {label}{' '}
      <span
        className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
          active ? 'bg-fuchsia-100 text-fuchsia-700' : 'bg-gray-100 text-gray-500'
        }`}
      >
        {count}
      </span>
    </button>
  );
}
