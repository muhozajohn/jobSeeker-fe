export interface ErrorResponse {
    status?: string;
    statusCode?: number;
    message: string;
    timestamp?: string;
    errors?: Array<{
        field: string;
        constraint: string;
    }>;
}

export const formatError = (errorResponse: ErrorResponse): string => {

    const errorMessage = errorResponse.message || "An unknown error occurred";
    if (errorResponse.errors && errorResponse.errors.length > 0) {
        // const statusCode = errorResponse.statusCode || 500;

        const formattedErrors = errorResponse.errors
            .map((error) => `${error.field}: ${error.constraint}`)
            .join(", ");

        return `${errorMessage} \n ${formattedErrors.charAt(0).toUpperCase() + formattedErrors.slice(1)} `;
    } else {
        return errorMessage;
    }
}