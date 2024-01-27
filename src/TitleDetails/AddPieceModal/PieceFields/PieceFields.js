import includes from 'lodash/includes';
import PropTypes from 'prop-types';
import { Field, useFormState } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  Col,
  Row,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import {
  FieldDatepickerFinal,
  FieldInventory,
  FieldSelectFinal,
  INVENTORY_RECORDS_TYPE,
  PIECE_STATUS,
} from '@folio/stripes-acq-components';

import {
  CreateItemField,
  LineLocationsView,
} from '../../../common/components';

export const PieceFields = ({
  createInventoryValues,
  instanceId,
  locationIds,
  locations,
  pieceFormatOptions,
  poLine,
  setLocationValue,
  onChangeDisplayOnHolding,
}) => {
  const { values } = useFormState();

  const isNotReceived = values.receivingStatus !== PIECE_STATUS.received;
  const isLocationRequired = includes(createInventoryValues[values.format], INVENTORY_RECORDS_TYPE.instanceAndHolding);

  // https://issues.folio.org/browse/UIREC-208
  const isDiscoverySuppressEnabled = false;

  return (
    <>
      <Row>
        <Col
          xs={6}
          md={3}
        >
          <Field
            component={TextField}
            fullWidth
            id="displaySummary"
            label={<FormattedMessage id="ui-receiving.piece.displaySummary" />}
            name="displaySummary"
            type="text"
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <Field
            component={TextField}
            fullWidth
            id="copyNumber"
            label={<FormattedMessage id="ui-receiving.piece.copyNumber" />}
            name="copyNumber"
            type="text"
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <Field
            component={TextField}
            fullWidth
            id="enumeration"
            label={<FormattedMessage id="ui-receiving.piece.enumeration" />}
            name="enumeration"
            type="text"
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <Field
            component={TextField}
            fullWidth
            id="chronology"
            label={<FormattedMessage id="ui-receiving.piece.chronology" />}
            name="chronology"
            type="text"
          />
        </Col>
      </Row>

      <Row>
        <Col
          xs={6}
          md={3}
        >
          <FieldSelectFinal
            dataOptions={pieceFormatOptions}
            disabled={!isNotReceived}
            label={<FormattedMessage id="ui-receiving.piece.format" />}
            name="format"
            required
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <FieldDatepickerFinal
            labelId="ui-receiving.piece.receiptDate"
            name="receiptDate"
            usePortal
          />
        </Col>
        <Col
          xs={12}
          md={6}
        >
          <Field
            component={TextArea}
            fullWidth
            label={<FormattedMessage id="ui-receiving.piece.comment" />}
            name="comment"
          />
        </Col>
      </Row>

      <Row>
        <Col
          xs={12}
          md={6}
        >
          <Field
            component={TextArea}
            fullWidth
            label={<FormattedMessage id="ui-receiving.piece.internalNote" />}
            name="internalNote"
          />
        </Col>
        <Col
          xs={12}
          md={6}
        >
          <Field
            component={TextArea}
            fullWidth
            label={<FormattedMessage id="ui-receiving.piece.externalNote" />}
            name="externalNote"
          />
        </Col>
      </Row>

      <Row>
        {Boolean(instanceId) && (
          <Col
            xs={6}
            md={3}
          >
            <CreateItemField
              createInventoryValues={createInventoryValues}
              instanceId={instanceId}
              label={<FormattedMessage id="ui-receiving.piece.createItem" />}
              piece={values}
            />
          </Col>
        )}

        <Col
          xs={6}
          md={3}
        >
          <Field
            component={Checkbox}
            fullWidth
            label={<FormattedMessage id="ui-receiving.piece.supplement" />}
            name="supplement"
            type="checkbox"
            vertical
          />
        </Col>

        {isLocationRequired && (
          <>
            <Col
              xs={6}
              md={3}
            >
              <Field
                component={Checkbox}
                fullWidth
                label={<FormattedMessage id="ui-receiving.piece.displayOnHolding" />}
                name="displayOnHolding"
                type="checkbox"
                vertical
                onChange={onChangeDisplayOnHolding}
              />
            </Col>

            {isDiscoverySuppressEnabled && (
              <Col
                xs={6}
                md={3}
              >
                <Field
                  component={Checkbox}
                  disabled={!values.displayOnHolding}
                  fullWidth
                  label={<FormattedMessage id="ui-receiving.piece.discoverySuppress" />}
                  name="discoverySuppress"
                  type="checkbox"
                  vertical
                />
              </Col>
            )}
          </>
        )}
      </Row>

      <Row>
        <Col
          xs={6}
          md={3}
        >
          <LineLocationsView
            poLine={poLine}
            locations={locations}
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <FieldInventory
            instanceId={isLocationRequired ? instanceId : undefined}
            locationIds={locationIds}
            locations={locations}
            holdingName="holdingId"
            locationName="locationId"
            onChange={setLocationValue}
            disabled={!isNotReceived}
            required={isLocationRequired}
          />
        </Col>
      </Row>
    </>
  );
};

PieceFields.propTypes = {
  createInventoryValues: PropTypes.object.isRequired,
  instanceId: PropTypes.string,
  locationIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  locations: PropTypes.arrayOf(PropTypes.object),
  pieceFormatOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  poLine: PropTypes.object.isRequired,
  setLocationValue: PropTypes.func.isRequired,
  onChangeDisplayOnHolding: PropTypes.func.isRequired,
};
