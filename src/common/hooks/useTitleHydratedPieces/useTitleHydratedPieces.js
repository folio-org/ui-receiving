import keyBy from 'lodash/keyBy';
import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  HOLDINGS_API,
  ITEMS_API,
  LOCATIONS_API,
  REQUESTS_API,
  batchFetch,
  useOrderLine,
} from '@folio/stripes-acq-components';

import { getHydratedPieces } from '../../utils';
import { usePieces } from '../usePieces';
import { useTitle } from '../useTitle';

export const useTitleHydratedPieces = ({ receivingStatus, titleId } = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace('receiving-title-hydrated-pieces');

  const {
    title,
    isLoading: isTitleLoading,
  } = useTitle(titleId);

  const {
    orderLine,
    isLoading: isOrderLineLoading,
  } = useOrderLine(title?.poLineId);

  const {
    pieces,
    isLoading: isPiecesLoading,
  } = usePieces(
    {
      searchParams: {
        query: `titleId=${titleId} and poLineId==${orderLine?.id} and receivingStatus==${receivingStatus}`,
      },
    },
    { enabled: Boolean(titleId && orderLine?.id && receivingStatus) },
  );

  const isReferenceDataLoading = (
    isTitleLoading
    || isOrderLineLoading
    || isPiecesLoading
  );

  const queryFn = async ({ signal }) => {
    const mutatorAdapter = (api, recordsKey) => ({
      GET: ({ params: searchParams }) => {
        return ky.get(api, { searchParams, signal })
          .json()
          .then((response) => response[recordsKey]);
      },
    });

    const hydratedPieces = await getHydratedPieces(
      pieces,
      mutatorAdapter(REQUESTS_API, 'requests'),
      mutatorAdapter(ITEMS_API, 'items'),
    );

    const holdingIds = hydratedPieces.map(({ holdingId }) => holdingId).filter(Boolean);
    const locationIds = hydratedPieces.map(({ locationId }) => locationId).filter(Boolean);

    const holdings = holdingIds.length
      ? await batchFetch(mutatorAdapter(HOLDINGS_API, 'holdingsRecords'), holdingIds)
      : [];

    const holdingLocationIds = holdings.map(({ permanentLocationId }) => permanentLocationId);
    const holdingLocations = await batchFetch(mutatorAdapter(LOCATIONS_API, 'locations'), [...new Set([...holdingLocationIds, ...locationIds])]);

    return {
      pieces: hydratedPieces,
      pieceLocationMap: keyBy(holdingLocations, 'id'),
      pieceHoldingMap: keyBy(holdings, 'id'),
    };
  };

  const { data, isLoading } = useQuery({
    queryKey: [namespace, pieces],
    queryFn,
    enabled: !isReferenceDataLoading && Boolean(pieces?.length),
  });

  return {
    isLoading: isLoading || isReferenceDataLoading,
    orderLine,
    pieces: data?.pieces,
    title,
    pieceLocationMap: data?.pieceLocationMap,
    pieceHoldingMap: data?.pieceHoldingMap,
  };
};
