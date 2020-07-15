const path = require('path')
const callsite = require('callsite')

function delcache(modulePath, all = false, rootPath = '') {

    modulePath = findModule(modulePath)

    if (!modulePath) {
        return false
    }

    let mod = require.cache[modulePath]

    if (mod) {
        //删除该模块的所有子引用
        traverseChildren(mod, m => {
            delete require.cache[m.id]
        })

        //防止内存泄露
        /* istanbul ignore else */
        if (mod.parent) {
            if(all) {
                clearTree(mod, rootPath)
            }
            else {
                mod.parent.children = mod.parent.children.filter(m => m.id !== mod.id)
            }
        }

        return true
    }

    return false
}

function clearTree(mod, rootPath) {

    let topModule = null

    if(rootPath) {
        try {
            topModule = require.cache[require.resolve(rootPath)]
        }
        catch(e) {}   
    }
    else {
        topModule = mod

        while(topModule.parent) {
            topModule = topModule.parent
        }
    }

    if(topModule) {
        traverseTree(topModule, m => m.id == mod.id) // true to delete
    }

}

function findModule(modulePath) {

    //如果传入相对路径
    if (/^\./.test(modulePath)) {
        let visited = false
        const stacks = callsite()
        for (const stack of stacks) {
            const filename = stack.getFileName()

            /* istanbul ignore else */
            if (filename == module.filename) {
                visited = true
            }
            else if (filename !== module.filename && filename !== 'module.js' && visited) {
                modulePath = path.resolve(path.dirname(filename), modulePath)
                break
            }
        }
    }
    try {
        return require.resolve(modulePath)
    } catch (e) {
        return ''
    }
}


function traverseChildren(mod, cb) {
    let visited = {}
    visited[mod.id] = 1

    function run(m) {
        visited[m.id] = true;
        m.children = m.children.filter(child => {
            // 不能delete c++ child，否则报错
            if (path.extname(child.filename) !== '.node' && !visited[child.id]) {
                run(child)
            }
            return false
        })
        cb(m)
    }

    run(mod)
}

function traverseTree(root, cb) {

    let visited = {}
    visited[root.id] = 1

    function run(mod) {

        mod.children = mod.children.filter(child => {

            if(cb(child)) {
                return false
            }
            else {
                if(!visited[child.id]) {
                    visited[child.id] = 1
                    run(child)
                }
                return true
            }
        })
    }

    run(root)
}



module.exports = delcache
module.exports.default = delcache