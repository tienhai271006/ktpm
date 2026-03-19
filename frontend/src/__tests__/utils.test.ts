import { formatDate, formatCurrency, formatSalary, getInitials, getAvatarColor, AVATAR_COLORS } from '../utils';

describe('formatDate', () => {
  it('formats ISO date string to dd/MM/yyyy', () => {
    expect(formatDate('2024-03-15')).toBe('15/03/2024');
  });
  it('returns — for null', () => {
    expect(formatDate(null)).toBe('—');
  });
  it('returns — for undefined', () => {
    expect(formatDate(undefined)).toBe('—');
  });
  it('returns — for invalid date', () => {
    expect(formatDate('not-a-date')).toBe('—');
  });
});

describe('formatCurrency', () => {
  it('formats to VND', () => {
    const result = formatCurrency(25000000);
    expect(result).toContain('25');
    expect(result).toContain('000');
  });
  it('returns — for null', () => {
    expect(formatCurrency(null)).toBe('—');
  });
});

describe('formatSalary', () => {
  it('converts to triệu', () => {
    expect(formatSalary(25000000)).toBe('25 triệu');
  });
  it('returns — for null', () => {
    expect(formatSalary(null)).toBe('—');
  });
});

describe('getInitials', () => {
  it('extracts last 2 initials', () => {
    expect(getInitials('Nguyễn Văn An')).toBe('VA');
  });
  it('handles single name', () => {
    expect(getInitials('Admin')).toBe('AD');
  });
});

describe('getAvatarColor', () => {
  it('returns a valid color object', () => {
    const color = getAvatarColor('Nguyễn Văn An');
    expect(color).toHaveProperty('bg');
    expect(color).toHaveProperty('color');
    expect(AVATAR_COLORS).toContain(color);
  });
  it('is deterministic for same name', () => {
    expect(getAvatarColor('Test')).toEqual(getAvatarColor('Test'));
  });
});
