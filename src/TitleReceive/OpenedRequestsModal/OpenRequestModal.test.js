import React from 'react';
import { render, screen } from '@testing-library/react';

import OpenedRequestsModal from './OpenedRequestsModal';

const defaultProps = {
  pieces: [{ itemId: 'itemId', request: {} }, { barcode: 'barcode', request: {} }],
  closeModal: jest.fn(),
};

const renderOpenedRequestsModal = (props = defaultProps) => (render(
  <OpenedRequestsModal
    {...props}
  />,
));

describe('OpenedRequestsModal', () => {
  it('should display open request modal with single request', () => {
    renderOpenedRequestsModal({ ...defaultProps, pieces: [] });

    expect(screen.getByText('ui-receiving.requests.message.single')).toBeDefined();
  });

  it('should display open request modal with multiple requests', () => {
    renderOpenedRequestsModal();

    expect(screen.getByText('ui-receiving.requests.message.multiple')).toBeDefined();
  });
});
