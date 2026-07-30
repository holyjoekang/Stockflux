import React from 'react';
import { AnalystConsensus } from '../types';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { Target, Award, Users, TrendingUp } from 'lucide-react';

interface AnalystConsensusCardProps {
  consensus: AnalystConsensus | null;
  currency: string;
}

export const AnalystConsensusCard: React.FC<AnalystConsensusCardProps> = ({ consensus, currency }) => {
  if (!consensus) return null;

  const { targetHigh, targetLow, targetMean, currentPrice, numberOfAnalystOpinions, recommendationMean } = consensus;

  // Calculate Upside / Downside %
  const upsidePercent = ((targetMean - currentPrice) / currentPrice) * 100;
  const isUpside = upsidePercent >= 0;

  // Position calculation for gauge marker (0% = low, 100% = high)
  const range = targetHigh - targetLow || 1;
  const currentPosPercent = Math.min(100, Math.max(0, ((currentPrice - targetLow) / range) * 100));
  const meanPosPercent = Math.min(100, Math.max(0, ((targetMean - targetLow) / range) * 100));

  // Recommendation string mapping based on score 1.0 - 5.0
  let recText = '매수 (Buy)';
  let recBg = 'bg-emerald-600 text-white border-emerald-700';
  if (recommendationMean <= 1.5) {
    recText = '강력 매수 (Strong Buy)';
    recBg = 'bg-emerald-600 text-white border-emerald-700';
  } else if (recommendationMean <= 2.5) {
    recText = '매수 (Buy)';
    recBg = 'bg-emerald-600 text-white border-emerald-700';
  } else if (recommendationMean <= 3.5) {
    recText = '보유/중립 (Hold)';
    recBg = 'bg-amber-500 text-white border-amber-600';
  } else {
    recText = '매도 (Sell)';
    recBg = 'bg-rose-600 text-white border-rose-700';
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">월가 애널리스트 목표주가 & 컨센서스</h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Users className="w-4 h-4 text-blue-600" />
          <span>전문 분석가 {numberOfAnalystOpinions}명 참여</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Rating Badge Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold mb-1">투자의견 컨센서스</div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-sm font-extrabold px-3 py-1.5 rounded-lg border shadow-xs ${recBg}`}>
                {recText}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200 text-xs text-slate-600 flex justify-between font-medium">
            <span>평균 점수 (1=강력매수 ~ 5=매도)</span>
            <span className="font-bold text-slate-900">{recommendationMean.toFixed(1)} / 5.0</span>
          </div>
        </div>

        {/* Target Price Visualizer Gauge */}
        <div className="md:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs text-slate-500 font-semibold">목표주가 밴드 (Target Price Range)</span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${isUpside ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
              평균 목표가 기준 {formatPercent(upsidePercent)} {isUpside ? '상승 여력' : '하락 위험'}
            </span>
          </div>

          {/* Range Visual Track */}
          <div className="relative my-7 px-2">
            <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden relative">
              {/* Target Low to High track */}
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-gradient-to-r from-rose-400 via-amber-400 to-emerald-500 opacity-80" />
            </div>

            {/* Current Price Marker Pin */}
            <div
              className="absolute -top-6 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
              style={{ left: `${currentPosPercent}%` }}
            >
              <div className="px-2 py-0.5 rounded bg-slate-900 text-white font-extrabold text-[10px] shadow-sm whitespace-nowrap">
                현재가: {formatCurrency(currentPrice, currency)}
              </div>
              <div className="w-2 h-2 bg-slate-900 rotate-45 -mt-1" />
            </div>

            {/* Mean Target Marker Pin */}
            <div
              className="absolute -bottom-6 -translate-x-1/2 flex flex-col items-center transition-all duration-500"
              style={{ left: `${meanPosPercent}%` }}
            >
              <div className="w-1.5 h-1.5 bg-blue-600 rotate-45 -mb-0.5" />
              <div className="px-2 py-0.5 rounded bg-blue-600 text-white font-extrabold text-[10px] shadow-sm whitespace-nowrap">
                평균 목표: {formatCurrency(targetMean, currency)}
              </div>
            </div>
          </div>

          {/* Min / Mean / Max numbers below */}
          <div className="grid grid-cols-3 text-xs text-center mt-4 pt-2 border-t border-slate-200">
            <div>
              <div className="text-slate-500 font-medium">최저 목표가</div>
              <div className="font-bold text-slate-800 mt-0.5">{formatCurrency(targetLow, currency)}</div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">평균 목표가</div>
              <div className="font-bold text-blue-700 mt-0.5">{formatCurrency(targetMean, currency)}</div>
            </div>
            <div>
              <div className="text-slate-500 font-medium">최고 목표가</div>
              <div className="font-bold text-emerald-700 mt-0.5">{formatCurrency(targetHigh, currency)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
