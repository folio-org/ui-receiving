import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  Accordion,
  AccordionSet,
  Col,
  ExpandAllButton,
  Pane,
  Row,
} from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { useAccordionToggle } from '@folio/stripes-acq-components';

import TitleInformation from './TitleInformation';
import {
  TITLE_ACCORDION,
  TITLE_ACCORDION_LABELS,
} from './constants';

const TitleDetails = ({ onClose, title, poLine }) => {
  const [expandAll, sections, toggleSection] = useAccordionToggle();

  return (
    <Pane
      id="pane-title-details"
      defaultWidth="fill"
      dismissible
      paneTitle={title.title}
      paneSub={poLine.poLineNumber}
      onClose={onClose}
    >
      <Row end="xs">
        <Col xs={12}>
          <ExpandAllButton
            accordionStatus={sections}
            onToggle={expandAll}
          />
        </Col>
      </Row>

      <AccordionSet
        accordionStatus={sections}
        onToggle={toggleSection}
      >
        <Accordion
          id={TITLE_ACCORDION.information}
          label={TITLE_ACCORDION_LABELS.information}
        >
          <ViewMetaData metadata={title.metadata} />
          <TitleInformation
            contributors={title.contributors}
            edition={title.edition}
            instanceId={title.instanceId}
            poLineNumber={poLine.poLineNumber}
            productIds={title.productIds}
            publicationDate={title.publicationDate}
            publisher={title.publisher}
            receiptDate={poLine.receiptDate}
            receivingNote={get(poLine, 'details.receivingNote')}
            subscriptionFrom={title.subscriptionFrom}
            subscriptionInterval={title.subscriptionInterval}
            subscriptionTo={title.subscriptionTo}
            title={title.title}
          />
        </Accordion>

        <Accordion
          id={TITLE_ACCORDION.expected}
          label={TITLE_ACCORDION_LABELS.expected}
        />

        <Accordion
          id={TITLE_ACCORDION.received}
          label={TITLE_ACCORDION_LABELS.received}
        />
      </AccordionSet>
    </Pane>
  );
};

TitleDetails.propTypes = {
  title: PropTypes.object.isRequired,
  poLine: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default TitleDetails;
