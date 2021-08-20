import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import user from '@testing-library/user-event';

import { HasCommand } from '@folio/stripes/components';

import TitleUnreceive from './TitleUnreceive';

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
  paneTitle: 'TitleUnreceive',
  pieceLocationMap: {},
  initialValues,
};

const renderTitleUnreceive = (props = defaultProps) => (render(
  <TitleUnreceive
    {...props}
  />,
  { wrapper: MemoryRouter },
));

describe('TitleUnreceive', () => {
  it('should display title unreceive', () => {
    const { getByText } = renderTitleUnreceive();

    expect(getByText(defaultProps.paneTitle)).toBeDefined();
  });

  it('should display pane footer', () => {
    const { getByText } = renderTitleUnreceive();

    expect(getByText('stripes-acq-components.FormFooter.cancel')).toBeDefined();
    expect(getByText('ui-receiving.title.details.button.unreceive')).toBeDefined();
  });

  describe('Close title unreceive', () => {
    it('should close Title unreceive', () => {
      const { getByText } = renderTitleUnreceive();

      user.click(getByText('stripes-acq-components.FormFooter.cancel'));

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      defaultProps.onCancel.mockClear();
    });

    it('should cancel form when cancel shortcut is called', () => {
      renderTitleUnreceive();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler();

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });
});
