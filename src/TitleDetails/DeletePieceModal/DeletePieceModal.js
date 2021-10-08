import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Button, Modal, Loading } from '@folio/stripes/components';
import { ModalFooter } from '@folio/stripes-acq-components';

import {
  usePieces,
  useHoldingItems,
} from '../../common/hooks';

export const DeletePieceModal = ({
  onCancel,
  onConfirm,
  piece,
}) => {
  const { itemId, holdingId } = piece;
  const { itemsCount, isFetching: isItemsFetching } = useHoldingItems(holdingId, { searchParams: { limit: 1 } });
  const { piecesCount, isFetching: isPiecesFetching } = usePieces(
    {
      searchParams: {
        limit: 1,
        query: `holdingId==${holdingId}`,
      },
    },
    { enabled: Boolean(holdingId) },
  );

  const isFetching = isItemsFetching || isPiecesFetching;
  const canDeleteHolding = Boolean(
    holdingId
    && piecesCount === 1
    && ((itemsCount === 1 && itemId) || itemsCount === 0),
  );

  const start = (
    <Button
      data-test-add-piece-cancel
      marginBottom0
      onClick={onCancel}
    >
      <FormattedMessage id="ui-receiving.piece.actions.cancel" />
    </Button>
  );
  const lastPieceDeleteBtn = (
    itemId
      ? <FormattedMessage id="ui-receiving.piece.actions.delete.deleteItem" />
      : <FormattedMessage id="ui-receiving.piece.actions.delete" />
  );
  const end = (
    <>
      {
        canDeleteHolding && (
          <Button
            buttonStyle="primary"
            marginBottom0
            onClick={() => onConfirm({ searchParams: { deleteHolding: true } })}
          >
            {
              itemId
                ? <FormattedMessage id="ui-receiving.piece.actions.delete.deleteHoldingsAndItem" />
                : <FormattedMessage id="ui-receiving.piece.actions.delete.deleteHoldings" />
            }
          </Button>
        )
      }
      <Button
        buttonStyle="primary"
        marginBottom0
        onClick={onConfirm}
      >
        {
          canDeleteHolding
            ? lastPieceDeleteBtn
            : <FormattedMessage id="ui-receiving.piece.delete.confirm" />
        }
      </Button>
    </>
  );

  const footer = (
    <ModalFooter
      renderStart={start}
      renderEnd={isFetching ? <Loading /> : end}
    />
  );

  const message = (
    canDeleteHolding
      ? <FormattedMessage id="ui-receiving.piece.delete.deleteHoldingsAndItem.message" />
      : <FormattedMessage id="ui-receiving.piece.delete.message" />
  );

  return (
    <Modal
      open
      size="small"
      footer={footer}
      id="delete-piece-confirmation"
      label={<FormattedMessage id="ui-receiving.piece.delete.heading" />}
    >
      {isFetching ? <Loading /> : message}
    </Modal>
  );
};

DeletePieceModal.propTypes = {
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  piece: PropTypes.object.isRequired,
};
