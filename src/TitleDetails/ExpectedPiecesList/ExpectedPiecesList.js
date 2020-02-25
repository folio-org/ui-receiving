import React from 'react';
import PropTypes from 'prop-types';

import PiecesList from '../PiecesList';
import { ExpectedPiecesActions } from '../PiecesActions';

const visibleColumns = ['caption', 'format', 'receiptDate', 'request', 'actions'];

const ExpectedPiecesList = ({ pieces, requests, onEditPiece, onReceivePiece }) => {
  const renderActions = (piece) => (
    <ExpectedPiecesActions
      expectedPiece={piece}
      onEditPiece={onEditPiece}
      onReceivePiece={onReceivePiece}
    />
  );

  return (
    <PiecesList
      pieces={pieces}
      requests={requests}
      renderActions={renderActions}
      visibleColumns={visibleColumns}
    />
  );
};

ExpectedPiecesList.propTypes = {
  onEditPiece: PropTypes.func.isRequired,
  onReceivePiece: PropTypes.func.isRequired,
  pieces: PropTypes.arrayOf(PropTypes.object),
  requests: PropTypes.arrayOf(PropTypes.object),
};

ExpectedPiecesList.defaultProps = {
  pieces: [],
  requests: [],
};

export default ExpectedPiecesList;
