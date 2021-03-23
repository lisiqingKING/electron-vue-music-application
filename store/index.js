import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState, createSharedMutations } from 'vuex-electron'

import modules from './modules'

Vue.use(Vuex)

/**
 * createShareMutations插件注释掉
 * 不然无法正常使用 vuex 的store
 */

export default new Vuex.Store({
    modules,
    plugins: [
        //createPersistedState(),
        //createSharedMutations()
    ],
    strict: process.env.NODE_ENV !== 'production'
})