import RequestHandler from './RequestHandler';
import { createDataButlerActions } from './actions';

export default (endpoint, httpOptions) => {
    const actionsToHandle = createDataButlerActions(endpoint);
    const requestHandler = new RequestHandler(httpOptions);

    return (action, store) => {
        switch (action.type) {
            case actionsToHandle.CREATE:
                requestHandler.requestServer(
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
                requestHandler.requestServer(
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
                requestHandler.requestServer(
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
                requestHandler.requestServer(
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
                requestHandler.requestServer(
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
