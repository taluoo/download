require('./test_setup');
const Download = require('../index');

const path = require('path');
const os = require('os');
const fs = require('fs');

const nock = require('nock');
const deleteTmpFile = require('@taluoo/tmpfile').deleteTmpFile;

describe('index.js', () => {
    it('should export a function', function () {
        Download.should.be.a('function');
    });
    describe('download()', () => {
        let testHost = 'http://test.com';
        it('should return a promise', async () => {
            nock(testHost)
                .get('/ok')
                .reply(200, 'response 200 OK');
            let promise = Download(testHost + '/ok'); // 这里需要下载一个 200 资源，否则 download reject 会导致后面 deleteTmpFile 也被 rejcted，导致测试失败
            promise.should.be.a('promise');
            deleteTmpFile(await promise);
        });
        describe('when response 200 OK', () => {
            it('should return a tmp file path', async function () {
                nock(testHost)
                    .get('/ok')
                    .reply(200, 'response 200 OK');
                let tmpFilePath = await Download(testHost + '/ok');

                tmpFilePath.should.be.a('string');
                fs.existsSync(tmpFilePath).should.be.true;
            });
            it('the downloaded file should be correct')
        });
        describe('when reponse without 200', () => {
            it('should be rejected', async () => {
                nock(testHost)
                    .get('/404')
                    .reply(404, 'response not found');
                Download(testHost + '/404').should.be.rejected;
            });
        });
    });

});