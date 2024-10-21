const httpResponse = {
    successResponse: (res, data, message, code) => {
        res.status(code).json({ data, message });
    },
    errorResponse: (res, error, code) => {
        res.status(code).json({
            success:false,
            error: error,
        });
    },
    serverError:(err, req, res, next)=>{
        res.status(500).json({
            success:false,
            error: err.message,
            type: err.name
        })
    },
    notFoundError:(req, res, next)=>{
        res.status(404).json({
            success:false,
            error: 'Not found'
        })
    }

}

module.exports = httpResponse
