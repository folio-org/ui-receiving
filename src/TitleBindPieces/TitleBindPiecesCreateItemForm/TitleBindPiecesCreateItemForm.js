import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  validateRequired,
  ConsortiumFieldInventory,
  FieldInventory,
} from '@folio/stripes-acq-components';
import {
  Col,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import {
  useHoldingsAndLocations,
  useReceivingTenantIdsAndLocations,
} from '../../common/hooks';
import { useReceivingSearchContext } from '../../contexts';
import { PIECE_FORM_FIELD_NAMES } from '../constants';
import {
  useLoanTypes,
  useMaterialTypes,
} from '../hooks';
import { buildOptions } from '../utils';

export const TitleBindPiecesCreateItemForm = ({
  instanceId,
  bindItemValues = {},
  selectLocation,
}) => {
  const { materialTypes } = useMaterialTypes();
  const { loanTypes } = useLoanTypes();
  const intl = useIntl();

  const { locationId, tenantId: receivingTenantId } = bindItemValues;

  const {
    additionalLocationIds,
    additionalTenantLocationIdsMap,
    tenantId,
  } = useReceivingTenantIdsAndLocations({
    currentLocationId: locationId,
    currentReceivingTenantId: receivingTenantId,
  });

  const { locations, isFetching } = useHoldingsAndLocations({
    instanceId,
    tenantId,
    additionalLocationIds,
    additionalTenantLocationIdsMap,
  });

  const { crossTenant } = useReceivingSearchContext();

  const FieldInventoryComponent = crossTenant
    ? ConsortiumFieldInventory
    : FieldInventory;

  const materialTypesOptions = useMemo(() => {
    const emptyOption = [{
      label: intl.formatMessage({ id: 'ui-receiving.piece.materialTypeId.empty' }),
      value: null,
    }];

    return emptyOption.concat(buildOptions(materialTypes, intl));
  }, [materialTypes, intl]);

  const loanTypesOptions = useMemo(() => {
    const emptyOption = [{
      label: intl.formatMessage({ id: 'ui-receiving.piece.permanentLoanTypeId.empty' }),
      value: null,
    }];

    return emptyOption.concat(buildOptions(loanTypes, intl));
  }, [loanTypes, intl]);

  const locationIds = useMemo(() => locations.map(({ id }) => id), [locations]);

  return (
    <Row>
      <Col
        xs={6}
        md={2}
      >
        <Field
          component={TextField}
          fullWidth
          id={PIECE_FORM_FIELD_NAMES.barcode}
          label={<FormattedMessage id="ui-receiving.piece.barcode" />}
          name={PIECE_FORM_FIELD_NAMES.barcode}
          type="text"
        />
      </Col>
      <Col
        xs={6}
        md={2}
      >
        <Field
          component={TextField}
          fullWidth
          id={PIECE_FORM_FIELD_NAMES.callNumber}
          label={<FormattedMessage id="ui-receiving.piece.callNumber" />}
          name={PIECE_FORM_FIELD_NAMES.callNumber}
          type="text"
        />
      </Col>
      <Col
        xs={6}
        md={2}
      >
        <Field
          component={Select}
          fullWidth
          required
          validate={validateRequired}
          dataOptions={materialTypesOptions}
          id={PIECE_FORM_FIELD_NAMES.materialTypeId}
          label={<FormattedMessage id="ui-receiving.piece.materialTypeId" />}
          name={PIECE_FORM_FIELD_NAMES.materialTypeId}
        />
      </Col>
      <Col
        xs={6}
        md={2}
      >
        <Field
          component={Select}
          fullWidth
          required
          validate={validateRequired}
          dataOptions={loanTypesOptions}
          id={PIECE_FORM_FIELD_NAMES.permanentLoanTypeId}
          label={<FormattedMessage id="ui-receiving.piece.permanentLoanTypeId" />}
          name={PIECE_FORM_FIELD_NAMES.permanentLoanTypeId}
        />
      </Col>
      <Col
        xs={12}
        md={4}
      >
        <FieldInventoryComponent
          affiliationName={PIECE_FORM_FIELD_NAMES.tenantId}
          instanceId={instanceId}
          locationIds={locationIds}
          locations={locations}
          holdingName={PIECE_FORM_FIELD_NAMES.holdingId}
          locationName={PIECE_FORM_FIELD_NAMES.locationId}
          onChange={selectLocation}
          locationLabelId="ui-receiving.piece.permanentLocationId"
          holdingLabelId="ui-receiving.piece.permanentLocationId"
          isLoading={isFetching}
          required
        />
      </Col>
    </Row>
  );
};

TitleBindPiecesCreateItemForm.propTypes = {
  instanceId: PropTypes.string.isRequired,
  selectLocation: PropTypes.func.isRequired,
  bindItemValues: PropTypes.object,
};
