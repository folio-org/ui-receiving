import React from 'react';
import PropTypes from 'prop-types';

import { PIECE_COLUMNS } from '../constants';
import PiecesList from '../PiecesList';

const visibleColumns = ['barcode', PIECE_COLUMNS.caption, 'format', PIECE_COLUMNS.receivedDate, 'request', 'selection'];

const ReceivedPiecesList = ({ pieces, selectPiece }) => {
  return (
    <PiecesList
      pieces={pieces}
      selectPiece={selectPiece}
      visibleColumns={visibleColumns}
      sortedColumn={PIECE_COLUMNS.receivedDate}
    />
  );
};

ReceivedPiecesList.propTypes = {
  pieces: PropTypes.arrayOf(PropTypes.object),
  selectPiece: PropTypes.func.isRequired,
};

export default ReceivedPiecesList;
