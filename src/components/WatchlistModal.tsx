import React from 'react';
import { Star, X, Trash2, ArrowRight } from 'lucide-react';

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: string[];
  onRemoveFromWatchlist: (symbol: string) => void;
  onSelectStock: (symbol: string) => void;
}

export const WatchlistModal: React.FC<WatchlistModalProps> = ({
  isOpen,
  onClose,
  watchlist,
  onRemoveFromWatchlist,
  onSelectStock,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-xl text-slate-900 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="text-lg font-bold text-slate-900">나의 관심 종목 리스트</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 max-h-80 overflow-y-auto space-y-2">
          {watchlist.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              관심 등록된 종목이 없습니다. 대시보드의 별 아이콘을 클릭하여 관심종목을 추가해보세요!
            </div>
          ) : (
            watchlist.map((sym) => (
              <div
                key={sym}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition group"
              >
                <button
                  onClick={() => {
                    onSelectStock(sym);
                    onClose();
                  }}
                  className="flex items-center gap-3 text-left font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition"
                >
                  <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 font-mono text-xs flex items-center justify-center border border-blue-200 font-bold">
                    {sym.substring(0, 3)}
                  </span>
                  <span>{sym}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectStock(sym);
                      onClose();
                    }}
                    className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold transition flex items-center gap-1 shadow-xs"
                  >
                    <span>대시보드</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onRemoveFromWatchlist(sym)}
                    className="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition"
                    title="관심종목 삭제"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pt-3 border-t border-slate-200 text-right">
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
