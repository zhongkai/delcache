const delcache = require('../../delcache')
const { getHeapUsed } = require('../../lib/getHeapInfo')
console.info('before memory heapUsed', getHeapUsed())
let time = 10000

while(time--) {
    let a = require('../../lib/hw')
    delcache('../../lib/hw')
}
global.gc()
console.info('after memory heapUsed', getHeapUsed())
