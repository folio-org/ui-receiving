export const RECEIVING_ROUTE = '/receiving';
export const RECEIVING_BIND_PIECES_BASE_ROUTE = `${RECEIVING_ROUTE}/bind-pieces`;
export const RECEIVING_BIND_PIECES_ROUTE = `${RECEIVING_BIND_PIECES_BASE_ROUTE}/:id`;
export const RECEIVING_ROUTE_CREATE = `${RECEIVING_ROUTE}/create`;
export const RECEIVING_ROUTE_EDIT = `${RECEIVING_ROUTE}/:id/edit`;
export const RECEIVING_ROUTE_VIEW = `${RECEIVING_ROUTE}/:id/view`;
export const RECEIVING_PIECE_CREATE_ROUTE = `${RECEIVING_ROUTE_VIEW}/piece/create`;
export const RECEIVING_PIECE_EDIT_ROUTE = `${RECEIVING_ROUTE_VIEW}/piece/:pieceId/edit`;
export const RECEIVING_ROUTE_RECEIVE = `${RECEIVING_ROUTE}/receive/:id`;
export const RECEIVING_ROUTE_UNRECEIVE = `${RECEIVING_ROUTE}/unreceive/:id`;
export const RECEIVING_ROUTE_EXPECT = `${RECEIVING_ROUTE}/expect/:id`;
export const ROUTING_LIST_ROUTE = `${RECEIVING_ROUTE}/routing-lists`;

export const CENTRAL_RECEIVING_ROUTE = '/receiving/central';
export const CENTRAL_RECEIVING_BIND_PIECES_BASE_ROUTE = `${CENTRAL_RECEIVING_ROUTE}/bind-pieces`;
export const CENTRAL_RECEIVING_BIND_PIECES_ROUTE = `${CENTRAL_RECEIVING_BIND_PIECES_BASE_ROUTE}/:id`;
export const CENTRAL_RECEIVING_ROUTE_CREATE = `${CENTRAL_RECEIVING_ROUTE}/create`;
export const CENTRAL_RECEIVING_ROUTE_EDIT = `${CENTRAL_RECEIVING_ROUTE}/:id/edit`;
export const CENTRAL_RECEIVING_ROUTE_VIEW = `${CENTRAL_RECEIVING_ROUTE}/:id/view`;
export const CENTRAL_RECEIVING_PIECE_CREATE_ROUTE = `${CENTRAL_RECEIVING_ROUTE_VIEW}/piece/create`;
export const CENTRAL_RECEIVING_PIECE_EDIT_ROUTE = `${CENTRAL_RECEIVING_ROUTE_VIEW}/piece/:pieceId/edit`;
export const CENTRAL_RECEIVING_ROUTE_RECEIVE = `${CENTRAL_RECEIVING_ROUTE}/receive/:id`;
export const CENTRAL_RECEIVING_ROUTE_UNRECEIVE = `${CENTRAL_RECEIVING_ROUTE}/unreceive/:id`;
export const CENTRAL_RECEIVING_ROUTE_EXPECT = `${CENTRAL_RECEIVING_ROUTE}/expect/:id`;
export const CENTRAL_ROUTING_LIST_ROUTE = `${CENTRAL_RECEIVING_ROUTE}/routing-lists`;
