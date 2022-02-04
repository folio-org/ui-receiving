import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  NoValue,
} from '@folio/stripes/components';
import {
  acqRowFormatter,
  FolioFormattedDate,
  FrontendSortingMCL,
  PIECE_FORMAT_LABELS,
} from '@folio/stripes-acq-components';

import {
  PIECE_COLUMNS,
  PIECE_COLUMN_MAPPING,
} from '../constants';

const sorters = {
  [PIECE_COLUMNS.enumeration]: ({ enumeration }) => enumeration?.toLowerCase(),
  [PIECE_COLUMNS.receiptDate]: ({ receiptDate }) => receiptDate,
  [PIECE_COLUMNS.receivedDate]: ({ receivedDate }) => receivedDate,
};

const formatter = {
  [PIECE_COLUMNS.copyNumber]: piece => piece.copyNumber || <NoValue />,
  [PIECE_COLUMNS.caption]: piece => piece.caption || <NoValue />,
  [PIECE_COLUMNS.enumeration]: piece => piece.enumeration || <NoValue />,
  [PIECE_COLUMNS.chronology]: piece => piece.chronology || <NoValue />,
  [PIECE_COLUMNS.format]: piece => PIECE_FORMAT_LABELS[piece.format],
  [PIECE_COLUMNS.receiptDate]: piece => <FolioFormattedDate value={piece.receiptDate} />,
  [PIECE_COLUMNS.receivedDate]: piece => <FolioFormattedDate value={piece.receivedDate} utc={false} />,
  [PIECE_COLUMNS.comment]: piece => piece.comment || <NoValue />,
  [PIECE_COLUMNS.barcode]: piece => piece.barcode || <NoValue />,
  [PIECE_COLUMNS.request]: piece => (
    piece.request
      ? <FormattedMessage id="ui-receiving.piece.request.isOpened" />
      : <NoValue />
  ),
  selection: () => <Icon icon="caret-right" />,
};

const PiecesList = ({ pieces, id, selectPiece, visibleColumns, sortedColumn }) => {
  const hasRowClick = Boolean(selectPiece);
  const rowProps = useMemo(() => ({ alignLastColToEnd: hasRowClick }), [hasRowClick]);

  if (!pieces) return null;

  return (
    <FrontendSortingMCL
      columnMapping={PIECE_COLUMN_MAPPING}
      contentData={pieces}
      formatter={formatter}
      id={id}
      interactive={false}
      rowFormatter={acqRowFormatter}
      rowProps={rowProps}
      visibleColumns={visibleColumns}
      onRowClick={selectPiece}
      sortedColumn={sortedColumn}
      sorters={sorters}
      hasArrow
    />
  );
};

PiecesList.propTypes = {
  pieces: PropTypes.arrayOf(PropTypes.object),
  id: PropTypes.string,
  selectPiece: PropTypes.func,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  sortedColumn: PropTypes.string.isRequired,
};

export default PiecesList;
