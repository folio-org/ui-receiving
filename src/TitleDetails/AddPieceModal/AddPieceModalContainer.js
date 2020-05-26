import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import {
  ORDER_FORMATS,
  PIECE_FORMAT_OPTIONS,
} from '@folio/stripes-acq-components';

import AddPieceModal from './AddPieceModal';

const AddPieceModalContainer = ({
  close,
  onSubmit,
  initialValues,
  instanceId,
  onCheckIn,
  poLine,
}) => {
  const createInventoryValues = useMemo(
    () => ({
      'Physical': poLine?.physical?.createInventory,
      'Electronic': poLine?.eresource?.createInventory,
    }),
    [poLine],
  );

  let pieceFormatOptions = PIECE_FORMAT_OPTIONS;
  const orderFormat = poLine?.orderFormat;

  if (orderFormat !== ORDER_FORMATS.PEMix) {
    pieceFormatOptions = PIECE_FORMAT_OPTIONS.filter(({ value }) => value === initialValues.format);
  }

  return (
    <AddPieceModal
      close={close}
      createInventoryValues={createInventoryValues}
      initialValues={initialValues}
      instanceId={instanceId}
      onCheckIn={onCheckIn}
      onSubmit={onSubmit}
      pieceFormatOptions={pieceFormatOptions}
      purchaseOrderLineIdentifier={poLine.id}
    />
  );
};

AddPieceModalContainer.propTypes = {
  close: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  instanceId: PropTypes.string,
  onCheckIn: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  poLine: PropTypes.object.isRequired,
};

export default AddPieceModalContainer;
