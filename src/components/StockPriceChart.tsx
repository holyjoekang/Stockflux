import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine,
} from 'recharts';
import { ChartDataPoint, TimeRange } from '../types';
import { formatCurrency, formatVolume } from '../utils/formatters';
import { LineChart as LineChartIcon, BarChart2, Activity, SlidersHorizontal } from 'lucide-react';

interface StockPriceChartProps {
  chartData: ChartDataPoint[];
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  currency: string;
  isLoading: boolean;
}

const RANGES: TimeRange[] = ['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'MAX'];

export const StockPriceChart: React.FC<StockPriceChartProps> = ({
  chartData,
  selectedRange,
  onRangeChange,
  currency,
  isLoading,
}) => {
  const [chartType, setChartType] = useState<'area' | 'line' | 'volume'>('area');
  const [showSMA, setShowSMA] = useState(true);
  const [showRSI, setShowRSI] = useState(false);
  const [showMACD, setShowMACD] = useState(false);
  const [showBB, setShowBB] = useState(false);

  if (!chartData || chartData.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500 mb-6 shadow-sm">
        차트 데이터를 불러오는 중입니다...
      </div>
    );
  }

  const firstPrice = chartData[0]?.close || 1;
  const lastPrice = chartData[chartData.length - 1]?.close || 1;
  const isUp = lastPrice >= firstPrice;
  const strokeColor = isUp ? '#059669' : '#e11d48';

  // Calculate Y min and max for padding
  const prices = chartData.map((d) => d.close);
  const minPrice = Math.min(...prices) * 0.98;
  const maxPrice = Math.max(...prices) * 1.02;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6 text-slate-900">
      {/* Chart Top Bar Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-3">
          <h3 className="font-bold text-slate-800 text-base">주가 차트 & 기술적 지표</h3>
          {/* Timeframe Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => onRangeChange(r)}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  selectedRange === r
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Chart View & Indicators Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                chartType === 'area' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              영역 차트
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                chartType === 'line' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              라인 차트
            </button>
            <button
              onClick={() => setChartType('volume')}
              className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                chartType === 'volume' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              거래량
            </button>
          </div>

          {/* Technical Indicators Pill Buttons */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <button
              onClick={() => setShowSMA(!showSMA)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                showSMA ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              SMA (이동평균)
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                showRSI ? 'bg-purple-50 text-purple-700 border-purple-300' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              RSI (상대강도)
            </button>
            <button
              onClick={() => setShowMACD(!showMACD)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                showMACD ? 'bg-cyan-50 text-cyan-700 border-cyan-300' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              MACD
            </button>
            <button
              onClick={() => setShowBB(!showBB)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition ${
                showBB ? 'bg-blue-50 text-blue-700 border-blue-300' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              볼린저 밴드
            </button>
          </div>
        </div>
      </div>

      {/* Main Stock Price Chart */}
      <div className="h-80 sm:h-96 w-full relative bg-slate-50/50 rounded-lg p-2 border border-slate-100">
        {isLoading && (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-10 flex items-center justify-center text-sm font-bold text-blue-600">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              차트 업데이트 중...
            </div>
          </div>
        )}

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.25} />
                <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis
              domain={[minPrice, maxPrice]}
              orientation="right"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0))}
            />
            <Tooltip content={<CustomTooltip currency={currency} />} />

            {/* Price Area / Line */}
            {chartType === 'area' && (
              <Area
                type="monotone"
                dataKey="close"
                stroke={strokeColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#priceGradient)"
                name="종가"
              />
            )}
            {chartType === 'line' && (
              <Line
                type="monotone"
                dataKey="close"
                stroke={strokeColor}
                strokeWidth={2.5}
                dot={false}
                name="종가"
              />
            )}
            {chartType === 'volume' && (
              <Bar dataKey="volume" fill="#2563eb" opacity={0.7} name="거래량" />
            )}

            {/* Technical Indicators Overlays */}
            {showSMA && (
              <>
                <Line type="monotone" dataKey="sma20" stroke="#d97706" strokeWidth={1.5} dot={false} name="SMA (20일)" />
                <Line type="monotone" dataKey="sma50" stroke="#2563eb" strokeWidth={1.5} dot={false} name="SMA (50일)" />
              </>
            )}

            {showBB && (
              <>
                <Line type="monotone" dataKey="bbUpper" stroke="#6366f1" strokeDasharray="3 3" strokeWidth={1} dot={false} name="상단 밴드" />
                <Line type="monotone" dataKey="bbLower" stroke="#6366f1" strokeDasharray="3 3" strokeWidth={1} dot={false} name="하단 밴드" />
              </>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Sub Technical Oscillator Chart (RSI / MACD) */}
      {(showRSI || showMACD) && (
        <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
          {showRSI && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-purple-700 mb-2 flex items-center justify-between">
                <span>RSI (14일 상대강도지수)</span>
                <span className="text-slate-500 font-normal">70(과매수) / 30(과매도)</span>
              </div>
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <YAxis domain={[0, 100]} orientation="right" stroke="#64748b" fontSize={10} ticks={[30, 50, 70]} />
                    <ReferenceLine y={70} stroke="#e11d48" strokeDasharray="3 3" />
                    <ReferenceLine y={30} stroke="#059669" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="rsi" stroke="#9333ea" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {showMACD && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="text-xs font-bold text-cyan-700 mb-2">MACD (이동평균 수렴확산)</div>
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <YAxis orientation="right" stroke="#64748b" fontSize={10} />
                    <ReferenceLine y={0} stroke="#cbd5e1" />
                    <Bar dataKey="macd" fill="#0891b2" opacity={0.7} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label, currency }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xl text-xs text-slate-800">
        <div className="font-bold text-slate-900 border-b border-slate-100 pb-1.5 mb-2">{data.date}</div>
        <div className="space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-slate-500 font-medium">종가:</span>
            <span className="font-black text-slate-900">{formatCurrency(data.close, currency)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500 font-medium">시가:</span>
            <span className="text-slate-700 font-bold">{formatCurrency(data.open, currency)}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500 font-medium">고가 / 저가:</span>
            <span className="text-slate-700 font-semibold">
              {formatCurrency(data.high, currency)} / {formatCurrency(data.low, currency)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-slate-500 font-medium">거래량:</span>
            <span className="text-slate-700 font-semibold">{formatVolume(data.volume)}</span>
          </div>
          {data.sma20 && (
            <div className="flex justify-between gap-4 text-amber-700 font-semibold">
              <span>SMA (20):</span>
              <span>{formatCurrency(data.sma20, currency)}</span>
            </div>
          )}
          {data.rsi && (
            <div className="flex justify-between gap-4 text-purple-700 font-semibold">
              <span>RSI:</span>
              <span>{data.rsi}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};
