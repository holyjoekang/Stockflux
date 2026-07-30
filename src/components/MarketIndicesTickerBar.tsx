import React, { useEffect, useState } from 'react';
import { MarketSummaryItem } from '../types';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

interface MarketIndicesTickerBarProps {
  onSelectStock: (symbol: string) => void;
  currentSymbol: string;
}

export const MarketIndicesTickerBar: React.FC<MarketIndicesTickerBarProps> = ({
  onSelectStock,
  currentSymbol,
}) => {
  const [indices, setIndices] = useState<MarketSummaryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/market/summary');
      if (res.ok) {
        const data = await res.json();
        setIndices(data);
      }
    } catch (err) {
      console.error('Market summary error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const formatNumber = (val: number) => {
    return val >= 1000
      ? val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : val.toFixed(2);
  };

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800 shadow-inner py-2.5 px-4 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>시장 지표 (Market Overview)</span>
          <button
            onClick={fetchSummary}
            className="p-1 hover:bg-slate-800 rounded transition text-slate-400 hover:text-white"
            title="시장지표 새로고침"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
          {indices.map((item) => {
            const isPos = item.changePercent >= 0;
            const isSelected = currentSymbol.toUpperCase() === item.symbol.toUpperCase();

            return (
              <button
                key={item.symbol}
                onClick={() => onSelectStock(item.symbol)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all shrink-0 font-medium ${
                  isSelected
                    ? 'bg-blue-600 border-blue-400 text-white shadow-md scale-105'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-slate-200'
                }`}
              >
                <span className="font-bold">{item.name}</span>
                <span className="font-mono text-slate-300">{formatNumber(item.price)}</span>
                <span
                  className={`inline-flex items-center gap-0.5 font-bold ${
                    isPos ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isPos ? (
                    <TrendingUp className="w-3 h-3 shrink-0" />
                  ) : (
                    <TrendingDown className="w-3 h-3 shrink-0" />
                  )}
                  <span>
                    {isPos ? '+' : ''}
                    {item.changePercent.toFixed(2)}%
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
