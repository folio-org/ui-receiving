import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Button,
} from '@folio/stripes/components';

export function TitleDetailsExpectedActions({
  openAddPieceModal,
  openReceiveList,
  hasReceive,
  disabled,
}) {
  return (
    <>
      {hasReceive && (
        <Button
          data-test-title-receive-button
          onClick={openReceiveList}
          disabled={disabled}
        >
          <FormattedMessage id="ui-receiving.title.details.button.receive" />
        </Button>
      )}
      <Button
        data-test-add-piece-button
        onClick={openAddPieceModal}
        disabled={disabled}
      >
        <FormattedMessage id="ui-receiving.piece.button.addPiece" />
      </Button>
    </>
  );
}

TitleDetailsExpectedActions.propTypes = {
  hasReceive: PropTypes.bool.isRequired,
  openAddPieceModal: PropTypes.func.isRequired,
  openReceiveList: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
