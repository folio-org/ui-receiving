import React from 'react';
import PropTypes from 'prop-types';

import PiecesList from '../PiecesList';

const visibleColumns = ['title', 'caption', 'format', 'receivedDate'];

const ReceivedPiecesList = ({ pieces, title }) => {
  return (
    <PiecesList
      title={title}
      pieces={pieces}
      visibleColumns={visibleColumns}
    />
  );
};

ReceivedPiecesList.propTypes = {
  pieces: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
};

ReceivedPiecesList.defaultProps = {
  pieces: [],
};

export default ReceivedPiecesList;
