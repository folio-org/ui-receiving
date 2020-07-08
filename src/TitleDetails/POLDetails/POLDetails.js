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
  ORDER_FORMATS,
} from '@folio/stripes-acq-components';

const POLDetails = ({
  accessProvider,
  materialSupplier,
  orderFormat,
  orderType,
  poLineId,
  poLineNumber,
  receiptDate,
  receivingNote,
  vendor,
}) => {
  const showAccessProvider = orderFormat === ORDER_FORMATS.electronicResource || orderFormat === ORDER_FORMATS.PEMix;
  const showMaterailSupplier = orderFormat !== ORDER_FORMATS.electronicResource;
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
    <>
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
        <Col
          data-test-title-order-type
          xs={6}
          md={3}
        >
          <KeyValue label={<FormattedMessage id="ui-receiving.title.orderType" />}>
            <FormattedMessage
              id={`ui-receiving.title.orderType.${orderType}`}
              defaultMessage={orderType}
            />
          </KeyValue>
        </Col>
      </Row>

      <Row>
        <Col
          data-test-title-vendor
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.title.vendor" />}
            value={vendor}
          />
        </Col>
        {showAccessProvider && (
          <Col
            data-test-title-access-provider
            xs={6}
            md={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-receiving.title.accessProvider" />}
              value={accessProvider}
            />
          </Col>
        )}
        {showMaterailSupplier && (
          <Col
            data-test-title-material-supplier
            xs={6}
            md={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-receiving.title.materialSupplier" />}
              value={materialSupplier}
            />
          </Col>
        )}
      </Row>
    </>
  );
};

POLDetails.propTypes = {
  accessProvider: PropTypes.string,
  materialSupplier: PropTypes.string,
  orderFormat: PropTypes.string.isRequired,
  orderType: PropTypes.string.isRequired,
  poLineId: PropTypes.string.isRequired,
  poLineNumber: PropTypes.string.isRequired,
  receiptDate: PropTypes.string,
  receivingNote: PropTypes.string,
  vendor: PropTypes.string.isRequired,
};

POLDetails.defaultProps = {
  receiptDate: '',
  receivingNote: '',
};

export default POLDetails;
