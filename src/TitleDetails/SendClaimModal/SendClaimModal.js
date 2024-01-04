import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  Col,
  Modal,
  Row,
  TextArea,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { ModalFooter } from '@folio/stripes-acq-components';

import { FieldClaimingDate } from '../../common/components';

const SendClaimModal = ({
  handleSubmit,
  onCancel,
  open,
}) => {
  const intl = useIntl();
  const modalLabel = intl.formatMessage({ id: 'ui-receiving.modal.sendClaim.heading' });

  const start = (
    <Button
      marginBottom0
      onClick={onCancel}
    >
      <FormattedMessage id="stripes-acq-components.FormFooter.cancel" />
    </Button>
  );
  const end = (
    <>
      <Button
        buttonStyle="primary"
        marginBottom0
        onClick={handleSubmit}
      >
        <FormattedMessage id="stripes-acq-components.FormFooter.save" />
      </Button>
    </>
  );

  const footer = (
    <ModalFooter
      renderStart={start}
      renderEnd={end}
    />
  );

  return (
    <Modal
      open={open}
      id="send-claim-modal"
      footer={footer}
      label={modalLabel}
      aria-label={modalLabel}
    >
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs>
            <FieldClaimingDate label={<FormattedMessage id="ui-receiving.modal.sendClaim.field.claimExpiryDate" />} />
          </Col>
        </Row>

        <Row>
          <Col xs>
            <Field
              component={TextArea}
              fullWidth
              label={<FormattedMessage id="ui-receiving.piece.internalNote" />}
              name="internalNote"
            />
          </Col>
          <Col xs>
            <Field
              component={TextArea}
              fullWidth
              label={<FormattedMessage id="ui-receiving.piece.externalNote" />}
              name="externalNote"
            />
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

SendClaimModal.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
})(SendClaimModal);
