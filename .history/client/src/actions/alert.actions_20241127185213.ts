// Contiene creadores de acciones de Redux para acciones relacionadas con alertas/notificaciones de tostadora en la aplicación. Por ejemplo, para mostrar un mensaje de alerta de éxito con el texto "¡Excelente trabajo!" puedes llamar a despacho(alertActions.success('¡Excelente trabajo!'));.

// He incluido los métodos de acción en un objeto alertActions en la parte superior del archivo para que sea fácil ver todas las acciones disponibles de un vistazo y simplifica su importación a otros archivos. Los detalles de implementación para cada creador de acciones se encuentran en las siguientes funciones.


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