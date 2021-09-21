import {
  useQuickReceive,
} from './useQuickReceive';
import {
  usePieceMutator,
} from './usePieceMutator';
import {
  useReceive,
} from './useReceive';

jest.mock('./usePieceMutator', () => ({
  usePieceMutator: jest.fn(),
}));
jest.mock('./useReceive', () => ({
  useReceive: jest.fn(),
}));

const pieceValues = {
  id: 'pieceId',
  holdingId: 'holdingId',
  caption: 'v1',
};

describe('useQuickReceive', () => {
  let mutatePieceMock;
  let receivePieceMock;

  beforeEach(() => {
    mutatePieceMock = jest.fn().mockReturnValue(Promise.resolve(pieceValues));
    receivePieceMock = jest.fn();

    usePieceMutator.mockClear().mockReturnValue({ mutatePiece: mutatePieceMock });
    useReceive.mockClear().mockReturnValue({ receive: receivePieceMock });
  });

  it('should call mutate piece', async () => {
    const { quickReceive } = useQuickReceive();

    await quickReceive(pieceValues);

    expect(mutatePieceMock).toHaveBeenCalled();
  });

  it('should call receive', async () => {
    const { quickReceive } = useQuickReceive();

    await quickReceive(pieceValues);

    expect(receivePieceMock).toHaveBeenCalled();
  });
});
