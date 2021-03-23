<template>
<div>
    <ul>
        <li v-for="(video,index) in list" :key="index" class="video-list-style">
            <div>
                <!--固定宽度和间距-->
                <div @click="goMvPlayPage(video)">
                    <!--固定正方形 -->
                    <img :src="video.pic|filter1">
                    <div class="video-list-play-logo"><i class="fa fa-play-circle-o" style="font-size:50px"></i></div>
                    <!--播放图标logo-->
                </div>
            </div>
            <div class="video-list-tag">播放:{{video.pay|playCountFilter}}</div>
        </li>
    </ul>
</div>
</template>

<script>
import player from "../player.js"
const axios = require("axios")
export default {
    data: function () {
        return {
            list: [],
            start: 0,
            end: 30,
            baseUrl: "http://127.0.0.1:3000/api/queryByKeyword/",
        }
    },
    filters: {
        filter1: function (url) {
            var picUrl = "http://127.0.0.1:3000/api/picture"
            return url ? picUrl + "/" + url.replace(new RegExp("\//|\/|:", "g"), "") : null
        },
        playCountFilter: function (count) {

            var count = Number(count)
            return count > 1000 ? Math.floor(count / 1000) + "k" : Math.floor(Math.random() * 1000)
        }
    },
    props: ["mode"],

    beforeMount() {

        //判断是本地读写数据还是选择请求数据
        console.log(this.$route)
        if (this.$route.meta == "query-music-list") {
            console.log("ok1")
            this.getList(this.$route.params.keywords)
        } else {
            /*
            选择本地数据读写
            如果执行该项 就是其他页面从本地读取出来的数据展示
            */
        }

    },
    methods: {
        getList: function (keywords) {
            console.log("ok2")
            let options = {
                url: this.$data.baseUrl + keywords,
                method: "get"
            }
            axios(options).then((resp) => {
                console.log(resp.data)
                this.$data.list = resp.data.slice(this.$data.start, this.$data.end)
            }).catch((err) => {
                /*
                讲错误对象交给 ERROR_CENTER 统一处理 以弹框方式显示
                */
            })
        },
        readList: function (keywords) {

        },
        goMvPlayPage: function (song) {
            if (song.hasmv) {
                //页面跳转
                player.historyStore("video",song,new Date())
                let path = "/videoplay/" + song.rid
                this.$router.push({
                    path: path,
                    query: {
                        song: song
                    }
                })
            } else {
                alert("仅限vip播放")
            }
        }
    }
}
</script>

<style>
.video-list-style {
    width: 15%;
    float: left;
    margin-right: 5%;
    margin-bottom: 30px;
}

.video-list-style:nth-child(5n) {
    margin-left: 0px;
}

.video-list-style>div:nth-child(1) {
    width: 100%;
    padding-top: 100%;
    height: 0px;
    position: relative;
}

.video-list-style>div:nth-child(1)>div {
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
}

.video-list-style img {
    width: 100%;
    height: 100%;
    border-radius: 20px;
}

.video-list-play-logo {
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.video-list-tag {
    margin-top: 20px;
}
</style>
