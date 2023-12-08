import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useCallback, useRef } from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Checkbox,
  checkScope,
  Col,
  collapseAllSections,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  KeyValue,
  NoValue,
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
  handleKeyCommand,
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
  hasValidationErrors,
  form,
  onCancel,
  pristine,
  submitting,
  values,
  identifierTypes,
  contributorNameTypes,
}) => {
  const history = useHistory();
  const accordionStatusRef = useRef();
  const { change } = form;
  const initialValues = get(form.getState(), 'initialValues', {});
  const { id, title, metadata } = initialValues;
  const paneFooter = (
    <FormFooter
      handleSubmit={handleSubmit}
      pristine={pristine}
      submitting={submitting}
      onCancel={onCancel}
      isSubmitDisabled={hasValidationErrors}
    />
  );

  const isEditMode = Boolean(id);
  const paneTitle = isEditMode
    ? title
    : <FormattedMessage id="ui-receiving.title.paneTitle.create" />;

  const addInstance = form.mutators.setTitleValue;
  const addLines = form.mutators.setPOLine;
  const { details, physical, isPackage } = get(values, 'poLine', {});

  const onClaimingActiveChange = useCallback((event) => {
    const { target: { checked } } = event;

    change('claimingActive', checked);

    if (!checked) change('claimingInterval', undefined);
  }, [change]);

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(onCancel),
    },
    {
      name: 'save',
      handler: handleKeyCommand(handleSubmit, { disabled: pristine || submitting }),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
    {
      name: 'search',
      handler: handleKeyCommand(() => history.push('/receiving')),
    },
  ];

  return (
    <form>
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
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
                <AccordionStatus ref={accordionStatusRef}>
                  <Row end="xs">
                    <Col xs={12}>
                      <ExpandAllButton />
                    </Col>
                  </Row>
                  <AccordionSet>
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
                        <Col
                          xs={6}
                          md={3}
                        >
                          <Field
                            component={Checkbox}
                            fullWidth
                            label={<FormattedMessage id="ui-receiving.title.claimingActive" />}
                            onChange={onClaimingActiveChange}
                            name="claimingActive"
                            type="checkbox"
                            vertical
                            validateFields={[]}
                          />
                        </Col>

                        <Col
                          xs={6}
                          md={3}
                        >
                          <Field
                            label={<FormattedMessage id="ui-receiving.title.claimingInterval" />}
                            name="claimingInterval"
                            component={TextField}
                            type="number"
                            fullWidth
                            disabled={!values.claimingActive}
                            validateFields={[]}
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
                            <FormattedMessage id="ui-receiving.find-po-line-plugin-unavailable" />
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
                              {details?.receivingNote || <NoValue />}
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
                </AccordionStatus>
              </Col>
            </Row>
          </Pane>
        </Paneset>
      </HasCommand>
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
  hasValidationErrors: PropTypes.bool.isRequired,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { hasValidationErrors: true, values: true },
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
