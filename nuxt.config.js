
module.exports = {
    build: {
    },
    srcDir: '/Users/wangjiagui/study/nuxt-ssr/static',
    router: {
        base: '/',
        extendRoutes(routes, resolve) {
            console.log('----router---', routes)
        }
    },
}