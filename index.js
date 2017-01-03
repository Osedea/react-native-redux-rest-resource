import middleware from './middleware';
import { createCRUDActionCreators } from './actions';

let endpoint = 'endpoint';

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
};

export default (endpointSetByUser, options) => {
    endpoint = endpointSetByUser;

    return middleware(
        endpointSetByUser,
        {
            ...OPTIONS,
            ...options,
        }
    );
};

export const ACTION_CREATORS = createCRUDActionCreators(endpoint);
