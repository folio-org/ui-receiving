import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';
import { Field } from 'react-final-form';
import { useIntl } from 'react-intl';

import {
  Checkbox,
  MultiColumnList,
} from '@folio/stripes/components';

import {
  COLUMN_FORMATTER,
  COLUMN_MAPPING,
  VISIBLE_COLUMNS,
} from './constants';

export const TitleBindPiecesList = ({ fields, props: { toggleCheckedAll } }) => {
  const intl = useIntl();

  const field = fields.name;
  const cellFormatters = useMemo(
    () => {
      return {
        checked: record => (
          <Field
            name={`${field}[${record.rowIndex}].checked`}
            component={Checkbox}
            type="checkbox"
            aria-label={intl.formatMessage({ id: 'ui-receiving.piece.actions.select' })}
          />
        ),
        ...COLUMN_FORMATTER,
      };
    },
    [field, intl],
  );

  const isAllChecked = useMemo(() => fields.value.every(({ checked }) => !!checked), [fields.value]);
  const toggleAll = useCallback(
    () => {
      toggleCheckedAll(!isAllChecked);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAllChecked],
  );

  const columnMapping = useMemo(
    () => ({
      checked: (
        <Checkbox
          checked={isAllChecked}
          data-test-unreceive-title-checked
          onChange={toggleAll}
          aria-label={intl.formatMessage({ id: 'ui-receiving.piece.actions.selectAll' })}
        />
      ),
      ...COLUMN_MAPPING,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isAllChecked, toggleAll],
  );

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={fields.value}
      formatter={cellFormatters}
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
