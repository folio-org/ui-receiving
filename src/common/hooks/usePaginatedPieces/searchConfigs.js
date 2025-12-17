import { dayjs } from '@folio/stripes/components';
import { DATE_FORMAT } from '@folio/stripes-acq-components';

const indexes = [
  'barcode',
  'displaySummary',
  'chronology',
  'comment',
  'copyNumber',
  'enumeration',
  'receiptDate',
  'receivedDate',
];

export const searchByDate = (dateFormat, query) => {
  const isoDate = dayjs.utc(query, dateFormat).format(DATE_FORMAT);

  return `${isoDate}*`;
};

export const makeKeywordQueryBuilder = dateFormat => query => {
  const queryFormatters = {
    receiptDate: searchByDate.bind(null, dateFormat),
    receivedDate: searchByDate.bind(null, dateFormat),
  };

  return indexes.reduce(
    (acc, sIndex) => {
      const formattedQuery = queryFormatters[sIndex] ? queryFormatters[sIndex](query) : query;

      if (acc) {
        return `${acc} or ${sIndex}=="*${formattedQuery}*"`;
      } else {
        return `${sIndex}=="*${formattedQuery}*"`;
      }
    },
    '',
  );
};
