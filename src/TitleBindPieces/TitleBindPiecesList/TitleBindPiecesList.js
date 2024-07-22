import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import { useIntl } from 'react-intl';

import {
  Checkbox,
  MultiColumnList,
} from '@folio/stripes/components';

import { PIECE_COLUMN_MAPPING } from '../../Piece';
import { VISIBLE_COLUMNS } from '../constants';
import { getPieceColumnFormatter } from '../utils';

export const TitleBindPiecesList = ({ fields, props: { toggleCheckedAll } }) => {
  const intl = useIntl();

  const field = fields.name;
  const formatter = useMemo(() => getPieceColumnFormatter({ intl, field }), [field, intl]);
  const isAllChecked = useMemo(() => fields.value.every(({ checked }) => !!checked), [fields.value]);
  const toggleAll = useCallback(() => toggleCheckedAll(!isAllChecked), [isAllChecked, toggleCheckedAll]);

  const columnMapping = useMemo(() => ({
    checked: (
      <Checkbox
        checked={isAllChecked}
        onChange={toggleAll}
        aria-label={intl.formatMessage({ id: 'ui-receiving.piece.actions.selectAll' })}
      />
    ),
    ...PIECE_COLUMN_MAPPING,
  }), [intl, isAllChecked, toggleAll]);

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={fields.value}
      formatter={formatter}
      id="bind-pieces-list"
      interactive={false}
      totalCount={fields.value.length}
      visibleColumns={VISIBLE_COLUMNS}
    />
  );
};

TitleBindPiecesList.propTypes = {
  fields: PropTypes.object.isRequired,
  props: PropTypes.shape({
    pieceLocationMap: PropTypes.object,
    pieceHoldingMap: PropTypes.object,
    toggleCheckedAll: PropTypes.func.isRequired,
  }).isRequired,
};
