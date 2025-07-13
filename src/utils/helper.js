export const validateData = (schema, data) => {
    const result = schema.validate(data, { abortEarly: false })

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