import { MemoryRouter } from 'react-router-dom';

import { render } from '@folio/jest-config-stripes/testing-library/react';
import {
  ORDER_FORMATS,
  useOrderLine,
} from '@folio/stripes-acq-components';

import { useTitle } from '../../common/hooks';
import { PieceFormContainer } from '../PieceForm';
import { PieceCreate } from './PieceCreate';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useOrderLine: jest.fn(),
}));
jest.mock('../../common/hooks', () => ({
  ...jest.requireActual('../../common/hooks'),
  useTitle: jest.fn(),
}));
jest.mock('../../contexts', () => ({
  ...jest.requireActual('../../contexts'),
  useReceivingSearchContext: jest.fn(() => ({
    crossTenant: false,
    targetTenantId: 'tenantId',
  })),
}));
jest.mock('../PieceForm', () => ({
  PieceFormContainer: jest.fn(() => 'PieceFormContainer'),
}));

const orderLine = {
  id: 'order-line-id',
  orderFormat: ORDER_FORMATS.physicalResource,
  checkinItems: false,
  locations: [{ locationId: 'locationId' }],
};

const title = {
  instanceId: 'instanceId',
  poLineId: orderLine.id,
};

const defaultProps = {
  location: {},
  match: {
    params: { id: 'titleId' },
  },
};

const renderComponent = (props = {}) => render(
  <PieceCreate
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('PieceCreate', () => {
  beforeEach(() => {
    PieceFormContainer.mockClear();

    useOrderLine
      .mockClear()
      .mockReturnValue({ orderLine });
    useTitle
      .mockClear()
      .mockReturnValue({ title });
  });

  it('should render new piece create form', () => {
    renderComponent();

    expect(PieceFormContainer.mock.calls[0][0].initialValues).toEqual(expect.objectContaining({
      locationId: orderLine.locations[0].locationId,
      poLineId: orderLine.id,
      titleId: defaultProps.match.params.id,
    }));
  });

  it('should render new piece create form based on provided template', () => {
    const pieceTemplate = {
      poLineId: orderLine.id,
      titleId: defaultProps.match.params.id,
      holdingId: 'holdingId',
    };

    renderComponent({
      location: {
        ...defaultProps.location,
        state: { pieceTemplate },
      },
    });

    expect(PieceFormContainer.mock.calls[0][0].initialValues).toEqual(pieceTemplate);
  });
});
