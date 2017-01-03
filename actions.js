import { camelizeKeys } from 'humps';

export const createCRUDActions = (endpoint, prefix) => ({
    INDEX: `${prefix}/${endpoint}/INDEX`,
    CREATE: `${prefix}/${endpoint}/CREATE`,
    READ: `${prefix}/${endpoint}/READ`,
    UPDATE: `${prefix}/${endpoint}/UPDATE`,
    DELETE: `${prefix}/${endpoint}/DELETE`,
});

export const createCRUDStatusActions = (endpoint, prefix) => Object.entries(createCRUDActions(endpoint, prefix)).reduce(
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

export const createCRUDActionCreators = (endpoint, prefix) => Object.entries(createCRUDStatusActions(endpoint, prefix)).reduce(
    (accumulator, CRUDItemStatusKeyValue) => {
        accumulator[camelizeKeys(CRUDItemStatusKeyValue[0])] = createActionCreator(CRUDItemStatusKeyValue[1]);

        return accumulator;
    }, {}
);

export const createCRUDActionsAndActionCreators = (endpoint, prefix) => ({
    ...createCRUDStatusActions(endpoint, prefix),
    ...createCRUDActionCreators(endpoint, prefix),
});
