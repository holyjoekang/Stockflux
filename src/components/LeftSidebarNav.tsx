import React from 'react';
import { MarketCategoryKey } from '../types';
import {
  TrendingUp,
  Cpu,
  Building2,
  Coins,
  BarChart3,
  Flame,
  ChevronRight,
  Layers,
  Sparkles,
  BookmarkPlus,
  Star,
} from 'lucide-react';

interface LeftSidebarNavProps {
  activeCategory: MarketCategoryKey;
  onSelectCategory: (category: MarketCategoryKey) => void;
  onSelectStock: (symbol: string) => void;
  currentSymbol: string;
  watchlist: string[];
  onToggleWatchlistModal: () => void;
}

const CATEGORY_ITEMS: {
  key: MarketCategoryKey;
  name: string;
  desc: string;
  indexTicker: string;
  icon: React.ReactNode;
  badge: string;
}[] = [
  {
    key: 'sp500',
    name: 'S&P 500',
    desc: '미국 대형주 500종목 지수',
    indexTicker: 'SPY',
    icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
    badge: '대형주',
  },
  {
    key: 'nasdaq',
    name: '나스닥 100',
    desc: '기술주 및 혁신 성장을 주도하는 100기업',
    indexTicker: 'QQQ',
    icon: <Cpu className="w-5 h-5 text-indigo-600" />,
    badge: '기술주',
  },
  {
    key: 'dow',
    name: '다우존스 30',
    desc: '미국을 대표하는 30대 우량주 지수',
    indexTicker: '^DJI',
    icon: <Building2 className="w-5 h-5 text-emerald-600" />,
    badge: '우량주',
  },
  {
    key: 'crypto',
    name: '암호화폐 (Crypto)',
    desc: '비트코인, 이더리움 및 주요 가상자산',
    indexTicker: 'BTC-USD',
    icon: <Coins className="w-5 h-5 text-amber-500" />,
    badge: '가상자산',
  },
  {
    key: 'indices',
    name: '시장 주요 지표',
    desc: 'KOSPI, KOSDAQ, 글로벌 증시 지수',
    indexTicker: '^KS11',
    icon: <BarChart3 className="w-5 h-5 text-purple-600" />,
    badge: '글로벌',
  },
  {
    key: 'commodities',
    name: '원자재 & 상품',
    desc: '금, 원유, 천연가스, 귀금속 및 원자재',
    indexTicker: 'GC=F',
    icon: <Flame className="w-5 h-5 text-rose-500" />,
    badge: '상품선물',
  },
];

export const LeftSidebarNav: React.FC<LeftSidebarNavProps> = ({
  activeCategory,
  onSelectCategory,
  onSelectStock,
  currentSymbol,
  watchlist,
  onToggleWatchlistModal,
}) => {
  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6">
      {/* Category Selection Navigation Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-extrabold text-slate-900">시장 카테고리 (Categories)</h2>
          </div>
          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            야후파이낸스
          </span>
        </div>

        <nav className="space-y-1.5">
          {CATEGORY_ITEMS.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => onSelectCategory(cat.key)}
                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md font-bold'
                    : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 group-hover:bg-white'
                    } transition`}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm ${isActive ? 'text-white' : 'text-slate-900 font-bold'}`}>
                        {cat.name}
                      </span>
                    </div>
                    <p className={`text-[11px] ${isActive ? 'text-blue-100' : 'text-slate-400'} line-clamp-1`}>
                      {cat.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {cat.badge}
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 transition ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:translate-x-0.5'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Quick Index Analysis Direct Shortcuts */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-slate-200">주요 지수 바로가기</h3>
          </div>
          <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
            직접분석
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { symbol: 'SPY', label: 'S&P 500 ETF' },
            { symbol: 'QQQ', label: '나스닥 ETF' },
            { symbol: '^DJI', label: '다우 지수' },
            { symbol: 'BTC-USD', label: '비트코인' },
            { symbol: '005930.KS', label: '삼성전자' },
            { symbol: 'GC=F', label: '금 선물' },
          ].map((item) => {
            const isSelected = currentSymbol.toUpperCase() === item.symbol.toUpperCase();
            return (
              <button
                key={item.symbol}
                onClick={() => onSelectStock(item.symbol)}
                className={`p-2.5 rounded-xl border text-left transition font-semibold flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-600 border-blue-400 text-white shadow-sm font-bold'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-300 hover:text-white'
                }`}
              >
                <span className="truncate">{item.label}</span>
                <span className="text-[10px] font-mono text-slate-400 opacity-80">{item.symbol.replace('.KS', '')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Watchlist Quick Widget */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <h3 className="text-xs font-bold text-slate-900">내 관심 종목 ({watchlist.length})</h3>
          </div>
          <button
            onClick={onToggleWatchlistModal}
            className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1"
          >
            <span>전체보기</span>
            <BookmarkPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        {watchlist.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">관심 등록된 종목이 없습니다.</p>
        ) : (
          <div className="space-y-1.5 max-h-48 overflow-y-auto">
            {watchlist.slice(0, 5).map((sym) => {
              const isSelected = currentSymbol.toUpperCase() === sym.toUpperCase();
              return (
                <button
                  key={sym}
                  onClick={() => onSelectStock(sym)}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition font-semibold ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 border border-blue-200 font-bold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="font-mono text-slate-900 font-bold">{sym}</span>
                  <span className="text-[11px] text-slate-400">대시보드 보기 →</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
