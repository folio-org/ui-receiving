import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import {
  FolioFormattedDate,
} from '@folio/stripes-acq-components';

const POLDetails = ({
  poLineId,
  poLineNumber,
  receiptDate,
  receivingNote,
}) => {
  const poLineNumberValue = (
    <Link
      data-testid="titlePOLineLink"
      to={{
        pathname: `/orders/lines/view/${poLineId}`,
        search: `?qindex=poLineNumber&query=${poLineNumber}`,
      }}
    >
      {poLineNumber}
    </Link>
  );

  return (
    <Row>
      <Col
        data-test-title-po-line-number
        xs={6}
        md={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-receiving.title.polNumber" />}
          value={poLineNumberValue}
        />
      </Col>
      <Col
        data-test-title-receipt-date
        xs={6}
        md={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-receiving.title.expectedReceiptDate" />}
          value={<FolioFormattedDate value={receiptDate} />}
        />
      </Col>
      <Col
        data-test-title-receiving-note
        xs={6}
        md={3}
      >
        <KeyValue
          label={<FormattedMessage id="ui-receiving.title.receivingNote" />}
          value={receivingNote}
        />
      </Col>
    </Row>
  );
};

POLDetails.propTypes = {
  poLineId: PropTypes.string.isRequired,
  poLineNumber: PropTypes.string.isRequired,
  receiptDate: PropTypes.string,
  receivingNote: PropTypes.string,
};

POLDetails.defaultProps = {
  receiptDate: '',
  receivingNote: '',
};

export default POLDetails;
