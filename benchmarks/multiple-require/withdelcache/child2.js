const delcache = require('../../../delcache')
const { getHeapUsed } = require('../../../lib/getHeapInfo')

require('../../../lib/hw')
delcache('../../../lib/hw', true)

global.gc()

console.info('after memory heapUsed', getHeapUsed())
