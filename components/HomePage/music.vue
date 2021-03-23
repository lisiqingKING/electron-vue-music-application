<template>
<div id="main-home-show">
    <div id="banner-frame">
        <div id="banner-container">
            <img :src="url" v-for="url in bannerList" :key="url">
        </div>
    </div>
    <div style="margin-bottom:20px"><span>推荐歌曲</span></div>
    <div class="rec-frame">
        <div v-for="(song,index) in rsongs" :key="song.pick">
            <div @click="playMusic(song,index)">
                <img :src="song.pick">
                <div><i class="fa fa-play" :id="'recm-song'+index"></i></div>
            </div>
            <div style="margin-top:20px" class="command-set1">{{song.name}}</div>
        </div>
    </div>

    <div style="margin:40px 0px" id="rec-songers-tag" @click.capture="changeRecommandSonger">
        <span id="china" style="color:blue">国语</span>
        <span id="japan&korea">日韩</span>
        <span id="europe&Usa">欧美</span>
    </div>

    <div class="rec-frame-songers">
        <div v-for="(songer) in rsongers.slice(start,end)" :key="songer.name">
            <div>
                <img :src="songer.pick" style="border-radius:50%">
            </div>
            <div class="songer-name" @click="goArtistPage(songer)"><span>{{songer.artist}}</span></div>
        </div>
    </div>

    <div id="selective-activity">
        <div id="selective-activity-1">
            <span>精选活动</span>
        </div>
        <div id="selective-activity-2">
            <div id="selective-activity-3">
                <div>
                    <img src="E:\前端路线学习资料\pictures\jx_1.jpg">
                    <div><i class="fa fa-arrow-circle-right" style="font-size:20px"></i></div>
                </div>
                <div>
                    <img src="E:\前端路线学习资料\pictures\jx_2.jpg">
                    <div><i class="fa fa-arrow-circle-right" style="font-size:20px"></i></div>
                </div>
            </div>
        </div>
    </div>

</div>
</template>

<script>
import player from "../player.js"
const axios = require("axios")
export default {
    data: function () {
        return {
            start: 0,
            end: 5,
            bannerList: [
                'http://127.0.0.1:3000/api/img/banner1.png',
                'http://127.0.0.1:3000/api/img/banner2.jpg',
                'http://127.0.0.1:3000/api/img/banner3.jpg',
                'http://127.0.0.1:3000/api/img/banner4.jpg',
                'http://127.0.0.1:3000/api/img/banner5.jpg'
            ],
            baseURL: "http://127.0.0.1:3000/api/getbanners",
            rsongUrl: "http://127.0.0.1:3000/api/rec/songs",
            rmvUrl: "http://127.0.0.1:3000/api/rec/mvs",
            rsongerUrl: "http://127.0.0.1:3000/api/rec/songers",
            picUrl: "http://127.0.0.1:3000/api/picture",
            rsongs: [],
            rsongers: [],
            rmv: [],
            currentTag1: "china"
        }
    },
    beforeMount() {
        this.getRecommandSong()
        this.getRecommandSonger()
    },
    mounted() {
        // console.log('this.$store:', this.$store)
        // console.log("this.$store.state.play.user:", this.$store.state.play.user) //获取store:play user
        // console.log("this.$store.getters.getUser:", this.$store.getters.getUser) //通过getters获取
        window.timeTask = true
        window.t_index = 0
        window.t_time = 5000

        //图片轮询播放
        function x() {
            task = null //清理上一个定时器 避免内存泄漏
            function callback() {
                window.t_index ? window.t_index : 0

                if (window.t_index > 4) {
                    window.t_index = 0;
                }
                if (window.timeTask) {
                    console.log("time-index: ", window.t_index)

                    document.getElementById("banner-container").style.left = '-' + window.t_index * 100 + "%"

                    window.t_index += 1;
                    x()
                }
            }
            let task = setTimeout(callback, window.t_time)
        }
        x()
    },
    beforeUpdate() {},
    beforeDestroy: function () {
        window.timeTask = false
    },
    methods: {
        goArtistPage: function (songer) {
            let songer_ = songer.artist.slice(0, songer.artist.indexOf("&") === -1 ? songer.artist.length : songer.artist.indexOf("&"))
            let path = `/songer/${songer_}`
            console.log('path: ', path)
            this.$router.push({
                path: path,
                query: {
                    song: songer
                }

            })
        },
        playMusic: function (song, index) {
            const id = 'recm-song' + index
            let node = document.getElementById(id)
            player.controlPlay(song, node, this)
        },
        getRecommandSong: function () {
            axios.get(this.$data.rsongUrl).then((resp) => {
                console.log(resp.data)
                var this_ = this
                resp.data.forEach((song, index) => {
                    var pick = song.pic.replace(new RegExp("\//|\/|:", "g"), "")
                    var pick = this_.picUrl + "/" + pick
                    console.log("pick", pick)
                    resp.data[index].pick = pick
                });
                this.$data.rsongs = resp.data
            })
        },
        getRecommandMv: function () {

        },
        getRecommandSonger: function () {
            axios.get(this.$data.rsongerUrl).then((resp) => {
                console.log(resp.data)
                var this_ = this
                resp.data.forEach((songer, index) => {
                    var pick = songer.pic.replace(new RegExp("\//|\/|:", "g"), "")
                    var pick = this_.picUrl + "/" + pick
                    console.log("pick", pick)
                    resp.data[index].pick = pick
                });
                this.$data.rsongers = resp.data
            })
        },
        changeRecommandSonger: function (event) {

            if (event.target.tagName === "SPAN" && event.target.id != this.$data.currentTag1) {
                let type = event.target.innerText
                let start, end
                if (type == "国语") {
                    start = 0
                    end = 5
                } else if (type == "欧美") {
                    start = 5
                    end = 10

                } else if (type == "日韩") {
                    start = 10
                    end = 15
                }
                this.$data.start = start
                this.$data.end = end
                document.getElementById(this.currentTag1).style.color = "white"
                document.getElementById(event.target.id).style.color = "blue"
                this.$data.currentTag1 = event.target.id
            }

        }
    },
}
</script>

<style>
#main-home-show img,
span {
    cursor: pointer;
}

#banner-frame {
    position: relative;
    width: 100%;
    padding-top: 22%;
    margin: 20px 0px;
}

#banner-container {
    position: absolute;
    width: 500%;
    top: 0px;
    right: 0px;
    left: 0px;
    bottom: 0px;

}

#banner-container img {
    width: 20%;
    height: 100%;
}

.rec-frame,
.rec-frame-songers {
    display: flex;
    justify-content: space-between;
}

.rec-frame>div,
.rec-frame-songers>div {
    width: 16%;
}

.rec-frame>div>div:nth-child(1) {
    width: 100%;
    padding-top: 100%;
    position: relative;
}

.rec-frame>div>div>img {
    position: absolute;
    left: 0px;
    bottom: 0px;
    right: 0px;
    bottom: 0px;
    width: 100%;
    z-index: 11;
}

.rec-frame>div>div>img:hover {
    box-shadow: 10px 10px 5px rgb(16, 4, 4);
    opacity: 0.3;
}

.rec-frame>div>div>div {
    position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    width: 100%;
    font-size: 50px;
    color: blue;
    background-color: #888888;
    display: flex;
    align-items: center;
    justify-content: center;
}

/**------- */
.rec-frame-songers>div>div>img:hover {
    bottom: 10px;
}

.rec-frame-songers>div>div:nth-child(1) {
    width: 100%;
    padding-top: 100%;
    position: relative;
}

.rec-frame-songers>div>div>img {
    position: absolute;
    left: 0px;
    bottom: 0px;
    right: 0px;
    bottom: 0px;
    width: 100%;
    z-index: 11;
}

#rec-songers-tag span {
    margin-right: 30px;
    cursor: pointer;
}

#selective-activity-1 {
    margin-top: 30px;
    margin-bottom: 10px;
    line-height: 34px;
    height: 34px;
}

#selective-activity-2 {
    position: relative;
    padding-top: 16.37%;
    height: 0px;
    width: 100%;
}

#selective-activity-3 {
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    display: flex;
}

#selective-activity-3>div:nth-child(1) {
    flex: 1;
    /* flex:1 每个宽度1 :1 此时的宽度包含width+padding-left+padding-right*/
    height: 100%;
    margin-right: 25px;
    position: relative;
}

#selective-activity-3>div:nth-child(2) {
    flex: 1;
    height: 100%;
    margin-left: 25px;
    position: relative;
}

#selective-activity-3>div>img {
    width: 100%;
    height: 100%;
}

#selective-activity-3>div>img+div:hover {
    animation: animation1 0.2s linear;
    opacity: 1;
}

@keyframes animation1 {
    from {
        height: 0px;
    }

    to {
        height: 100%;
    }
}

#selective-activity-3>div>img+div {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    top: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.64);
    opacity: 0;
}

.songer-name {
    margin: 10px 0px;
    display: flex;
    justify-content: center;
}

.songer-name:hover {
    color: blue;
}

.command-set1 {
    cursor: pointer;
}
</style>
