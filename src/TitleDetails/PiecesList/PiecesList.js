import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { noop } from 'lodash';

import {
  Checkbox,
  Icon,
  MultiColumnList,
  NoValue,
} from '@folio/stripes/components';
import {
  acqRowFormatter,
  FolioFormattedDate,
  PrevNextPagination,
  useSorting,
} from '@folio/stripes-acq-components';

import {
  PIECE_COLUMN_BASE_FORMATTER,
  PIECE_COLUMNS,
  PIECE_COLUMN_MAPPING,
  SORTABLE_COLUMNS,
} from '../../Piece';

const formatter = {
  ...PIECE_COLUMN_BASE_FORMATTER,
  [PIECE_COLUMNS.enumeration]: piece => piece.enumeration || <NoValue />,
  [PIECE_COLUMNS.chronology]: piece => piece.chronology || <NoValue />,
  [PIECE_COLUMNS.receiptDate]: piece => <FolioFormattedDate value={piece.receiptDate} />,
  [PIECE_COLUMNS.receivedDate]: piece => <FolioFormattedDate value={piece.receivedDate} utc={false} />,
  [PIECE_COLUMNS.comment]: piece => piece.comment || <NoValue />,
  [PIECE_COLUMNS.locationName]: piece => piece?.locationName || <NoValue />,
  [PIECE_COLUMNS.displayToPublic]: piece => (
    <Checkbox
      checked={!!piece?.displayToPublic}
      disabled
    />
  ),
  selection: () => <Icon icon="caret-right" />,
  arrow: (record) => <Icon data-testid={`arrow-${record.rowIndex}`} icon="caret-right" />,
};

const PiecesList = ({
  id,
  columnIdPrefix,
  isLoading,
  pieces,
  totalCount,
  onNeedMoreData,
  applySorting,
  pagination,
  visibleColumns,
  selectPiece,
}) => {
  const [sortingField, sortingDirection, changeSorting] = useSorting(noop, SORTABLE_COLUMNS);

  const hasRowClick = Boolean(selectPiece);
  const rowProps = useMemo(() => ({ alignLastColToEnd: hasRowClick }), [hasRowClick]);
  const nonInteractiveHeaders = useMemo(
    () => visibleColumns.filter(col => !SORTABLE_COLUMNS.includes(col)),
    [visibleColumns],
  );

  const onPageChange = newPagination => {
    onNeedMoreData({ ...newPagination, timestamp: new Date() });
  };
  const onHeaderClick = (e, meta) => {
    applySorting(changeSorting(e, meta));
    onPageChange({ ...pagination, offset: 0 });
  };

  if (!pieces) return null;

  return (
    <>
      <MultiColumnList
        id={id}
        columnIdPrefix={columnIdPrefix}
        contentData={pieces}
        totalCount={totalCount}
        columnMapping={PIECE_COLUMN_MAPPING}
        visibleColumns={[...visibleColumns, 'arrow']}
        formatter={formatter}
        interactive={false}
        onRowClick={selectPiece}
        rowFormatter={acqRowFormatter}
        rowProps={rowProps}
        nonInteractiveHeaders={[...nonInteractiveHeaders, 'arrow']}
        onHeaderClick={onHeaderClick}
        sortDirection={sortingDirection}
        sortedColumn={sortingField}
      />

      {pieces.length > 0 && (
        <PrevNextPagination
          {...pagination}
          totalCount={totalCount}
          disabled={isLoading}
          onChange={onPageChange}
        />
      )}
    </>
  );
};

PiecesList.propTypes = {
  pieces: PropTypes.arrayOf(PropTypes.object),
  id: PropTypes.string,
  columnIdPrefix: PropTypes.string,
  selectPiece: PropTypes.func,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortedColumn: PropTypes.string.isRequired,
  isLoading: PropTypes.bool,
  totalCount: PropTypes.number,
  pagination: PropTypes.object,
  onNeedMoreData: PropTypes.func,
  applySorting: PropTypes.func.isRequired,
};

export default PiecesList;
