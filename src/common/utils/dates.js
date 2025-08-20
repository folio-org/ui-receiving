import { dayjs } from '@folio/stripes/components';

export const isSameOrBeforeDay = (leftDay, rightDay) => {
  return dayjs(leftDay).isSameOrBefore(dayjs(rightDay).startOf('day'), 'day');
};

export const isBeforeDay = (leftDay, rightDay) => {
  return dayjs(leftDay).isBefore(dayjs(rightDay).startOf('day'), 'day');
};

export const isAfterDay = (leftDay, rightDay) => {
  return dayjs(leftDay).isAfter(dayjs(rightDay).startOf('day'), 'day');
};
