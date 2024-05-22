import omit from 'lodash/omit';
import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
} from 'react';

import {
  ORDER_FORMATS,
  PIECE_FORMAT_OPTIONS,
  PIECE_FORMAT,
} from '@folio/stripes-acq-components';

import {
  PIECE_FORM_CHECKBOX_FIELD_NAMES,
  PIECE_FORM_FIELD_NAMES,
} from '../constants';
import AddPieceModal from './AddPieceModal';

const AddPieceModalContainer = ({
  close,
  deletePiece,
  canDeletePiece,
  onUnreceive,
  initialValues,
  instanceId,
  restrictionsByAcqUnit,
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
    const { deleteHolding = false, isCreateAnother } = formValues;
    const values = omit(formValues, ['deleteHolding', 'isCreateAnother']);

    onSubmit(values, { searchParams: { deleteHolding } }, isCreateAnother);
  };

  const onQuickReceive = useCallback((formValues) => (
    onCheckIn(omit(formValues, PIECE_FORM_FIELD_NAMES.isCreateAnother), formValues.isCreateAnother)
  ), [onCheckIn]);

  const orderFormat = poLine?.orderFormat;
  const pieceFormatOptions = orderFormat === ORDER_FORMATS.PEMix
    ? PIECE_FORMAT_OPTIONS.filter(({ value }) => [PIECE_FORMAT.electronic, PIECE_FORMAT.physical].includes(value))
    : PIECE_FORMAT_OPTIONS.filter(({ value }) => value === initialValues.format);

  const initialCheckboxValues = useMemo(() => (
    PIECE_FORM_CHECKBOX_FIELD_NAMES.reduce((acc, key) => {
      acc[key] = Boolean(initialValues[key]);

      return acc;
    }, {})
  ), [initialValues]);

  return (
    <AddPieceModal
      close={close}
      createInventoryValues={createInventoryValues}
      deletePiece={deletePiece}
      canDeletePiece={canDeletePiece}
      initialValues={{ ...initialValues, ...initialCheckboxValues }}
      instanceId={instanceId}
      locationIds={locationIds}
      locations={locations}
      onCheckIn={onQuickReceive}
      onSubmit={onSavePiece}
      pieceFormatOptions={pieceFormatOptions}
      onUnreceive={onUnreceive}
      poLine={poLine}
      restrictionsByAcqUnit={restrictionsByAcqUnit}
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
  onUnreceive: PropTypes.func.isRequired,
  restrictionsByAcqUnit: PropTypes.shape({
    protectCreate: PropTypes.bool,
    protectDelete: PropTypes.bool,
    protectUpdate: PropTypes.bool,
  }),
};

export default AddPieceModalContainer;
