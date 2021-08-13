import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import user from '@testing-library/user-event';

import AddPieceModal from './AddPieceModal';

jest.mock('@folio/stripes-acq-components', () => {
  return {
    ...jest.requireActual('@folio/stripes-acq-components'),
    FieldInventory: jest.fn().mockReturnValue('FieldInventory'),
  };
});

const defaultProps = {
  close: jest.fn(),
  createInventoryValues: {},
  deletePiece: jest.fn(),
  form: {},
  onSubmit: jest.fn(),
  hasValidationErrors: false,
  instanceId: 'instanceId',
  isManuallyAddPieces: true,
  locationIds: [],
  locations: [],
  onCheckIn: jest.fn(),
  pieceFormatOptions: [],
  values: {},
};

const renderAddPieceModal = (props = defaultProps) => (render(
  <AddPieceModal
    {...props}
  />,
  { wrapper: MemoryRouter },
));

describe('AddPieceModal', () => {
  beforeEach(() => {
    defaultProps.close.mockClear();
    defaultProps.onCheckIn.mockClear();
  });

  it('should display Add piece modal', () => {
    renderAddPieceModal();

    expect(screen.getByText('ui-receiving.piece.addPieceModal.title')).toBeDefined();
  });

  describe('Close Add piece modal', () => {
    it('should close Add piece modal', () => {
      renderAddPieceModal();

      user.click(screen.getByText('ui-receiving.piece.actions.cancel'));

      expect(defaultProps.close).toHaveBeenCalled();
    });
  });

  describe('Check display on holding', () => {
    it('should enable discovery suppress', () => {
      renderAddPieceModal();

      user.click(screen.getByText('ui-receiving.piece.displayOnHolding'));

      expect(screen.getByLabelText('ui-receiving.piece.discoverySuppress')).not.toHaveAttribute('disabled');
    });
  });
});
