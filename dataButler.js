import RequestHandler from './requestHandler';
import { createCRUDActionsAndActionCreators } from './actions';

export default (endpoint, options) => {
    const actionsToHandle = createCRUDActionsAndActionCreators(endpoint, options.REDUX_ACTIONS_PREFIX);

    RequestHandler.options = options.HTTP_OPTIONS;

    return (action, store) => {
        switch (action.type) {
            case actionsToHandle.CREATE:
                RequestHandler.requestServer(
                    endpoint,
                    'POST',
                    action.payload
                ).then((resourceFromServer) => {
                    store.dispatch(actionsToHandle.createSuccess(resourceFromServer));
                })
                .catch((error) => {
                    store.dispatch(actionsToHandle.createFailure(error));
                    throw error;
                });
                break;
            case actionsToHandle.READ:
                RequestHandler.requestServer(
                    `${endpoint}s/${action.meta.id}`,
                    'GET'
                ).then((resourceFromServer) => {
                    store.dispatch(actionsToHandle.readSuccess(resourceFromServer));
                })
                .catch((error) => {
                    store.dispatch(actionsToHandle.readFailure(error));
                });
                break;
            case actionsToHandle.UPDATE:
                RequestHandler.requestServer(
                    `${endpoint}s/${action.meta.id}`,
                    'PUT',
                    action.payload
                ).then((resourceFromServer) => {
                    store.dispatch(actionsToHandle.updateSuccess(resourceFromServer));
                })
                .catch((error) => {
                    store.dispatch(actionsToHandle.updateFailure(error));
                });
                break;
            case actionsToHandle.DELETE:
                RequestHandler.requestServer(
                    `${endpoint}s/${action.meta.id}`,
                    'DELETE'
                ).then((resourceFromServer) => {
                    store.dispatch(actionsToHandle.deleteSuccess(resourceFromServer));
                })
                .catch((error) => {
                    store.dispatch(actionsToHandle.deleteFailure(error));
                });
                break;
            case actionsToHandle.INDEX:
                RequestHandler.requestServer(
                    `${endpoint}s`,
                    'GET'
                ).then((resourceFromServer) => {
                    store.dispatch(actionsToHandle.indexSuccess(resourceFromServer));
                })
                .catch((error) => {
                    store.dispatch(actionsToHandle.indexFailure(error));
                });
                break;
            default:
                break;
        }
    };
};
