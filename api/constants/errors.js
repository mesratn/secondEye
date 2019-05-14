module.exports = {
    UNHANDLED_ERROR: {
        code: -1,
        error: '',
        httpCode: 520
    },
    FILE_ERROR: {
        code: 10,
        error: 'File error or bad file format.',
        httpCode: 400
    },
    NO_FACE: {
        code: 20,
        error: 'No face detected.',
        httpCode: 400
    },
    NO_SAVED_FACE: {
        code: 21,
        error: 'No saved face detected.',
        httpCode: 400
    }
}