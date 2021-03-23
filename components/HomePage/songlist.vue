<template>
<div>
    <div id="nav-tags" v-if="isShow">
        <span>歌曲</span>
        <span>歌手</span>
        <span>专辑</span>
        <span>时长</span>
    </div>
    <ul style="margin:0px">
        <li v-for="(song,index) in list" :key="index" class="song-list" @mouseover.capture="displayButton(index)" @mouseout.capture="noDisplayButton(index)">
            <div>
                <div>
                    <span>{{index+1}}</span>
                    <span style="margin-left:10px">{{song.name}}</span>
                </div>
                <div class="four-function">
                    <i class="fa fa-play" title="播放" @click="controlSong($event,song)"></i>
                    <i class="fa fa-arrow-down" title="下载" @click="downloadAudio(song)"></i>
                    <i class="fa fa-plus-square" title="加入播放列表"></i>
                    <i class="fa fa-more"></i>
                </div>
            </div>
            <div>
                <span>{{song.artist}}</span>
            </div>
            <div>
                <span>{{song.album ? song.album : "未知专辑"}}</span>
            </div>
            <div>
                <span>{{song.songTimeMinutes}}</span>
            </div>
        </li>
    </ul>
</div>
</template>

<script>
const axios = require("axios")
const player = require("../player.js")
export default {
    name: "songlist",
    data: function () {
        return {
            list: [],
            start: 0,
            end: 30,
            baseUrl: "http://127.0.0.1:3000/api/queryByKeyword/",
            isShow:true
        };
    },

    props: ["mode","datax"],

    beforeMount() {

        if (this.mode === "input") {
            //打补丁的方式 选择数据注入处理 而不是在组件进行数据请求
            this.isShow = false
        } else {
            if (this.$route.meta == "query-music-list") {
                console.log("ok1")
                this.getList(this.$route.params.keywords)
            }
        }

    },
    watch:{
        datax:function(newV,oldV) {
            this.list = newV
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
        displayButton: function (index) {
            document.getElementsByClassName("four-function")[index].style.display =
                "block";
        },
        noDisplayButton: function (index) {
            document.getElementsByClassName("four-function")[index].style.display =
                "none";
        },
        controlSong: function (event, song) {
            let node = event.target
            player.default.controlPlay(song, node, this)
            player.default.getReadyPlaySongList(this, this.$data.list) //获取搜索结果的所有歌曲
        },
        downloadAudio: function (song) {
            player.default.download(song, "audio")
        }
    }
};
</script>

<style>
.song-list {
    display: flex;
    font-size: 17px;
    height: 30px;
    line-height: 30px;
    padding: 10px 0px;
}

.song-list:hover {
    background-color: rgb(109, 109, 204);
}

.song-list * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.song-list>div:nth-child(1) {
    width: 0;
    flex-grow: 4;
    display: flex;
    justify-content: space-between;
}

.song-list>div:nth-child(2) {
    padding-left: 40px;
    width: 0;
    flex-grow: 2;
}

.song-list>div:nth-child(3) {
    padding-left: 40px;
    width: 0;
    flex-grow: 4;
}

.song-list>div:nth-child(4) {
    width: 80px;
}

.four-function {
    height: 30px;
    line-height: 30px;
    display: none;
}

.four-function>i {
    margin: 0 5px;
}

#nav-tags {
    font-size: 17px;
    display: flex;
    font-weight: bold;
}

#nav-tags>span:nth-child(1) {
    width: 0px;
    flex-grow: 4;
}

#nav-tags>span:nth-child(2) {
    padding-left: 40px;
    width: 0px;
    flex-grow: 2;
}

#nav-tags>span:nth-child(3) {
    padding-left: 40px;
    width: 0px;
    flex-grow: 4;
}

#nav-tags>span:nth-child(4) {
    width: 80px;

}
</style>
