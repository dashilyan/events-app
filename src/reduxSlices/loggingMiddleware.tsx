import { Middleware } from 'redux';
import { PayloadAction } from '@reduxjs/toolkit';

const loggingMiddleware: Middleware = (store) => (next) => (action) => {
    console.group(`Вызвано действие: ${action.type}`);
    console.log('Состояние до:', store.getState());
    const result = next(action);
    console.log('Состояние после:', store.getState());
    console.groupEnd();
    return result;
};

export default loggingMiddleware;