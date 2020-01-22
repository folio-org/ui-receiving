import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { MultiColumnList } from '@folio/stripes/components';
import { FolioFormattedDate } from '@folio/stripes-acq-components';

const columnMapping = {
  title: <FormattedMessage id="ui-receiving.piece.title" />,
  caption: <FormattedMessage id="ui-receiving.piece.caption" />,
  format: <FormattedMessage id="ui-receiving.piece.format" />,
  receiptDate: <FormattedMessage id="ui-receiving.piece.receiptDate" />,
  receivedDate: <FormattedMessage id="ui-receiving.piece.receivedDate" />,
  actions: null,
};

const PiecesList = ({ pieces, title, visibleColumns, renderActions }) => {
  const formatter = {
    title: () => title,
    receiptDate: piece => <FolioFormattedDate value={piece.receiptDate} />,
    receivedDate: piece => <FolioFormattedDate value={piece.receivedDate} />,
    actions: renderActions,
  };

  return (
    <MultiColumnList
      columnMapping={columnMapping}
      contentData={pieces}
      formatter={formatter}
      id="pieces-list"
      interactive={false}
      visibleColumns={visibleColumns}
    />
  );
};

PiecesList.propTypes = {
  pieces: PropTypes.arrayOf(PropTypes.object),
  renderActions: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string,
};

PiecesList.defaultProps = {
  pieces: [],
};

export default PiecesList;
