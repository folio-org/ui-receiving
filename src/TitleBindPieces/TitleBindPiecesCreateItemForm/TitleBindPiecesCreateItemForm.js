import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  ConsortiumFieldInventory,
  FieldInventory,
  useLocationsQuery,
  validateRequired,
} from '@folio/stripes-acq-components';
import {
  Col,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import { useReceivingSearchContext } from '../../contexts';
import { BIND_ITEM_FORM_FIELD_NAMES } from '../constants';
import {
  useLoanTypes,
  useMaterialTypes,
} from '../hooks';
import { buildOptions } from '../utils';

export const TitleBindPiecesCreateItemForm = ({
  instanceId,
  selectLocation,
}) => {
  const { materialTypes } = useMaterialTypes();
  const { loanTypes } = useLoanTypes();
  const intl = useIntl();

  const { crossTenant } = useReceivingSearchContext();

  const {
    isLoading: isLocationsLoading,
    locations,
  } = useLocationsQuery({ consortium: crossTenant });

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
          id={BIND_ITEM_FORM_FIELD_NAMES.barcode}
          label={<FormattedMessage id="ui-receiving.piece.barcode" />}
          name={BIND_ITEM_FORM_FIELD_NAMES.barcode}
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
          id={BIND_ITEM_FORM_FIELD_NAMES.callNumber}
          label={<FormattedMessage id="ui-receiving.piece.callNumber" />}
          name={BIND_ITEM_FORM_FIELD_NAMES.callNumber}
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
          id={BIND_ITEM_FORM_FIELD_NAMES.materialTypeId}
          label={<FormattedMessage id="ui-receiving.piece.materialTypeId" />}
          name={BIND_ITEM_FORM_FIELD_NAMES.materialTypeId}
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
          id={BIND_ITEM_FORM_FIELD_NAMES.permanentLoanTypeId}
          label={<FormattedMessage id="ui-receiving.piece.permanentLoanTypeId" />}
          name={BIND_ITEM_FORM_FIELD_NAMES.permanentLoanTypeId}
        />
      </Col>
      <Col
        xs={12}
        md={4}
      >
        <FieldInventoryComponent
          affiliationName={BIND_ITEM_FORM_FIELD_NAMES.tenantId}
          instanceId={instanceId}
          isLoading={isLocationsLoading}
          locationIds={locationIds}
          locations={locations}
          holdingName={BIND_ITEM_FORM_FIELD_NAMES.holdingId}
          locationName={BIND_ITEM_FORM_FIELD_NAMES.locationId}
          onChange={selectLocation}
          locationLabelId="ui-receiving.piece.permanentLocationId"
          holdingLabelId="ui-receiving.piece.permanentLocationId"
          required
        />
      </Col>
    </Row>
  );
};

TitleBindPiecesCreateItemForm.propTypes = {
  instanceId: PropTypes.string.isRequired,
  selectLocation: PropTypes.func.isRequired,
};
