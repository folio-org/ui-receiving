import React from 'react';
import PropTypes from 'prop-types';

import PiecesList from '../PiecesList';
import { ReceivedPiecesActions } from '../PiecesActions';

const visibleColumns = ['barcode', 'caption', 'format', 'receivedDate', 'request', 'actions'];

const ReceivedPiecesList = ({ pieces, items, requests, onUnreceivePiece }) => {
  const renderActions = (piece) => (
    <ReceivedPiecesActions
      onUnreceivePiece={onUnreceivePiece}
      receivedPiece={piece}
    />
  );

  return (
    <PiecesList
      pieces={pieces}
      items={items}
      requests={requests}
      visibleColumns={visibleColumns}
      renderActions={renderActions}
    />
  );
};

ReceivedPiecesList.propTypes = {
  onUnreceivePiece: PropTypes.func.isRequired,
  pieces: PropTypes.arrayOf(PropTypes.object),
  items: PropTypes.arrayOf(PropTypes.object),
  requests: PropTypes.arrayOf(PropTypes.object),
};

ReceivedPiecesList.defaultProps = {
  pieces: [],
  items: [],
  requests: [],
};

export default ReceivedPiecesList;
