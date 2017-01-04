import RequestHandler from './requestHandler';
import { createCRUDActionsAndActionCreators } from './actions';

export default (endpoint, options) => {
    const actionsToHandle = createCRUDActionsAndActionCreators(endpoint, options.REDUX_ACTIONS_PREFIX);

    RequestHandler.options = options;

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
                    store.dispatch(actionsToHandle.createFailure({
                        status: error.status,
                        message: error.message,
                        stack: error.stack,
                    }));
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
                    store.dispatch(actionsToHandle.readFailure({
                        status: error.status,
                        message: error.message,
                        stack: error.stack,
                    }));
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
                    store.dispatch(actionsToHandle.updateFailure({
                        status: error.status,
                        message: error.message,
                        stack: error.stack,
                    }));
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
                    store.dispatch(actionsToHandle.deleteFailure({
                        status: error.status,
                        message: error.message,
                        stack: error.stack,
                    }));
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
                    store.dispatch(actionsToHandle.indexFailure({
                        status: error.status,
                        message: error.message,
                        stack: error.stack,
                    }));
                });
                break;
            default:
                break;
        }
    };
};
