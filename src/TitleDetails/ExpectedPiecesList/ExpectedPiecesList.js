import React from 'react';
import PropTypes from 'prop-types';

import PiecesList from '../PiecesList';
import { ExpectedPiecesActions } from '../PiecesActions';

const visibleColumns = ['caption', 'format', 'receiptDate', 'request', 'actions'];

const ExpectedPiecesList = ({ pieces, requests, onEditPiece }) => {
  const renderActions = (piece) => (
    <ExpectedPiecesActions
      expectedPiece={piece}
      onEditPiece={onEditPiece}
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
  pieces: PropTypes.arrayOf(PropTypes.object),
  requests: PropTypes.arrayOf(PropTypes.object),
};

ExpectedPiecesList.defaultProps = {
  pieces: [],
  requests: [],
};

export default ExpectedPiecesList;
