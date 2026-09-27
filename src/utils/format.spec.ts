import { describe, it, expect } from 'vitest';
import { emailToTitleCase } from './nameFormat';
import { formatChatListTime, formatMessageTime } from './dateFormat';

describe('emailToTitleCase', () => {
  it('converts email prefix with underscore to Title Case', () => {
    expect(emailToTitleCase('chris_evans@example.com')).toBe('Chris Evans');
  });

  it('converts email prefix with dot to Title Case', () => {
    expect(emailToTitleCase('tony.stark@marvel.com')).toBe('Tony Stark');
  });

  it('converts single word email prefix to Title Case', () => {
    expect(emailToTitleCase('batman@wayne.enterprises')).toBe('Batman');
  });

  it('handles multiple separators properly', () => {
    expect(emailToTitleCase('peter_parker-spider@dailybugle.com')).toBe('Peter Parker Spider');
  });
});

describe('formatChatListTime', () => {
  it('returns "just now" for dates within 60 seconds', () => {
    const recent = new Date(Date.now() - 30 * 1000).toISOString();
    expect(formatChatListTime(recent)).toBe('just now');
  });

  it('returns HH:mm for timestamps on the same day (> 1 min)', () => {
    const today = new Date();
    today.setHours(13, 5, 0, 0);
    if (Math.abs(Date.now() - today.getTime()) < 60000) {
      today.setHours(today.getHours() - 1);
    }
    const formatted = formatChatListTime(today);
    expect(formatted).toMatch(/^\d{2}:\d{2}$/);
  });

  it('returns "d Mmm" format for previous dates', () => {
    const pastDate = new Date(2025, 9, 10, 10, 0, 0);
    expect(formatChatListTime(pastDate)).toBe('10 Oct');
  });
});

describe('formatMessageTime', () => {
  it('formats time in HH:mm format', () => {
    const date = new Date(2026, 0, 1, 14, 30);
    expect(formatMessageTime(date)).toBe('14:30');
  });
});
