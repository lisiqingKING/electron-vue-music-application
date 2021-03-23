<template>
<div id="play-control-area">
    <div>
        <img @click="showMusicAudioPlay" :src="song.pic|imgUrlFilter">
        <div>
            <div id="name-artist" style="display:flex">
                <span>{{song.name}}</span>
                <span style="margin-left:20px">{{song.artist}}</span>
            </div>
            <div id="progress-frame" @click="adjustProgress($event)">
                <div id="progress-bar" :style="progressstyle"></div>
            </div>
        </div>
        <!--<transition name="audio-play">

        </transition>-->
    </div>
    <div id="three-play-button">
        <i class="fa fa-step-backward" title="播放上一首" @click="playLast"></i>
        <i :class="playicon" :title="playstate" @click="controlPlay(playicon,$event)"></i>
        <i class="fa fa-step-forward" title="播放下一首" @click="playNext"></i>
    </div>
    <div>
        <i style="font-size:15px">{{currentTime|timeFormat}}/{{song.songTimeMinutes ? song.songTimeMinutes : "00:00"}}</i>
        <i class="fa fa-heart" 
           :style="style"
        id="loveIcon" @click.self="loveSlect($event,song)"></i>
        <i class="fa fa-volume-up" :title="'音量:'+ volume*100 + '%'" @click.self="adjustVolume" style="position:relative">
            <div id="volumeStyle">
                <div @click="adjust($event)" id="x0">
                    <div id="x1"></div>
                    <div id="x2"></div>
                </div>
            </div>
        </i>
        <i class="fa fa-shower" title="播放模式" @click.self="changeAudioPlayMode()"></i>
        <i class="fa fa-list-ul" title="选择播放" @click.self="foldSimplePlayList">
            <aside-list></aside-list>
        </i>
    </div>
</div>
</template>

<script>
import player from "../player.js";
import asideList from "../HomePage/asideList";
import {
    mapGetters
} from "vuex";
import {
    constants
} from "http2";
export default {
    data: function () {
        return {
            picUrl: "http://127.0.0.1:3000/api/picture",
        };
    },
    computed: {
        progressstyle: function () {
            let time = this.$store.getters.getCurrentTime;
            let duration = this.$store.getters.getCurrentSong.duration;
            return "width:" + time / duration * 100 + "%";
        },
        playicon: function () {
            return this.$store.getters.getCurrentPlayState == "play" ?
                "fa fa-pause" :
                "fa fa-play";
        },
        playstate: function () {
            return this.$store.getters.getCurrentPlayState == "play" ?
                "暂停" :
                "播放";
        },
        volume: function () {
            return this.$store.getters.getCurrentVolume;
        },
        audioPlayMode: function () {
            var mode = this.$store.getters.getCurrentAudioPlayMode;
            console.log("mode ", mode);
            if (mode == "once") {
                return "fa fa-shower"; //暂无合适的class
            } else if (mode == "loop") {
                return "fa fa-refresh";
            } else if (mode == "list") {
                return "fa fa-exchange";
            } else if (mode == "random") {
                return "fa fa-random";
            }
        },
        song: function () {
            return this.$store.getters.getCurrentSong;
        },
        currentTime: function () {
            return this.$store.getters.getCurrentTime;
        },
        style:function() {
            if(this.$store.getters.getCurrentIsLove.song){
                return "color:red"
            }else {
                return "color:white"
            }
        }
    },
    watch: {
        // "$store.getters.getCurrentIsLove.song": function () {
        //     //心的变化
        //     alert("love? change")
        //     let node = document.getElementById("loveIcon");
        //     if (this.$store.getters.getCurrentIsLove.song) {
        //         node.style.color = "red";
        //         node.className = "fa fa-heart"
        //     } else {
        //         node.style.color = "white";
        //         node.className = "fa fa-heart-o"
        //     }
        // },
    },
    beforeMount() {
        
    },
    methods: {
        loveSlect: function (e, song) {
            let node = document.getElementById("loveIcon");
            if (this.$store.getters.getCurrentSong.rid && node.style.color === "red") {
                //取消收藏
                alert("取消收藏")
                player.updateCollect("remove", "song", song, this);
                node.style.color = "white";
                node.className = "fa fa-heart"
            } else if(this.$store.getters.getCurrentSong.rid) {
                //添加收藏
                if (!this.$store.getters.getCurrentIsLove.song) {
                    alert("添加进收藏")
                    player.updateCollect("add", "song", song, this);
                    node.style.color = "red";
                    node.className = "fa fa-heart"
                }

            }else {
                alert("暂无歌曲")
            }
        },
        foldSimplePlayList: function () {
            document.getElementById("aside-list").style.display = "flex";
        },
        showMusicAudioPlay: function () {
            this.$router.push({
                path: "/songplay",
            });
        },
        playLast: function () {
            /**
             * 无论是对于在线播放歌曲
             * 还是本地歌曲播放
             * 当选中第一首歌时 要将其实在环境中的列表拉入 预备播放列表中
             */
            this.$store.commit("playLastAudio");
        },
        playNext: function () {
            this.$store.commit("playNextAudio");
        },
        adjust: function (e) {
            let node = document.getElementById("x1");
            let nodex = document.getElementById("x2");
            let p = document.getElementById("x0");
            node.style.top = e.offsetY + "px"; // button
            nodex.style.height = e.offsetY + "px"; //空白滑条宽度
            let v = (p.offsetHeight - e.offsetY) / p.offsetHeight;
            v = Number(new String(v).slice(0, 4));
            this.$store.commit("updateCurrentVolume", v);
        },

        controlPlay: function (className, event) {
            if (className == "fa fa-play") {
                //此时音乐暂停或者无音乐播放
                if (this.$store.getters.getCurrentAudio.src) {
                    this.$store.commit("playAudio");
                } else {
                    alert("请选择歌曲播放");
                }
            } else {
                //此时音乐播放中
                this.$store.commit("pauseAudio");
            }
        },
        adjustVolume: function () {
            let node = document.getElementById("volumeStyle");
            if (node.style.display != "flex") {
                node.style.display = "flex";
            } else {
                node.style.display = "none";
            }
        },

        adjustProgress: function (e) {
            let node = e.target;
            let progress = e.offsetX / node.offsetWidth;
            console.log("progress: ", progress);
            this.$store.commit("updateAudioTime", progress);
        },
        changeAudioPlayMode: function () {
            const MODES = ["once", "loop", "list", "random"];
            var index = 0;
            for (let i = 0; i < MODES.length; i++) {
                if (MODES[i] == this.$store.getters.getCurrentAudioPlayMode) {
                    index = i + 1 > 3 ? 0 : i + 1;
                    break;
                }
            }
            console.log("index: ", index);
            console.log("mode-selected ", MODES[index]);
            this.$store.commit("updateAudioPlayMode", MODES[index]);
        },
    },
    filters: {
        imgUrlFilter: url => {
            var picUrl = "http://127.0.0.1:3000/api/picture";
            return url ?
                picUrl + "/" + url.replace(new RegExp("//|/|:", "g"), "") :
                null;
        },
        timeFormat: function (time) {
            if (time >= 60) {
                var min = parseInt(time / 60);
                var sec = time % 60;
                if (10 > sec) {
                    return `0${min}:0${sec}`.slice(0, 5);
                } else {
                    return `0${min}:${sec}`.slice(0, 5);
                }
            } else if (time >= 10 && 60 > time) {
                time = "00:" + time;
                return time.slice(0, 5);
            } else {
                time = "00:0" + time;
                return time.slice(0, 5);
            }
        },
    },
    components: {
        asideList,
    },
};
</script>

<style>
#three-play-button i:hover {
    color: blue;
}

#play-control-area {
    height: 50px;
    padding: 5px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    border-top: solid 1px rgba(38, 38, 199, 0.337);
}

#play-control-area>div {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

#play-control-area>div:nth-child(2) i {
    margin: 0 20px 0 20px;
    font-size: 30px;
}

#play-control-area>div:nth-child(3) i {
    margin: 0 15px 0 15px;
    font-size: 20px;
}

#play-control-area>div:nth-child(1) {
    display: flex;
    width: 30%;
    height: 45px;
}

#play-control-area>div:nth-child(2) {
    width: 30%;
}

#play-control-area>div:nth-child(3) {
    width: 30%;
    justify-content: flex-end;
}

#play-control-area>div:nth-child(1) img {
    width: 45px;
    flex-grow: 0;
    height: inherit;
    background-color: grey;
}

#play-control-area>div:nth-child(1) img+div {
    width: 0px;
    flex-grow: 1;
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

#progress-bar {
    width: 0px;
    height: 8px;
    background-color: blue;
}

#volumeStyle {
    position: absolute;
    width: 60px;
    height: 250px;
    top: -260px;
    left: -20px;
    border-radius: 10px;
    background-color: white;
    border-style: solid;
    border-width: 1px;
    border-color: black;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;
    display: none;
}

#volumeStyle>div:nth-child(1) {
    width: 5px;
    height: 230px;
    position: relative;
    background-color: blue;
}

#volumeStyle>div:nth-child(1)>div:nth-child(1) {
    position: absolute;
    top: 50%;
    left: -5px;
    width: 15px;
    height: 5px;
    background-color: brown;
    border-radius: 1px;
}

#volumeStyle>div:nth-child(1)>div:nth-child(2) {
    height: 50%;
    width: 100%;
    background-color: wheat;
}

#name-artist {
    height: 20px;
    line-height: 20px;
}

#progress-frame {
    background-color: gray;
}

#name-artist>span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
