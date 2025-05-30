import { useHistory } from 'react-router-dom';

import { screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';
import { useOkapiKy } from '@folio/stripes/core';

import { renderWithRouter } from 'helpers';
import TitleForm from './TitleForm';
import { useReceivingSearchContext } from '../contexts';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  useAcqRestrictions: jest.fn().mockReturnValue({
    restrictions: {
      protectUpdate: false,
    },
    isLoading: false,
  }),
}));
jest.mock('@folio/stripes-acq-components/lib/hooks', () => ({
  ...jest.requireActual('@folio/stripes-acq-components/lib/hooks'),
  useAcquisitionUnits: jest.fn(() => ({ acquisitionsUnits: [] })),
  useContributorNameTypes: jest.fn(() => ({ contributorNameTypes: [] })),
  useIdentifierTypes: jest.fn(() => ({ identifierTypes: [] })),
}));
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));

const defaultProps = {
  onCancel: jest.fn(),
  onSubmit: jest.fn(),
  initialValues: { metadata: {} },
};

const kyMock = {
  extend: () => kyMock,
  get: jest.fn(() => ({
    json: () => Promise.resolve({}),
  })),
  delete: jest.fn(() => Promise.resolve()),
};

const defaultReceivingSearchContextValue = {
  isCentralRouting: false,
  isTargetTenantForeign: false,
  targetTenantId: 'tenant-1',
};

const renderTitleForm = (props = {}) => renderWithRouter(
  <TitleForm
    {...defaultProps}
    {...props}
  />,
);

describe('TitleForm', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
    useReceivingSearchContext.mockReturnValue(defaultReceivingSearchContextValue);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display title', () => {
    const { getByText } = renderTitleForm();

    expect(getByText('ui-receiving.title.paneTitle.create')).toBeDefined();
  });

  it('should display edit title', () => {
    const { getByText } = renderTitleForm({ initialValues: { id: 'id', title: 'TEST' } });

    expect(getByText('TEST')).toBeDefined();
  });

  it('should display pane footer', () => {
    const { getByText } = renderTitleForm();

    expect(getByText('stripes-acq-components.FormFooter.cancel')).toBeDefined();
    expect(getByText('stripes-acq-components.FormFooter.save')).toBeDefined();
  });

  it('should clear the \'Claiming interval\' field when a user unchecked \'Claiming active\' checkbox', async () => {
    renderTitleForm();

    const claimingActiveField = screen.getByRole('checkbox', { name: 'ui-receiving.title.claimingActive' });
    const claimingIntervalField = screen.getByLabelText('ui-receiving.title.claimingInterval');

    await user.click(claimingActiveField);
    await user.type(claimingIntervalField, '42');

    expect(claimingActiveField).toBeChecked();
    expect(claimingIntervalField).toHaveValue(42);

    await user.click(claimingActiveField);

    expect(claimingActiveField).not.toBeChecked();
    expect(claimingIntervalField).toHaveValue(null);
  });

  it('should validate \'Claiming interval\' field', async () => {
    renderTitleForm();

    const claimingActiveField = screen.getByRole('checkbox', { name: 'ui-receiving.title.claimingActive' });
    const claimingIntervalField = screen.getByLabelText('ui-receiving.title.claimingInterval');

    // Shouldn't be required if "Claiming active" unchecked
    expect(claimingIntervalField).not.toBeRequired();
    expect(claimingIntervalField).toBeValid();

    await user.click(claimingActiveField);
    expect(claimingIntervalField).toBeRequired();
    expect(claimingIntervalField).not.toBeValid();

    await user.type(claimingIntervalField, '-2');
    expect(claimingIntervalField).toHaveValue(-2);
    expect(claimingIntervalField).not.toBeValid();

    await user.clear(claimingIntervalField);
    await user.type(claimingIntervalField, '0');
    expect(claimingIntervalField).toHaveValue(0);
    expect(claimingIntervalField).not.toBeValid();

    await user.clear(claimingIntervalField);
    await user.type(claimingIntervalField, '69');
    expect(claimingIntervalField).toHaveValue(69);
    expect(claimingIntervalField).toBeValid();
  });

  describe('Close form', () => {
    it('should close Title form', async () => {
      const { getByText } = renderTitleForm();

      await user.click(getByText('stripes-acq-components.FormFooter.cancel'));

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      expandAllSections.mockClear();
      collapseAllSections.mockClear();
    });

    it('should call expandAllSections when expandAllSections shortcut is called', async () => {
      expandAllSections.mockClear();
      renderTitleForm();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', () => {
      collapseAllSections.mockClear();
      renderTitleForm();

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();

      expect(collapseAllSections).toHaveBeenCalled();
    });

    it('should cancel form when cancel shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderTitleForm();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'cancel').handler();

      expect(defaultProps.onCancel).toHaveBeenCalled();
    });

    it('should navigate to list view when search shortcut is called', () => {
      const pushMock = jest.fn();

      useHistory.mockClear().mockReturnValue({
        push: pushMock,
      });

      renderTitleForm();
      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'search').handler();

      expect(pushMock).toHaveBeenCalledWith('/receiving');
    });
  });

  describe('Actions', () => {
    it('should handle "Remove from package" action for packaged title', async () => {
      renderTitleForm({
        initialValues: {
          id: 'id',
          title: 'TEST',
          poLine: {
            isPackage: true,
          },
        },

      });

      await user.click(screen.getByRole('button', { name: 'ui-receiving.title.paneTitle.removeFromPackage' }));
      await user.click(screen.getByRole('button', { name: 'ui-receiving.title.confirmationModal.removeFromPackage.confirm' }));

      expect(kyMock.delete).toHaveBeenCalled();
    });

    it('should not display "Remove from package" action for non-packaged title', () => {
      renderTitleForm({
        initialValues: {
          id: 'id',
          title: 'TEST',
          poLine: {
            isPackage: false,
          },
        },
      });

      expect(screen.queryByRole('button', { name: 'ui-receiving.title.paneTitle.removeFromPackage' })).not.toBeInTheDocument();
    });

    it('should not display "Remove from package" action for title from foreign tenant', () => {
      useReceivingSearchContext.mockReturnValue({
        ...defaultReceivingSearchContextValue,
        isTargetTenantForeign: true,
        isCentralRouting: true,
      });

      renderTitleForm({
        initialValues: {
          id: 'id',
          title: 'TEST',
          poLine: {
            isPackage: false,
          },
        },
      });

      expect(screen.queryByRole('button', { name: 'ui-receiving.title.paneTitle.removeFromPackage' })).not.toBeInTheDocument();
    });
  });
});
