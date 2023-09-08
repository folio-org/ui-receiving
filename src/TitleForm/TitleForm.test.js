import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { useHistory } from 'react-router';
import { Form } from 'react-final-form';
import { render } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';

import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import TitleForm from './TitleForm';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useHistory: jest.fn(),
}));

const defaultProps = {
  onCancel: jest.fn(),
  form: {},
  onSubmit: jest.fn(),
  pristine: false,
  submitting: false,
  initialValues: { metadata: {} },
};

const renderTitleForm = (props = defaultProps) => (render(
  <Form
    onSubmit={jest.fn}
    render={() => (
      <TitleForm
        {...props}
      />
    )}
  />,
  { wrapper: MemoryRouter },
));

describe('TitleForm', () => {
  it('should display title', () => {
    const { getByText } = renderTitleForm();

    expect(getByText('ui-receiving.title.paneTitle.create')).toBeDefined();
  });

  it('should display edit title', () => {
    const { getByText } = renderTitleForm({ ...defaultProps, initialValues: { id: 'id', title: 'TEST' } });

    expect(getByText('TEST')).toBeDefined();
  });

  it('should display pane footer', () => {
    const { getByText } = renderTitleForm();

    expect(getByText('stripes-acq-components.FormFooter.cancel')).toBeDefined();
    expect(getByText('stripes-acq-components.FormFooter.save')).toBeDefined();
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
});
