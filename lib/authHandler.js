'use strict';

////////////////////////////////////////////////////////////////////////////
// Exported Functions
//
module.exports = authHandler;


////////////////////////////////////////////////////////////////////////////
// Local Variables
//
let authOptions = {
    uri: 'https://api.ctl.io/v2/authentication/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    json: true,
    body: null,
    resolveWithFullResponse: true
};


////////////////////////////////////////////////////////////////////////////
// External Modules
//
const auth = require('./auth').auth;
const cache = require('memory-cache');
const requestPromise = require('request-promise');
const retry = require('./retry');
const request = retry(requestPromise);

function authHandler(creds){
    return new Promise((resolve, reject) => {
        if (!creds || typeof creds !== 'object') {
            return reject(new Error('creds were missing or of the wrong type.'));
        }
        const cachedToken = cache.get('bearerToken');
        const cachedAlias = cache.get('alias');

        if(cachedToken){
            // Test the token. If good, return the cached token
            request({
                uri: 'https://api.ctl.io/v2/datacenters/'+ cachedAlias +'/CA1',
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + cachedToken
                },
                resolveWithFullResponse: true
            })
                .then(res => {
                    if (res.statusCode && res.statusCode !== 200) {
                        authOptions.body = creds;
                        return auth(authOptions, request)
                            .then(res => {
                                cache.put('bearerToken', res.body.bearerToken);
                                cache.put('alias', res.body.accountAlias);
                                return resolve(res.body.bearerToken);
                            })
                            .catch(err => {
                                return reject(err);
                            })
                    }
                    return resolve(cachedToken);
                })
                .catch(err => {
                    return reject(err);
                });
        } else {
            authOptions.body = creds;
            return auth(authOptions, request)
                .then(res =>{
                    cache.put('bearerToken', res.body.bearerToken);
                    cache.put('alias', res.body.accountAlias);
                    return resolve(res.body.bearerToken);
                })
                .catch(err =>{
                    return reject(err.error.message);
                });
        }
    });
}