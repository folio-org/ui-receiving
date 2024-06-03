import { MemoryRouter } from 'react-router-dom';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { HasCommand } from '@folio/stripes/components';

import TitleBindPieces from './TitleBindPieces';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
}));

const initialValues = {
  receivedItems: [{
    barcode: '10001',
    enumeration: 'The American Journal of Medicine',
    id: '0001',
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

const renderTitleBindPieces = (props = defaultProps) => (render(
  <TitleBindPieces
    {...props}
  />,
  { wrapper: MemoryRouter },
));

describe('TitleBindPieces', () => {
  it('should display title TitleBindPieces', () => {
    const { getByText } = renderTitleBindPieces();

    expect(getByText(defaultProps.paneTitle)).toBeDefined();
  });

  it('should display pane footer', () => {
    const { getByText } = renderTitleBindPieces();

    expect(getByText('stripes-acq-components.FormFooter.cancel')).toBeDefined();
    expect(getByText('ui-receiving.title.details.button.bind')).toBeDefined();
  });

  it('should close Title TitleBindPieces', async () => {
    const { getByText } = renderTitleBindPieces();

    await user.click(getByText('stripes-acq-components.FormFooter.cancel'));

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
