import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react';
import { useIntl } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  LoadingPane,
  Paneset,
} from '@folio/stripes/components';
import {
  buildDateRangeQuery,
  formatDate,
  PIECE_FORMAT,
  RESULT_COUNT_INCREMENT,
  useLocalPagination,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  useReceive,
  useTitleHydratedPieces,
} from '../common/hooks';
import {
  getReceivingPieceItemStatus,
  handleReceiveErrorResponse,
} from '../common/utils';
import {
  CENTRAL_RECEIVING_ROUTE,
  RECEIVING_ROUTE,
} from '../constants';
import { useReceivingSearchContext } from '../contexts';
import {
  EXPECTED_PIECES_SEARCH_VALUE,
  PIECE_FORM_FIELD_NAMES,
} from '../Piece';
import OpenedRequestsModal from './OpenedRequestsModal';
import TitleReceive from './TitleReceive';

const { receiptDate: RECEIPT_DATE } = PIECE_FORM_FIELD_NAMES;

function TitleReceiveContainer({ history, location, match }) {
  const intl = useIntl();
  const showCallout = useShowCallout();
  const {
    crossTenant,
    isCentralRouting,
    targetTenantId,
  } = useReceivingSearchContext();

  const abortControllerRef = useRef(new AbortController());

  useEffect(() => {
    const abortController = abortControllerRef.current;

    return () => {
      abortController.abort();
    };
  }, []);

  const [isTransitionPending, startTransition] = useTransition();

  const [receivedPiecesWithRequests, setReceivedPiecesWithRequests] = useState([]);

  const titleId = match.params.id;
  const dateRange = location.state?.dateRange;
  const searchQuery = (
    dateRange
      ? `${buildDateRangeQuery(RECEIPT_DATE, [dateRange.startDate, dateRange.endDate].join(':'))} sortBy ${RECEIPT_DATE}`
      : ''
  );

  const {
    isLoading: isPiecesLoading,
    locations,
    orderLine: poLine,
    pieces = [],
    piecesCount,
    title,
  } = useTitleHydratedPieces({
    receivingStatus: `(${EXPECTED_PIECES_SEARCH_VALUE})`,
    searchQuery,
    tenantId: targetTenantId,
    titleId,
  });

  const {
    pagination,
    setPagination,
    paginatedData,
  } = useLocalPagination(pieces, RESULT_COUNT_INCREMENT);

  const instanceId = title?.instanceId;
  const currentChunkedPiecesCount = pagination.offset + paginatedData.length;

  /* Check if all pieces have been loaded and rendered from all chunks */
  const isPiecesChunksExhausted = currentChunkedPiecesCount >= piecesCount;

  const {
    isLoading: isReceiveLoading,
    receive,
  } = useReceive({
    signal: abortControllerRef.current.signal,
    tenantId: targetTenantId,
  });

  const onCancel = useCallback(() => {
    history.push({
      pathname: `${isCentralRouting ? CENTRAL_RECEIVING_ROUTE : RECEIVING_ROUTE}/${titleId}/view`,
      search: location.search,
    });
  }, [history, isCentralRouting, titleId, location.search]);

  const closeOpenedRequestsModal = useCallback(() => {
    setReceivedPiecesWithRequests([]);
    onCancel();
  }, [onCancel]);

  const renderNextChunk = useCallback(() => {
    startTransition(() => {
      setPagination((prev) => ({
        ...prev,
        offset: prev.offset + RESULT_COUNT_INCREMENT,
      }));
    });
  }, [setPagination]);

  const onSubmit = useCallback(({ receivedItems }) => {
    const selectedItems = receivedItems.filter(({ checked }) => checked === true);

    if (!selectedItems?.length) {
      return renderNextChunk();
    }

    return receive(selectedItems.map(item => ({ ...item, itemStatus: getReceivingPieceItemStatus(item) })))
      .then(() => {
        showCallout({
          messageId: 'ui-receiving.title.actions.receive.success',
          type: 'success',
        });
        const receivedItemsWithRequests = receivedItems.filter(({ request }) => Boolean(request));

        if (receivedItemsWithRequests.length) {
          return setReceivedPiecesWithRequests(receivedItemsWithRequests);
        } else {
          return isPiecesChunksExhausted
            ? onCancel()
            : renderNextChunk();
        }
      })
      .catch(async ({ response }) => {
        await handleReceiveErrorResponse(showCallout, response);
        onCancel();
      });
  }, [receive, renderNextChunk, showCallout, isPiecesChunksExhausted, onCancel]);

  const initialValues = useMemo(() => ({ receivedItems: paginatedData }), [paginatedData]);

  const createInventoryValues = useMemo(() => ({
    [PIECE_FORMAT.physical]: poLine?.physical?.createInventory,
    [PIECE_FORMAT.electronic]: poLine?.eresource?.createInventory,
    [PIECE_FORMAT.other]: poLine?.physical?.createInventory,
  }), [poLine]);

  if (isPiecesLoading) {
    return (
      <Paneset>
        <LoadingPane />
      </Paneset>
    );
  }

  const paneTitle = `${poLine?.poLineNumber} - ${title.title}`;

  /*
    Labels for the date range and chunked piece count in the pane subtitle.
    Used to inform the user about the current data scope displayed in the UI.
   */
  const dateRangeLabel = dateRange && `${formatDate(dateRange.startDate, intl)} - ${formatDate(dateRange.endDate, intl)}`;
  const chunkLabel = (dateRange || piecesCount > RESULT_COUNT_INCREMENT) && intl.formatMessage(
    { id: 'ui-receiving.piece.receiveForm.limited.paneSub' },
    {
      count: currentChunkedPiecesCount,
      totalRecords: piecesCount,
    },
  );
  const paneSub = [chunkLabel, dateRangeLabel].filter(Boolean).join(' • ');
  const submitButtonLabel = isPiecesChunksExhausted
    ? intl.formatMessage({ id: 'ui-receiving.title.details.button.receive' })
    : intl.formatMessage({ id: 'ui-receiving.piece.receiveForm.limited.action.receiveAndLoad' });

  return (
    <>
      <TitleReceive
        crossTenant={crossTenant}
        createInventoryValues={createInventoryValues}
        initialValues={initialValues}
        instanceId={instanceId}
        isLoading={isReceiveLoading || isTransitionPending}
        isPiecesChunksExhausted={isPiecesChunksExhausted}
        locations={locations}
        onCancel={onCancel}
        onSubmit={onSubmit}
        paneSub={paneSub}
        paneTitle={paneTitle}
        poLine={poLine}
        receivingNote={poLine?.details?.receivingNote}
        submitButtonLabel={submitButtonLabel}
      />
      {!!receivedPiecesWithRequests.length && (
        <OpenedRequestsModal
          closeModal={closeOpenedRequestsModal}
          pieces={receivedPiecesWithRequests}
        />
      )}
    </>
  );
}

TitleReceiveContainer.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};

export default stripesConnect(TitleReceiveContainer);
