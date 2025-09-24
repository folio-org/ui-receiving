import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  ORDER_FORMATS,
  useOrderLine,
} from '@folio/stripes-acq-components';

import { useTitle } from '../../common/hooks';
import { useReceivingSearchContext } from '../../contexts';
import {
  ORDER_FORMAT_TO_PIECE_FORMAT,
  PIECE_FORM_FIELD_NAMES,
} from '../constants';
import { PieceFormContainer } from '../PieceForm';

function getNewPieceValues(titleId, poLine, crossTenant) {
  const {
    orderFormat,
    id: poLineId,
    physical,
    locations,
    checkinItems,
  } = (poLine || {});

  const initialValuesPiece = {
    receiptDate: physical?.expectedReceiptDate,
    poLineId,
    titleId,
  };

  if (orderFormat !== ORDER_FORMATS.PEMix) {
    initialValuesPiece.format = ORDER_FORMAT_TO_PIECE_FORMAT[orderFormat];
  }

  if (locations?.length === 1 && !crossTenant) {
    initialValuesPiece.locationId = locations[0].locationId;
    initialValuesPiece.holdingId = locations[0].holdingId;
  }

  if (checkinItems) {
    initialValuesPiece.displayOnHolding = true;
  }

  return initialValuesPiece;
}

export const PieceCreate = ({
  location,
  match,
}) => {
  const { id: titleId } = match.params;
  const { state } = location;
  const isCreateFromTemplate = typeof state?.pieceTemplate === 'object';

  const intl = useIntl();

  const {
    crossTenant,
    targetTenantId: tenantId,
  } = useReceivingSearchContext();

  const {
    isLoading: isTitleLoading,
    title,
  } = useTitle(titleId, {
    tenantId,
    enabled: !isCreateFromTemplate,
  });

  const {
    isLoading: isOrderLineLoading,
    orderLine,
  } = useOrderLine(title?.poLineId, {
    tenantId,
    enabled: !isCreateFromTemplate,
  });

  const initialValues = useMemo(() => {
    return {
      ...(isCreateFromTemplate ? state.pieceTemplate : getNewPieceValues(titleId, orderLine, crossTenant)),
      [PIECE_FORM_FIELD_NAMES.sequenceNumber]: title?.nextSequenceNumber,
    };
  }, [
    crossTenant,
    isCreateFromTemplate,
    orderLine,
    state?.pieceTemplate,
    title?.nextSequenceNumber,
    titleId,
  ]);

  const isLoading = isTitleLoading || isOrderLineLoading;

  return (
    <PieceFormContainer
      initialValues={initialValues}
      isLoading={isLoading}
      paneTitle={intl.formatMessage({ id: 'ui-receiving.piece.pieceForm.create.title' })}
    />
  );
};

PieceCreate.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
};
