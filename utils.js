function sendSuccessMessage(res, data) {
    return res.status(200).send(JSON.stringify({ data: data || {}, message: "Success" }));
}

function sendErrorMessage(res, error) {
    return res.status(500).send(JSON.stringify({ error: error || {}, message: "Something went wrong" }))
}

module.exports = { sendSuccessMessage, sendErrorMessage };
