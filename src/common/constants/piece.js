import React from 'react';
import { FormattedMessage } from 'react-intl';

export const PIECE_STATUS = {
  expected: 'Expected',
  received: 'Received',
};

export const PIECE_FORMAT = {
  electronic: 'Electronic',
  physical: 'Physical',
  other: 'Other',
};

export const PIECE_FORMAT_LABELS = {
  [PIECE_FORMAT.electronic]: <FormattedMessage id="ui-receiving.piece.pieceFormat.electronic" />,
  [PIECE_FORMAT.physical]: <FormattedMessage id="ui-receiving.piece.pieceFormat.physical" />,
  [PIECE_FORMAT.other]: <FormattedMessage id="ui-receiving.piece.pieceFormat.other" />,
};

export const PIECE_FORMAT_OPTIONS = [
  { labelId: 'ui-receiving.piece.pieceFormat.electronic', value: PIECE_FORMAT.electronic },
  { labelId: 'ui-receiving.piece.pieceFormat.physical', value: PIECE_FORMAT.physical },
];

export const PIECE_STATUS_OPTIONS = Object.keys(PIECE_STATUS).map(status => ({
  value: PIECE_STATUS[status],
  label: <FormattedMessage id={`ui-receiving.piece.pieceStatus.${status}`} />,
}));
