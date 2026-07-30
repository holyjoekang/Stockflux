import React, { useState } from 'react';
import { StockNews, PeerComparison } from '../types';
import { formatCurrency, formatLargeNumber, formatPercent } from '../utils/formatters';
import { Newspaper, Users, ExternalLink, ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';

interface NewsAndPeersCardProps {
  news: StockNews[];
  peers: PeerComparison[];
  currency: string;
  onSelectStock: (symbol: string) => void;
}

export const NewsAndPeersCard: React.FC<NewsAndPeersCardProps> = ({
  news,
  peers,
  currency,
  onSelectStock,
}) => {
  const [activeTab, setActiveTab] = useState<'news' | 'peers'>('news');

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6 text-slate-900">
      {/* Top Tab Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
        <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition ${
              activeTab === 'news' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Newspaper className="w-4 h-4" />
            <span>주요 뉴스 & 시장 이슈 ({news.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('peers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition ${
              activeTab === 'peers' ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>동종 업계 라이벌 비교 ({peers.length})</span>
          </button>
        </div>
      </div>

      {/* News Feed Tab */}
      {activeTab === 'news' && (
        <div className="space-y-3">
          {news.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">최근 관련 뉴스가 없습니다.</div>
          ) : (
            news.map((item) => {
              const pubDate = new Date(item.providerPublishTime * 1000).toLocaleDateString('ko-KR', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              let sentimentBadge = 'bg-slate-100 text-slate-600 border-slate-200';
              let sentimentText = '중립';
              if (item.sentiment === 'positive') {
                sentimentBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                sentimentText = '긍정적';
              } else if (item.sentiment === 'negative') {
                sentimentBadge = 'bg-rose-50 text-rose-700 border-rose-200';
                sentimentText = '부정적';
              }

              return (
                <a
                  key={item.id}
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 hover:bg-slate-100/80 transition group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <span className="text-xs font-bold text-blue-700">{item.publisher}</span>
                        <span className="text-xs text-slate-400">• {pubDate}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${sentimentBadge}`}>
                          {sentimentText}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2">
                        {item.title}
                      </h4>
                      {item.summary && (
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">{item.summary}</p>
                      )}
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 shrink-0 mt-1 transition" />
                  </div>
                </a>
              );
            })
          )}
        </div>
      )}

      {/* Peer Comparison Table Tab */}
      {activeTab === 'peers' && (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="text-[11px] font-bold uppercase text-slate-500 bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="p-3">종목명 / 티커</th>
                <th className="p-3">현재가</th>
                <th className="p-3">일일 변동률</th>
                <th className="p-3">시가총액</th>
                <th className="p-3">PER (배)</th>
                <th className="p-3">매출 성장률</th>
                <th className="p-3 text-right">대시보드 보기</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {peers.map((peer) => {
                const isPos = peer.changePercent >= 0;
                return (
                  <tr key={peer.symbol} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-blue-700 border border-slate-200 font-mono">
                        {peer.symbol}
                      </span>
                      <span>{peer.name}</span>
                    </td>
                    <td className="p-3 font-bold">{formatCurrency(peer.price, currency)}</td>
                    <td className={`p-3 font-bold ${isPos ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {formatPercent(peer.changePercent)}
                    </td>
                    <td className="p-3 font-medium text-slate-600">{formatLargeNumber(peer.marketCap, currency)}</td>
                    <td className="p-3">{peer.peRatio ? `${peer.peRatio.toFixed(1)}배` : 'N/A'}</td>
                    <td className="p-3 text-emerald-700 font-bold">+{peer.revenueGrowth}%</td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => onSelectStock(peer.symbol)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold transition border border-blue-200"
                      >
                        <span>선택</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
