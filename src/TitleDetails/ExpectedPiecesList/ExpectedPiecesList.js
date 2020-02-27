import React from 'react';
import PropTypes from 'prop-types';

import PiecesList from '../PiecesList';
import { ExpectedPiecesActions } from '../PiecesActions';

const visibleColumns = ['caption', 'format', 'receiptDate', 'request', 'actions'];

const ExpectedPiecesList = ({ pieces, onEditPiece }) => {
  const renderActions = (piece) => (
    <ExpectedPiecesActions
      expectedPiece={piece}
      onEditPiece={onEditPiece}
    />
  );

  return (
    <PiecesList
      pieces={pieces}
      renderActions={renderActions}
      visibleColumns={visibleColumns}
    />
  );
};

ExpectedPiecesList.propTypes = {
  onEditPiece: PropTypes.func.isRequired,
  pieces: PropTypes.arrayOf(PropTypes.object),
};

ExpectedPiecesList.defaultProps = {
  pieces: [],
};

export default ExpectedPiecesList;
