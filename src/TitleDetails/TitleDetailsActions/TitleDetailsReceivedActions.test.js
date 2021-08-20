import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import { TitleDetailsReceivedActions } from './TitleDetailsReceivedActions';

const defaultProps = {
  titleId: 'titleId',
  hasUnreceive: true,
};

const renderTitleDetailsReceivedActions = (props = defaultProps) => (render(
  <TitleDetailsReceivedActions
    {...props}
  />,
  { wrapper: MemoryRouter },
));

describe('TitleDetailsReceivedActions', () => {
  it('should display Title details received actions', () => {
    renderTitleDetailsReceivedActions();

    expect(screen.getByText('ui-receiving.title.details.button.unreceive')).toBeDefined();
  });
});
