import React, { useState, useEffect, useCallback } from 'react';
import {
  StockQuote,
  ChartDataPoint,
  FinancialMetric,
  AnalystConsensus,
  StockNews,
  PeerComparison,
  GeminiAIAnalysis,
  TimeRange,
  MarketCategoryKey,
} from './types';
import { HeaderNav } from './components/HeaderNav';
import { MarketIndicesTickerBar } from './components/MarketIndicesTickerBar';
import { LeftSidebarNav } from './components/LeftSidebarNav';
import { CategoryStockListSection } from './components/CategoryStockListSection';
import { StockOverviewHeader } from './components/StockOverviewHeader';
import { StockPriceChart } from './components/StockPriceChart';
import { GeminiAIReportCard } from './components/GeminiAIReportCard';
import { FinancialsTab } from './components/FinancialsTab';
import { AnalystConsensusCard } from './components/AnalystConsensusCard';
import { NewsAndPeersCard } from './components/NewsAndPeersCard';
import { WatchlistModal } from './components/WatchlistModal';
import { StockCompareModal } from './components/StockCompareModal';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentSymbol, setCurrentSymbol] = useState<string>('NVDA');
  const [activeCategory, setActiveCategory] = useState<MarketCategoryKey>('sp500');
  const [quote, setQuote] = useState<StockQuote | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [financials, setFinancials] = useState<FinancialMetric[]>([]);
  const [consensus, setConsensus] = useState<AnalystConsensus | null>(null);
  const [news, setNews] = useState<StockNews[]>([]);
  const [peers, setPeers] = useState<PeerComparison[]>([]);
  const [aiReport, setAiReport] = useState<GeminiAIAnalysis | null>(null);

  const [selectedRange, setSelectedRange] = useState<TimeRange>('1M');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Watchlist state with localStorage
  const [watchlist, setWatchlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('yahoo_finance_watchlist');
      return saved ? JSON.parse(saved) : ['NVDA', 'AAPL', '005930.KS', 'TSLA'];
    } catch {
      return ['NVDA', 'AAPL', '005930.KS', 'TSLA'];
    }
  });

  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Save watchlist on change
  useEffect(() => {
    try {
      localStorage.setItem('yahoo_finance_watchlist', JSON.stringify(watchlist));
    } catch (e) {
      console.error('Failed to save watchlist:', e);
    }
  }, [watchlist]);

  // Fetch Stock Main Data
  const fetchStockData = useCallback(async (symbol: string, range: TimeRange) => {
    setIsLoading(true);
    setError(null);

    try {
      // Parallel requests for max speed
      const [quoteRes, chartRes, finRes, conRes, newsRes, peerRes] = await Promise.all([
        fetch(`/api/stock/${symbol}`),
        fetch(`/api/stock/${symbol}/chart?range=${range}`),
        fetch(`/api/stock/${symbol}/financials`),
        fetch(`/api/stock/${symbol}/consensus`),
        fetch(`/api/stock/${symbol}/news`),
        fetch(`/api/stock/${symbol}/peers`),
      ]);

      if (quoteRes.ok) {
        const qData = await quoteRes.json();
        setQuote(qData);

        // Request Gemini AI Report after quote is retrieved
        fetchAiReport(symbol, qData, []);
      }

      if (chartRes.ok) {
        const cData = await chartRes.json();
        setChartData(cData);
      }

      if (finRes.ok) {
        const fData = await finRes.json();
        setFinancials(fData);
      }

      if (conRes.ok) {
        const conData = await conRes.json();
        setConsensus(conData);
      }

      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setNews(newsData);
      }

      if (peerRes.ok) {
        const peerData = await peerRes.json();
        setPeers(peerData);
      }
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('종목 데이터를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch Gemini AI Report
  const fetchAiReport = async (symbol: string, currentQuote: StockQuote, finData: FinancialMetric[]) => {
    setIsAiLoading(true);
    try {
      const res = await fetch(`/api/stock/${symbol}/ai-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quote: currentQuote, financials: finData }),
      });

      if (res.ok) {
        const data = await res.json();
        setAiReport(data);
      }
    } catch (err) {
      console.error('AI Report fetch error:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Trigger main fetch when symbol changes
  useEffect(() => {
    fetchStockData(currentSymbol, selectedRange);
  }, [currentSymbol, fetchStockData]);

  // Trigger chart range change
  const handleRangeChange = async (newRange: TimeRange) => {
    setSelectedRange(newRange);
    try {
      const res = await fetch(`/api/stock/${currentSymbol}/chart?range=${newRange}`);
      if (res.ok) {
        const data = await res.json();
        setChartData(data);
      }
    } catch (e) {
      console.error('Range change error:', e);
    }
  };

  const handleToggleWatchlist = () => {
    const sym = currentSymbol.toUpperCase();
    if (watchlist.includes(sym)) {
      setWatchlist((prev) => prev.filter((s) => s !== sym));
    } else {
      setWatchlist((prev) => [...prev, sym]);
    }
  };

  const handleSelectStock = (symbol: string) => {
    if (symbol.toUpperCase() !== currentSymbol.toUpperCase()) {
      setCurrentSymbol(symbol.toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased selection:bg-blue-600 selection:text-white flex flex-col">
      {/* Header Navigation */}
      <HeaderNav
        currentSymbol={currentSymbol}
        onSelectStock={handleSelectStock}
        watchlist={watchlist}
        onToggleWatchlistModal={() => setIsWatchlistOpen(true)}
        onToggleCompareModal={() => setIsCompareOpen(true)}
        isLoading={isLoading}
        onRefresh={() => fetchStockData(currentSymbol, selectedRange)}
      />

      {/* Yahoo Finance Style Global Market Ticker Bar */}
      <MarketIndicesTickerBar
        onSelectStock={handleSelectStock}
        currentSymbol={currentSymbol}
      />

      {/* Main Content Area with Left Sidebar & Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Yahoo Finance Style Left Navigation Sidebar */}
          <LeftSidebarNav
            activeCategory={activeCategory}
            onSelectCategory={(cat) => setActiveCategory(cat)}
            onSelectStock={handleSelectStock}
            currentSymbol={currentSymbol}
            watchlist={watchlist}
            onToggleWatchlistModal={() => setIsWatchlistOpen(true)}
          />

          {/* Main Dashboard Content Area */}
          <div className="flex-1 w-full min-w-0">
            {/* Category Stock List Section (Top 10, Top 30, Popular, Gainers, Losers, Active) */}
            <CategoryStockListSection
              activeCategory={activeCategory}
              onSelectStock={handleSelectStock}
              currentSymbol={currentSymbol}
            />

            {error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 flex items-center justify-between text-rose-800 shadow-sm">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <span className="text-sm font-semibold">{error}</span>
                </div>
                <button
                  onClick={() => fetchStockData(currentSymbol, selectedRange)}
                  className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> 다시 시도
                </button>
              </div>
            )}

            {quote ? (
              <div className="space-y-6">
                {/* Top Overview & Key Metrics */}
                <StockOverviewHeader
                  quote={quote}
                  isWatchlisted={watchlist.includes(currentSymbol.toUpperCase())}
                  onToggleWatchlist={handleToggleWatchlist}
                  isLoading={isLoading}
                />

                {/* Interactive Price & Technical Indicators Chart */}
                <StockPriceChart
                  chartData={chartData}
                  selectedRange={selectedRange}
                  onRangeChange={handleRangeChange}
                  currency={quote.currency}
                  isLoading={isLoading}
                />

                {/* Gemini 3.6 AI Deep Stock Analysis */}
                <GeminiAIReportCard
                  aiReport={aiReport}
                  isLoading={isAiLoading}
                  onRefreshAI={() => fetchAiReport(currentSymbol, quote, financials)}
                  symbol={currentSymbol}
                />

                {/* Analyst Consensus & Price Target Gauge */}
                <AnalystConsensusCard consensus={consensus} currency={quote.currency} />

                {/* Financial Statements Breakdown */}
                <FinancialsTab financials={financials} currency={quote.currency} />

                {/* News & Peer Comparison */}
                <NewsAndPeersCard
                  news={news}
                  peers={peers}
                  currency={quote.currency}
                  onSelectStock={handleSelectStock}
                />
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-xl p-16 text-center shadow-sm">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">{currentSymbol} 종목 데이터를 불러오는 중...</h3>
                <p className="text-sm text-slate-500">실시간 종목 시세, 연도별 재무제표 및 AI 리포트를 준비 중입니다.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-slate-700">STOCKFLUX</span>
            <span>• 실시간 파이낸스 대시보드</span>
          </div>
          <p className="text-slate-400">
            © Yahoo Finance Stock Dashboard — Gemini 3.6 AI Financial Analytics
          </p>
        </div>
      </footer>

      {/* Watchlist Modal */}
      <WatchlistModal
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlist}
        onRemoveFromWatchlist={(sym) => setWatchlist((prev) => prev.filter((s) => s !== sym))}
        onSelectStock={handleSelectStock}
      />

      {/* Stock Comparison Modal */}
      {quote && (
        <StockCompareModal
          isOpen={isCompareOpen}
          onClose={() => setIsCompareOpen(false)}
          currentQuote={quote}
          currency={quote.currency}
        />
      )}
    </div>
  );
}
