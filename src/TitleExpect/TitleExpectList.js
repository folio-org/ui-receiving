import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';

import { TITLE_EXPECT_PIECES_VISIBLE_COLUMNS } from './constants';
import {
  getColumnMapping,
  getResultFormatter,
} from './utils';

export const TitleExpectList = ({ fields, props: { pieceLocationMap, pieceHoldingMap, toggleCheckedAll } }) => {
  const intl = useIntl();

  const field = fields.name;
  const isAllChecked = useMemo(() => fields.value.every(({ checked }) => !!checked), [fields]);

  const formatter = useMemo(() => {
    return getResultFormatter({ field, intl, pieceHoldingMap, pieceLocationMap });
  }, [field, intl, pieceHoldingMap, pieceLocationMap]);

  const toggleAll = useCallback(() => {
    toggleCheckedAll(!isAllChecked);
  }, [isAllChecked, toggleCheckedAll]);

  const columnMapping = useMemo(() => {
    return getColumnMapping({ intl, isAllChecked, toggleAll });
  }, [intl, isAllChecked, toggleAll]);

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={fields.value}
      formatter={formatter}
      id="title-expect-list"
      interactive={false}
      totalCount={fields.value.length}
      visibleColumns={TITLE_EXPECT_PIECES_VISIBLE_COLUMNS}
    />
  );
};

TitleExpectList.propTypes = {
  fields: PropTypes.object.isRequired,
  props: PropTypes.shape({
    pieceLocationMap: PropTypes.object,
    pieceHoldingMap: PropTypes.object,
    toggleCheckedAll: PropTypes.func.isRequired,
  }).isRequired,
};
