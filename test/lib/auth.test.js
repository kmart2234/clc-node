////////////////////////////////////////////////////////////////////////////
// Prod Modules Required
//
const auth = require('../../lib/auth').auth;


////////////////////////////////////////////////////////////////////////////
// Dev Modules Required
//
const
    chai = require('chai'),
    expect = require('chai').expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai');

chai.use(sinonChai);


////////////////////////////////////////////////////////////////////////////
// Mocks Inputs / Responses
//
let myMock = (code, message) => {
    return {
        statusCode: code,
        statusMessage: message,
        body: {
            bearerToken: 'randomString'
        }
    }
};


////////////////////////////////////////////////////////////////////////////
// Tests
//
describe('auth.js Tests',() => {

    it('should resolve with a bearer token',() => {
        let resGood = sinon.stub().resolves(myMock(200, 'Good'));
        auth('Placeholder', resGood)
            .then(reply => {
                expect(reply.body.bearerToken).to.equal('randomString');
            });
    });

    it('should reject with a bad statusCode',() => {
        let resGood = sinon.stub().resolves(myMock(408, 'Bad'));
        auth('Placeholder', resGood)
            .then(res =>{
                throw new Error(res)
            })
            .catch(err =>{
                expect(err);
            })
    });

    it('should reject with bad creds, statusCode 400',() => {
        let resBad = sinon.stub().rejects(myMock(400, 'Bad'));
        auth('Placeholder', resBad)
            .catch(err => {
                expect(err);
            });
    });

});