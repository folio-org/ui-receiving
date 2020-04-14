import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  MultiColumnList,
  Tooltip,
} from '@folio/stripes/components';
import {
  acqRowFormatter,
  FolioFormattedDate,
} from '@folio/stripes-acq-components';

import { PIECE_FORMAT_LABELS } from '../../common/constants';
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
  barcode: piece => piece.barcode || '-',
  request: piece => (
    piece.request
      ? <FormattedMessage id="ui-receiving.piece.request.isOpened" />
      : '-'
  ),
  selection: () => <Icon icon="caret-right" />,
};

const PiecesList = ({ pieces, id, visibleColumns, selectPiece }) => {
  const onRowClick = useCallback((e, piece) => selectPiece && selectPiece(piece), [selectPiece]);
  const hasRowClick = Boolean(selectPiece);
  const rowProps = useMemo(() => ({ alignLastColToEnd: hasRowClick }), [hasRowClick]);

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
      onRowClick={selectPiece ? onRowClick : undefined}
    />
  );
};

PiecesList.propTypes = {
  pieces: PropTypes.arrayOf(PropTypes.object),
  id: PropTypes.string,
  selectPiece: PropTypes.func,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

PiecesList.defaultProps = {
  pieces: [],
};

export default PiecesList;
