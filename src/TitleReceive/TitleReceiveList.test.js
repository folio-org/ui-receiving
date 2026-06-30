import React from 'react';
import { Form } from 'react-final-form';
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import { MultiColumnList } from '@folio/stripes/components';

import { useNumberGeneratorOptions } from '../common/hooks';
import {
  ACCESSION_NUMBER_SETTING,
  BARCODE_SETTING,
  CALL_NUMBER_SETTING,
  GENERATOR_ON_EDITABLE,
  GENERATOR_ON,
  GENERATOR_OFF,
} from '../common/constants';
import { TitleReceiveList } from './TitleReceiveList';

jest.mock('../common/hooks', () => ({
  useNumberGeneratorOptions: jest.fn(),
}));

jest.mock('@folio/stripes/components', () => {
  const actual = jest.requireActual('@folio/stripes/components');

  return {
    ...actual,
    MultiColumnList: jest.fn(actual.MultiColumnList),
  };
});

const defaultProps = {
  fields: {
    value: [{ rowIndex: 0, itemId: null, isCreateItem: true }],
  },
  props: {
    crossTenant: false,
    createInventoryValues: {},
    selectLocation: jest.fn(),
    toggleCheckedAll: jest.fn(),
    poLineLocationIds: [],
    locations: [],
  },
};

const queryClient = new QueryClient();
const buildTitleReceiveList = (props = {}) => (
  <QueryClientProvider client={queryClient}>
    <Form onSubmit={() => {}} render={() => <TitleReceiveList {...defaultProps} {...props} />} />
  </QueryClientProvider>
);
const renderTitleReceiveList = (props = {}) => render(buildTitleReceiveList(props));

describe('Render TitleReceiveList', () => {
  beforeEach(() => {
    MultiColumnList.mockClear();
    useNumberGeneratorOptions.mockReturnValue({ data: {} });
  });

  it('should render MultiColumnList with autosize prop', () => {
    renderTitleReceiveList();

    expect(MultiColumnList).toHaveBeenCalledWith(
      expect.objectContaining({ autosize: true }),
      expect.anything(),
    );
  });

  it('should not show the number generator button if generator settings are off', async () => {
    useNumberGeneratorOptions.mockReturnValue({
      data: {
        [BARCODE_SETTING]: GENERATOR_OFF,
        [CALL_NUMBER_SETTING]: GENERATOR_OFF,
        [ACCESSION_NUMBER_SETTING]: GENERATOR_OFF,
      },
      isLoading: false,
      error: null,
    });

    renderTitleReceiveList({ props: null });

    const button = screen.queryByRole('button', { name: 'ui-receiving.numberGenerator.generateForRow' });

    expect(button).not.toBeInTheDocument();
  });

  it('should enable the number generator button when generator settings are on or editable', async () => {
    useNumberGeneratorOptions.mockReturnValue({
      data: {
        [BARCODE_SETTING]: GENERATOR_ON,
        [CALL_NUMBER_SETTING]: GENERATOR_ON_EDITABLE,
        [ACCESSION_NUMBER_SETTING]: GENERATOR_OFF,
      },
      isLoading: false,
      error: null,
    });

    renderTitleReceiveList({ props: {} });

    const button = screen.getByRole('button', { name: 'ui-receiving.numberGenerator.generateForRow' });

    expect(button).toBeEnabled();
  });

  it('should keep contentData reference stable when only form-bound fields change', () => {
    const baseRecord = { id: 'a', itemId: 'i', format: 'P', isCreateItem: false };
    const fieldsWith = (value) => ({ fields: { value: [value], name: 'receivedItems' } });

    const { rerender } = render(buildTitleReceiveList(fieldsWith({ ...baseRecord, displaySummary: 'old' })));
    const firstContentData = MultiColumnList.mock.calls[0][0].contentData;

    MultiColumnList.mockClear();
    rerender(buildTitleReceiveList(fieldsWith({ ...baseRecord, displaySummary: 'new' })));

    const secondContentData = MultiColumnList.mock.calls[0][0].contentData;

    expect(secondContentData).toBe(firstContentData);
  });

  it('should rebuild contentData reference when a record field changes', () => {
    const baseRecord = { id: 'a', itemId: 'i', isCreateItem: false, displaySummary: 'x' };
    const fieldsWith = (value) => ({ fields: { value: [value], name: 'receivedItems' } });

    const { rerender } = render(buildTitleReceiveList(fieldsWith({ ...baseRecord, format: 'Physical' })));
    const firstContentData = MultiColumnList.mock.calls[0][0].contentData;

    MultiColumnList.mockClear();
    rerender(buildTitleReceiveList(fieldsWith({ ...baseRecord, format: 'Electronic' })));

    const secondContentData = MultiColumnList.mock.calls[0][0].contentData;

    expect(secondContentData).not.toBe(firstContentData);
  });

  it('should show the number generator modal when a number generator is enabled', async () => {
    const setNumberGeneratorModalRecordMock = jest.fn();

    jest.spyOn(React, 'useState').mockImplementationOnce((initialState) => [initialState, setNumberGeneratorModalRecordMock]);

    useNumberGeneratorOptions.mockReturnValue({
      data: {
        [ACCESSION_NUMBER_SETTING]: GENERATOR_ON,
        [BARCODE_SETTING]: GENERATOR_ON,
        [CALL_NUMBER_SETTING]: GENERATOR_ON,
      },
      isLoading: false,
      error: null,
    });

    renderTitleReceiveList({
      props: {
        ...defaultProps.props,
        setNumberGeneratorModalRecord: setNumberGeneratorModalRecordMock,
      },
    });

    const button = screen.getByRole('button', { name: 'ui-receiving.numberGenerator.generateForRow' });

    user.click(button);

    expect(setNumberGeneratorModalRecordMock).toHaveBeenCalled();
  });
});
