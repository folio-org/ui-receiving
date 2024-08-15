import React from 'react';
import { render, cleanup } from '@folio/jest-config-stripes/testing-library/react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import '@folio/stripes-acq-components/test/jest/__mock__';
import { INVENTORY_RECORDS_TYPE } from '@folio/stripes-acq-components';
import stripesFinalForm from '@folio/stripes/final-form';

import CreateItemField from './CreateItemField';

// eslint-disable-next-line react/prop-types
const renderForm = ({ piece }) => (
  <form>
    <CreateItemField
      createInventoryValues={{ test: INVENTORY_RECORDS_TYPE.all }}
      instanceId="instanceId"
      label="label"
      piece={piece}
      currentTenantId="currentTenantId"
    />
  </form>
);

const FromCmpt = stripesFinalForm({})(renderForm);

const renderCreateItemField = (piece) => (render(
  <IntlProvider locale="en">
    <MemoryRouter>
      <FromCmpt
        onSubmit={() => { }}
        piece={piece}
      />
    </MemoryRouter>
  </IntlProvider>,
));

describe('CreateItemField', () => {
  afterEach(cleanup);

  it('should display link to item', () => {
    const { getByTestId } = renderCreateItemField({ itemId: 'itemId', holdingsRecordId: 'holdingsRecordId' });

    expect(getByTestId('connected-link')).toBeDefined();
  });

  it('should display checkbox', () => {
    const { getByTestId } = renderCreateItemField({ format: 'test' });

    expect(getByTestId('isCreateItem')).toBeDefined();
  });

  it('displays nothing if createInventory is not set', () => {
    const { queryByTestId } = renderCreateItemField({});

    expect(queryByTestId('connected-link')).toBeNull();
    expect(queryByTestId('isCreateItem')).toBeNull();
  });

  it('should link be disabled if receivingTenantId is different from currentTenantId', () => {
    const { getByTestId } = renderCreateItemField({
      receivingTenantId: 'receivingTenantId',
      holdingsRecordId: 'holdingsRecordId',
      itemId: 'itemId',
    });

    expect(getByTestId('connected-link').closest('a')).toHaveClass('disabled');
  });
});
