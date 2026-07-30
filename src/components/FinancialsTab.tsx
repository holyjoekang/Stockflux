import React, { useState } from 'react';
import { FinancialMetric } from '../types';
import { formatLargeNumber } from '../utils/formatters';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { Landmark, TrendingUp, DollarSign, Wallet, FileText } from 'lucide-react';

interface FinancialsTabProps {
  financials: FinancialMetric[];
  currency: string;
}

export const FinancialsTab: React.FC<FinancialsTabProps> = ({ financials, currency }) => {
  const [subTab, setSubTab] = useState<'income' | 'balance' | 'cashflow'>('income');

  if (!financials || financials.length === 0) {
    return null;
  }

  const latest = financials[financials.length - 1];
  const grossMargin = latest.revenue ? ((latest.grossProfit / latest.revenue) * 100).toFixed(1) : 'N/A';
  const opMargin = latest.revenue ? ((latest.operatingIncome / latest.revenue) * 100).toFixed(1) : 'N/A';
  const netMargin = latest.revenue ? ((latest.netIncome / latest.revenue) * 100).toFixed(1) : 'N/A';

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6 text-slate-900">
      {/* Header & Sub-tab Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 mb-6">
        <div className="flex items-center gap-2">
          <Landmark className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-slate-900">재무제표 및 연도별 실적 추이</h3>
        </div>

        {/* Sub-tab buttons */}
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setSubTab('income')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              subTab === 'income' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            손익계산서 (Income)
          </button>
          <button
            onClick={() => setSubTab('balance')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              subTab === 'balance' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            재무상태표 (Balance)
          </button>
          <button
            onClick={() => setSubTab('cashflow')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${
              subTab === 'cashflow' ? 'bg-white text-blue-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            현금흐름표 (Cash Flow)
          </button>
        </div>
      </div>

      {/* Ratios Highlight Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-500 font-medium mb-1">매출총이익률 (Gross Margin)</div>
          <div className="text-lg font-extrabold text-blue-700">{grossMargin}%</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-500 font-medium mb-1">영업이익률 (Op Margin)</div>
          <div className="text-lg font-extrabold text-emerald-700">{opMargin}%</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-500 font-medium mb-1">순이익률 (Net Margin)</div>
          <div className="text-lg font-extrabold text-cyan-700">{netMargin}%</div>
        </div>
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="text-xs text-slate-500 font-medium mb-1">잉여현금흐름 (FCF)</div>
          <div className="text-lg font-extrabold text-amber-700">{formatLargeNumber(latest.freeCashFlow, currency)}</div>
        </div>
      </div>

      {/* Chart Visualizer */}
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={financials} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="period" stroke="#64748b" fontSize={12} />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickFormatter={(v) => formatLargeNumber(v, currency)}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', color: '#0f172a', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              formatter={(value: any) => [formatLargeNumber(Number(value), currency), '']}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

            {subTab === 'income' && (
              <>
                <Bar dataKey="revenue" name="매출액 (Revenue)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="grossProfit" name="매출총이익" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="operatingIncome" name="영업이익" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="netIncome" name="당기순이익" fill="#d97706" radius={[4, 4, 0, 0]} />
              </>
            )}

            {subTab === 'balance' && (
              <>
                <Bar dataKey="totalAssets" name="총자산 (Total Assets)" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="totalDebt" name="총부채 (Total Debt)" fill="#e11d48" radius={[4, 4, 0, 0]} />
              </>
            )}

            {subTab === 'cashflow' && (
              <>
                <Bar dataKey="operatingCashFlow" name="영업현금흐름" fill="#059669" radius={[4, 4, 0, 0]} />
                <Bar dataKey="freeCashFlow" name="잉여현금흐름 (FCF)" fill="#7c3aed" radius={[4, 4, 0, 0]} />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
