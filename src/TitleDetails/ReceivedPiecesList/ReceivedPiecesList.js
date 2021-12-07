import React from 'react';
import PropTypes from 'prop-types';

import { PIECE_COLUMNS } from '../constants';
import PiecesList from '../PiecesList';

const ReceivedPiecesList = ({ pieces, selectPiece, visibleColumns }) => {
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
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ReceivedPiecesList;
