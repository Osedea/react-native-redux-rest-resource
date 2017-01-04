import middlewareCreate from './middleware';
import { createCRUDStatusActions, createCRUDActionCreators } from './actions';

const OPTIONS = {
    DEBUG: true,
    CAMELIZE_DECAMELIZE: true,
    HTTP_ERROR_CODE_MESSAGES: {
        401: 'FORBIDDEN',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
    },
    API_URL: 'localhost',
    HTTP_OPTIONS: {},
    REDUX_ACTIONS_PREFIX: 'RNRRR',
};

export default (endpoint, options = {}) => {
    const optionsMerged = {
        ...OPTIONS,
        ...options,
    };

    const actions = createCRUDStatusActions(
        endpoint,
        optionsMerged.REDUX_ACTIONS_PREFIX
    );
    const actionCreators = createCRUDActionCreators(
        endpoint,
        optionsMerged.REDUX_ACTIONS_PREFIX
    );
    const middleware = middlewareCreate(
        endpoint,
        optionsMerged
    );

    return {
        actions,
        actionCreators,
        middleware,
    };
};
