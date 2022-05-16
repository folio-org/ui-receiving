import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage, useIntl } from 'react-intl';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  Button,
  Label,
  Layout,
  Loading,
  Modal,
  ModalFooter,
  RadioButton,
  RadioButtonGroup,
} from '@folio/stripes/components';
import {
  FieldMultiSelectionFinal,
} from '@folio/stripes-acq-components';

import {
  EXPORT_FIELDS_PARAMS,
  EXPORT_PIECE_FIELDS_OPTIONS,
  EXPORT_SETTINGS_FIELDS,
  EXPORT_TITLE_FIELDS_OPTIONS,
} from './constants';
import { isAllSelected } from './utils';

const SELECTED_TITLE_FIELDS_ID = 'selected-title-fields';
const SELECTED_PIECE_FIELDS_ID = 'selected-piece-fields';

const ExportSettingsModal = ({
  handleSubmit,
  isExporting,
  onCancel,
  values,
}) => {
  const intl = useIntl();

  const modalLabel = intl.formatMessage({ id: 'ui-receiving.exportSettings.label' });

  const {
    exportPieceFields,
    exportTitleFields,
    pieceFields,
    titleFields,
  } = values;

  const isExportBtnDisabled = isExporting
    || (!isAllSelected(exportTitleFields) && !titleFields?.length)
    || (!isAllSelected(exportPieceFields) && !pieceFields?.length);

  const exportModalFooter = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        onClick={handleSubmit}
        disabled={isExportBtnDisabled}
        marginBottom0
      >
        <FormattedMessage id="ui-receiving.exportSettings.export" />
      </Button>
      <Button
        marginBottom0
        onClick={onCancel}
      >
        <FormattedMessage id="stripes-core.button.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      aria-label={modalLabel}
      open
      label={modalLabel}
      footer={exportModalFooter}
    >
      <FormattedMessage
        id="ui-receiving.exportSettings.message"
        tagName="p"
      />

      {isExporting
        ? <Loading size="large" />
        : (
          <form>
            <Label>
              <FormattedMessage id="ui-receiving.exportSettings.title.fieldsLabel" />
            </Label>

            <Layout className="display-flex flex-align-items-start">
              <Layout className="padding-end-gutter">
                <RadioButtonGroup>
                  <Field
                    aria-label={intl.formatMessage({ id: 'ui-receiving.exportSettings.title.all' })}
                    component={RadioButton}
                    name={EXPORT_SETTINGS_FIELDS.exportTitleFields}
                    type="radio"
                    value={EXPORT_FIELDS_PARAMS.all}
                  />
                  <Field
                    aria-label={intl.formatMessage({ id: 'ui-receiving.exportSettings.title.selected' })}
                    component={RadioButton}
                    id={SELECTED_TITLE_FIELDS_ID}
                    name={EXPORT_SETTINGS_FIELDS.exportTitleFields}
                    type="radio"
                    value={EXPORT_FIELDS_PARAMS.selected}
                  />
                </RadioButtonGroup>
              </Layout>

              <Layout>
                <Label>
                  <FormattedMessage id="ui-receiving.exportSettings.export.all" />
                </Label>

                <FieldMultiSelectionFinal
                  aria-labelledby={SELECTED_TITLE_FIELDS_ID}
                  dataOptions={EXPORT_TITLE_FIELDS_OPTIONS}
                  name={EXPORT_SETTINGS_FIELDS.titleFields}
                  disabled={isAllSelected(exportTitleFields)}
                />
              </Layout>
            </Layout>

            <Label>
              <FormattedMessage id="ui-receiving.exportSettings.piece.fieldsLabel" />
            </Label>

            <Layout className="display-flex flex-align-items-start">
              <Layout className="padding-end-gutter">
                <RadioButtonGroup>
                  <Field
                    aria-label={intl.formatMessage({ id: 'ui-receiving.exportSettings.piece.all' })}
                    component={RadioButton}
                    name={EXPORT_SETTINGS_FIELDS.exportPieceFields}
                    type="radio"
                    value={EXPORT_FIELDS_PARAMS.all}
                  />
                  <Field
                    aria-label={intl.formatMessage({ id: 'ui-receiving.exportSettings.piece.selected' })}
                    component={RadioButton}
                    id={SELECTED_PIECE_FIELDS_ID}
                    name={EXPORT_SETTINGS_FIELDS.exportPieceFields}
                    type="radio"
                    value={EXPORT_FIELDS_PARAMS.selected}
                  />
                </RadioButtonGroup>

              </Layout>
              <Layout>
                <Label>
                  <FormattedMessage id="ui-receiving.exportSettings.export.all" />
                </Label>

                <FieldMultiSelectionFinal
                  aria-labelledby={SELECTED_PIECE_FIELDS_ID}
                  dataOptions={EXPORT_PIECE_FIELDS_OPTIONS}
                  name={EXPORT_SETTINGS_FIELDS.pieceFields}
                  disabled={isAllSelected(exportPieceFields)}
                />
              </Layout>
            </Layout>
          </form>
        )
      }
    </Modal>
  );
};

ExportSettingsModal.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  isExporting: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  values: PropTypes.object.isRequired,
};

export default stripesFinalForm({
  subscription: { values: true },
})(ExportSettingsModal);
