import React, { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, Star, GitCompare, RefreshCw, Sparkles, Building2 } from 'lucide-react';
import { SearchResult } from '../types';

interface HeaderNavProps {
  currentSymbol: string;
  onSelectStock: (symbol: string) => void;
  watchlist: string[];
  onToggleWatchlistModal: () => void;
  onToggleCompareModal: () => void;
  isLoading: boolean;
  onRefresh: () => void;
}

const PRESET_CHIPS = [
  { symbol: 'AAPL', label: '애플' },
  { symbol: 'NVDA', label: '엔비디아' },
  { symbol: 'TSLA', label: '테슬라' },
  { symbol: 'MSFT', label: '마이크로소프트' },
  { symbol: 'GOOGL', label: '구글' },
  { symbol: '005930.KS', label: '삼성전자' },
  { symbol: '000660.KS', label: 'SK하이닉스' },
  { symbol: 'SPY', label: 'S&P 500' },
  { symbol: 'QQQ', label: '나스닥 100' },
  { symbol: 'BTC-USD', label: '비트코인' },
];

export const HeaderNav: React.FC<HeaderNavProps> = ({
  currentSymbol,
  onSelectStock,
  watchlist,
  onToggleWatchlistModal,
  onToggleCompareModal,
  isLoading,
  onRefresh,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (symbol: string) => {
    onSelectStock(symbol);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 text-slate-900 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Brand Logo & Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectStock('NVDA')}>
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-xl tracking-tight text-blue-700">
                    STOCKFLUX
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                    <Sparkles className="w-3 h-3 text-blue-600" /> Gemini 3.6 AI
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">실시간 종목 시세 & AI 종합 재무 대시보드</p>
              </div>
            </div>

            {/* Mobile Action Controls */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={onToggleWatchlistModal}
                className="p-2 rounded-lg bg-slate-100 text-amber-500 hover:bg-slate-200 transition"
                title="관심 종목"
              >
                <Star className="w-5 h-5 fill-amber-400" />
              </button>
              <button
                onClick={onRefresh}
                disabled={isLoading}
                className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition"
                title="새로고침"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Search Bar & Auto-complete */}
          <div className="relative flex-1 max-w-xl" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query.trim() && setIsOpen(true)}
                placeholder="티커 또는 종목명 검색 (예: NVDA, AAPL, 005930.KS, TSLA)..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-10 pr-10 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-inner"
              />
              {searching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Dropdown Suggestions */}
            {isOpen && results.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50 max-h-80 overflow-y-auto">
                <div className="p-2 text-xs font-semibold text-slate-500 border-b border-slate-100 bg-slate-50">
                  검색 결과 ({results.length}개)
                </div>
                {results.map((item) => (
                  <button
                    key={item.symbol}
                    onClick={() => handleSelect(item.symbol)}
                    className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-blue-50 transition group border-b border-slate-100 last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-600 flex items-center justify-center font-bold text-xs text-slate-700 group-hover:text-white transition">
                        {item.symbol.substring(0, 3)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-900 group-hover:text-blue-700">
                          {item.symbol}
                        </div>
                        <div className="text-xs text-slate-500 truncate max-w-xs">{item.name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 text-xs rounded bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
                        {item.exchange}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Right Action Tools */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onToggleWatchlistModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition"
            >
              <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
              <span>관심종목 ({watchlist.length})</span>
            </button>

            <button
              onClick={onToggleCompareModal}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition"
            >
              <GitCompare className="w-4 h-4 text-blue-600" />
              <span>종목 비교</span>
            </button>

            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50 shadow-sm"
              title="데이터 새로고침"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Preset Chips Bar */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <span className="text-xs text-slate-500 font-semibold whitespace-nowrap flex items-center gap-1 mr-1">
            <Building2 className="w-3.5 h-3.5 text-blue-600" /> 인기 종목:
          </span>
          {PRESET_CHIPS.map((chip) => {
            const isSelected = currentSymbol.toUpperCase() === chip.symbol.toUpperCase();
            return (
              <button
                key={chip.symbol}
                onClick={() => onSelectStock(chip.symbol)}
                className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {chip.label} ({chip.symbol.replace('.KS', '')})
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
