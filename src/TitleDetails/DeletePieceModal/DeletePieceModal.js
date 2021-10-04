import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Button, Modal, Loading } from '@folio/stripes/components';
import { ModalFooter } from '@folio/stripes-acq-components';

import { useHoldingItems } from '../hooks';

export const DeletePieceModal = ({
  onCancel,
  onConfirm,
  piece,
}) => {
  const { itemId, holdingsRecordId } = piece;
  const { itemsCount, isFetching } = useHoldingItems(holdingsRecordId, { searchParams: { limit: 1 } });
  const isLastConnectedItem = itemId && itemsCount === 1;

  const start = (
    <Button
      data-test-add-piece-cancel
      marginBottom0
      onClick={onCancel}
    >
      <FormattedMessage id="ui-receiving.piece.actions.cancel" />
    </Button>
  );
  const end = isFetching
    ? <Loading />
    : (
      <>
        {isLastConnectedItem && (
          <Button
            buttonStyle="primary"
            marginBottom0
            onClick={() => onConfirm({ searchParams: { deleteHolding: true } })}
          >
            <FormattedMessage id="ui-receiving.piece.actions.delete.deleteHoldingsAndItem" />
          </Button>
        )}
        <Button
          buttonStyle="primary"
          marginBottom0
          onClick={onConfirm}
        >
          {
            isLastConnectedItem
              ? <FormattedMessage id="ui-receiving.piece.actions.delete.deleteItem" />
              : <FormattedMessage id="ui-receiving.piece.delete.confirm" />
          }
        </Button>
      </>
    );

  const footer = (
    <ModalFooter
      renderStart={start}
      renderEnd={end}
    />
  );

  return (
    <Modal
      open
      size="small"
      footer={footer}
      id="delete-piece-confirmation"
      label={<FormattedMessage id="ui-receiving.piece.delete.heading" />}
    >
      {isFetching
        ? <Loading />
        : (
          isLastConnectedItem
            ? <FormattedMessage id="ui-receiving.piece.delete.deleteHoldingsAndItem.message" />
            : <FormattedMessage id="ui-receiving.piece.delete.message" />
        )}
    </Modal>
  );
};

DeletePieceModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  piece: PropTypes.object.isRequired,
};
