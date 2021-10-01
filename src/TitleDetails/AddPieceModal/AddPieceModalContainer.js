import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

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
}) => {
  const createInventoryValues = useMemo(
    () => ({
      [PIECE_FORMAT.physical]: poLine?.physical?.createInventory,
      [PIECE_FORMAT.electronic]: poLine?.eresource?.createInventory,
      [PIECE_FORMAT.other]: poLine?.physical?.createInventory,
    }),
    [poLine],
  );

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
      onSubmit={onSubmit}
      pieceFormatOptions={pieceFormatOptions}
      poLine={poLine}
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
};

export default AddPieceModalContainer;
