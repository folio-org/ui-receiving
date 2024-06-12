import React from 'react';
import { render, cleanup } from '@folio/jest-config-stripes/testing-library/react';
import { IntlProvider } from 'react-intl';

import '@folio/stripes-acq-components/test/jest/__mock__';

import { usePaginatedPieces } from '../../common/hooks';
import { BoundPiecesList } from './BoundPiecesList';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn().mockReturnValue({ hasPerm: jest.fn().mockReturnValue(true) }),
}));
jest.mock('../../common/hooks', () => ({
  usePaginatedPieces: jest.fn(),
}));

const pieces = [{
  barcode: 'v1',
  isBound: true,
  displaySummary: 'Electronic item',
  status: { name: 'Available' },
}];

const renderBoundPiecesList = () => (render(
  <IntlProvider locale="en">
    <BoundPiecesList
      id="boundPiecesListId"
      filters={{}}
      title={{ id: 'titleId' }}
    />
  </IntlProvider>,
));

describe('BoundPiecesList', () => {
  beforeEach(() => {
    usePaginatedPieces.mockClear().mockReturnValue({
      pieces,
      totalCount: pieces.length,
      isFetching: false,
    });
  });

  afterEach(cleanup);

  it('should render component', () => {
    const { getByText } = renderBoundPiecesList();

    expect(getByText('ui-receiving.piece.callNumber')).toBeInTheDocument();
    expect(getByText('ui-receiving.piece.displaySummary')).toBeInTheDocument();
    expect(getByText('ui-receiving.piece.barcode')).toBeInTheDocument();
    expect(getByText('ui-receiving.piece.status')).toBeInTheDocument();

    expect(getByText(pieces[0].barcode)).toBeInTheDocument();
  });
});
