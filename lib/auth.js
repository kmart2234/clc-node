'use strict';

////////////////////////////////////////////////////////////////////////////
// Exported
//
exports.auth = (options, fn) => {
    return new Promise((resolve, reject) => {
        fn(options)
            .then(res => {
                if (res.statusCode && res.statusCode !== 200) {
                    return reject('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage);
                }
                return resolve(res);
            })
            .catch(err => {
                return reject(err);
            });
    });
};