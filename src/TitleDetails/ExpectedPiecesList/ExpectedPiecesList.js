import React from 'react';
import PropTypes from 'prop-types';

import PiecesList from '../PiecesList';
import { ExpectedPiecesActions } from '../PiecesActions';

const visibleColumns = ['title', 'caption', 'format', 'receiptDate', 'actions'];

const ExpectedPiecesList = ({ pieces, title, onEditPiece, onReceivePiece }) => {
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
      renderActions={renderActions}
      title={title}
      visibleColumns={visibleColumns}
    />
  );
};

ExpectedPiecesList.propTypes = {
  onEditPiece: PropTypes.func.isRequired,
  onReceivePiece: PropTypes.func.isRequired,
  pieces: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
};

ExpectedPiecesList.defaultProps = {
  pieces: [],
};

export default ExpectedPiecesList;
