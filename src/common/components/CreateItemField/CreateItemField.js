import includes from 'lodash/includes';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
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

import { useReceivingSearchContext } from '../../../contexts';
import { PIECE_FORM_FIELD_NAMES } from '../../constants';

import css from './style.css';

function CreateItemField({
  createInventoryValues,
  instanceId,
  label,
  name = PIECE_FORM_FIELD_NAMES.isCreateItem,
  piece,
}) {
  const { activeTenantId: currentTenantId } = useReceivingSearchContext();

  const {
    bindItemId,
    format,
    holdingsRecordId,
    isBound,
    itemId,
    receivingStatus,
    receivingTenantId,
  } = piece;

  const isReceived = receivingStatus === PIECE_STATUS.received;
  const isAddItemAvailable = (
    includes(createInventoryValues[format], INVENTORY_RECORDS_TYPE.all)
      && Boolean(instanceId)
      && !itemId
  );

  const currentItemId = isBound ? bindItemId : itemId;
  const isLinkDisabled = (receivingTenantId && currentTenantId) && (receivingTenantId !== currentTenantId);

  const intl = useIntl();

  if (isAddItemAvailable) {
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
  }

  if (itemId && holdingsRecordId) {
    return (
      <KeyValue label={label}>
        <Link
          data-test-connected-link
          data-testid="connected-link"
          className={isLinkDisabled ? css.disabled : ''}
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
  }

  return <KeyValue label={label} value={<NoValue />} />;
}

CreateItemField.propTypes = {
  createInventoryValues: PropTypes.object.isRequired,
  instanceId: PropTypes.string,
  label: PropTypes.node,
  name: PropTypes.string,
  piece: PropTypes.object.isRequired,
};

export default CreateItemField;
