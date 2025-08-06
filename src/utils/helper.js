export const validateData = (schema, data, context = {}) => {
    const result = schema.validate(data, { abortEarly: false, context })

    if (result.error) {
        const error = result.error
        const format_error = {}
        error.details.forEach(detail => {
            format_error[detail.context.key] = detail.message
        })
        return format_error
    }

    return null;
};