const { getHeapUsed } = require('../../../lib/getHeapInfo')
let times = 10000

console.info('before memory heapUsed', getHeapUsed())

while(times--) {
    require('../../../lib/hw')
    //fake delete
    delete require.cache[require.resolve('../../../lib/hw')]
}
