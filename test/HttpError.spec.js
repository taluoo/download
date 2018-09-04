require('./test_setup');

const HttpError = require('../lib/HttpError');

describe('HttpError.js', () => {
    it('should exprot a class', function () {
        // HttpError.should.be.a('function')
    });
    // https://github.com/domenic/chai-as-promised/issues/226#issuecomment-337773181
    it('should work', async () => {
        await Promise.reject(new HttpError(404, 'Not found.'))
            .should.be.rejectedWith(HttpError, 'Not found.')
            .and.eventually.have.property('statusCode', 404);
    });
});