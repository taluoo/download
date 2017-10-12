require('./test_setup');
const Download = require('../index');

const path = require('path');
const os = require('os');
const fs = require('fs');

const nock = require('nock');
const md5 = require('@taluoo/md5');
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
            it('should return a tmp file path and the downloaded file should be correct', async function () {
                let file = __dirname + '/res/used_for_download.txt';
                fs.existsSync(file).should.be.true;
                nock(testHost)
                    .get('/ok')
                    .replyWithFile(200, __dirname + '/res/used_for_download.txt');
                let tmpFilePath = await Download(testHost + '/ok');

                tmpFilePath.should.be.a('string');
                fs.existsSync(tmpFilePath).should.be.true;

                let v = await md5(tmpFilePath);
                v.should.be.equal('f100d3d220bfd1a527fcf8908fd843a1');
                deleteTmpFile(tmpFilePath);
            });
        });
        describe('when response 404', () => {
            it('should be rejected', async () => {
                nock(testHost)
                    .get('/404')
                    .reply(404, 'response not found');
                Download(testHost + '/404').should.be.rejectedWith('download() failed');
            });
        });
    });

});