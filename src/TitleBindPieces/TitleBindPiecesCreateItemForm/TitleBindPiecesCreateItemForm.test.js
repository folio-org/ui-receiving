import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';
import {
  MemoryRouter,
} from 'react-router-dom';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import stripesFinalForm from '@folio/stripes/final-form';

import { TitleBindPiecesCreateItemForm } from './TitleBindPiecesCreateItemForm';

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  ConsortiumFieldInventory: () => 'ConsortiumFieldInventory',
  FieldInventory: () => 'FieldInventory',
}));
jest.mock('../hooks', () => ({
  useMaterialTypes: jest.fn().mockReturnValue({ materialTypes: [] }),
  useLoanTypes: jest.fn().mockReturnValue({ loanTypes: [] }),
}));

const defaultProps = {
  onChange: jest.fn(),
  locations: [{ id: '1', name: 'location1' }],
  instanceId: 'instanceId',
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <MemoryRouter>
      {children}
    </MemoryRouter>
  </QueryClientProvider>
);

const renderComponentForm = (props = {}) => (
  <form>
    <TitleBindPiecesCreateItemForm {...props} />,
  </form>
);

const FormComponent = stripesFinalForm({})(renderComponentForm);

const renderComponent = (props = defaultProps) => render(
  <FormComponent
    onSubmit={() => { }}
    initialValues={{}}
    {...props}
  />,
  { wrapper },
);

describe('TitleBindPiecesCreateItemForm', () => {
  beforeEach(() => {
  });

  it('should render component', () => {
    renderComponent();

    expect(screen.getByText('ui-receiving.piece.barcode')).toBeInTheDocument();
  });
});
