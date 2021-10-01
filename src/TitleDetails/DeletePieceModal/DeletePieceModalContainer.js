import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Button } from '@folio/stripes/components';
import { ModalFooter } from '@folio/stripes-acq-components';

import { DeletePieceModal } from './DeletePieceModal';
import { useHoldingItems } from '../hooks';

const DeletePieceModalContainer = ({
  onCancel,
  onConfirm,
  piece,
  setIsLoading,
}) => {
  const { itemId, holdingsRecordId } = piece;
  const { itemsCount, isFetching } = useHoldingItems(holdingsRecordId, { searchParams: { limit: 1 } });
  const isLastConnectedItem = itemId && itemsCount === 1;

  useEffect(() => {
    setIsLoading(isFetching);
  }, [isFetching]);

  const start = (
    <Button
      data-test-add-piece-cancel
      marginBottom0
      onClick={onCancel}
    >
      <FormattedMessage id="ui-receiving.piece.actions.cancel" />
    </Button>
  );
  const end = (
    <>
      <Button
        buttonStyle="primary"
        marginBottom0
        onClick={() => onConfirm({ searchParams: { deleteHolding: true } })}
      >
        <FormattedMessage id="ui-receiving.piece.actions.delete.deleteHoldingsAndItem" />
      </Button>
      <Button
        buttonStyle="primary"
        marginBottom0
        onClick={onConfirm}
      >
        <FormattedMessage id="ui-receiving.piece.actions.delete.deleteItem" />
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
    !isFetching &&
    <DeletePieceModal
      isLoading={isFetching}
      footer={footer}
      onConfirm={onConfirm}
      onCancel={onCancel}
      isLastConnectedItem={isLastConnectedItem}
    />
  );
};

DeletePieceModalContainer.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  piece: PropTypes.object.isRequired,
};

export default DeletePieceModalContainer;
