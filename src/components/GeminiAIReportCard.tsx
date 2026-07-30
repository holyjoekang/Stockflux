import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, ShieldCheck, Target, RefreshCw, BarChart, CheckCircle2 } from 'lucide-react';
import { GeminiAIAnalysis } from '../types';

interface GeminiAIReportCardProps {
  aiReport: GeminiAIAnalysis | null;
  isLoading: boolean;
  onRefreshAI: () => void;
  symbol: string;
}

export const GeminiAIReportCard: React.FC<GeminiAIReportCardProps> = ({
  aiReport,
  isLoading,
  onRefreshAI,
  symbol,
}) => {
  if (isLoading && !aiReport) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm mb-6 text-center text-slate-700">
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-lg text-slate-900">Gemini 3.6 AI 종목 심층 분석을 작성 중입니다...</p>
          <p className="text-xs text-slate-500">재무제표, 실시간 주가, 수급 및 시장 뉴스 트렌드를 실시간 분석하고 있습니다.</p>
        </div>
      </div>
    );
  }

  if (!aiReport) return null;

  // Determine verdict badge color
  let verdictBg = 'bg-emerald-50 text-emerald-700 border-emerald-300';
  if (aiReport.verdict.includes('강력 매수') || aiReport.verdict.includes('Strong Buy')) {
    verdictBg = 'bg-emerald-600 text-white border-emerald-700';
  } else if (aiReport.verdict.includes('중립') || aiReport.verdict.includes('Hold')) {
    verdictBg = 'bg-amber-500 text-white border-amber-600';
  } else if (aiReport.verdict.includes('매도') || aiReport.verdict.includes('Caution') || aiReport.verdict.includes('Sell')) {
    verdictBg = 'bg-rose-600 text-white border-rose-700';
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6 text-slate-900 relative overflow-hidden">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-200">
            <Sparkles className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-slate-900">Gemini 3.6 AI 종합 종목 진단 리포트</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                PRO INSIGHT
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">{symbol} 정밀 데이터 기반 자동 AI 투자 분석</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onRefreshAI}
            disabled={isLoading}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>AI 분석 재요청</span>
          </button>
        </div>
      </div>

      {/* Highlight Rating Blue Banner & Confidence */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6 p-5 rounded-xl bg-blue-900 text-white shadow-sm">
        {/* Verdict Badge */}
        <div className="flex flex-col justify-center">
          <div className="text-xs text-blue-200 font-semibold mb-1">AI 투자 종합 의견 (Verdict)</div>
          <div className="flex items-center gap-3">
            <span className={`text-base font-extrabold px-3.5 py-1.5 rounded-lg border shadow-sm ${verdictBg}`}>
              {aiReport.verdict}
            </span>
          </div>
        </div>

        {/* Confidence Progress Bar */}
        <div className="flex flex-col justify-center">
          <div className="flex justify-between text-xs font-semibold mb-1.5">
            <span className="text-blue-200">분석 신뢰도 (Confidence Score)</span>
            <span className="text-white font-bold">{aiReport.confidenceScore}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-blue-950 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all duration-700"
              style={{ width: `${aiReport.confidenceScore}%` }}
            />
          </div>
        </div>

        {/* Target Price Insight */}
        <div className="flex flex-col justify-center">
          <div className="text-xs text-blue-200 font-semibold mb-1 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-blue-300" />
            <span>목표가 및 전망 제언</span>
          </div>
          <div className="text-xs font-bold text-white leading-snug">
            {aiReport.targetPriceEstimate}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
        <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          수석 분석가 핵심 진단 요약 (Executive Summary)
        </h4>
        <p className="text-sm text-slate-800 leading-relaxed font-normal">{aiReport.executiveSummary}</p>
      </div>

      {/* Investment Thesis 3 Pillars */}
      {aiReport.investmentThesis && aiReport.investmentThesis.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <BarChart className="w-4 h-4 text-blue-600" />
            핵심 투자 포인트 (3-Pillar Investment Thesis)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {aiReport.investmentThesis.map((thesis, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex gap-3 items-start">
                <div className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                  0{idx + 1}
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">{thesis}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bullish vs Bearish Comparative Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bullish Drivers */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
          <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            상승 모멘텀 & 강점 (Bullish Drivers)
          </h4>
          <ul className="space-y-2">
            {aiReport.bullishDrivers?.map((driver, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{driver}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bearish Risks */}
        <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200">
          <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            위험 요인 & 리스크 (Bearish Risks)
          </h4>
          <ul className="space-y-2">
            {aiReport.bearishRisks?.map((risk, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-800 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Valuation & Sector Footer */}
      <div className="mt-4 pt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-4 text-xs text-slate-600">
        <div>
          <span className="font-bold text-slate-800">밸류에이션 진단: </span>
          <span>{aiReport.valuationAssessment}</span>
        </div>
        <div>
          <span className="font-bold text-slate-800">섹터 전망: </span>
          <span>{aiReport.sectorOutlook}</span>
        </div>
      </div>
    </div>
  );
};
