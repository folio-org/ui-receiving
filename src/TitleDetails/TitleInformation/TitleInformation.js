import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';

import {
  ContributorDetails,
  FolioFormattedDate,
  ProductIdDetails,
} from '@folio/stripes-acq-components';

const TitleInformation = ({
  contributors,
  edition,
  productIds,
  publishedDate,
  publisher,
  subscriptionFrom,
  subscriptionInterval,
  subscriptionTo,
}) => {
  return (
    <>
      <Row>
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
            value={publishedDate}
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
            value={<FolioFormattedDate value={subscriptionFrom} />}
          />
        </Col>
        <Col
          data-test-title-subscription-to
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.title.subscriptionTo" />}
            value={<FolioFormattedDate value={subscriptionTo} />}
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
    </>
  );
};

TitleInformation.propTypes = {
  contributors: PropTypes.arrayOf(PropTypes.object),
  edition: PropTypes.string,
  productIds: PropTypes.arrayOf(PropTypes.object),
  publishedDate: PropTypes.string,
  publisher: PropTypes.string,
  subscriptionFrom: PropTypes.string,
  subscriptionInterval: PropTypes.number,
  subscriptionTo: PropTypes.string,
};

TitleInformation.defaultProps = {
  contributors: [],
  edition: '',
  productIds: [],
  publishedDate: '',
  publisher: '',
  subscriptionFrom: '',
  subscriptionInterval: 0,
  subscriptionTo: '',
};

export default TitleInformation;
