import middlewareCreate from './middleware';
import { createCRUDStatusActions, createCRUDActionCreators } from './actions';

const OPTIONS = {
    API_URL: 'localhost/',
    CAMELIZE_DECAMELIZE: true,
    DEBUG: true,
    HTTP_ERROR_CODE_MESSAGES: {
        401: 'FORBIDDEN',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
    },
    HTTP_HEADERS: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    JWT_TOKEN: null,
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
