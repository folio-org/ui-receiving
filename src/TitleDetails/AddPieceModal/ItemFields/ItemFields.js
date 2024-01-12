import PropTypes from 'prop-types';
import { Field, useFormState } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  InfoPopover,
  KeyValue,
  Row,
  TextField,
} from '@folio/stripes/components';
import { getItemStatusLabel } from '@folio/stripes-acq-components';

export const ItemFields = ({ disabled }) => {
  const { values } = useFormState();

  return (
    <>
      <Row>
        <Col
          xs={6}
          md={3}
        >
          <Field
            name="barcode"
            component={TextField}
            label={<FormattedMessage id="ui-receiving.piece.barcode" />}
            disabled={disabled}
            fullWidth
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <Field
            name="itemLevelCallNumber"
            component={TextField}
            label={<FormattedMessage id="ui-receiving.piece.callNumber" />}
            disabled={disabled}
            fullWidth
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <Field
            name="accessionNumber"
            component={TextField}
            label={<FormattedMessage id="ui-receiving.piece.accessionNumber" />}
            disabled={disabled}
            fullWidth
          />
        </Col>
      </Row>
      <Row>
        <Col
          xs={6}
          md={3}
        >
          <KeyValue
            label={(
              <>
                <FormattedMessage id="ui-receiving.piece.itemStatus" />
                <InfoPopover content={(<FormattedMessage id="ui-receiving.piece.itemStatus.info" />)} />
              </>
          )}
            value={getItemStatusLabel(values.itemStatus)}
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.piece.request" />}
            value={values.request ? <FormattedMessage id="ui-receiving.piece.request.isOpened" /> : null}
          />
        </Col>
      </Row>
    </>
  );
};

ItemFields.propTypes = {
  disabled: PropTypes.bool,
};
