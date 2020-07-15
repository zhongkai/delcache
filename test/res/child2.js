const delcache = require('../../delcache')
require('./seven')
delcache('./seven', true)
console.info('num:' + module.parent.children[0].children.length)