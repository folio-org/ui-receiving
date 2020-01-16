import React from 'react';
import PropTypes from 'prop-types';

import PiecesList from '../PiecesList';

const visibleColumns = ['title', 'caption', 'format', 'receiptDate'];

const ExpectedPiecesList = ({ pieces, title }) => {
  return (
    <PiecesList
      title={title}
      pieces={pieces}
      visibleColumns={visibleColumns}
    />
  );
};

ExpectedPiecesList.propTypes = {
  pieces: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
};

ExpectedPiecesList.defaultProps = {
  pieces: [],
};

export default ExpectedPiecesList;
