import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
} from '@folio/stripes/components';

export function TitleDetailsExpectedActions({ checkinItems, openAddPieceModal, openReceiveList, hasReceive }) {
  return (
    <>
      {hasReceive && (
        <Button
          data-test-title-receive-button
          onClick={openReceiveList}
        >
          <FormattedMessage id="ui-receiving.title.details.button.receive" />
        </Button>
      )}
      {checkinItems && (
        <Button
          data-test-add-piece-button
          onClick={openAddPieceModal}
        >
          <FormattedMessage id="ui-receiving.piece.button.addPiece" />
        </Button>
      )}
    </>
  );
}

TitleDetailsExpectedActions.propTypes = {
  checkinItems: PropTypes.bool.isRequired,
  hasReceive: PropTypes.bool.isRequired,
  openAddPieceModal: PropTypes.func.isRequired,
  openReceiveList: PropTypes.func.isRequired,
};
