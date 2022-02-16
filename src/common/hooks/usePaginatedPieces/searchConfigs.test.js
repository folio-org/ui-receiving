import {
  makeKeywordQueryBuilder,
  searchByDate,
} from './searchConfigs';

describe('makeKeywordQueryBuilder', () => {
  it(
    'should return a function that creates a keyword query string based on indexes and an initial query',
    () => {
      const searchQuery = '1212';
      const dateFormat = 'MM/DD/YYYY';

      expect(makeKeywordQueryBuilder(dateFormat)(searchQuery)).toEqual(
        `caption=="*${searchQuery}*" or chronology=="*${searchQuery}*" or comment=="*${searchQuery}*" or ` +
        `copyNumber=="*${searchQuery}*" or enumeration=="*${searchQuery}*" or ` +
        `receiptDate=="*${searchByDate(dateFormat, searchQuery)}*" or receivedDate=="*${searchByDate(dateFormat, searchQuery)}*"`,
      );
    },
  );
});
