import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import {
  HasCommand,
  expandAllSections,
  collapseAllSections,
} from '@folio/stripes/components';

import TitleDetails from './TitleDetails';
import { TitleDetailsExpectedActions } from './TitleDetailsActions';

jest.mock('@folio/stripes-components/lib/Commander', () => ({
  HasCommand: jest.fn(({ children }) => <div>{children}</div>),
  expandAllSections: jest.fn(),
  collapseAllSections: jest.fn(),
}));
jest.mock('./TitleInformation', () => jest.fn().mockReturnValue('TitleInformation'));
jest.mock('./ExpectedPiecesList', () => jest.fn().mockReturnValue('ExpectedPiecesList'));
jest.mock('./ReceivedPiecesList', () => jest.fn().mockReturnValue('ReceivedPiecesList'));
jest.mock('./TitleDetailsActions', () => ({
  TitleDetailsExpectedActions: jest.fn().mockReturnValue('TitleDetailsExpectedActions'),
  TitleDetailsReceivedActions: jest.fn().mockReturnValue('TitleDetailsReceivedActions'),
}));
jest.mock('./Title', () => jest.fn().mockReturnValue('Title'));
jest.mock('./POLDetails', () => jest.fn().mockReturnValue('POLDetails'));
jest.mock('./AddPieceModal', () => jest.fn().mockReturnValue('AddPieceModal'));

const locationMock = { hash: 'hash', pathname: 'pathname', search: 'search' };
const historyMock = {
  push: jest.fn(),
  action: 'PUSH',
  block: jest.fn(),
  createHref: jest.fn(),
  go: jest.fn(),
  listen: jest.fn(),
  location: locationMock,
};
const matchMock = { params: { id: 'titleId' }, path: 'path', url: 'url' };
const defaultProps = {
  order: {},
  pieces: [{ id: 'id', receivingStatus: 'expected' }],
  poLine: { locations: [{ locationId: 'id' }] },
  title: {},
  vendorsMap: {},
  locations: [],
  onEdit: jest.fn(),
  onClose: jest.fn(),
  onCheckIn: jest.fn(),
  onAddPiece: jest.fn(),
  deletePiece: jest.fn(),
  location: locationMock,
  history: historyMock,
  match: matchMock,
};

const renderTitleDetails = (props = defaultProps) => (render(
  <TitleDetails
    {...props}
  />,
  { wrapper: MemoryRouter },
));

describe('TitleDetails', () => {
  it('should display title details accordions', async () => {
    await act(async () => renderTitleDetails());

    expect(screen.getByText('ui-receiving.title.information')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.polDetails')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.expected')).toBeDefined();
    expect(screen.getByText('ui-receiving.title.received')).toBeDefined();
  });

  it('should open add piece modal and stay on title details', async () => {
    await act(async () => renderTitleDetails());

    await act(async () => TitleDetailsExpectedActions.mock.calls[0][0].openAddPieceModal());

    expect(screen.getByText('Title')).toBeDefined();
  });

  describe('Shortcuts', () => {
    beforeEach(() => {
      HasCommand.mockClear();
      expandAllSections.mockClear();
      collapseAllSections.mockClear();
      historyMock.push.mockClear();
    });

    it('should call expandAllSections when expandAllSections shortcut is called', async () => {
      await act(async () => renderTitleDetails());

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'expandAllSections').handler();

      expect(expandAllSections).toHaveBeenCalled();
    });

    it('should call collapseAllSections when collapseAllSections shortcut is called', async () => {
      await act(async () => renderTitleDetails());

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'collapseAllSections').handler();

      expect(collapseAllSections).toHaveBeenCalled();
    });

    it('should navigate to edit view when edit shortcut is called', async () => {
      await act(async () => renderTitleDetails());

      HasCommand.mock.calls[0][0].commands.find(c => c.name === 'edit').handler();

      expect(defaultProps.onEdit).toHaveBeenCalled();
    });
  });
});
