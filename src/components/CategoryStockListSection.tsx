import React, { useState, useEffect } from 'react';
import { MarketCategoryKey, MarketFilterKey, CategoryStockItem, CategoryStockResponse } from '../types';
import {
  ListFilter,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Search,
  Sparkles,
  BarChart2,
} from 'lucide-react';

interface CategoryStockListSectionProps {
  activeCategory: MarketCategoryKey;
  onSelectStock: (symbol: string) => void;
  currentSymbol: string;
}

const FILTER_TABS: { key: MarketFilterKey; label: string; desc: string }[] = [
  { key: 'top10', label: 'Top 10', desc: '상위 10개 핵심 종목' },
  { key: 'top30', label: 'Top 30', desc: '상위 30개 대표 종목' },
  { key: 'popular', label: '인기 종목', desc: '시가총액 상위 대형주' },
  { key: 'gainers', label: '상승률 상위', desc: '금일 주가 상승 우수' },
  { key: 'losers', label: '하락률 상위', desc: '금일 주가 하락 조정' },
  { key: 'active', label: '거래량 상위', desc: '투자자 관심 최다' },
];

export const CategoryStockListSection: React.FC<CategoryStockListSectionProps> = ({
  activeCategory,
  onSelectStock,
  currentSymbol,
}) => {
  const [filter, setFilter] = useState<MarketFilterKey>('top10');
  const [data, setData] = useState<CategoryStockResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchCategoryStocks = async (cat: MarketCategoryKey, filt: MarketFilterKey) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/market/category-stocks?category=${cat}&filter=${filt}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Error fetching category stocks:', err);
    } fontFinally: {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategoryStocks(activeCategory, filter);
  }, [activeCategory, filter]);

  const formatCurrency = (val: number, curr: string) => {
    if (curr === 'KRW') {
      return `₩${val.toLocaleString('ko-KR')}`;
    }
    return `$${val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatLargeNumber = (val: number, curr: string) => {
    if (curr === 'KRW') {
      const jo = Math.floor(val / 1000000000000);
      const euk = Math.floor((val % 1000000000000) / 100000000);
      if (jo > 0) return `${jo}조 ${euk > 0 ? `${euk}억` : ''}원`;
      return `${euk}억원`;
    }
    if (val >= 1e12) return `$${(val / 1e12).toFixed(2)}T`;
    if (val >= 1e9) return `$${(val / 1e9).toFixed(2)}B`;
    if (val >= 1e6) return `$${(val / 1e6).toFixed(2)}M`;
    return `$${val.toLocaleString()}`;
  };

  const filteredStocks = data?.stocks.filter((st) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return st.symbol.toLowerCase().includes(q) || st.name.toLowerCase().includes(q) || (st.sector && st.sector.toLowerCase().includes(q));
  }) || [];

  return (
    <section className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm mb-6">
      {/* Category Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
              <BarChart2 className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              {data ? `${data.categoryName} 리스트` : '종목 리스트'}
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
              {data?.totalCount || 0}개 항목
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            왼쪽 카테고리 선택에 대응하는 종목 및 지수 리스트입니다. 원하는 종목을 선택하여 대시보드에서 분석하세요.
          </p>
        </div>

        {/* Search within category list */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="카테고리 내 종목/섹터 필터..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
        </div>
      </div>

      {/* Filter Tabs Bar (Top 10, Top 30, 인기종목, 상승률, 하락률, 거래량) */}
      <div className="flex items-center gap-2 my-4 overflow-x-auto no-scrollbar pb-1">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 shrink-0 mr-1">
          <ListFilter className="w-3.5 h-3.5 text-blue-600" /> 종목 필터:
        </span>

        {FILTER_TABS.map((tab) => {
          const isActive = filter === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                isActive
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xs scale-102'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Stock List Table */}
      {loading ? (
        <div className="text-center py-12 text-blue-600 font-bold flex items-center justify-center gap-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>{data?.categoryName || '종목'} 리스트를 불러오는 중...</span>
        </div>
      ) : filteredStocks.length === 0 ? (
        <div className="text-center py-10 text-slate-400 text-sm">
          조건에 일치하는 종목이 없습니다.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[11px] uppercase tracking-wider">
              <tr>
                <th className="p-3">순위</th>
                <th className="p-3">종목명 / 티커</th>
                <th className="p-3">현재가</th>
                <th className="p-3">등락률 (%)</th>
                <th className="p-3">시가총액 / 규모</th>
                <th className="p-3">섹터 / 분류</th>
                <th className="p-3 text-right">대시보드 선택</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {filteredStocks.map((stock, idx) => {
                const isPos = stock.changePercent >= 0;
                const isSelected = currentSymbol.toUpperCase() === stock.symbol.toUpperCase();

                return (
                  <tr
                    key={stock.symbol}
                    className={`transition ${
                      isSelected
                        ? 'bg-blue-50/80 hover:bg-blue-100/80 font-semibold'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="p-3 font-mono font-bold text-slate-400 w-12 text-center">
                      {idx + 1}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-blue-700 border border-slate-200 font-mono font-bold text-xs shrink-0">
                          {stock.symbol}
                        </span>
                        <span className="font-bold text-slate-900 truncate max-w-xs">{stock.name}</span>
                      </div>
                    </td>
                    <td className="p-3 font-bold text-slate-900 font-mono">
                      {formatCurrency(stock.price, stock.currency)}
                    </td>
                    <td className="p-3 font-bold">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-bold ${
                          isPos
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>
                          {isPos ? '+' : ''}
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </span>
                    </td>
                    <td className="p-3 text-slate-600 font-medium">
                      {formatLargeNumber(stock.marketCap, stock.currency)}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        {stock.sector || '기타'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onSelectStock(stock.symbol)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-2xs ${
                          isSelected
                            ? 'bg-blue-700 text-white shadow-sm ring-2 ring-blue-400'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200'
                        }`}
                      >
                        <span>{isSelected ? '선택됨' : '대시보드 보기'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
