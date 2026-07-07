import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { FieldArray } from 'react-final-form-arrays';

import stripesFinalForm from '@folio/stripes/final-form';
import {
  checkScope,
  HasCommand,
  Layout,
  Loading,
  MessageBanner,
  Pane,
  Paneset,
} from '@folio/stripes/components';
import {
  ColumnManagerMenu,
  useColumnManager,
} from '@folio/stripes/smart-components';
import {
  FormFooter,
  handleKeyCommand,
} from '@folio/stripes-acq-components';

import { LineLocationsView } from '../common/components';
import { setLocationValueFormMutator } from '../common/utils';
import {
  PIECE_COLUMNS,
  RECEIVE_PIECE_COLUMN_MAPPING,
} from '../Piece';
import { TitleReceiveList } from './TitleReceiveList';
import css from './TitleReceive.css';

const COLUMN_MANAGER_ID = 'receive-piece-column-manager';

const FIELD_NAME = 'receivedItems';

const TitleReceive = ({
  createInventoryValues,
  crossTenant = false,
  form,
  handleSubmit,
  instanceId,
  isLoading,
  isPiecesChunksExhausted,
  locations,
  onCancel,
  paneSub,
  paneTitle,
  poLine,
  receivingNote,
  submitButtonLabel,
  submitting,
  values,
}) => {
  const {
    visibleColumns,
    toggleColumn,
  } = useColumnManager(COLUMN_MANAGER_ID, RECEIVE_PIECE_COLUMN_MAPPING);

  const renderActionMenu = useCallback(() => (
    <ColumnManagerMenu
      prefix="receive-piece"
      columnMapping={RECEIVE_PIECE_COLUMN_MAPPING}
      visibleColumns={visibleColumns}
      toggleColumn={toggleColumn}
      excludeColumns={[PIECE_COLUMNS.displaySummary]}
    />
  ), [visibleColumns, toggleColumn]);

  const isReceiveDisabled = useMemo(() => {
    return isLoading || (isPiecesChunksExhausted && !values[FIELD_NAME].some(({ checked }) => checked));
  }, [isLoading, isPiecesChunksExhausted, values]);

  const poLineLocationIds = useMemo(() => {
    return poLine?.locations
      ?.map(({ locationId }) => locationId)
      ?.filter(Boolean);
  }, [poLine]);

  const paneFooter = (
    <FormFooter
      handleSubmit={handleSubmit}
      isSubmitDisabled={isReceiveDisabled}
      label={(
        isLoading
          ? (
            <>
              {submitButtonLabel}
              <Loading />
            </>
          )
          : submitButtonLabel
      )}
      onCancel={onCancel}
      submitting={submitting}
    />
  );

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(onCancel),
    },
    {
      name: 'receive',
      shortcut: 'mod + alt + r',
      handler: handleKeyCommand(handleSubmit, { disabled: isReceiveDisabled }),
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
            actionMenu={renderActionMenu}
            defaultWidth="fill"
            dismissible
            footer={paneFooter}
            id="pane-title-receive-list"
            onClose={onCancel}
            paneTitle={paneTitle}
            paneSub={paneSub}
          >
            <div className={css.receiveListWrapper}>
              <LineLocationsView
                crossTenant={crossTenant}
                instanceId={instanceId}
                poLine={poLine}
                locations={locations}
              />
              {receivingNote && (
                <Layout className="marginTopHalf">
                  <MessageBanner>
                    {receivingNote}
                  </MessageBanner>
                </Layout>
              )}
              <div className={css.receiveListContent}>
                <FieldArray
                  component={TitleReceiveList}
                  id="receivedItems"
                  name={FIELD_NAME}
                  props={{
                    createInventoryValues,
                    crossTenant,
                    instanceId,
                    isLoading,
                    locations,
                    poLineLocationIds,
                    selectLocation: form.mutators.setLocationValue,
                    toggleCheckedAll: form.mutators.toggleCheckedAll,
                    visibleColumns,
                  }}
                />
              </div>
            </div>
          </Pane>
        </Paneset>
      </HasCommand>
    </form>
  );
};

TitleReceive.propTypes = {
  crossTenant: PropTypes.bool,
  createInventoryValues: PropTypes.object.isRequired,
  form: PropTypes.object, // form object to get initialValues
  handleSubmit: PropTypes.func.isRequired,
  instanceId: PropTypes.string,
  isLoading: PropTypes.bool,
  isPiecesChunksExhausted: PropTypes.bool,
  locations: PropTypes.arrayOf(PropTypes.object).isRequired,
  onCancel: PropTypes.func.isRequired,
  paneSub: PropTypes.string,
  paneTitle: PropTypes.string.isRequired,
  poLine: PropTypes.object.isRequired,
  receivingNote: PropTypes.string,
  submitButtonLabel: PropTypes.node.isRequired,
  submitting: PropTypes.bool.isRequired,
  values: PropTypes.object.isRequired, // current form values
};

export default stripesFinalForm({
  mutators: {
    setLocationValue: setLocationValueFormMutator,
    toggleCheckedAll: (args, state, tools) => {
      const isChecked = !!args[0];

      state.formState.values[FIELD_NAME].forEach((_, i) => {
        tools.changeValue(state, `${FIELD_NAME}[${i}].checked`, () => isChecked);
      });
    },
  },
  navigationCheck: true,
  subscription: { values: true },
})(TitleReceive);
