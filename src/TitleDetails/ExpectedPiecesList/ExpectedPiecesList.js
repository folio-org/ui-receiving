import React from 'react';
import PropTypes from 'prop-types';

import PiecesList from '../PiecesList';

const visibleColumns = ['caption', 'format', 'receiptDate', 'request', 'selection'];

const ExpectedPiecesList = ({ pieces, selectPiece }) => {
  return (
    <PiecesList
      pieces={pieces}
      selectPiece={selectPiece}
      visibleColumns={visibleColumns}
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
