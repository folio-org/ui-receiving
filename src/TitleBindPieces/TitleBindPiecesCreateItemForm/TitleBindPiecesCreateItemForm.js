import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Row,
  Select,
  TextField,
} from '@folio/stripes/components';
import { LocationLookup, LocationSelection } from '@folio/stripes/smart-components';

import { TITLE_BIND_PIECES_FILED_NAMES } from '../constants';
import { useLoanTypes, useMaterialTypes } from '../hooks';

function buildOptions(items) {
  return items.map(({ id, name }) => ({
    label: name,
    value: id,
  }));
}

export const TitleBindPiecesCreateItemForm = ({ onChange }) => {
  const { materialTypes } = useMaterialTypes();
  const { loanTypes } = useLoanTypes();

  const materialTypesOptions = useMemo(() => buildOptions(materialTypes), [materialTypes]);
  const loanTypesOptions = useMemo(() => buildOptions(loanTypes), [loanTypes]);

  const onLocationSelected = (location) => {
    onChange(TITLE_BIND_PIECES_FILED_NAMES.permanentLocation, location?.id);
  };

  return (
    <Row>
      <Col
        xs={6}
        md={2}
      >
        <Field
          component={TextField}
          fullWidth
          id={TITLE_BIND_PIECES_FILED_NAMES.barcode}
          label={<FormattedMessage id="ui-receiving.piece.barcode" />}
          name={TITLE_BIND_PIECES_FILED_NAMES.barcode}
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
          id={TITLE_BIND_PIECES_FILED_NAMES.callNumber}
          label={<FormattedMessage id="ui-receiving.piece.callNumber" />}
          name={TITLE_BIND_PIECES_FILED_NAMES.callNumber}
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
          dataOptions={materialTypesOptions}
          id={TITLE_BIND_PIECES_FILED_NAMES.materialType}
          label={<FormattedMessage id="ui-receiving.piece.materialType" />}
          name={TITLE_BIND_PIECES_FILED_NAMES.materialType}
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
          dataOptions={loanTypesOptions}
          id={TITLE_BIND_PIECES_FILED_NAMES.permanentLoanType}
          label={<FormattedMessage id="ui-receiving.piece.permanentLoanType" />}
          name={TITLE_BIND_PIECES_FILED_NAMES.permanentLoanType}
        />
      </Col>
      <Col
        xs={6}
        md={3}
      >
        <Field
          label={<FormattedMessage id="ui-receiving.piece.permanentLocation" />}
          name={TITLE_BIND_PIECES_FILED_NAMES.permanentLocation}
          id={TITLE_BIND_PIECES_FILED_NAMES.permanentLocation}
          component={LocationSelection}
          onSelect={onLocationSelected}
          fullWidth
          marginBottom0
          required
        />
        <LocationLookup onLocationSelected={onLocationSelected} />
      </Col>
    </Row>
  );
};

TitleBindPiecesCreateItemForm.propTypes = {
  onChange: PropTypes.func.isRequired,
};
