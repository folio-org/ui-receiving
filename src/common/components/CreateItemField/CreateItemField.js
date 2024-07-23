import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import { includes } from 'lodash';
import { Link } from 'react-router-dom';

import {
  Checkbox,
  Icon,
  KeyValue,
  NoValue,
} from '@folio/stripes/components';
import {
  INVENTORY_RECORDS_TYPE,
  PIECE_STATUS,
} from '@folio/stripes-acq-components';

import { PIECE_FORM_FIELD_NAMES } from '../../../TitleDetails/constants';

function CreateItemField({ createInventoryValues, instanceId, label, piece, name }) {
  const {
    bindItemId,
    format,
    holdingsRecordId,
    isBound,
    itemId,
    receivingStatus,
  } = piece;
  const isAddItemAvailable =
    includes(createInventoryValues[format], INVENTORY_RECORDS_TYPE.all)
    && Boolean(instanceId);
  const isReceived = receivingStatus === PIECE_STATUS.received;
  const currentItemId = isBound ? bindItemId : itemId;

  const intl = useIntl();

  if (currentItemId && holdingsRecordId) {
    return (
      <KeyValue label={label}>
        <Link
          data-test-connected-link
          data-testid="connected-link"
          to={`/inventory/view/${instanceId}/${holdingsRecordId}/${currentItemId}`}
        >
          <FormattedMessage id="ui-receiving.piece.connectedItem" />
          <Icon
            size="small"
            icon="external-link"
          />
        </Link>
      </KeyValue>
    );
  } else if (isAddItemAvailable) {
    return (
      <Field
        component={Checkbox}
        data-testid="isCreateItem"
        disabled={isReceived}
        fullWidth
        label={label}
        name={name}
        type="checkbox"
        vertical
        aria-label={intl.formatMessage({ id: 'ui-receiving.piece.createItem' })}
      />
    );
  } else return <NoValue />;
}

CreateItemField.propTypes = {
  createInventoryValues: PropTypes.object.isRequired,
  instanceId: PropTypes.string,
  label: PropTypes.node,
  name: PropTypes.string,
  piece: PropTypes.object.isRequired,
};

CreateItemField.defaultProps = {
  name: PIECE_FORM_FIELD_NAMES.isCreateItem,
};

export default CreateItemField;
