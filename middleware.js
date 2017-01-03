import { NetInfo } from 'react-native';
import dataButler from './dataButler';

let isConnected = true;

export default (endpoint, options) => {
    const dispatchConnected = (connected) => {
        if (!isConnected && connected && options.DEBUG) {
            console.log('CONNECTED');
        } else if (isConnected && !connected && options.DEBUG) {
            console.log('DISCONNECTED');
        }
        isConnected = connected;
    };
    const dataButlerMiddleware = dataButler(endpoint, options.HTTP_OPTIONS);

    if (NetInfo) {
        NetInfo.isConnected.fetch().then().done(() => {
            NetInfo.isConnected.addEventListener('change', dispatchConnected);
        });
    }

    return (store) => (next) => (action) => {
        if (isConnected) {
            dataButlerMiddleware(action, store);
        }

        return next(action);
    };
};
