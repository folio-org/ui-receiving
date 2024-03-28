import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  Col,
  Modal,
  Row,
} from '@folio/stripes/components';
import stripesFinalForm from '@folio/stripes/final-form';
import { ModalFooter } from '@folio/stripes-acq-components';

import { FieldClaimingDate } from '../../common/components';

const DelayClaimModal = ({
  onCancel,
  handleSubmit,
  open,
}) => {
  const intl = useIntl();
  const modalLabel = intl.formatMessage({ id: 'ui-receiving.modal.delayClaim.heading' });

  const start = (
    <Button
      marginBottom0
      onClick={onCancel}
    >
      <FormattedMessage id="stripes-acq-components.FormFooter.cancel" />
    </Button>
  );
  const end = (
    <Button
      buttonStyle="primary"
      onClick={handleSubmit}
      marginBottom0
    >
      <FormattedMessage id="stripes-acq-components.FormFooter.save" />
    </Button>
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
      id="delay-claim-modal"
      size="small"
      footer={footer}
      label={modalLabel}
      aria-label={modalLabel}
    >
      <form onSubmit={handleSubmit}>
        <Row>
          <Col xs>
            <FieldClaimingDate label={<FormattedMessage id="ui-receiving.modal.delayClaim.field.delayTo" />} />
          </Col>
        </Row>
      </form>
    </Modal>
  );
};

DelayClaimModal.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  open: PropTypes.bool,
};

export default stripesFinalForm({
  navigationCheck: true,
  subscription: { values: true },
})(DelayClaimModal);
