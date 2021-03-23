<template>
<div id="wrapper">
    <div id="navigations" @click.capture="go($event)">
        <div ref="userImag">
            <i id="userImage" class="fa fa-user-circle" @click.self="showUserForm">&nbsp&nbsp{{username}}</i>
            <login v-if="isShowUserForm" v-on:close1="closeLogin"></login>
        </div>
        <div ref="music" name="music">
            <i class="el-icon-headset"></i>
            <router-link to="/">音乐</router-link>
        </div>
        <div ref="collect" name="collect">
            <i class="el-icon-collection-tag"></i>
            <router-link to="/collect">收藏</router-link>
        </div>
        <div ref="local" name="local">
            <i class="el-icon-download"></i>
            <router-link to="/applocal">本地</router-link>
        </div>
        <div ref="songlist" name="songlist">
            <i class="el-icon-s-order"></i>
            <router-link to="/gedanlists">歌单</router-link>
        </div>
        <div ref="history" name="history">
            <i class="el-icon-time"></i>
            <router-link to="/history">历史</router-link>
        </div>
        <div ref="setting" name="setting">
            <i class="el-icon-setting"></i>
            <router-link to="/setting">设置</router-link>
        </div>
    </div>
    <div id="main-display">
        <!--this area full of functions-->
        <div id="function-area">
            <search></search>
            <div>
                <i class="el-icon-minus" title="最小化" @click="minScreen"></i>
                <i class="el-icon-full-screen" title="全屏" @click="maxScreen"></i>
                <i class="el-icon-close" title="退出应用" @click="exitApplication"></i>
            </div>
        </div>
        <!--this area as router-view-->
        <div id="main-recommand">
            <router-view></router-view>
        </div>
        <!--audio control area-->
        <audiocontrol></audiocontrol>
    </div>
</div>
</template>

<script>
//.vue component文件
import login from "./login";
import search from "./search"
import audiocontrol from "./audioPlayControl"

//moudles quote
import axios from 'axios'
import {
    ipcRenderer,
    inAppPurchase
} from "electron"

export default {
    name: "Home",
    data: function () {
        return {
            isShowUserForm: false,
            currentNavigationStyle: "navigationActiveStyle",
        };
    },
    mounted() {
        //路由更新 当前组件需重新挂载
        console.log(this.$route)
        console.log("mouted-phase: ", this.$data)
        var list = document.getElementById("navigations").children
        var index_ = 1

        if (this.$route.path == "/") {
            index_ = 1
        } else if (this.$route.path == '/collect') {
            index_ = 2
        } else if (this.$route.path == '/applocal') {
            index_ = 3
        } else if (this.$route.path == '/gedanlists') {
            index_ = 4
        } else if (this.$route.path == '/history') {
            index_ = 5
        } else if (this.$route.path == '/setting') {
            index_ = 6
        }
        list[index_].classList.add(this.currentNavigationStyle)
    },

    methods: {
        go(event) {
            //点击路由后 数据会更新 所以 点击后的一些属性操作会被重置 最合理的做法就是 监听路由的改变
            console.log("navigation change")

        },
        showUserForm: function () {
            if (!this.$store.getters.getUser.username) {
                this.$data.isShowUserForm = !this.$data.isShowUserForm
            }

        },
        minScreen: function () {
            ipcRenderer.send('MIN_SCREEN')
        },
        maxScreen: function () {
            ipcRenderer.send('MAX_SCREEN')
        },
        exitApplication: function () {
            ipcRenderer.send('EXIT_APPLICATION')
        },
        closeLogin: function () {
            this.$data.isShowUserForm = false
        }
    },
    components: {
        login,
        search,
        audiocontrol
    },
    computed: {
        username: function () {
            return this.$store.getters.getUser.username
        }
    }
};
</script>

<style>
#wrapper {
    display: flex;
}

#wrapper,
#wrapper>div {
    height: 100%;
}

#navigations {
    padding: 15px;
    box-sizing: border-box;
    width: 180px;
    flex-grow: 0;
    border-right: solid rgba(145, 158, 222, 0.39) 1px;
}

#navigations>* {
    font-size: 18px;
    padding-left: 10px;
    display: block;
    height: 30px;
    line-height: 30px;
    margin-bottom: 15px;
}

#navigations>div>i {
    margin-right: 6px;
}

#navigations>*:not(:nth-child(1)):hover {
    border-radius: 5px;
    background-color: rgba(17, 88, 218, 0.4);
}

#main-display {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
}

#function-area {
    position: relative;
    box-sizing: border-box;
    height: 60px;
    padding: 0px 30px;
    margin-top: 10px;
}

#function-area>div:nth-child(1) {
    height: 100%;
    width: 40%;
    min-width: 400px;
    max-width: 800px;
    float: left;
    display: flex;
    align-items: center;
}

#function-area>div:nth-child(2) {
    height: 100%;
    float: right;
    display: flex;
    align-items: center;
}

#function-area>div:nth-child(2) i {
    padding: 10px;
}

#function-area>div:nth-child(2) i:hover {
    background-color: rgba(153, 147, 147, 0.261);
    color: green;
}

#main-recommand {
    flex-grow: 1;
    position: relative;
    overflow-x: hidden;
    overflow-y: scroll;
    margin: 10px 30px;
    margin-bottom: 0px;
}

#main-recommand>div {
    position: absolute;
    width: 100%;
}

.navigationActiveStyle {
    background-color: rgba(17, 88, 218, 0.75);
    border-radius: 5px;
}

#userImage+* {
    width: 600px;
    height: 400px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    top: 0px;
    margin: auto;
    z-index: 99;
}

.audio-play-enter,
.audio-play-leave-to {
    transform: translateY(100%);
}

.audio-play-enter-active,
.audio-play-leave-active {
    transition: all 0.2s linear;
}

.audio-play-enter-to,
.audio-play-leave {
    transform: translateY(0%);
}
</style>
