import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { useQuery } from 'react-query';

import {
  Button,
  Loading,
  Modal,
} from '@folio/stripes/components';
import {
  HoldingsAbandonmentPieceStrategy,
  ModalFooter,
  useHoldingsAbandonmentAnalyzer,
} from '@folio/stripes-acq-components';

export const DeletePieceModal = ({
  onCancel,
  onConfirm,
  piece,
}) => {
  const {
    holdingId,
    id,
    itemId,
  } = piece;

  const { analyzerFactory } = useHoldingsAbandonmentAnalyzer();

  const intl = useIntl();
  const modalLabel = intl.formatMessage({ id: 'ui-receiving.piece.delete.heading' });

  const {
    data: canDeleteHolding = false,
    isFetching,
  } = useQuery({
    queryKey: [holdingId, id, itemId],
    queryFn: async ({ signal }) => {
      const analyzer = await analyzerFactory({
        holdingIds: [holdingId],
        signal,
      });

      const abandonmentAnalysisResult = await analyzer.analyze({
        explain: true,
        holdingIds: [holdingId],
        ids: [id],
        strategy: HoldingsAbandonmentPieceStrategy.name,
      });

      return abandonmentAnalysisResult[0]?.abandoned;
    },
    enabled: Boolean(id && holdingId),
  });

  const start = (
    <Button
      data-test-add-piece-cancel
      marginBottom0
      onClick={onCancel}
    >
      <FormattedMessage id="ui-receiving.piece.actions.cancel" />
    </Button>
  );
  const lastPieceDeleteBtnLabel = (
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
            ? lastPieceDeleteBtnLabel
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
      label={modalLabel}
      aria-label={modalLabel}
    >
      {isFetching ? <Loading /> : message}
    </Modal>
  );
};

DeletePieceModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  piece: PropTypes.object.isRequired,
};
