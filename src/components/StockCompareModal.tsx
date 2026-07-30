import React, { useState, useEffect } from 'react';
import { StockQuote } from '../types';
import { formatCurrency, formatLargeNumber, formatPercent } from '../utils/formatters';
import { GitCompare, X, ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

interface StockCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuote: StockQuote;
  currency: string;
}

const COMPARISON_OPTIONS = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'GOOGL', 'AMZN', '005930.KS', '000660.KS', 'SPY', 'QQQ'];

export const StockCompareModal: React.FC<StockCompareModalProps> = ({
  isOpen,
  onClose,
  currentQuote,
  currency,
}) => {
  const [targetSymbol, setTargetSymbol] = useState('AAPL');
  const [targetQuote, setTargetQuote] = useState<StockQuote | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchTarget = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/stock/${targetSymbol}`);
        if (res.ok) {
          const data = await res.json();
          setTargetQuote(data);
        }
      } catch (err) {
        console.error('Fetch compare quote error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTarget();
  }, [isOpen, targetSymbol]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 shadow-xl text-slate-900 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-bold text-slate-900">종목 1:1 비교 분석 (Stock Comparison)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selector Header Bar */}
        <div className="grid grid-cols-2 gap-4 my-6">
          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
            <div className="text-xs text-blue-700 font-bold mb-1">현재 종목</div>
            <div className="text-lg font-extrabold text-slate-900">{currentQuote.symbol}</div>
            <div className="text-xs text-slate-600 truncate font-medium">{currentQuote.shortName}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 font-bold mb-1">비교할 대상 종목 선택</div>
            <select
              value={targetSymbol}
              onChange={(e) => setTargetSymbol(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {COMPARISON_OPTIONS.map((sym) => (
                <option key={sym} value={sym}>
                  {sym}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Table */}
        {loading || !targetQuote ? (
          <div className="text-center py-12 text-blue-600 flex items-center justify-center gap-2 font-bold">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>비교 데이터 로딩 중...</span>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase text-[11px] font-bold">
                  <th className="p-3">지표 (Metric)</th>
                  <th className="p-3 text-blue-700 font-bold">{currentQuote.symbol}</th>
                  <th className="p-3 text-emerald-700 font-bold">{targetQuote.symbol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <CompareRow
                  label="현재가"
                  val1={formatCurrency(currentQuote.regularMarketPrice, currentQuote.currency)}
                  val2={formatCurrency(targetQuote.regularMarketPrice, targetQuote.currency)}
                />
                <CompareRow
                  label="일일 변동률"
                  val1={formatPercent(currentQuote.regularMarketChangePercent)}
                  val2={formatPercent(targetQuote.regularMarketChangePercent)}
                  isPercent
                  num1={currentQuote.regularMarketChangePercent}
                  num2={targetQuote.regularMarketChangePercent}
                />
                <CompareRow
                  label="시가총액"
                  val1={formatLargeNumber(currentQuote.marketCap, currentQuote.currency)}
                  val2={formatLargeNumber(targetQuote.marketCap, targetQuote.currency)}
                />
                <CompareRow
                  label="PER (주가수익비율)"
                  val1={currentQuote.trailingPE ? `${currentQuote.trailingPE.toFixed(1)}배` : 'N/A'}
                  val2={targetQuote.trailingPE ? `${targetQuote.trailingPE.toFixed(1)}배` : 'N/A'}
                />
                <CompareRow
                  label="Forward PER"
                  val1={currentQuote.forwardPE ? `${currentQuote.forwardPE.toFixed(1)}배` : 'N/A'}
                  val2={targetQuote.forwardPE ? `${targetQuote.forwardPE.toFixed(1)}배` : 'N/A'}
                />
                <CompareRow
                  label="배당수익률"
                  val1={currentQuote.dividendYield ? `${currentQuote.dividendYield.toFixed(2)}%` : '0.00%'}
                  val2={targetQuote.dividendYield ? `${targetQuote.dividendYield.toFixed(2)}%` : '0.00%'}
                />
                <CompareRow
                  label="섹터"
                  val1={currentQuote.sector || 'N/A'}
                  val2={targetQuote.sector || 'N/A'}
                />
              </tbody>
            </table>
          </div>
        )}

        <div className="pt-4 border-t border-slate-200 text-right mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

const CompareRow: React.FC<{
  label: string;
  val1: string;
  val2: string;
  isPercent?: boolean;
  num1?: number;
  num2?: number;
}> = ({ label, val1, val2, isPercent, num1, num2 }) => (
  <tr className="hover:bg-slate-50 transition">
    <td className="p-3 font-semibold text-slate-500">{label}</td>
    <td
      className={`p-3 font-extrabold ${
        isPercent && num1 != null ? (num1 >= 0 ? 'text-emerald-700' : 'text-rose-700') : 'text-slate-900'
      }`}
    >
      {val1}
    </td>
    <td
      className={`p-3 font-extrabold ${
        isPercent && num2 != null ? (num2 >= 0 ? 'text-emerald-700' : 'text-rose-700') : 'text-slate-900'
      }`}
    >
      {val2}
    </td>
  </tr>
);
