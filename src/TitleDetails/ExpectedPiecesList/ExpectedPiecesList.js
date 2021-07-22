import React from 'react';
import PropTypes from 'prop-types';

import { PIECE_COLUMNS } from '../constants';
import PiecesList from '../PiecesList';

const visibleColumns = [PIECE_COLUMNS.caption, 'format', PIECE_COLUMNS.receiptDate, 'request', 'selection'];

const ExpectedPiecesList = ({ pieces, selectPiece }) => {
  return (
    <PiecesList
      pieces={pieces}
      selectPiece={selectPiece}
      visibleColumns={visibleColumns}
      sortedColumn={PIECE_COLUMNS.receiptDate}
    />
  );
};

ExpectedPiecesList.propTypes = {
  selectPiece: PropTypes.func.isRequired,
  pieces: PropTypes.arrayOf(PropTypes.object),
};

ExpectedPiecesList.defaultProps = {
  pieces: [],
};

export default ExpectedPiecesList;
