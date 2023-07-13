import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { groupBy } from 'lodash';

import {
  Modal,
  Button,
  Row,
} from '@folio/stripes/components';

import css from './OpenedRequestsModal.css';

const buildFooter = closeModal => {
  return (
    <Row end="xs">
      <Button
        data-test-close-opened-requests-modal-button
        onClick={closeModal}
      >
        <FormattedMessage id="ui-receiving.requests.footer.close" />
      </Button>
    </Row>
  );
};

const OpenedRequestsModal = ({ pieces, closeModal }) => {
  const intl = useIntl();
  const footer = useMemo(() => buildFooter(closeModal), [closeModal]);

  const requestPieces = pieces.filter(piece => piece.request);
  const itemRequestGroups = groupBy(requestPieces, 'request.instance.title');
  const isMultiple = requestPieces.length > 1;
  const modalLabel = intl.formatMessage({ id: `ui-receiving.requests.title.${isMultiple ? 'multiple' : 'single'}` });

  return (
    <Modal
      id="data-test-opened-requests-modal"
      open
      label={modalLabel}
      aria-label={modalLabel}
      footer={footer}
    >
      <FormattedMessage id={`ui-receiving.requests.message.${isMultiple ? 'multiple' : 'single'}`} />
      <ul className={css.openedRequestsModalBody}>
        {
          Object.keys(itemRequestGroups).map(item => {
            return (
              <li>
                <span className={css.openedRequestsModalItem}>{item}:</span>
                {
                  itemRequestGroups[item].map((piece, idx, arr) => {
                    return (
                      <span>
                        {
                          piece.barcode
                            ? <FormattedMessage id="ui-receiving.requests.message.barcode" values={{ barcode: piece.barcode }} />
                            : <FormattedMessage id="ui-receiving.requests.message.itemId" values={{ itemId: piece.itemId }} />
                        }
                        {idx !== arr.length - 1 && ', '}
                      </span>
                    );
                  })
                }
              </li>
            );
          })
        }
      </ul>
    </Modal>
  );
};

OpenedRequestsModal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  pieces: PropTypes.arrayOf(PropTypes.object),
};

OpenedRequestsModal.defaultProps = {
  pieces: [],
};

export default OpenedRequestsModal;
