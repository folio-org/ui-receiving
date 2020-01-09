import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';
import { get } from 'lodash';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Accordion,
  AccordionSet,
  Col,
  ExpandAllButton,
  Pane,
  Paneset,
  Row,
  TextField,
} from '@folio/stripes/components';
import { Pluggable } from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  FormFooter,
  useAccordionToggle,
  validateRequired,
} from '@folio/stripes-acq-components';

import {
  SECTIONS,
} from './constants';
import ProductIdDetailsForm from './ProductIdDetailsForm';

const TitleForm = ({
  handleSubmit,
  form,
  onCancel,
  pristine,
  submitting,
  // values,
  identifierTypes,
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
  const addLines = form.mutators.setPOLNumberValue;

  return (
    <form>
      <Paneset>
        <Pane
          defaultWidth="fill"
          dismissible
          id="pane-title-form"
          onClose={onCancel}
          paneTitle={paneTitle}
          paneSub={title}
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
                        disabled
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
                  </Row>
                  <Row>
                    <ProductIdDetailsForm
                      identifierTypes={identifierTypes}
                    />
                  </Row>
                </Accordion>
                <Accordion
                  id={SECTIONS.lineDetails}
                  label={<FormattedMessage id="ui-receiving.title.section.lineDetails" />}
                >
                  <Row>
                    <Col
                      data-test-col-title-line-number
                      xs={6}
                    >
                      <Field
                        component={TextField}
                        disabled
                        label={<FormattedMessage id="ui-receiving.titles.lineNumber" />}
                        name="poLineNumber"
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
  // values: PropTypes.object.isRequired,  // current form values
  identifierTypes: PropTypes.arrayOf(PropTypes.object),
};

export default stripesFinalForm({
  navigationCheck: true,
  // subscription: { values: true },
  mutators: {
    setTitleValue: (args, state, tools) => {
      const { id, title } = get(args, '0', {});

      tools.changeValue(state, 'title', () => title);
      tools.changeValue(state, 'instanceId', () => id);
    },
    setPOLNumberValue: (args, state, tools) => {
      const { id, poLineNumber } = get(args, '0.0', {});

      tools.changeValue(state, 'poLineNumber', () => poLineNumber);
      tools.changeValue(state, 'poLineId', () => id);
    },
  },
})(TitleForm);
