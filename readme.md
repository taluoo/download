download url and save to a tmpfile

## THIS PROJECT IS 【INACTIVE】
This project is not maintained anymore. Please use alternative.

## Install

```
npm install @taluoo/download --save
```

## Usage

```
const download = require('@taluoo/download');

async function test() {
    let tmpFilePath = await download('https://www.baidu.com/'); // download(url) return a Promise, which will resolve a tmpfile path when response.statusCode == 200 and download success
    console.log(tmpFilePath);
}

test();
```

## TODO

- custom requst headers
