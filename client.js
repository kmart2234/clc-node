'use strict';

////////////////////////////////////////////////////////////////////////////
// Exported Functions
//
module.exports = Client;


////////////////////////////////////////////////////////////////////////////
// Required Modules
//
const requestPromise = require('request-promise');
const retry = require('./lib/retry');
const request = retry(requestPromise);
const querystring = require('querystring');
const authHandler = require('./lib/authHandler');

////////////////////////////////////////////////////////////////////////////
// Local Variables / Functions
//
const apiBaseUrl = 'https://api.ctl.io/';
let credsObj = null;

const myBody = (body) => {
    if(typeof body !== 'object'){
        return JSON.parse(body);
    }
    return body;
};

let options = (url, method, token, body, qs) =>{
    if(!url || !method || !token) return new Error('You need to give me more');
    qs = qs ? '?' + querystring.stringify(qs) : '';
    let _option =  {
        uri: url + qs,
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        timeout: 5000,
        resolveWithFullResponse: true
    };
    if(/put|post|patch/i.test(method) && (body && typeof body === 'object')){
        _option.json = true;
        _option.body = body;
    }
    return _option;
};


////////////////////////////////////////////////////////////////////////////
// Constructor
//
function Client(creds) {
    credsObj = creds;
}

// https://www.ctl.io/api-docs/v2/#billing
Client.prototype.billing = {
    /*
     *  https://www.ctl.io/api-docs/v2/#data-centers-get-data-center-bare-metal-capabilities
     */
    getInvoiceData: (accountAlias, year, month, pAlias) =>{
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                pAlias = pAlias ? {'pricingAccount': pAlias } : null;
                let myUrl = apiBaseUrl + 'v2/invoice/' + accountAlias + '/' + year + '/' + month;
                request(options(myUrl, 'GET', token, null, pAlias))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    }
};

// https://www.ctl.io/api-docs/v2/#data-centers
Client.prototype.dataCenters = {
    /*
     *  https://www.ctl.io/api-docs/v2/#data-centers-get-data-center-bare-metal-capabilities
     */
    getDcBareMetalCapabilities: (accountAlias, dataCenter) =>{
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/datacenters/' + accountAlias + '/' + dataCenter + '/bareMetalCapabilities';
                request(options(myUrl, 'GET', token, null, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#data-centers-get-data-center-deployment-capabilities
     */
    getDcDeploymentCapabilities: (accountAlias, dataCenter) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/datacenters/' + accountAlias + '/' + dataCenter + '/deploymentCapabilities';
                request(options(myUrl, 'GET', token, null, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#data-centers-get-data-center-list
     */
    getDcList: (accountAlias) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/datacenters/' + accountAlias;
                request(options(myUrl, 'GET', token, null, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#data-centers-get-data-center
     */
    getDc: (accountAlias, dataCenter, groupLinks) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                groupLinks = groupLinks ? {'groupLinks': groupLinks } : null;
                let myUrl = apiBaseUrl + 'v2/datacenters/' + accountAlias + '/' + dataCenter;
                request(options(myUrl, 'GET', token, null, groupLinks))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    }
};

// https://www.ctl.io/api-docs/v2/#groups
Client.prototype.groups = {
    /*
     *  https://www.ctl.io/api-docs/v2/#groups-create-group
     */
    createGroup: (accountAlias, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/groups/' + accountAlias;
                request(options(myUrl, 'POST', token, content, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     * https://www.ctl.io/api-docs/v2/#groups-delete-group
     */
    deleteGroup: (accountAlias, groupId) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/groups/' + accountAlias + '/' + groupId;
                request(options(myUrl, 'DELETE', token, null, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#groups-get-group-billing-details
     */
    getGroupBillingDetails: (accountAlias, groupId) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/groups/' + accountAlias + '/' + groupId + '/billing';
                request(options(myUrl, 'GET', token, null, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#groups-get-group-horizontal-autoscale-policy
     */
    getGroupHorizontalAutoscalePolicy: (accountAlias, groupId) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/groups/' + accountAlias + '/' + groupId + '/horizontalAutoscalePolicy';
                request(options(myUrl, 'GET', token, null, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#groups-get-group-monitoring-statistics
     */
    getGroupMonitoringStatistics: (accountAlias, groupId, qs) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/groups/' + accountAlias + '/' + groupId + '/statistics';
                request(options(myUrl, 'GET', token, null, qs))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#groups-get-group-scheduled-activities
     */
    getGroupScheduledActivities: (accountAlias, groupId) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/groups/' + accountAlias + '/' + groupId + '/ScheduledActivities';
                request(options(myUrl, 'GET', token, null, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#groups-get-group
     */
    getGroup: (accountAlias, groupId) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/groups/' + accountAlias + '/' + groupId;
                request(options(myUrl, 'GET', token, null, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#groups-set-group-custom-fields
     */
    setGroupCustomFields: (accountAlias, groupId, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/groups/' + accountAlias + '/' + groupId;
                request(options(myUrl, 'PATCH', token, content, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#groups-set-group-defaults
     */
    setGroupDefaults: (accountAlias, groupId, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/groups/' + accountAlias + '/' + groupId + '/defaults';
                request(options(myUrl, 'POST', token, content, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#groups-set-group-horizontal-autoscale-policy
     */
    setGroupHorizontalAutoscalePolicy: (accountAlias, groupId, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/groups/' + accountAlias + '/' + groupId + '/horizontalAutoscalePolicy';
                request(options(myUrl, 'PUT', token, content, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#groups-set-group-namedescription
     */
    setGroupNameDescription: (accountAlias, groupId, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/groups/' + accountAlias + '/' + groupId;
                request(options(myUrl, 'PATCH', token, content, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#groups-set-group-parent
     */
    setGroupParent: (accountAlias, groupId, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/groups/' + accountAlias + '/' + groupId;
                request(options(myUrl, 'PATCH', token, content, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#groups-set-group-scheduled-activities
     */
    setGroupScheduledActivities: (accountAlias, groupId, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/groups/' + accountAlias + '/' + groupId + '/ScheduledActivities';
                request(options(myUrl, 'POST', token, content, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    }
};

// https://www.ctl.io/api-docs/v2/#networks
Client.prototype.networks = {
    /*
     *  https://www.ctl.io/api-docs/v2/#networks-claim-network
     */
    claimNetwork: (accountAlias, dataCenter) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2-experimental/networks/' + accountAlias + '/' + dataCenter + '/claim';
                request(options(myUrl, 'POST', token, null, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#networks-get-ip-address-list
     */
    getIpAddressList: (accountAlias, dataCenter, network, type) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                type = type ? {'type': type }: null;
                let myUrl = apiBaseUrl + 'v2-experimental/networks/' + accountAlias + '/' + dataCenter + '/' + network + '/ipAddresses';
                request(options(myUrl, 'GET', token, null, type))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#networks-get-network-list
     */
    getNetworkList: (accountAlias, dataCenter) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2-experimental/networks/' + accountAlias + '/' + dataCenter;
                request(options(myUrl, 'GET', token, null, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#networks-get-network
     */
    getNetwork: (accountAlias, dataCenter, network, ipAddresses) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                ipAddresses = ipAddresses ? {'ipAddresses': ipAddresses }: null;
                let myUrl = apiBaseUrl + 'v2-experimental/networks/' + accountAlias + '/' + dataCenter + '/' + network;
                request(options(myUrl, 'GET', token, null, ipAddresses))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#networks-release-network
     */
    releaseNetwork: (accountAlias, dataCenter, network) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2-experimental/networks/' + accountAlias + '/' + dataCenter + '/' + network + '/release';
                request(options(myUrl, 'POST', token, null, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#networks-create-a-site-to-site-vpn
     */
    createSiteToSiteVpn: (accountId, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/siteToSiteVpn';
                request(options(myUrl, 'POST', token, content, { 'account': accountId }))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#networks-delete-a-site-to-site-vpn
     */
    deleteSiteToSiteVpn: (accountId, vpnId) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/siteToSiteVpn/' + vpnId;
                request(options(myUrl, 'DELETE', token, null, { 'account': accountId }))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#networks-get-details-for-a-site-to-site-vpn
     */
    getSiteToSiteVpnDetails: (accountId, vpnId) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/siteToSiteVpn/' + vpnId;
                request(options(myUrl, 'GET', token, null, { 'account': accountId }))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#networks-get-details-for-a-site-to-site-vpn
     */
    getSiteToSiteVpns: (accountId) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/siteToSiteVpn';
                request(options(myUrl, 'GET', token, null, { 'account': accountId }))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#networks-update-a-site-to-site-vpn
     */
    updateSiteToSiteVpn: (accountId, vpnId, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/siteToSiteVpn/' + vpnId;
                request(options(myUrl, 'PUT', token, content, { 'account': accountId }))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#networks-update-network
     */
    updateNetwork: (accountAlias, dataCenter, network, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2-experimental/networks/' + accountAlias + '/' + dataCenter + '/' + network;
                request(options(myUrl, 'PUT', token, content, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    }
};

// https://www.ctl.io/api-docs/v2/#servers
Client.prototype.servers = {
    /*
     *  https://www.ctl.io/api-docs/v2/#servers-add-secondary-network
     */
    addSecondaryNetwork: (accountAlias, serverId, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/servers/' + accountAlias + '/' + serverId + '/networks';
                request(options(myUrl, 'POST', token, content, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#servers-clone-server
     */
    cloneServer: (accountAlias, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/servers/' + accountAlias;
                request(options(myUrl, 'POST', token, content, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#servers-create-server
     */
    createServer: (accountAlias, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/servers/' + accountAlias;
                request(options(myUrl, 'POST', token, content, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#servers-delete-server
     */
    deleteServer: (accountAlias, serverId) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/servers/' + accountAlias + '/' + serverId;
                request(options(myUrl, 'DELETE', token, null, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#servers-get-available-server-imports
     */
    getAvailableServerImports: (accountAlias, locationId) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/servers/' + accountAlias + '/' + locationId + '/available';
                request(options(myUrl, 'GET', token, null, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#servers-get-server-credentials
     */
    getServerCredentials:  (accountAlias, serverId) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/servers/' + accountAlias + '/' + serverId + '/credentials';
                request(options(myUrl, 'GET', token, null, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#servers-get-server
     */
    getServer: (accountAlias, serverId) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/servers/' + accountAlias + '/' + serverId;
                request(options(myUrl, 'GET', token, null, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#servers-import-server
     */
    importServer: (accountAlias, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/vmImport/' + accountAlias;
                request(options(myUrl, 'POST', token, content, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#servers-remove-secondary-network
     */
    removeSecondaryNetwork: (accountAlias, serverId, networkId) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/servers/' + accountAlias + '/' + serverId + '/networks/' + networkId;
                request(options(myUrl, 'DELETE', token, null, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#servers-set-server-cpumemory
     */
    setServerResources: (accountAlias, serverId, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/servers/' + accountAlias + '/' + serverId;
                request(options(myUrl, 'PATCH', token, content, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#servers-set-server-credentials
     */
    setServerCredentials: (accountAlias, serverId, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/servers/' + accountAlias + '/' + serverId;
                request(options(myUrl, 'PATCH', token, content, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#servers-set-server-custom-fields
     */
    setServerCustomFields: (accountAlias, serverId, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/servers/' + accountAlias + '/' + serverId;
                request(options(myUrl, 'PATCH', token, content, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#servers-set-server-descriptiongroup
     */
    setServerDescriptionGroup: (accountAlias, serverId, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/servers/' + accountAlias + '/' + serverId;
                request(options(myUrl, 'PATCH', token, content, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    },
    /*
     *  https://www.ctl.io/api-docs/v2/#servers-set-server-disks
     */
    setServerDisks: (accountAlias, serverId, content) => {
        return new Promise((resolve, reject) => {
            return authHandler(credsObj).then(token => {
                let myUrl = apiBaseUrl + 'v2/servers/' + accountAlias + '/' + serverId;
                request(options(myUrl, 'PATCH', token, content, null))
                    .then(res => {
                        if (res.statusCode < 200 || res.statusCode > 299) {
                            return reject(new Error('Status Code: ' + res.statusCode + ' - Message: ' + res.statusMessage));
                        }
                        return resolve(myBody(res.body));
                    })
                    .catch(err => {
                        return reject(err);
                    });
            }).catch(err => {
                return reject(err);
            });
        });
    }
};