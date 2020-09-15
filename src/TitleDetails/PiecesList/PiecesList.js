import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  MultiColumnList,
  NoValue,
  Tooltip,
} from '@folio/stripes/components';
import {
  acqRowFormatter,
  FolioFormattedDate,
  PIECE_FORMAT_LABELS,
} from '@folio/stripes-acq-components';

import styles from './PiecesList.css';

const columnMapping = {
  barcode: <FormattedMessage id="ui-receiving.piece.barcode" />,
  caption: <FormattedMessage id="ui-receiving.piece.caption" />,
  format: <FormattedMessage id="ui-receiving.piece.format" />,
  receiptDate: <FormattedMessage id="ui-receiving.piece.receiptDate" />,
  receivedDate: <FormattedMessage id="ui-receiving.piece.receivedDate" />,
  request: <FormattedMessage id="ui-receiving.piece.request" />,
  selection: null,
};

const formatter = {
  caption: piece => piece.caption || <NoValue />,
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
  receiptDate: piece => <FolioFormattedDate value={piece.receiptDate} />,
  receivedDate: piece => <FolioFormattedDate value={piece.receivedDate} />,
  barcode: piece => piece.barcode || <NoValue />,
  request: piece => (
    piece.request
      ? <FormattedMessage id="ui-receiving.piece.request.isOpened" />
      : <NoValue />
  ),
  selection: () => <Icon icon="caret-right" />,
};

const PiecesList = ({ pieces, id, visibleColumns, selectPiece }) => {
  const hasRowClick = Boolean(selectPiece);
  const rowProps = useMemo(() => ({ alignLastColToEnd: hasRowClick }), [hasRowClick]);

  if (!pieces) return null;

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={pieces}
      formatter={formatter}
      id={id}
      interactive={false}
      rowFormatter={acqRowFormatter}
      rowProps={rowProps}
      visibleColumns={visibleColumns}
      onRowClick={selectPiece}
    />
  );
};

PiecesList.propTypes = {
  pieces: PropTypes.arrayOf(PropTypes.object),
  id: PropTypes.string,
  selectPiece: PropTypes.func,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PiecesList;
