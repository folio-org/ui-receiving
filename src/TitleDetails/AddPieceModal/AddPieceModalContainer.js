import React, { useMemo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  batchFetch,
  locationsManifest,
  ORDER_FORMATS,
  PIECE_FORMAT_OPTIONS,
  PIECE_FORMAT,
} from '@folio/stripes-acq-components';

import AddPieceModal from './AddPieceModal';

const AddPieceModalContainer = ({
  close,
  initialValues,
  instanceId,
  mutator,
  onCheckIn,
  onSubmit,
  poLine,
}) => {
  const [locations, setLocations] = useState();
  const pieceLocation = initialValues.locationId;
  const poLineLocations = poLine?.locations?.map(({ locationId }) => locationId) || [];
  const locationIds = pieceLocation ? [...new Set([...poLineLocations, pieceLocation])] : poLineLocations;

  useEffect(() => {
    setLocations();

    batchFetch(mutator.pieceLocations, locationIds)
      .then(setLocations)
      .catch(() => setLocations([]));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [poLine, initialValues.locationId]);

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

  if (!locations) return null;

  return (
    <AddPieceModal
      close={close}
      createInventoryValues={createInventoryValues}
      initialValues={initialValues}
      instanceId={instanceId}
      locationIds={locationIds}
      locations={locations}
      onCheckIn={onCheckIn}
      onSubmit={onSubmit}
      pieceFormatOptions={pieceFormatOptions}
    />
  );
};

AddPieceModalContainer.manifest = Object.freeze({
  pieceLocations: {
    ...locationsManifest,
    fetch: false,
  },
});

AddPieceModalContainer.propTypes = {
  close: PropTypes.func.isRequired,
  initialValues: PropTypes.object.isRequired,
  instanceId: PropTypes.string,
  mutator: PropTypes.object.isRequired,
  onCheckIn: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  poLine: PropTypes.object.isRequired,
};

export default stripesConnect(AddPieceModalContainer);
