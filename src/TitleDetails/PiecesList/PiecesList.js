import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  MultiColumnList,
  Tooltip,
} from '@folio/stripes/components';
import { FolioFormattedDate } from '@folio/stripes-acq-components';

import { PIECE_FORMAT_LABELS } from '../constants';

import styles from './PiecesList.css';

const columnMapping = {
  barcode: <FormattedMessage id="ui-receiving.piece.barcode" />,
  caption: <FormattedMessage id="ui-receiving.piece.caption" />,
  format: <FormattedMessage id="ui-receiving.piece.format" />,
  receiptDate: <FormattedMessage id="ui-receiving.piece.receiptDate" />,
  receivedDate: <FormattedMessage id="ui-receiving.piece.receivedDate" />,
  request: <FormattedMessage id="ui-receiving.piece.request" />,
  actions: null,
};

const PiecesList = ({ pieces, items, requests, visibleColumns, renderActions }) => {
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
    barcode: piece => items.find(item => item.id === piece.itemId)?.barcode || '-',
    request: piece => (
      requests.find(request => request.itemId === piece.itemId)
        ? <FormattedMessage id="ui-receiving.piece.request.isOpened" />
        : '-'
    ),
    actions: renderActions,
  };

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={pieces}
      formatter={formatter}
      id="pieces-list"
      interactive={false}
      visibleColumns={visibleColumns}
    />
  );
};

PiecesList.propTypes = {
  pieces: PropTypes.arrayOf(PropTypes.object),
  items: PropTypes.arrayOf(PropTypes.object),
  requests: PropTypes.arrayOf(PropTypes.object),
  renderActions: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

PiecesList.defaultProps = {
  pieces: [],
  items: [],
  requests: [],
};

export default PiecesList;
