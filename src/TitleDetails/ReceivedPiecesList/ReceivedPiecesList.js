import React from 'react';
import PropTypes from 'prop-types';

import PiecesList from '../PiecesList';

const visibleColumns = ['barcode', 'caption', 'format', 'receivedDate', 'request'];

const ReceivedPiecesList = ({ pieces }) => {
  return (
    <PiecesList
      pieces={pieces}
      visibleColumns={visibleColumns}
    />
  );
};

ReceivedPiecesList.propTypes = {
  pieces: PropTypes.arrayOf(PropTypes.object),
};

ReceivedPiecesList.defaultProps = {
  pieces: [],
};

export default ReceivedPiecesList;
