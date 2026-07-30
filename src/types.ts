export interface StockQuote {
  symbol: string;
  shortName: string;
  longName: string;
  currency: string;
  exchangeName: string;
  marketCap: number;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  averageDailyVolume10Day: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  trailingPE?: number;
  forwardPE?: number;
  epsTrailingTwelveMonths?: number;
  dividendYield?: number;
  beta?: number;
  priceToBook?: number;
  sector?: string;
  industry?: string;
  summaryProfile?: {
    longBusinessSummary: string;
    website?: string;
    fullTimeEmployees?: number;
    city?: string;
    country?: string;
  };
}

export interface FinancialMetric {
  period: string; // e.g., '2021', '2022', '2023', '2024'
  revenue: number;
  grossProfit: number;
  operatingIncome: number;
  netIncome: number;
  operatingCashFlow: number;
  freeCashFlow: number;
  totalAssets?: number;
  totalDebt?: number;
}

export interface AnalystConsensus {
  targetHigh: number;
  targetLow: number;
  targetMean: number;
  targetMedian: number;
  currentPrice: number;
  recommendationKey: 'strong_buy' | 'buy' | 'hold' | 'underperform' | 'sell' | string;
  recommendationMean: number; // 1.0 (Strong Buy) to 5.0 (Sell)
  numberOfAnalystOpinions: number;
}

export interface ChartDataPoint {
  timestamp: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  sma20?: number;
  sma50?: number;
  sma200?: number;
  rsi?: number;
  macd?: number;
  macdSignal?: number;
  bbUpper?: number;
  bbLower?: number;
}

export interface StockNews {
  id: string;
  title: string;
  publisher: string;
  link: string;
  providerPublishTime: number;
  sentiment?: 'positive' | 'neutral' | 'negative';
  summary?: string;
}

export interface PeerComparison {
  symbol: string;
  name: string;
  price: number;
  changePercent: number;
  marketCap: number;
  peRatio: number;
  revenueGrowth: number;
  profitMargin: number;
}

export interface GeminiAIAnalysis {
  verdict: '강력 매수 (Strong Buy)' | '매수 (Buy)' | '중립 (Hold)' | '주의 / 매도 (Caution/Sell)';
  confidenceScore: number;
  executiveSummary: string;
  investmentThesis: string[];
  bullishDrivers: string[];
  bearishRisks: string[];
  valuationAssessment: string;
  targetPriceEstimate: string;
  keyMetricsTakeaway: string;
  sectorOutlook: string;
}

export interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  exchange: string;
}

export type TimeRange = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y' | '5Y' | 'MAX';

export interface MarketSummaryItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
}

export type MarketCategoryKey = 'sp500' | 'nasdaq' | 'dow' | 'crypto' | 'indices' | 'commodities';
export type MarketFilterKey = 'top10' | 'top30' | 'popular' | 'gainers' | 'losers' | 'active';

export interface CategoryStockItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  peRatio?: number;
  currency: string;
  sector?: string;
}

export interface CategoryStockResponse {
  categoryKey: MarketCategoryKey;
  categoryName: string;
  indexTicker: string;
  filter: MarketFilterKey;
  totalCount: number;
  stocks: CategoryStockItem[];
}
