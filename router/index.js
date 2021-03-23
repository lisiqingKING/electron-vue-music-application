import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}
export default new Router({
    routes: [
        {
            path: '/',
            name: 'home',
            component: require('../components/HomePage/Home').default,
            children: 
            [{
                path: '/',
                component: require('../components/HomePage/music').default //常规主页面
            },
            {
                meta: "query-music-list",
                path: 'songlist/:keywords',
                component: require("../components/HomePage/musiclist").default //搜索的歌曲结果展示
            },
            {

                path: "gedanlists",
                component: require("../components/HomePage/gedanlist").default //歌单页面
            }, {
                path: 'collect',
                component: require('../components/HomePage/collect').default
            },
            {
                path: 'applocal',
                component: require('../components/HomePage/applocal').default
            },
            {
                path: 'history',
                component: require('../components/HomePage/history').default
            },
            {
                path:"videoplay/:keywords",
                meta:"视频播放主界面",
                component:require("../components/HomePage/mvplay").default
            },{
                path:"songer/:name",
                meta:"歌手个人歌曲展示页面",
                component:require("../components/HomePage/songerShow").default
            },{
                path:"setting",
                meta:"设置界面",
                component:require("../components/HomePage/setting.vue").default
            }
            ]
        },
        {
            path: "/songplay",
            meta: "歌曲播放主界面",
            component: require("../components/HomePage/musciplay.vue").default
        }
    ]
})