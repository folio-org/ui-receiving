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
  ConsortiumFieldInventory,
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
import { useReceivingSearchContext } from '../../../contexts';
import { PIECE_FORM_FIELD_NAMES } from '../../constants';

import css from './PieceFields.css';

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
  const { crossTenant } = useReceivingSearchContext();
  const { values } = useFormState();

  const isNotReceived = values.receivingStatus !== PIECE_STATUS.received;
  const isLocationSelectionDisabled = !isNotReceived || values.receivingStatus === PIECE_STATUS.unreceivable;
  const isLocationRequired = includes(createInventoryValues[values.format], INVENTORY_RECORDS_TYPE.instanceAndHolding);
  const isDisplayToPublic = values.displayOnHolding;

  // https://issues.folio.org/browse/UIREC-208
  const isDiscoverySuppressEnabled = false;

  const FieldInventoryComponent = crossTenant
    ? ConsortiumFieldInventory
    : FieldInventory;

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
            name={PIECE_FORM_FIELD_NAMES.displaySummary}
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
            name={PIECE_FORM_FIELD_NAMES.copyNumber}
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
            name={PIECE_FORM_FIELD_NAMES.enumeration}
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
            name={PIECE_FORM_FIELD_NAMES.chronology}
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
            name={PIECE_FORM_FIELD_NAMES.format}
            required
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <FieldDatepickerFinal
            labelId="ui-receiving.piece.receiptDate"
            name={PIECE_FORM_FIELD_NAMES.receiptDate}
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
            name={PIECE_FORM_FIELD_NAMES.comment}
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
            name={PIECE_FORM_FIELD_NAMES.internalNote}
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
            name={PIECE_FORM_FIELD_NAMES.externalNote}
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
            name={PIECE_FORM_FIELD_NAMES.supplement}
            type="checkbox"
            vertical
          />
        </Col>

        {isLocationRequired && (
          <>
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
                  name={PIECE_FORM_FIELD_NAMES.discoverySuppress}
                  type="checkbox"
                  vertical
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
                label={<FormattedMessage id="ui-receiving.piece.displayOnHolding" />}
                name={PIECE_FORM_FIELD_NAMES.displayOnHolding}
                type="checkbox"
                vertical
                onChange={onChangeDisplayOnHolding}
              />
            </Col>

            {
              isDisplayToPublic && (
                <Col
                  xs={6}
                  md={3}
                >
                  <Field
                    component={Checkbox}
                    fullWidth
                    label={<FormattedMessage id="ui-receiving.piece.displayToPublic" />}
                    name={PIECE_FORM_FIELD_NAMES.displayToPublic}
                    type="checkbox"
                    vertical
                  />
                </Col>
              )
            }

            <Col
              xs={6}
              md={3}
            >
              <Field
                component={Checkbox}
                className={css.control}
                fullWidth
                label={<FormattedMessage id="ui-receiving.piece.isBound" />}
                name={PIECE_FORM_FIELD_NAMES.isBound}
                type="checkbox"
                vertical
                disabled={isNotReceived}
              />
            </Col>
          </>
        )}
      </Row>

      <Row>
        <Col
          xs={6}
          md={3}
        >
          <LineLocationsView
            crossTenant={crossTenant}
            instanceId={instanceId}
            poLine={poLine}
            locations={locations}
          />
        </Col>
        <Col
          xs={crossTenant ? 12 : 6}
          md={crossTenant ? 6 : 3}
        >
          <FieldInventoryComponent
            affiliationName={PIECE_FORM_FIELD_NAMES.receivingTenantId}
            instanceId={isLocationRequired ? instanceId : undefined}
            locationIds={locationIds}
            locations={locations}
            holdingName={PIECE_FORM_FIELD_NAMES.holdingId}
            locationName={PIECE_FORM_FIELD_NAMES.locationId}
            onChange={setLocationValue}
            disabled={isLocationSelectionDisabled}
            isNonInteractive={isLocationSelectionDisabled}
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
  pieceFormatOptions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
    value: PropTypes.string,
  })),
  locationIds: PropTypes.arrayOf(PropTypes.string),
  locations: PropTypes.arrayOf(PropTypes.object),
  poLine: PropTypes.object.isRequired,
  setLocationValue: PropTypes.func.isRequired,
  onChangeDisplayOnHolding: PropTypes.func.isRequired,
};
