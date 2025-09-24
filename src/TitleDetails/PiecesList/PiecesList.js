import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import { useMemo } from 'react';

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
  applySorting,
  columnIdPrefix,
  id,
  initialSorting,
  isLoading,
  onNeedMoreData,
  pagination,
  pieces,
  selectPiece,
  totalCount,
  visibleColumns,
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
        columnIdPrefix={columnIdPrefix}
        columnMapping={PIECE_COLUMN_MAPPING}
        contentData={pieces}
        formatter={formatter}
        id={id}
        interactive={false}
        loading={isLoading}
        nonInteractiveHeaders={[...nonInteractiveHeaders, 'arrow']}
        onHeaderClick={onHeaderClick}
        onRowClick={selectPiece}
        rowFormatter={acqRowFormatter}
        rowProps={rowProps}
        sortDirection={sortingDirection || initialSorting?.sortingDirection}
        sortedColumn={sortingField || initialSorting?.sorting}
        totalCount={totalCount}
        visibleColumns={[...visibleColumns, 'arrow']}
      />

      {pieces.length > 0 && (
        <PrevNextPagination
          disabled={isLoading}
          onChange={onPageChange}
          totalCount={totalCount}
          {...pagination}
        />
      )}
    </>
  );
};

PiecesList.propTypes = {
  applySorting: PropTypes.func.isRequired,
  columnIdPrefix: PropTypes.string,
  id: PropTypes.string,
  initialSorting: PropTypes.shape({
    sorting: PropTypes.string,
    sortingDirection: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  onNeedMoreData: PropTypes.func,
  pagination: PropTypes.shape({
    limit: PropTypes.number,
    offset: PropTypes.number,
  }),
  pieces: PropTypes.arrayOf(PropTypes.object),
  selectPiece: PropTypes.func,
  totalCount: PropTypes.number,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PiecesList;
