import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  Checkbox,
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import {
  FolioFormattedDate,
  ORDER_FORMATS,
} from '@folio/stripes-acq-components';

const POLDetails = ({
  accessProvider,
  expectedReceiptDate,
  materialSupplier,
  orderFormat,
  orderType,
  poLineId,
  poLineNumber,
  receivingNote,
  requester,
  rush,
  vendor,
}) => {
  const showAccessProvider = orderFormat === ORDER_FORMATS.electronicResource || orderFormat === ORDER_FORMATS.PEMix;
  const showMaterialSupplier = orderFormat !== ORDER_FORMATS.electronicResource;
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
            value={<FolioFormattedDate value={expectedReceiptDate} />}
          />
        </Col>
        <Col
          data-test-title-receiving-note
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.title.receivingNote" />}
            value={receivingNote || <NoValue />}
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
        {showMaterialSupplier && (
          <Col
            data-test-title-material-supplier
            xs={6}
            md={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-receiving.title.materialSupplier" />}
              value={materialSupplier || <NoValue />}
            />
          </Col>
        )}
      </Row>
      <Row>
        <Col
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.title.requester" />}
            value={requester}
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <Checkbox
            checked={rush}
            disabled
            label={<FormattedMessage id="ui-receiving.title.rush" />}
            type="checkbox"
            vertical
          />
        </Col>
      </Row>
    </>
  );
};

POLDetails.propTypes = {
  accessProvider: PropTypes.string,
  expectedReceiptDate: PropTypes.string,
  materialSupplier: PropTypes.string,
  orderFormat: PropTypes.string,
  orderType: PropTypes.string,
  poLineId: PropTypes.string,
  poLineNumber: PropTypes.string,
  receivingNote: PropTypes.string,
  requester: PropTypes.string,
  rush: PropTypes.bool,
  vendor: PropTypes.string,
};

POLDetails.defaultProps = {
  expectedReceiptDate: '',
  receivingNote: '',
  rush: false,
};

export default POLDetails;
