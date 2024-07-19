import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  validateRequired,
  FieldInventory,
} from '@folio/stripes-acq-components';
import {
  Col,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';

import { PIECE_FORM_FIELD_NAMES } from '../constants';
import { useLoanTypes, useMaterialTypes } from '../hooks';
import { buildOptions } from '../utils';

export const TitleBindPiecesCreateItemForm = ({ onChange, instanceId, locations }) => {
  const { materialTypes } = useMaterialTypes();
  const { loanTypes } = useLoanTypes();
  const intl = useIntl();

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

  const onLocationSelected = (location) => {
    onChange(PIECE_FORM_FIELD_NAMES.locationId, location?.id);
  };

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
        md={3}
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
        xs={6}
        md={3}
      >
        <FieldInventory
          instanceId={instanceId}
          locationIds={locationIds}
          locations={locations}
          holdingName={PIECE_FORM_FIELD_NAMES.locationId}
          locationName={PIECE_FORM_FIELD_NAMES.locationId}
          onChange={onLocationSelected}
          required
        />
      </Col>
    </Row>
  );
};

TitleBindPiecesCreateItemForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  instanceId: PropTypes.string.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object),
};
