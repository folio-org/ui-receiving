import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import omit from 'lodash/omit';

import {
  ORDER_FORMATS,
  PIECE_FORMAT_OPTIONS,
  PIECE_FORMAT,
} from '@folio/stripes-acq-components';

import AddPieceModal from './AddPieceModal';

const AddPieceModalContainer = ({
  close,
  deletePiece,
  canDeletePiece,
  initialValues,
  instanceId,
  locations,
  locationIds,
  onCheckIn,
  onSubmit,
  poLine,
  getHoldingsItemsAndPieces,
}) => {
  const createInventoryValues = useMemo(
    () => ({
      [PIECE_FORMAT.physical]: poLine?.physical?.createInventory,
      [PIECE_FORMAT.electronic]: poLine?.eresource?.createInventory,
      [PIECE_FORMAT.other]: poLine?.physical?.createInventory,
    }),
    [poLine],
  );

  const onSavePiece = (formValues) => {
    const { deleteHolding = false } = formValues;
    const values = omit(formValues, 'deleteHolding');

    onSubmit(values, { searchParams: { deleteHolding } });
  };

  const orderFormat = poLine?.orderFormat;
  const pieceFormatOptions = orderFormat === ORDER_FORMATS.PEMix
    ? PIECE_FORMAT_OPTIONS.filter(({ value }) => [PIECE_FORMAT.electronic, PIECE_FORMAT.physical].includes(value))
    : PIECE_FORMAT_OPTIONS.filter(({ value }) => value === initialValues.format);

  return (
    <AddPieceModal
      close={close}
      createInventoryValues={createInventoryValues}
      deletePiece={deletePiece}
      canDeletePiece={canDeletePiece}
      initialValues={initialValues}
      instanceId={instanceId}
      locationIds={locationIds}
      locations={locations}
      onCheckIn={onCheckIn}
      onSubmit={onSavePiece}
      pieceFormatOptions={pieceFormatOptions}
      poLine={poLine}
      getHoldingsItemsAndPieces={getHoldingsItemsAndPieces}
    />
  );
};

AddPieceModalContainer.propTypes = {
  close: PropTypes.func.isRequired,
  deletePiece: PropTypes.func.isRequired,
  canDeletePiece: PropTypes.bool,
  initialValues: PropTypes.object.isRequired,
  instanceId: PropTypes.string,
  locations: PropTypes.arrayOf(PropTypes.object),
  locationIds: PropTypes.arrayOf(PropTypes.string),
  onCheckIn: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  poLine: PropTypes.object.isRequired,
  getHoldingsItemsAndPieces: PropTypes.func.isRequired,
};

export default AddPieceModalContainer;
