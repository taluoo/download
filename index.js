const fs = require('fs');

const Request = require('request');
const makeTmpFile = require('@taluoo/tmpfile').makeTmpFile;

/**
 * 下载
 * @param url
 * @return {Promise} 仅当响应码为 200 时，返回保存着临时文件路径
 */
function download(url) {
    return new Promise(function (resolve, reject) {
        let options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:54.0) Gecko/20100101 Firefox/54.0'
            }
        };

        Request.get(url, options)
            .on('response', async response => {
                let code = response.statusCode;
                if (code === 200) {
                    // 不能直接 resolve response，会导致数据丢失。参见：https://github.com/request/request/issues/2696
                    // resolve(response);
                    // 解决办法：先写入到临时文件
                    let tmpFilePath = await makeTmpFile();
                    let stream = fs.createWriteStream(tmpFilePath);
                    stream.on('finish', () => resolve(tmpFilePath));
                    stream.on('error', err => reject(err));
                    response.pipe(stream);
                } else {
                    let msg = `download() failed，Request ${url} response code ${code}`;
                    reject(new Error(msg))
                }
            })
            .on('error', function (err) {
                reject(err);
            })
    })
}

module.exports = download;