import React from 'react';
import PropTypes from 'prop-types';

import { PIECE_COLUMNS } from '../constants';
import PiecesList from '../PiecesList';

const ExpectedPiecesList = ({ pieces, selectPiece, visibleColumns }) => {
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
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
};

ExpectedPiecesList.defaultProps = {
  pieces: [],
};

export default ExpectedPiecesList;
