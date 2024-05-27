import {
  RECEIVING_ROUTE,
  ROUTING_LIST_ROUTE,
} from '../../constants';

export const FALLBACK_ROUTE = RECEIVING_ROUTE;
export const ROUTING_LIST_CREATE_ROUTE = `${ROUTING_LIST_ROUTE}/create/:poLineId`;
export const ROUTING_LIST_EDIT_ROUTE = `${ROUTING_LIST_ROUTE}/edit/:id`;
export const ROUTING_LIST_VIEW_ROUTE = `${ROUTING_LIST_ROUTE}/view/:id`;
