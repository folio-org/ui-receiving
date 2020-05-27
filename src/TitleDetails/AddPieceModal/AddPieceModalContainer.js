import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { uniqBy } from 'lodash';

import {
  ORDER_FORMATS,
  PIECE_FORMAT_OPTIONS,
  PIECE_FORMAT,
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

  const pieceLocation = initialValues.locationId;
  const poLineLocations = poLine.locations.map(({ locationId }) => locationId);
  const locationIds = pieceLocation ? uniqBy([...poLineLocations, pieceLocation]) : poLineLocations;

  return (
    <AddPieceModal
      close={close}
      createInventoryValues={createInventoryValues}
      initialValues={initialValues}
      instanceId={instanceId}
      locationIds={locationIds}
      onCheckIn={onCheckIn}
      onSubmit={onSubmit}
      pieceFormatOptions={pieceFormatOptions}
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
