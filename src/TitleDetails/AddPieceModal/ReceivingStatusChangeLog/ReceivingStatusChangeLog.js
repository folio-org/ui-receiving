import PropTypes from 'prop-types';
import { FormattedDate, FormattedMessage } from 'react-intl';

import {
  MultiColumnList,
  TextLink,
} from '@folio/stripes/components';
import { getFullName } from '@folio/stripes/util';

import { usePieceStatusChangeLog } from '../../hooks';

const COLUMN_NAMES = {
  status: 'status',
  eventDate: 'eventDate',
  user: 'user',
};

const COLUMN_MAPPING = {
  [COLUMN_NAMES.status]: <FormattedMessage id="ui-receiving.piece.statusChangeLog.column.status" />,
  [COLUMN_NAMES.eventDate]: <FormattedMessage id="ui-receiving.piece.statusChangeLog.column.date" />,
  [COLUMN_NAMES.user]: <FormattedMessage id="ui-receiving.piece.statusChangeLog.column.updatedBy" />,
};

const FORMATTER = {
  [COLUMN_NAMES.status]: item => item.receivingStatus,
  [COLUMN_NAMES.eventDate]: item => <FormattedDate value={item.eventDate} />,
  [COLUMN_NAMES.user]: item => (
    item.user
      ? <TextLink to={`/users/preview/${item.user.id}`}>{getFullName(item.user)}</TextLink>
      : <FormattedMessage id="stripes-acq-components.invalidReference" />
  ),
};

const VISIBLE_COLUMNS = Object.values(COLUMN_NAMES);

export const ReceivingStatusChangeLog = ({ piece }) => {
  const { isFetching, data } = usePieceStatusChangeLog(piece.id);

  return (
    <MultiColumnList
      id="piece-status-change-log"
      columnMapping={COLUMN_MAPPING}
      contentData={data}
      totalCount={data.length}
      formatter={FORMATTER}
      interactive={false}
      loading={isFetching}
      visibleColumns={VISIBLE_COLUMNS}
    />
  );
};

ReceivingStatusChangeLog.defaultProps = {
  piece: {},
};

ReceivingStatusChangeLog.propTypes = {
  piece: PropTypes.shape({
    id: PropTypes.string,
  }),
};
