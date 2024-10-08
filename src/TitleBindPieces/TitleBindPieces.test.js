import { screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import { HasCommand } from '@folio/stripes/components';

import { renderWithRouter } from '../../test/jest/helpers';
import TitleBindPieces from './TitleBindPieces';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));

jest.mock('./TitleBindPiecesCreateItemForm', () => ({
  TitleBindPiecesCreateItemForm: jest.fn(() => 'TitleBindPiecesCreateItemForm'),
}));

const initialValues = {
  receivedItems: [{
    barcode: '10001',
    enumeration: 'The American Journal of Medicine',
    id: '0001',
  }, {
    barcode: '10002',
    enumeration: 'The American Journal of Medicine',
    id: '0002',
    itemId: '0002',
    itemStatus: 'Available',
  },
  {
    barcode: '10003',
    enumeration: 'The American Journal of Medicine',
    id: '0003',
    itemId: '0003',
  }],
};
const defaultProps = {
  onCancel: jest.fn(),
  form: {},
  onSubmit: jest.fn(),
  pristine: false,
  submitting: false,
  paneTitle: 'TitleBindPieces',
  pieceLocationMap: {},
  initialValues,
};

const renderTitleBindPieces = (props = defaultProps) => renderWithRouter(
  <TitleBindPieces
    {...props}
  />,
);

describe('TitleBindPieces', () => {
  it('should display title TitleBindPieces', () => {
    renderTitleBindPieces();

    expect(screen.getByText(defaultProps.paneTitle)).toBeDefined();
  });

  it('should display pane footer', () => {
    renderTitleBindPieces();

    expect(screen.getByText('stripes-acq-components.FormFooter.cancel')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.details.button.bind')).toBeDefined();
  });

  it('should close Title TitleBindPieces', async () => {
    renderTitleBindPieces();

    await user.click(screen.getByText('stripes-acq-components.FormFooter.cancel'));

    expect(defaultProps.onCancel).toHaveBeenCalled();
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      defaultProps.onCancel.mockClear();
    });

    it('should cancel form when cancel shortcut is called', () => {
      renderTitleBindPieces();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler();

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });
});
