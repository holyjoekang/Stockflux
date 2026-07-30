export function formatCurrency(value: number | undefined, currency: string = 'USD'): string {
  if (value == null || isNaN(value)) return 'N/A';

  if (currency === 'KRW') {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(value);
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatLargeNumber(value: number | undefined, currency: string = 'USD'): string {
  if (value == null || isNaN(value)) return 'N/A';

  if (currency === 'KRW') {
    if (value >= 1_0000_0000_0000) {
      return `${(value / 1_0000_0000_0000).toFixed(1)}조 원`;
    }
    if (value >= 1_0000_0000) {
      return `${(value / 1_0000_0000).toFixed(0)}억 원`;
    }
    return `${value.toLocaleString('ko-KR')}원`;
  }

  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(2)}T`;
  }
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  return `$${value.toLocaleString('en-US')}`;
}

export function formatPercent(value: number | undefined): string {
  if (value == null || isNaN(value)) return '0.00%';
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

export function formatVolume(value: number | undefined): string {
  if (value == null || isNaN(value)) return 'N/A';
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(2)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toLocaleString();
}
