import { camelizeKeys, decamelizeKeys } from 'humps';

export default class RequestHandler {
    static request(
        url,
        method = 'GET',
        headers = {},
        body = {}
    ) {
        const headersMerged = {
            ...this.options.HTTP_HEADERS,
            ...headers,
        };

        if (__DEV__ && this.options.DEBUG) {
            console.log(`[REQUEST] ${method} - ${url} - headers: `, headersMerged, 'body: ', body);
        }

        return fetch(
            url,
            {
                method,
                headers,
                ...(method !== 'GET' && method !== 'HEAD' && body !== {}
                    ? { body: JSON.stringify(this.options.CAMELIZE_DECAMELIZE ? decamelizeKeys(body) : body) }
                    : {}
                ),
            }
        )
        .then((response) => {
            if (response.status >= 400) {
                throw response;
            }

            return response.json();
        })
        .then((response) => {
            if (this.options.CAMELIZE_DECAMELIZE) {
                return camelizeKeys(response);
            } else {
                return response;
            }
        })
        .catch((errorResponse) => {
            // Handle Network Failure Request Error
            if (errorResponse.name === 'TypeError') {
                console.log(`9999 - Error for ${url} request`, 'NOT_CONNECTED');
                const error = new Error('NOT_CONNECTED');
                error.status = 9999;

                throw error;
            }

            // Handle HTTP Errors
            Object.entries(this.options.HTTP_ERROR_CODE_MESSAGES).forEach((errorCodesValues) => {
                if (errorResponse.status === errorCodesValues[0]) {
                    if (__DEV__ && this.options.DEBUG) {
                        console.log(`${errorResponse.status} - Error for ${url} request`, errorResponse.message);
                        console.log(errorResponse.stack);
                    }
                    const error = new Error(errorCodesValues[1]);
                    error.status = errorResponse.status;

                    throw error;
                }
            });

            // Handle Other JS Errors
            if (errorResponse.message) {
                if (__DEV__ && this.options.DEBUG) {
                    console.log(`${errorResponse.status} - Error for ${url} request`, errorResponse.message);
                    console.log(errorResponse.stack);
                }

                throw errorResponse;
            }

            // Handle Unparsed Server Errors
            return errorResponse.text()
            .then((errorParsed) => {
                if (__DEV__ && this.options.DEBUG) {
                    console.log(`${errorResponse.status} - Error for ${url} request`, errorParsed);
                }

                const error = new Error(errorParsed);

                error.status = errorResponse.status;

                throw error;
            });
        });
    }

    static requestServer(
        path,
        method = 'GET',
        data = {},
        options = {}
    ) {
        let authorization = {};

        if (this.options.JWT_TOKEN) {
            authorization = { Authorization: `Bearer ${this.options.JWT_TOKEN}` };
        }

        let body = null;

        if (method !== 'GET' && method !== 'HEAD') {
            body = data;
        }

        return this.request(
            `${this.options.API_URL}${path}`,
            method,
            {
                ...authorization,
                ...options,
            },
            body
        );
    }
}
