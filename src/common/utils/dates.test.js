import { dayjs } from '@folio/stripes/components';

import {
  isAfterDay,
  isBeforeDay,
  isSameOrBeforeDay,
} from './dates';

describe('dates utility functions', () => {
  describe('isSameOrBeforeDay', () => {
    it('should return true when left day is before right day', () => {
      const leftDay = '2023-01-01';
      const rightDay = '2023-01-02';

      expect(isSameOrBeforeDay(leftDay, rightDay)).toBe(true);
    });

    it('should return true when days are the same', () => {
      const leftDay = '2023-01-01';
      const rightDay = '2023-01-01';

      expect(isSameOrBeforeDay(leftDay, rightDay)).toBe(true);
    });

    it('should return false when left day is after right day', () => {
      const leftDay = '2023-01-02';
      const rightDay = '2023-01-01';

      expect(isSameOrBeforeDay(leftDay, rightDay)).toBe(false);
    });

    it('should handle dayjs objects', () => {
      const leftDay = dayjs('2023-01-01');
      const rightDay = dayjs('2023-01-02');

      expect(isSameOrBeforeDay(leftDay, rightDay)).toBe(true);
    });
  });

  describe('isBeforeDay', () => {
    it('should return true when left day is before right day', () => {
      const leftDay = '2023-01-01';
      const rightDay = '2023-01-02';

      expect(isBeforeDay(leftDay, rightDay)).toBe(true);
    });

    it('should return false when days are the same', () => {
      const leftDay = '2023-01-01';
      const rightDay = '2023-01-01';

      expect(isBeforeDay(leftDay, rightDay)).toBe(false);
    });

    it('should return false when left day is after right day', () => {
      const leftDay = '2023-01-02';
      const rightDay = '2023-01-01';

      expect(isBeforeDay(leftDay, rightDay)).toBe(false);
    });

    it('should handle dayjs objects', () => {
      const leftDay = dayjs('2023-01-01');
      const rightDay = dayjs('2023-01-02');

      expect(isBeforeDay(leftDay, rightDay)).toBe(true);
    });
  });

  describe('isAfterDay', () => {
    it('should return false when left day is before right day', () => {
      const leftDay = '2023-01-01';
      const rightDay = '2023-01-02';

      expect(isAfterDay(leftDay, rightDay)).toBe(false);
    });

    it('should return false when days are the same', () => {
      const leftDay = '2023-01-01';
      const rightDay = '2023-01-01';

      expect(isAfterDay(leftDay, rightDay)).toBe(false);
    });

    it('should return true when left day is after right day', () => {
      const leftDay = '2023-01-02';
      const rightDay = '2023-01-01';

      expect(isAfterDay(leftDay, rightDay)).toBe(true);
    });

    it('should handle dayjs objects', () => {
      const leftDay = dayjs('2023-01-02');
      const rightDay = dayjs('2023-01-01');

      expect(isAfterDay(leftDay, rightDay)).toBe(true);
    });
  });
});
