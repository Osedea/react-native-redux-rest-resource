import { camelizeKeys } from 'humps';

const defaultPrefix = 'RNRR';

export const createCRUDActions = (endpoint) => ({
    [`INDEX_${endpoint.toUpperCase()}`]: `${defaultPrefix}/${endpoint}/INDEX`,
    [`CREATE_${endpoint.toUpperCase()}`]: `${defaultPrefix}/${endpoint}/CREATE`,
    [`READ_${endpoint.toUpperCase()}`]: `${defaultPrefix}/${endpoint}/READ`,
    [`UPDATE_${endpoint.toUpperCase()}`]: `${defaultPrefix}/${endpoint}/UPDATE`,
    [`DELETE_${endpoint.toUpperCase()}`]: `${defaultPrefix}/${endpoint}/DELETE`,
});

export const createCRUDStatusActions = (endpoint) => Object.entries(createCRUDActions(endpoint)).reduce(
    (accumulator, CRUDItemKeyValue) => {
        accumulator[CRUDItemKeyValue[0]] = CRUDItemKeyValue[1];
        accumulator[`${CRUDItemKeyValue[0]}_SUCCESS`] = `${CRUDItemKeyValue[1]}_SUCCESS`;
        accumulator[`${CRUDItemKeyValue[0]}_FAILURE`] = `${CRUDItemKeyValue[1]}_FAILURE`;

        return accumulator;
    }, {}
);

const createActionCreator = (type) => (payload, meta) => ({
    type,
    payload,
    meta,
});

export const createCRUDActionCreators = (endpoint) => Object.entries(createCRUDStatusActions(endpoint)).reduce(
    (accumulator, CRUDItemStatusKeyValue) => {
        accumulator[camelizeKeys(CRUDItemStatusKeyValue[0])] = createActionCreator(CRUDItemStatusKeyValue[1]);

        return accumulator;
    }, {}
);

export const createDataButlerActions = (endpoint) => ({
    INDEX: `${defaultPrefix}/${endpoint}/INDEX`,
    indexSuccess: createActionCreator(`${defaultPrefix}/${endpoint}/INDEX_SUCCESS`),
    indexFailure: createActionCreator(`${defaultPrefix}/${endpoint}/INDEX_FAILURE`),
    CREATE: `${defaultPrefix}/${endpoint}/CREATE`,
    createSuccess: createActionCreator(`${defaultPrefix}/${endpoint}/CREATE_SUCCESS`),
    createFailure: createActionCreator(`${defaultPrefix}/${endpoint}/CREATE_FAILURE`),
    READ: `${defaultPrefix}/${endpoint}/READ`,
    readSuccess: createActionCreator(`${defaultPrefix}/${endpoint}/READ_SUCCESS`),
    readFailure: createActionCreator(`${defaultPrefix}/${endpoint}/READ_FAILURE`),
    UPDATE: `${defaultPrefix}/${endpoint}/UPDATE`,
    updateSuccess: createActionCreator(`${defaultPrefix}/${endpoint}/UPDATE_SUCCESS`),
    updateFailure: createActionCreator(`${defaultPrefix}/${endpoint}/UPDATE_FAILURE`),
    DELETE: `${defaultPrefix}/${endpoint}/DELETE`,
    deleteSuccess: createActionCreator(`${defaultPrefix}/${endpoint}/DELETE_SUCCESS`),
    deleteFailure: createActionCreator(`${defaultPrefix}/${endpoint}/DELETE_FAILURE`),
});
