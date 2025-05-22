module.exports = func => {
    return function (req, res, next) {
        func (req, res, next).catch(next) // This will catch any error that occurs in the async function and pass it to the next middleware
        
    };
}