import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import TitleForm from './TitleForm';
import TitleFormContainer from './TitleFormContainer';

jest.mock('./TitleForm', () => jest.fn().mockReturnValue('TitleForm'));

const mutatorMock = {
  titles: { POST: jest.fn() },
  identifierTypes: { GET: jest.fn().mockReturnValue(Promise.resolve([])) },
  contributorNameTypes: { GET: jest.fn().mockReturnValue(Promise.resolve([])) },
};
const locationMock = { hash: 'hash', pathname: 'pathname', search: 'search' };
const historyMock = {
  push: jest.fn(),
  replace: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  listen: jest.fn(),
  location: locationMock,
};

const defaultProps = {
  mutator: mutatorMock,
  match: { params: { id: 'titleId' }, path: 'path', url: 'url' },
  location: locationMock,
  history: historyMock,
};

const renderTitleFormContainer = (props = defaultProps) => render(
  <TitleFormContainer
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('TitleFormContainer', () => {
  beforeEach(() => {
    TitleForm.mockClear();

    historyMock.push.mockClear();
    mutatorMock.titles.POST.mockClear();
    mutatorMock.identifierTypes.GET.mockClear();
    mutatorMock.contributorNameTypes.GET.mockClear();
  });

  it('should display title form', async () => {
    await act(async () => renderTitleFormContainer());

    expect(screen.getByText('TitleForm')).toBeDefined();
  });

  it('should display title form even if identifierTypes and contributorNameTypes were not fetched', async () => {
    mutatorMock.identifierTypes.GET.mockReturnValue(Promise.reject());
    mutatorMock.contributorNameTypes.GET.mockReturnValue(Promise.reject());

    await act(async () => renderTitleFormContainer());

    expect(screen.getByText('TitleForm')).toBeDefined();
  });

  it('should fetch identifierTypes and contributorNameTypes', async () => {
    await act(async () => renderTitleFormContainer());

    expect(mutatorMock.identifierTypes.GET).toHaveBeenCalled();
    expect(mutatorMock.contributorNameTypes.GET).toHaveBeenCalled();
  });

  it('should redirect to title list when create is cancelled', async () => {
    await act(async () => renderTitleFormContainer());

    TitleForm.mock.calls[0][0].onCancel();

    expect(historyMock.push).toHaveBeenCalled();
  });

  it('should save title', async () => {
    mutatorMock.titles.POST.mockReturnValue(Promise.resolve({}));

    await act(async () => renderTitleFormContainer());

    TitleForm.mock.calls[0][0].onSubmit({});

    expect(mutatorMock.titles.POST).toHaveBeenCalled();
  });
});
