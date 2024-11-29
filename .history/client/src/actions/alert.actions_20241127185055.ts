import { alertConstants } from '../constants/alert.constants';

export const alertActions = {
    success,
    error,
    clear
};

interface SuccessAction {
    type: typeof alertConstants.SUCCESS;
    message: string;
}

interface ErrorAction {
    type: typeof alertConstants.ERROR;
    message: string;
}

function success(message: string): SuccessAction {
    return { type: alertConstants.SUCCESS, message };
}

function error(message: string): ErrorAction {
    return { type: alertConstants.ERROR, message };
}

function clear() {
    return { type: alertConstants.CLEAR };
}