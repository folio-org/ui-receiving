import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { includes } from 'lodash';
import { Link } from 'react-router-dom';

import {
  Checkbox,
  Icon,
  KeyValue,
} from '@folio/stripes/components';
import { INVENTORY_RECORDS_TYPE } from '@folio/stripes-acq-components';

function CreateItemField({ createInventoryValues, instanceId, label, piece, name }) {
  const { format, itemId } = piece;
  const isAddItemAvailable = includes(createInventoryValues[format], INVENTORY_RECORDS_TYPE.all);

  if (itemId) {
    return (
      <KeyValue label={label}>
        <Link
          data-test-connected-link
          data-testid="connected-link"
          to={`/inventory/view/${instanceId}`}
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
        fullWidth
        label={label}
        name={name}
        type="checkbox"
        vertical
      />
    );
  } else return null;
}

CreateItemField.propTypes = {
  createInventoryValues: PropTypes.object.isRequired,
  instanceId: PropTypes.string,
  label: PropTypes.node,
  name: PropTypes.string,
  piece: PropTypes.object.isRequired,
};

CreateItemField.defaultProps = {
  name: 'isCreateItem',
};

export default CreateItemField;
