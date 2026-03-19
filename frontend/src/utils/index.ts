import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';

export const formatDate = (date: string | Date | null | undefined): string => {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'dd/MM/yyyy', { locale: vi });
  } catch { return '—'; }
};

export const formatCurrency = (value: number | null | undefined): string => {
  if (value == null) return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

export const formatSalary = (value: number | null | undefined): string => {
  if (value == null) return '—';
  return `${(value / 1_000_000).toFixed(0)} triệu`;
};

export const getInitials = (name: string): string => {
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(-2).join('').toUpperCase();
};

export const AVATAR_COLORS = [
  { bg: 'rgba(79,142,247,0.18)', color: '#4f8ef7' },
  { bg: 'rgba(124,92,252,0.18)', color: '#7c5cfc' },
  { bg: 'rgba(34,200,122,0.18)', color: '#22c87a' },
  { bg: 'rgba(245,166,35,0.18)', color: '#f5a623' },
  { bg: 'rgba(242,92,92,0.18)', color: '#f25c5c' },
  { bg: 'rgba(14,165,233,0.18)', color: '#0ea5e9' },
];

export const getAvatarColor = (name: string) => {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
};

export const CONTRACT_TYPE_LABEL: Record<string, string> = {
  'full-time': 'Toàn thời gian',
  'part-time': 'Bán thời gian',
  'probation': 'Thử việc',
};

export const STATUS_LABEL: Record<string, string> = {
  active: 'Đang làm',
  inactive: 'Nghỉ việc',
  'on-leave': 'Nghỉ phép',
};

export const STAGE_LABEL: Record<string, string> = {
  applied: 'Đã nộp',
  screening: 'Sàng lọc',
  interview: 'Phỏng vấn',
  offer: 'Đề xuất',
  hired: 'Đã tuyển',
  rejected: 'Từ chối',
};

export const JOB_TYPE_LABEL: Record<string, string> = {
  'full-time': 'Toàn thời gian',
  'part-time': 'Bán thời gian',
  'internship': 'Thực tập',
};
