const delcache = require('../../../delcache')
const { getHeapUsed } = require('../../../lib/getHeapInfo')

require('../../../lib/hw')
require.cache[require.resolve('../../../lib/hw')]

global.gc()

console.info('after memory heapUsed', getHeapUsed())