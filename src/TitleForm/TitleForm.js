import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { get } from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Accordion,
  AccordionSet,
  Checkbox,
  Col,
  ExpandAllButton,
  KeyValue,
  Pane,
  Paneset,
  Row,
  TextField,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  FieldDatepickerFinal,
  FolioFormattedDate,
  FormFooter,
  useAccordionToggle,
  validateRequired,
} from '@folio/stripes-acq-components';

import {
  SECTIONS,
} from './constants';
import ProductIdDetailsForm from './ProductIdDetailsForm';
import ContributorsForm from './ContributorsForm';

const ALLOWED_YEAR_LENGTH = 4;

const TitleForm = ({
  handleSubmit,
  form,
  onCancel,
  pristine,
  submitting,
  values,
  identifierTypes,
  contributorNameTypes,
}) => {
  const [expandAll, sections, toggleSection] = useAccordionToggle();
  const initialValues = get(form.getState(), 'initialValues', {});
  const { id, title, metadata } = initialValues;
  const paneFooter = (
    <FormFooter
      handleSubmit={handleSubmit}
      pristine={pristine}
      submitting={submitting}
      onCancel={onCancel}
    />
  );

  const isEditMode = Boolean(id);
  const paneTitle = isEditMode
    ? title
    : <FormattedMessage id="ui-receiving.title.paneTitle.create" />;

  const addInstance = form.mutators.setTitleValue;
  const addLines = form.mutators.setPOLine;
  const { details, physical, isPackage } = get(values, 'poLine', {});

  return (
    <form>
      <Paneset>
        <Pane
          defaultWidth="fill"
          dismissible
          id="pane-title-form"
          onClose={onCancel}
          paneTitle={paneTitle}
          footer={paneFooter}
        >
          <Row>
            <Col
              xs={12}
              md={8}
              mdOffset={2}
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
                  id={SECTIONS.itemDetails}
                  label={<FormattedMessage id="ui-receiving.title.section.itemDetails" />}
                >
                  {metadata && <ViewMetaData metadata={metadata} />}
                  <Row>
                    <Col
                      data-test-col-title-title
                      xs={3}
                    >
                      <Field
                        component={TextField}
                        disabled={!isPackage}
                        label={<FormattedMessage id="ui-receiving.titles.title" />}
                        name="title"
                        required
                        type="text"
                        validate={validateRequired}
                      />
                      <Pluggable
                        aria-haspopup="true"
                        dataKey="instances"
                        searchButtonStyle="link"
                        searchLabel={<FormattedMessage id="ui-receiving.title.titleLookUp" />}
                        selectInstance={addInstance}
                        type="find-instance"
                      >
                        <FormattedMessage id="ui-receiving.title.titleLookUpNoPlugin" />
                      </Pluggable>
                    </Col>
                    <Col
                      data-test-col-title-publisher
                      xs={3}
                    >
                      <Field
                        component={TextField}
                        label={<FormattedMessage id="ui-receiving.title.publisher" />}
                        name="publisher"
                        type="text"
                      />
                    </Col>
                    <Col
                      data-test-col-title-published-date
                      xs={3}
                    >
                      <Field
                        component={TextField}
                        label={<FormattedMessage id="ui-receiving.title.publicationDate" />}
                        name="publishedDate"
                        type="text"
                      />
                    </Col>
                    <Col
                      data-test-col-title-edition
                      xs={3}
                    >
                      <Field
                        component={TextField}
                        label={<FormattedMessage id="ui-receiving.title.edition" />}
                        name="edition"
                        type="text"
                      />
                    </Col>
                    <Col
                      data-test-col-title-subscription-from
                      xs={3}
                    >
                      <FieldDatepickerFinal
                        label={<FormattedMessage id="ui-receiving.title.subscriptionFrom" />}
                        name="subscriptionFrom"
                      />
                    </Col>
                    <Col
                      data-test-col-title-subscription-to
                      xs={3}
                    >
                      <FieldDatepickerFinal
                        label={<FormattedMessage id="ui-receiving.title.subscriptionTo" />}
                        name="subscriptionTo"
                      />
                    </Col>
                    <Col
                      data-test-col-title-subscription-interval
                      xs={3}
                    >
                      <Field
                        component={TextField}
                        fullWidth
                        label={<FormattedMessage id="ui-receiving.title.subscriptionInterval" />}
                        name="subscriptionInterval"
                        type="number"
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <ContributorsForm contributorNameTypes={contributorNameTypes} />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <ProductIdDetailsForm identifierTypes={identifierTypes} />
                    </Col>
                  </Row>
                </Accordion>
                <Accordion
                  id={SECTIONS.lineDetails}
                  label={<FormattedMessage id="ui-receiving.title.section.lineDetails" />}
                >
                  <Row>
                    <Col
                      data-test-col-title-line-number
                      xs={3}
                    >
                      <Field
                        component={TextField}
                        disabled
                        label={<FormattedMessage id="ui-receiving.titles.lineNumber" />}
                        name="poLine.poLineNumber"
                        required
                        type="text"
                        validate={validateRequired}
                      />
                      <Pluggable
                        addLines={addLines}
                        aria-haspopup="true"
                        dataKey="find-po-line"
                        isSingleSelect
                        searchButtonStyle="link"
                        searchLabel={<FormattedMessage id="ui-receiving.title.lineLookUp" />}
                        type="find-po-line"
                      >
                        <FormattedMessage id="ui-invoice.find-po-line-plugin-unavailable" />
                      </Pluggable>
                    </Col>
                    <Col xs={3}>
                      <KeyValue
                        label={<FormattedMessage id="ui-receiving.title.expectedReceiptDate" />}
                        value={<FolioFormattedDate value={get(physical, 'expectedReceiptDate')} />}
                      />
                    </Col>
                    <Col xs={3}>
                      <KeyValue label={<FormattedMessage id="ui-receiving.title.receivingNote" />}>
                        <span style={{
                          whiteSpace: 'pre-line',
                          overflowWrap: 'break-word',
                        }}
                        >
                          {get(details, 'receivingNote')}
                        </span>
                      </KeyValue>
                    </Col>
                    <Col xs={3}>
                      <Field
                        component={Checkbox}
                        fullWidth
                        label={<FormattedMessage id="ui-receiving.title.isAcknowledged" />}
                        name="isAcknowledged"
                        type="checkbox"
                        vertical
                      />
                    </Col>
                  </Row>
                </Accordion>
              </AccordionSet>
            </Col>
          </Row>
        </Pane>
      </Paneset>
    </form>
  );
};

TitleForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  form: PropTypes.object,  // form object to get initialValues
  onCancel: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired,  // current form values
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
  contributorNameTypes: PropTypes.arrayOf(PropTypes.object),
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
  mutators: {
    setTitleValue: (args, state, tools) => {
      const { contributors, editions, publication, title, identifiers, id } = get(args, '0', {});

      tools.changeValue(state, 'title', () => title);
      tools.changeValue(state, 'instanceId', () => id);

      if (publication && publication.length) {
        const { publisher, dateOfPublication } = publication[0];

        tools.changeValue(state, 'publisher', () => publisher);

        if (dateOfPublication && dateOfPublication.length === ALLOWED_YEAR_LENGTH) {
          tools.changeValue(state, 'publishedDate', () => dateOfPublication);
        }
      }

      const edition = editions && editions[0];

      tools.changeValue(state, 'edition', () => edition);

      if (contributors && contributors.length) {
        const lineContributors = contributors.map(({ name, contributorNameTypeId }) => ({
          contributor: name,
          contributorNameTypeId,
        }));

        tools.changeValue(state, 'contributors', () => lineContributors);
      }

      if (identifiers && identifiers.length) {
        const lineIdentifiers = identifiers
          .map(({ identifierTypeId, value }) => ({
            productId: value,
            productIdType: identifierTypeId,
          }));

        tools.changeValue(state, 'productIds', () => lineIdentifiers);
      }
    },
    setPOLine: (args, state, tools) => {
      const poLine = get(args, '0.0', {});

      tools.changeValue(state, 'poLine', () => poLine);
      tools.changeValue(state, 'poLineId', () => poLine.id);
    },
  },
})(TitleForm);
