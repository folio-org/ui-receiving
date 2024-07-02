import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  MultiColumnList,
  NoValue,
  TextLink,
} from '@folio/stripes/components';
import { getFullName } from '@folio/stripes/util';
import { FolioFormattedDate } from '@folio/stripes-acq-components';

import { isSyntheticUser } from '../../../common/utils';
import { useReceivingSearchContext } from '../../../contexts';
import { usePieceStatusChangeLog } from '../../hooks';

const COLUMN_NAMES = {
  status: 'status',
  eventDate: 'eventDate',
  interval: 'interval',
  user: 'user',
};

const COLUMN_MAPPING = {
  [COLUMN_NAMES.status]: <FormattedMessage id="ui-receiving.piece.statusChangeLog.column.status" />,
  [COLUMN_NAMES.eventDate]: <FormattedMessage id="ui-receiving.piece.statusChangeLog.column.date" />,
  [COLUMN_NAMES.interval]: <FormattedMessage id="ui-receiving.piece.statusChangeLog.column.interval" />,
  [COLUMN_NAMES.user]: <FormattedMessage id="ui-receiving.piece.statusChangeLog.column.updatedBy" />,
};

const FORMATTER = {
  [COLUMN_NAMES.status]: item => item.receivingStatus,
  [COLUMN_NAMES.eventDate]: item => <FolioFormattedDate value={item.eventDate} />,
  [COLUMN_NAMES.interval]: item => item.claimingInterval || <NoValue />,
  [COLUMN_NAMES.user]: item => {
    if (!item.user) return <FormattedMessage id="stripes-acq-components.invalidReference" />;

    return isSyntheticUser(item.user.id)
      ? <FormattedMessage id="ui-receiving.systemUser.label" />
      : <TextLink to={`/users/preview/${item.user.id}`}>{getFullName(item.user)}</TextLink>;
  },
};

const VISIBLE_COLUMNS = Object.values(COLUMN_NAMES);

export const ReceivingStatusChangeLog = ({ piece }) => {
  const { targetTenantId } = useReceivingSearchContext();
  const { isFetching, data } = usePieceStatusChangeLog(piece.id, { tenantId: targetTenantId });

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
