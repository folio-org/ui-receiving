import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import {
  ContributorDetails,
  FolioFormattedTime,
  ProductIdDetails,
} from '@folio/stripes-acq-components';

const TitleInformation = ({
  contributors,
  edition,
  instanceId,
  poLineNumber,
  productIds,
  publicationDate,
  publisher,
  receiptDate,
  receivingNote,
  subscriptionFrom,
  subscriptionInterval,
  subscriptionTo,
  title,
}) => {
  const titleValue = instanceId
    ? <Link to={`/inventory/view/${instanceId}`}>{title}</Link>
    : title;

  return (
    <Fragment>
      <Row>
        <Col
          data-test-title-information-title
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.title.title" />}
            value={titleValue}
          />
        </Col>
        <Col
          data-test-title-information-publisher
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.title.publisher" />}
            value={publisher}
          />
        </Col>
        <Col
          data-test-title-information-publication-date
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.title.publicationDate" />}
            value={<FolioFormattedTime dateString={publicationDate} />}
          />
        </Col>
        <Col
          data-test-title-information-edition
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.title.edition" />}
            value={edition}
          />
        </Col>
        <Col
          data-test-title-subscription-from
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.title.subscriptionFrom" />}
            value={<FolioFormattedTime dateString={subscriptionFrom} />}
          />
        </Col>
        <Col
          data-test-title-subscription-to
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.title.subscriptionTo" />}
            value={<FolioFormattedTime dateString={subscriptionTo} />}
          />
        </Col>
        <Col
          data-test-title-subscription-interval
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.title.subscriptionInterval" />}
            value={subscriptionInterval}
          />
        </Col>
      </Row>
      <Row>
        <Col
          data-test-title-contributors
          xs={12}
        >
          <KeyValue label={<FormattedMessage id="ui-receiving.title.contributors" />}>
            <ContributorDetails contributors={contributors} />
          </KeyValue>
        </Col>
      </Row>
      <Row>
        <Col
          data-test-title-product-ids
          xs={12}
        >
          <KeyValue label={<FormattedMessage id="ui-receiving.title.productIds" />}>
            <ProductIdDetails productIds={productIds} />
          </KeyValue>
        </Col>
      </Row>
      <Row>
        <Col
          data-test-title-po-line-number
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.title.polNumber" />}
            value={poLineNumber}
          />
        </Col>
        <Col
          data-test-title-receipt-date
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.title.expectedDate" />}
            value={<FolioFormattedTime dateString={receiptDate} />}
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
    </Fragment>
  );
};

TitleInformation.propTypes = {
  contributors: PropTypes.arrayOf(PropTypes.object),
  edition: PropTypes.string,
  instanceId: PropTypes.string,
  poLineNumber: PropTypes.string,
  productIds: PropTypes.arrayOf(PropTypes.object),
  publicationDate: PropTypes.string,
  publisher: PropTypes.string,
  receiptDate: PropTypes.string,
  receivingNote: PropTypes.string,
  subscriptionFrom: PropTypes.string,
  subscriptionInterval: PropTypes.number,
  subscriptionTo: PropTypes.string,
  title: PropTypes.string,
};

TitleInformation.defaultProps = {
  contributors: [],
  edition: '',
  instanceId: '',
  poLineNumber: '',
  productIds: [],
  publicationDate: '',
  publisher: '',
  receiptDate: '',
  receivingNote: '',
  subscriptionFrom: '',
  subscriptionInterval: 0,
  subscriptionTo: '',
  title: '',
};

export default TitleInformation;
