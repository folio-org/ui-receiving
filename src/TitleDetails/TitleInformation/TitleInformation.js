import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Checkbox,
  Col,
  KeyValue,
  NoValue,
  Row,
} from '@folio/stripes/components';

import {
  AcqUnitsView,
  ContributorDetails,
  FolioFormattedDate,
  ProductIdDetails,
} from '@folio/stripes-acq-components';

const TitleInformation = ({
  acqUnitIds,
  claimingActive,
  claimingInterval,
  contributors,
  edition,
  productIds,
  publishedDate,
  publisher,
  subscriptionFrom,
  subscriptionInterval,
  subscriptionTo,
  tenantId,
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
            value={publisher || <NoValue />}
          />
        </Col>
        <Col
          data-test-title-information-publication-date
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.title.publicationDate" />}
            value={publishedDate || <NoValue />}
          />
        </Col>
        <Col
          data-test-title-information-edition
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.title.edition" />}
            value={edition || <NoValue />}
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
            value={subscriptionInterval ?? <NoValue />}
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <Checkbox
            checked={claimingActive}
            disabled
            label={<FormattedMessage id="ui-receiving.title.claimingActive" />}
            vertical
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-receiving.title.claimingInterval" />}
            value={claimingInterval}
          />
        </Col>
        <Col
          xs={6}
          lg={3}
        >
          <AcqUnitsView
            tenantId={tenantId}
            units={acqUnitIds}
          />
        </Col>
      </Row>
      <Row>
        <Col
          data-test-title-contributors
          xs={12}
        >
          <KeyValue label={<FormattedMessage id="ui-receiving.title.contributors" />}>
            <ContributorDetails
              contributors={contributors}
              tenantId={tenantId}
            />
          </KeyValue>
        </Col>
      </Row>
      <Row>
        <Col
          data-test-title-product-ids
          xs={12}
        >
          <KeyValue label={<FormattedMessage id="ui-receiving.title.productIds" />}>
            <ProductIdDetails
              productIds={productIds}
              tenantId={tenantId}
            />
          </KeyValue>
        </Col>
      </Row>
    </>
  );
};

TitleInformation.propTypes = {
  acqUnitIds: PropTypes.arrayOf(PropTypes.string),
  claimingActive: PropTypes.bool,
  claimingInterval: PropTypes.number,
  contributors: PropTypes.arrayOf(PropTypes.object),
  edition: PropTypes.string,
  productIds: PropTypes.arrayOf(PropTypes.object),
  publishedDate: PropTypes.string,
  publisher: PropTypes.string,
  subscriptionFrom: PropTypes.string,
  subscriptionInterval: PropTypes.number,
  subscriptionTo: PropTypes.string,
  tenantId: PropTypes.string,
};

export default TitleInformation;
