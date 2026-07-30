import React from 'react';
import { Star, ExternalLink, TrendingUp, TrendingDown, DollarSign, Activity, PieChart, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StockQuote } from '../types';
import { formatCurrency, formatLargeNumber, formatPercent, formatVolume } from '../utils/formatters';

interface StockOverviewHeaderProps {
  quote: StockQuote;
  isWatchlisted: boolean;
  onToggleWatchlist: () => void;
  isLoading: boolean;
}

export const StockOverviewHeader: React.FC<StockOverviewHeaderProps> = ({
  quote,
  isWatchlisted,
  onToggleWatchlist,
  isLoading,
}) => {
  const isPositive = quote.regularMarketChange >= 0;
  const priceColor = isPositive ? 'text-emerald-600' : 'text-rose-600';

  // Calculate Day Range percentage
  const dayLow = quote.regularMarketDayLow || quote.regularMarketPrice * 0.98;
  const dayHigh = quote.regularMarketDayHigh || quote.regularMarketPrice * 1.02;
  const dayPercent = Math.min(
    100,
    Math.max(0, ((quote.regularMarketPrice - dayLow) / (dayHigh - dayLow || 1)) * 100)
  );

  // Calculate 52-Week Range percentage
  const yearLow = quote.fiftyTwoWeekLow || quote.regularMarketPrice * 0.7;
  const yearHigh = quote.fiftyTwoWeekHigh || quote.regularMarketPrice * 1.3;
  const yearPercent = Math.min(
    100,
    Math.max(0, ((quote.regularMarketPrice - yearLow) / (yearHigh - yearLow || 1)) * 100)
  );

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6 text-slate-900 relative overflow-hidden">
      {/* Header Info Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              {quote.longName || quote.shortName}
            </h2>
            <span className="text-lg font-bold px-3 py-0.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
              {quote.symbol}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-semibold">
              {quote.exchangeName || 'EXCHANGE'}
            </span>
            {quote.sector && (
              <span className="text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                {quote.sector}
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-1 flex items-center gap-3 font-medium">
            <span>통화: {quote.currency}</span>
            {quote.summaryProfile?.website && (
              <a
                href={quote.summaryProfile.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-blue-600 font-semibold hover:underline"
              >
                웹사이트 <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </p>
        </div>

        {/* Price Action Block */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              {formatCurrency(quote.regularMarketPrice, quote.currency)}
            </div>
            <div className={`flex items-center justify-end gap-1 font-bold text-sm sm:text-base ${priceColor}`}>
              {isPositive ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
              <span>
                {isPositive ? '+' : ''}
                {quote.regularMarketChange.toFixed(2)} ({formatPercent(quote.regularMarketChangePercent)})
              </span>
            </div>
          </div>

          {/* Watchlist Toggle */}
          <button
            onClick={onToggleWatchlist}
            className={`p-3 rounded-xl border transition ${
              isWatchlisted
                ? 'bg-amber-50 text-amber-600 border-amber-300 hover:bg-amber-100'
                : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200 hover:text-slate-800'
            }`}
            title={isWatchlisted ? '관심종목 해제' : '관심종목 추가'}
          >
            <Star className={`w-5 h-5 ${isWatchlisted ? 'fill-amber-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Range Bars Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
        {/* Day Range Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-semibold">
            <span>오늘의 변동폭 (Low - High)</span>
            <span className="text-slate-800 font-bold">
              {formatCurrency(dayLow, quote.currency)} - {formatCurrency(dayHigh, quote.currency)}
            </span>
          </div>
          <div className="relative w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isPositive ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
              style={{ width: `${dayPercent}%` }}
            />
          </div>
        </div>

        {/* 52-Week Range Bar */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-semibold">
            <span>52주 최고/최저폭 (52W Range)</span>
            <span className="text-slate-800 font-bold">
              {formatCurrency(yearLow, quote.currency)} - {formatCurrency(yearHigh, quote.currency)}
            </span>
          </div>
          <div className="relative w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${yearPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <MetricCard label="시가총액 (Market Cap)" value={formatLargeNumber(quote.marketCap, quote.currency)} />
        <MetricCard label="PER (Trailing P/E)" value={quote.trailingPE ? `${quote.trailingPE.toFixed(1)}배` : 'N/A'} />
        <MetricCard label="Forward PER" value={quote.forwardPE ? `${quote.forwardPE.toFixed(1)}배` : 'N/A'} />
        <MetricCard label="EPS (주당순이익)" value={quote.epsTrailingTwelveMonths ? formatCurrency(quote.epsTrailingTwelveMonths, quote.currency) : 'N/A'} />
        <MetricCard label="배당수익률 (Div Yield)" value={quote.dividendYield ? `${quote.dividendYield.toFixed(2)}%` : '0.00%'} />
        <MetricCard label="베타 (Beta - 변동성)" value={quote.beta ? quote.beta.toFixed(2) : '1.00'} />
        <MetricCard label="거래량 (Volume)" value={formatVolume(quote.regularMarketVolume)} />
        <MetricCard label="10일 평균 거래량" value={formatVolume(quote.averageDailyVolume10Day)} />
        <MetricCard label="52주 최고가" value={formatCurrency(quote.fiftyTwoWeekHigh, quote.currency)} />
        <MetricCard label="52주 최저가" value={formatCurrency(quote.fiftyTwoWeekLow, quote.currency)} />
        <MetricCard label="PBR (주가순자산비율)" value={quote.priceToBook ? `${quote.priceToBook.toFixed(2)}배` : 'N/A'} />
        <MetricCard label="섹터 / 산업" value={quote.sector || '기타'} highlight />
      </div>
    </div>
  );
};

const MetricCard: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
  <div className={`p-3 rounded-xl border ${highlight ? 'bg-blue-50/70 border-blue-200' : 'bg-slate-50 border-slate-200'} flex flex-col justify-between shadow-2xs`}>
    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 truncate">{label}</div>
    <div className={`text-sm font-extrabold truncate ${highlight ? 'text-blue-700' : 'text-slate-900'}`}>{value}</div>
  </div>
);
