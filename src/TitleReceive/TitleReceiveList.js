import includes from 'lodash/includes';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import {
  memo,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  Field,
  useForm,
} from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Checkbox,
  InfoPopover,
  MultiColumnList,
  NoValue,
  TextArea,
  TextField,
} from '@folio/stripes/components';
import {
  ConsortiumFieldInventory,
  FieldDatepickerFinal,
  FieldInventory,
  getItemStatusLabel,
  INVENTORY_RECORDS_TYPE,
  PIECE_FORMAT_LABELS,
} from '@folio/stripes-acq-components';

import {
  CreateItemField,
  NumberGeneratorButton,
  NumberGeneratorModal,
} from '../common/components';
import {
  ACCESSION_NUMBER_SETTING,
  BARCODE_SETTING,
  CALL_NUMBER_SETTING,
  GENERATOR_ON_EDITABLE,
  GENERATOR_ON,
  PIECE_FORM_FIELD_NAMES,
} from '../common/constants';
import { useNumberGeneratorOptions } from '../common/hooks';
import { useReceivingSearchContext } from '../contexts';
import {
  PIECE_COLUMN_MAPPING,
  PIECE_COLUMNS,
} from '../Piece';
import { useFieldArrowNavigation } from './useFieldArrowNavigation';

const visibleColumns = [
  'checked',
  PIECE_COLUMNS.displaySummary,
  PIECE_COLUMNS.enumeration,
  PIECE_COLUMNS.chronology,
  PIECE_COLUMNS.copyNumber,
  PIECE_COLUMNS.accessionNumber,
  PIECE_COLUMNS.barcode,
  PIECE_COLUMNS.format,
  PIECE_COLUMNS.receiptDate,
  PIECE_COLUMNS.request,
  PIECE_COLUMNS.comment,
  PIECE_COLUMNS.location,
  PIECE_COLUMNS.itemStatus,
  PIECE_COLUMNS.callNumber,
  PIECE_COLUMNS.isCreateItem,
  PIECE_COLUMNS.displayOnHolding,
  PIECE_COLUMNS.supplement,
];

const accessionNumberFieldName = (field, index) => `${field}[${index}].accessionNumber`;
const barcodeFieldName = (field, index) => `${field}[${index}].barcode`;
const callNumberFieldName = (field, index) => `${field}[${index}].callNumber`;

const columnWidths = {
  location: '250px',
};

const getResultFormatter = ({
  numberGeneratorData,
  createInventoryValues,
  crossTenant,
  field,
  fieldsValue,
  instanceId,
  intl,
  locations,
  poLineLocationIds,
  selectLocation,
  setNumberGeneratorModalRecord,
}) => ({
  checked: record => (
    <Field
      data-test-title-receive-checked
      name={`${field}[${record.rowIndex}].checked`}
      component={Checkbox}
      type="checkbox"
      aria-label={intl.formatMessage({ id: 'ui-receiving.piece.actions.select' })}
    />
  ),
  [PIECE_COLUMNS.displaySummary]: record => (
    <Field
      name={`${field}[${record.rowIndex}].displaySummary`}
      component={TextField}
      marginBottom0
      fullWidth
      aria-label={intl.formatMessage({ id: 'ui-receiving.piece.displaySummary' })}
    />
  ),
  [PIECE_COLUMNS.enumeration]: record => (
    <Field
      name={`${field}[${record.rowIndex}].enumeration`}
      component={TextField}
      marginBottom0
      fullWidth
      aria-label={intl.formatMessage({ id: 'ui-receiving.piece.enumeration' })}
    />
  ),
  [PIECE_COLUMNS.chronology]: record => (
    <Field
      name={`${field}[${record.rowIndex}].chronology`}
      component={TextField}
      marginBottom0
      aria-label={intl.formatMessage({ id: 'ui-receiving.piece.chronology' })}
      fullWidth
    />
  ),
  [PIECE_COLUMNS.copyNumber]: record => (
    <Field
      name={`${field}[${record.rowIndex}].copyNumber`}
      component={TextField}
      marginBottom0
      fullWidth
      aria-label={intl.formatMessage({ id: 'ui-receiving.piece.copyNumber' })}
    />
  ),
  [PIECE_COLUMNS.accessionNumber]: record => (
    <Field
      name={accessionNumberFieldName(field, record.rowIndex)}
      component={TextField}
      disabled={
        (!record.itemId && !record.isCreateItem) ||
        numberGeneratorData[ACCESSION_NUMBER_SETTING] === GENERATOR_ON
      }
      marginBottom0
      fullWidth
      aria-label={intl.formatMessage({ id: 'ui-receiving.piece.accessionNumber' })}
    />
  ),
  [PIECE_COLUMNS.barcode]: record => (
    <Field
      name={barcodeFieldName(field, record.rowIndex)}
      component={TextField}
      disabled={
        (!record.itemId && !record.isCreateItem) ||
        numberGeneratorData[BARCODE_SETTING] === GENERATOR_ON
      }
      marginBottom0
      aria-label={intl.formatMessage({ id: 'ui-receiving.piece.barcode' })}
      fullWidth
    />
  ),
  [PIECE_COLUMNS.format]: ({ format }) => PIECE_FORMAT_LABELS[format],
  [PIECE_COLUMNS.receiptDate]: record => (
    <FieldDatepickerFinal
      name={`${field}[${record.rowIndex}].receiptDate`}
      aria-label={intl.formatMessage({ id: 'ui-receiving.piece.receiptDate' })}
      marginBottom0
      usePortal
    />
  ),
  [PIECE_COLUMNS.request]: record => (
    record.request
      ? <FormattedMessage id="ui-receiving.piece.request.isOpened" />
      : <NoValue />
  ),
  [PIECE_COLUMNS.comment]: record => (
    <Field
      name={`${field}[${record.rowIndex}].comment`}
      component={TextArea}
      aria-label={intl.formatMessage({ id: 'ui-receiving.piece.comment' })}
      fullWidth
    />
  ),
  [PIECE_COLUMNS.location]: record => {
    const locationId = fieldsValue[record.rowIndex]?.locationId;
    const locationIds = locationId ? [...new Set([...poLineLocationIds, locationId])] : poLineLocationIds;
    const isHolding = includes(createInventoryValues[record.format], INVENTORY_RECORDS_TYPE.instanceAndHolding);

    const FieldInventoryComponent = crossTenant
      ? ConsortiumFieldInventory
      : FieldInventory;

    return (
      <FieldInventoryComponent
        affiliationName={`${field}[${record.rowIndex}].${PIECE_FORM_FIELD_NAMES.receivingTenantId}`}
        instanceId={isHolding ? instanceId : undefined}
        locationIds={locationIds}
        locations={locations}
        locationLookupLabel={<FormattedMessage id="ui-receiving.piece.locationLookup" />}
        holdingName={`${field}[${record.rowIndex}].holdingId`}
        locationName={`${field}[${record.rowIndex}].locationId`}
        onChange={selectLocation}
        labelless
        vertical
      />
    );
  },
  [PIECE_COLUMNS.itemStatus]: record => {
    return record?.itemId ? getItemStatusLabel(record?.itemStatus) : <NoValue />;
  },
  [PIECE_COLUMNS.callNumber]: record => (
    <Field
      name={callNumberFieldName(field, record.rowIndex)}
      component={TextField}
      disabled={
        (!record.itemId && !record.isCreateItem) ||
        numberGeneratorData[CALL_NUMBER_SETTING] === GENERATOR_ON
      }
      marginBottom0
      aria-label={intl.formatMessage({ id: 'ui-receiving.piece.callNumber' })}
      fullWidth
    />
  ),
  [PIECE_COLUMNS.isCreateItem]: piece => (
    <CreateItemField
      createInventoryValues={createInventoryValues}
      instanceId={instanceId}
      name={`${field}[${piece.rowIndex}].isCreateItem`}
      piece={piece}
    />
  ),
  [PIECE_COLUMNS.displayOnHolding]: record => (
    <Field
      name={`${field}[${record.rowIndex}].displayOnHolding`}
      component={Checkbox}
      type="checkbox"
    />
  ),
  [PIECE_COLUMNS.supplement]: record => (
    <Field
      name={`${field}[${record.rowIndex}].supplement`}
      component={Checkbox}
      type="checkbox"
    />
  ),
  actions: record => (
    <NumberGeneratorButton
      disabled={(!record.itemId && !record.isCreateItem)}
      onClick={() => setNumberGeneratorModalRecord(record)}
      tooltipId={`generate-numbers-btn-${record.rowIndex}`}
      tooltipLabel={
        <FormattedMessage
          id="ui-receiving.numberGenerator.generateForRow"
          values={{ rowIndex: record.rowIndex + 1 }}
        />
      }
    />
  ),
});

const getColumnMappings = ({ intl, isAllChecked, toggleAll }) => ({
  checked: (
    <Checkbox
      checked={isAllChecked}
      onChange={toggleAll}
      aria-label={intl.formatMessage({ id: 'ui-receiving.piece.actions.selectAll' })}
    />
  ),
  [PIECE_COLUMNS.itemStatus]: (
    <>
      <FormattedMessage id="ui-receiving.piece.itemStatus" />
      <InfoPopover content={(<FormattedMessage id="ui-receiving.piece.itemStatus.info" />)} />
    </>
  ),
  ...PIECE_COLUMN_MAPPING,
  actions: <FormattedMessage id="ui-receiving.button.actions" />,
});

const defaultListProps = {
  crossTenant: false,
  createInventoryValues: {},
  selectLocation: noop,
  toggleCheckedAll: noop,
  locations: [],
  poLineLocationIds: [],
};

export const TitleReceiveList = ({ fields, props }) => {
  const {
    crossTenant = defaultListProps.crossTenant,
    createInventoryValues = defaultListProps.createInventoryValues,
    instanceId,
    isLoading,
    selectLocation = defaultListProps.selectLocation,
    toggleCheckedAll = defaultListProps.toggleCheckedAll,
    locations = defaultListProps.locations,
    poLineLocationIds = defaultListProps.poLineLocationIds,
  } = props || {};

  const intl = useIntl();
  const { change } = useForm();
  const { targetTenantId } = useReceivingSearchContext();
  const { data: numberGeneratorData } = useNumberGeneratorOptions({ tenantId: targetTenantId });

  const [numberGeneratorModalRecord, setNumberGeneratorModalRecord] = useState();

  const field = fields.name;

  const { onKeyDown: onFieldKeyDown } = useFieldArrowNavigation(field, []);

  const cellFormatters = useMemo(() => getResultFormatter({
    numberGeneratorData,
    createInventoryValues,
    crossTenant,
    field,
    fieldsValue: fields.value,
    instanceId,
    intl,
    locations,
    poLineLocationIds,
    selectLocation,
    setNumberGeneratorModalRecord,
  }), [
    numberGeneratorData,
    createInventoryValues,
    crossTenant,
    field,
    fields.value,
    instanceId,
    intl,
    locations,
    poLineLocationIds,
    selectLocation,
  ]);

  const isAllChecked = fields.value.every(({ checked }) => !!checked);

  const toggleAll = useCallback(() => {
    toggleCheckedAll(!isAllChecked);
  }, [isAllChecked, toggleCheckedAll]);

  const columnMapping = useMemo(() => getColumnMappings({
    intl,
    isAllChecked,
    toggleAll,
  }), [intl, isAllChecked, toggleAll]);

  const rowProps = useMemo(() => ({
    onKeyDown: onFieldKeyDown,
  }), [onFieldKeyDown]);

  const visibleColumnsWithActions = useMemo(() => {
    const vcwa = [...visibleColumns];

    if (
      numberGeneratorData[ACCESSION_NUMBER_SETTING] === GENERATOR_ON ||
      numberGeneratorData[ACCESSION_NUMBER_SETTING] === GENERATOR_ON_EDITABLE ||
      numberGeneratorData[BARCODE_SETTING] === GENERATOR_ON ||
      numberGeneratorData[BARCODE_SETTING] === GENERATOR_ON_EDITABLE ||
      numberGeneratorData[CALL_NUMBER_SETTING] === GENERATOR_ON ||
      numberGeneratorData[CALL_NUMBER_SETTING] === GENERATOR_ON_EDITABLE
    ) {
      // Actions only valid if at least one of the number generator settings is useGenerator or useBoth
      vcwa.push('actions');
    }

    return vcwa;
  }, [numberGeneratorData]);

  return (
    <>
      <MultiColumnList
        rowProps={rowProps}
        columnMapping={columnMapping}
        columnWidths={columnWidths}
        contentData={fields.value}
        formatter={cellFormatters}
        id="title-receive-list"
        interactive={false}
        loading={isLoading}
        totalCount={fields.value.length}
        visibleColumns={visibleColumnsWithActions}
      />
      <NumberGeneratorModal
        numberGeneratorData={numberGeneratorData}
        modalLabel={
          <FormattedMessage
            id="ui-receiving.numberGenerator.generateForRow"
            values={{ rowIndex: (numberGeneratorModalRecord?.rowIndex ?? 0) + 1 }}
          />
        }
        open={!!numberGeneratorModalRecord}
        onClose={() => setNumberGeneratorModalRecord()}
        onGenerateAccessionNumber={val => {
          change(accessionNumberFieldName(field, numberGeneratorModalRecord.rowIndex), val);
        }}
        onGenerateBarcode={val => {
          change(barcodeFieldName(field, numberGeneratorModalRecord.rowIndex), val);
        }}
        onGenerateCallNumber={val => {
          change(callNumberFieldName(field, numberGeneratorModalRecord.rowIndex), val);
        }}
      />
    </>
  );
};

TitleReceiveList.propTypes = {
  fields: PropTypes.object.isRequired,
  props: PropTypes.shape({
    crossTenant: PropTypes.bool,
    createInventoryValues: PropTypes.object.isRequired,
    instanceId: PropTypes.string,
    isLoading: PropTypes.bool,
    selectLocation: PropTypes.func.isRequired,
    toggleCheckedAll: PropTypes.func.isRequired,
    poLineLocationIds: PropTypes.arrayOf(PropTypes.string),
    locations: PropTypes.arrayOf(PropTypes.object),
  }).isRequired,
};

export default memo(TitleReceiveList);
