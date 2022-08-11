// const { Nuxt, Builder } = require('nuxt')
// const config = require("../nuxt.config.js");
//
//
// // Import and Set Nuxt.js options
//
//
// class AppBootHook {
//     constructor(app) {
//         this.app = app;
//     }
//
//     configWillLoad() {
//         // Ready to call configDidLoad,
//         // Config, plugin files are referred,
//         // this is the last chance to modify the config.
//     }
//
//     configDidLoad() {
//         // Config, plugin files have been loaded.
//     }
//
//     async didLoad() {
//         // All files have loaded, start plugin here.
//     }
//
//     async willReady() {
//         // All plugins have started, can do some thing before app ready
//     }
//
//     async didReady() {
//         let config = require('../nuxt.config.js')
//         config.dev = !(this.app.env === 'production')
//         console.log('-----this-app---', this.app)
//         // Worker is ready, can do some things
//         // don't need to block the app boot.
//         // Instantiate nuxt.js
//         const nuxt = new Nuxt(config)
//
//         const {
//             host = process.env.HOST || '127.0.0.1',
//             port = process.env.PORT || 3000
//         } = nuxt.options.server
//
//         // Build in development
//         if (config.dev) {
//             const builder = new Builder(nuxt)
//             await builder.build()
//         } else {
//             await nuxt.ready()
//         }
//
//         // 监听所有路由
//         this.app.use(ctx => {
//             console.log('----ctx---', ctx)
//             ctx.status = 200
//             ctx.respond = false // Bypass Koa's built-in response handling
//             ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
//             nuxt.render(ctx.req, ctx.res)
//         })
//     }
//
//     async serverDidReady() {
//         // Server is listening.
//     }
//
//     async beforeClose() {
//         // Do some thing before app close.
//     }
// }
//
// module.exports = AppBootHook


const { Nuxt, Builder } = require("nuxt");
let config = require("../../../nuxt.config");
module.exports = (options, app) => {
    const nuxtRender = new Nuxt(config);
    let isDev = process.env.NODE_ENV !== "production";
    if (isDev) {
        new Builder(nuxtRender).build();
    }
    return async function(ctx, next) {
        let flag = false;
        let routerArr = [];
        if (!flag) {
            routerArr = app.router.stack.map(el => el.path);
            flag = true;
        }
        if (routerArr.some(el => el === ctx.path)) {
            return await next();
        }
        ctx.status = 200;
        ctx.req.session = ctx.session;
        const { res, req } = ctx;
        return new Promise((resolve, reject) => {
            ctx.res.on("close", resolve);
            ctx.res.on("finish", resolve);
            nuxtRender.render(req, res)
        });
    };
};