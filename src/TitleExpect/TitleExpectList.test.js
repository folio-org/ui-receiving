import { FieldArray } from 'react-final-form-arrays';
import { MemoryRouter } from 'react-router-dom';

import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import user from '@folio/jest-config-stripes/testing-library/user-event';
import stripesFinalForm from '@folio/stripes/final-form';

import { TITLE_EXPECT_PIECES_VISIBLE_COLUMNS } from './constants';
import { TitleExpectList } from './TitleExpectList';

const defaultProps = {
  pieceLocationMap: {},
  pieceHoldingMap: {},
  toggleCheckedAll: jest.fn(),
};

const piece = {
  id: 'piece-id',
  caption: 'Test piece',
};

const FormComponent = stripesFinalForm({})(({ children }) => <form>{children}</form>);

const renderTitleExpectList = (props = {}, formProps = {}) => render(
  <FormComponent
    onSubmit={jest.fn}
    initialValues={{ test: [piece] }}
    {...formProps}
  >
    <FieldArray
      component={TitleExpectList}
      name="test"
      props={{
        ...defaultProps,
        ...props,
      }}
    />
  </FormComponent>,
  { wrapper: MemoryRouter },
);

describe('TitleExpectList', () => {
  it('should render pieces list', () => {
    renderTitleExpectList();

    TITLE_EXPECT_PIECES_VISIBLE_COLUMNS.slice(1).forEach((column) => {
      expect(screen.getByText(`ui-receiving.piece.${column}`)).toBeInTheDocument();
    });
  });

  it('should call \'toggleCheckedAll\' when "Select all" checked', async () => {
    renderTitleExpectList();

    await user.click(screen.getByLabelText('ui-receiving.piece.actions.selectAll'));

    expect(defaultProps.toggleCheckedAll).toHaveBeenCalled();
  });
});
