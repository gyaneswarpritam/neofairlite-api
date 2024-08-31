function schemaValidator(schema, data) {
    try {
        const validatedData = schema.parse(data);
        return { success: true, data: validatedData };
    } catch (error) {
        const errors = error && error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
        }));
        return { success: false, errors: errors };
    }
}

module.exports = schemaValidator;