const successResponse = (message, data) => {
    try {
        return {
            status: 200,
            message: message,
            data
        };

    } catch (error) {
        console.error(error);
    }
};
const notFoundResponse = (message) => {
    try {
        return {
            status: 200,
            message: message,
            data: []
        };

    } catch (error) {
        console.error(error);
    }
};
const successResponseWithRecordCount = (message, data, totalrecords) => {
    try {
        return {
            status: 200,
            message: message,
            data,
            totalCount: totalrecords,
            // totalPages: totalPages,
            // currentPage
        };
    } catch (error) {
        console.error(error);
    }
};

module.exports = { successResponse, successResponseWithRecordCount, notFoundResponse };