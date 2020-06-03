import React from 'react';
import PropTypes from 'prop-types';

import PiecesList from '../PiecesList';

const visibleColumns = ['barcode', 'caption', 'format', 'receivedDate', 'request', 'selection'];

const ReceivedPiecesList = ({ pieces, selectPiece }) => {
  return (
    <PiecesList
      pieces={pieces}
      selectPiece={selectPiece}
      visibleColumns={visibleColumns}
    />
  );
};

ReceivedPiecesList.propTypes = {
  pieces: PropTypes.arrayOf(PropTypes.object),
  selectPiece: PropTypes.func.isRequired,
};

export default ReceivedPiecesList;
