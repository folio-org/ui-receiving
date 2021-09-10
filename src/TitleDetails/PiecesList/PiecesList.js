import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  NoValue,
  Tooltip,
} from '@folio/stripes/components';
import {
  acqRowFormatter,
  FolioFormattedDate,
  FrontendSortingMCL,
  PIECE_FORMAT_LABELS,
} from '@folio/stripes-acq-components';

import { PIECE_COLUMNS } from '../constants';
import styles from './PiecesList.css';

const sorters = {
  [PIECE_COLUMNS.enumeration]: ({ enumeration }) => enumeration?.toLowerCase(),
  [PIECE_COLUMNS.receiptDate]: ({ receiptDate }) => receiptDate,
  [PIECE_COLUMNS.receivedDate]: ({ receivedDate }) => receivedDate,
};
const columnMapping = {
  [PIECE_COLUMNS.copyNumber]: <FormattedMessage id="ui-receiving.piece.copyNumber" />,
  [PIECE_COLUMNS.chronology]: <FormattedMessage id="ui-receiving.piece.chronology" />,
  [PIECE_COLUMNS.caption]: <FormattedMessage id="ui-receiving.piece.caption" />,
  barcode: <FormattedMessage id="ui-receiving.piece.barcode" />,
  [PIECE_COLUMNS.enumeration]: <FormattedMessage id="ui-receiving.piece.enumeration" />,
  format: <FormattedMessage id="ui-receiving.piece.format" />,
  [PIECE_COLUMNS.receiptDate]: <FormattedMessage id="ui-receiving.piece.receiptDate" />,
  [PIECE_COLUMNS.receivedDate]: <FormattedMessage id="ui-receiving.piece.receivedDate" />,
  request: <FormattedMessage id="ui-receiving.piece.request" />,
  selection: null,
};

const formatter = {
  [PIECE_COLUMNS.copyNumber]: piece => piece.copyNumber || <NoValue />,
  [PIECE_COLUMNS.caption]: piece => piece.caption || <NoValue />,
  [PIECE_COLUMNS.enumeration]: piece => piece.enumeration || <NoValue />,
  format: piece => (
    <span>
      {PIECE_FORMAT_LABELS[piece.format]}
      {
        Boolean(piece.comment) && (
          <Tooltip
            id={`piece-comment-${piece.id}`}
            text={piece.comment}
          >
            {({ ref, ariaIds }) => (
              <Icon
                ref={ref}
                size="small"
                icon="comment"
                ariaLabel={ariaIds.text}
                iconClassName={styles.pieceComment}
              />
            )}
          </Tooltip>
        )
      }
    </span>
  ),
  [PIECE_COLUMNS.receiptDate]: piece => <FolioFormattedDate value={piece.receiptDate} />,
  [PIECE_COLUMNS.receivedDate]: piece => <FolioFormattedDate value={piece.receivedDate} />,
  barcode: piece => piece.barcode || <NoValue />,
  request: piece => (
    piece.request
      ? <FormattedMessage id="ui-receiving.piece.request.isOpened" />
      : <NoValue />
  ),
  selection: () => <Icon icon="caret-right" />,
};

const PiecesList = ({ pieces, id, visibleColumns, selectPiece, sortedColumn }) => {
  const hasRowClick = Boolean(selectPiece);
  const rowProps = useMemo(() => ({ alignLastColToEnd: hasRowClick }), [hasRowClick]);

  if (!pieces) return null;

  return (
    <FrontendSortingMCL
      columnMapping={columnMapping}
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
