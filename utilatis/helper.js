const setSuccessResponse = (data) => {
    const response = {
        success: (data && data.success) == false ? data.success : true,
        message: (data && data.message) ? data.message : 'Operation Successfull',
        content: (data && data.recordset) ? data.recordset : []
    }
    return response
};

const setErrorResponse = (data) => {
    return {
        success: false,
        message: (data && data.message) ? data.message : 'Internal Server Error'
    }
};

module.exports = { setSuccessResponse: setSuccessResponse, setErrorResponse: setErrorResponse }