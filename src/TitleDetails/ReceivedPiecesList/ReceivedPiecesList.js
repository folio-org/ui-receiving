import React from 'react';
import PropTypes from 'prop-types';

import PiecesList from '../PiecesList';
import ReceivedPiecesActions from '../PiecesActions';

const visibleColumns = ['title', 'caption', 'format', 'receivedDate', 'actions'];

const ReceivedPiecesList = ({ pieces, title, onUnreceivePiece }) => {
  const renderActions = (piece) => (
    <ReceivedPiecesActions
      onUnreceivePiece={onUnreceivePiece}
      receivedPiece={piece}
    />
  );

  return (
    <PiecesList
      title={title}
      pieces={pieces}
      visibleColumns={visibleColumns}
      renderActions={renderActions}
    />
  );
};

ReceivedPiecesList.propTypes = {
  onUnreceivePiece: PropTypes.func.isRequired,
  pieces: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
};

ReceivedPiecesList.defaultProps = {
  pieces: [],
};

export default ReceivedPiecesList;
