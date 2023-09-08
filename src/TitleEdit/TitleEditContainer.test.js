import React from 'react';
import { act, render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router';

import TitleForm from '../TitleForm/TitleForm';
import TitleEditContainer from './TitleEditContainer';

jest.mock('../TitleForm/TitleForm', () => jest.fn().mockReturnValue('TitleForm'));

const mutatorMock = {
  editTitle: {
    PUT: jest.fn(),
    GET: jest.fn().mockReturnValue(Promise.resolve({ id: 'titleId' })),
  },
  identifierTypes: { GET: jest.fn().mockReturnValue(Promise.resolve([])) },
  contributorNameTypes: { GET: jest.fn().mockReturnValue(Promise.resolve([])) },
  editTitlePOLine: { GET: jest.fn().mockReturnValue(Promise.resolve({})) },
};
const locationMock = { hash: 'hash', pathname: 'pathname', search: 'search' };
const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  listen: jest.fn(),
  location: locationMock,
  replace: jest.fn(),
};

const defaultProps = {
  mutator: mutatorMock,
  match: { params: { id: 'titleId' }, path: 'path', url: 'url' },
  location: locationMock,
  history: historyMock,
};

const renderTitleEditContainer = (props = defaultProps) => render(
  <TitleEditContainer
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('TitleEditContainer', () => {
  beforeEach(() => {
    TitleForm.mockClear();

    historyMock.push.mockClear();
    mutatorMock.editTitle.PUT.mockClear();
    mutatorMock.identifierTypes.GET.mockClear();
    mutatorMock.contributorNameTypes.GET.mockClear();
  });

  it('should display title form', async () => {
    await act(async () => renderTitleEditContainer());

    expect(mutatorMock.editTitle.GET).toHaveBeenCalled();
    expect(screen.getByText('TitleForm')).toBeDefined();
  });

  it('should display title form even if identifierTypes and contributorNameTypes were not fetched', async () => {
    mutatorMock.identifierTypes.GET.mockReturnValue(Promise.reject());
    mutatorMock.contributorNameTypes.GET.mockReturnValue(Promise.reject());

    await act(async () => renderTitleEditContainer());

    expect(screen.getByText('TitleForm')).toBeDefined();
  });

  it('should fetch identifierTypes and contributorNameTypes', async () => {
    await act(async () => renderTitleEditContainer());

    expect(mutatorMock.identifierTypes.GET).toHaveBeenCalled();
    expect(mutatorMock.contributorNameTypes.GET).toHaveBeenCalled();
  });

  it('should redirect to title list when create is cancelled', async () => {
    await act(async () => renderTitleEditContainer());

    TitleForm.mock.calls[0][0].onCancel();

    expect(historyMock.push).toHaveBeenCalled();
  });

  it('should save title', async () => {
    mutatorMock.editTitle.PUT.mockReturnValue(Promise.resolve({}));

    await act(async () => renderTitleEditContainer());

    TitleForm.mock.calls[0][0].onSubmit({
      poLine: {
        poLineNumber: '10001-1',
      },
    });

    expect(mutatorMock.editTitle.PUT).toHaveBeenCalled();
  });
});
