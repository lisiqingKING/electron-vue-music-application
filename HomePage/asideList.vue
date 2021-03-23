<template>
<div id="aside-list">
    <div id="aside-list-part-one">
        <div>
            播放队列
        </div>
        <div>
            {{songList.length}}首歌
        </div>
    </div>
    <div id="aside-list-part-two">
        <div>
            <ul>
                <li v-for="(song,index) in songList" :key="index" class="simple-song-list" :rid="song.rid" @mouseout="cancelPlayButton(index)" @mouseover="displayPlayButton(index)">
                    <div>
                        <div>{{song.name}}</div>
                        <div>{{song.artist}}</div>
                    </div>
                    <div>
                        <div style="text-align:right">
                            <span class="simple-time">{{song.songTimeMinutes}}</span><i :id="'aside-play'+index" class="fa fa-play" style="display:none;font-size:13px" title="播放音乐" @click.self="playMusic(song,index)"></i>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
    <div id="aside-list-part-three">
        <span @click="unholdThisPage">收起</span>
    </div>
</div>
</template>

<script>
import player from "../player.js"
export default {
    data: function () {
        return {

        }
    },
    mounted() {

    },
    computed: {
        songList() {
            return this.$store.getters.getReadyPlaySongList
        },
        currentSong() {
            return this.$store.getters.getCurrentSong
        }
    },
    watch: {
        "$store.getters.getCurrentSong": function () {
            //检测当前播放歌曲 然后高亮显示播放列表
            let song = this.$store.getters.getCurrentSong
            let list = document.getElementsByClassName("simple-song-list")

            function clear() {
                for (let i = 0; i < list.length; i++) {
                    list[i].style.backgroundColor = ""
                }
            }

            clear()
            for (let e = 0; e < list.length; e++) {
                if (song.rid == list[e].getAttribute("rid")) {
                    list[e].style.backgroundColor = "#9898f3"
                    break;
                }
            }
        }
    },
    methods: {
        unholdThisPage: function () {
            document.getElementById("aside-list").style.display = "none"
        },
        displayPlayButton: function (index) {
            //simple-time
            let id = 'aside-play' + index
            document.getElementsByClassName("simple-time")[index].style.display = "none"
            document.getElementById(id).style.display = "inline"
        },
        cancelPlayButton: function (index) {
            let id = 'aside-play' + index
            document.getElementsByClassName("simple-time")[index].style.display = "inline"
            document.getElementById(id).style.display = "none"
        },
        playMusic: function (song, index) {
            let id = 'aside-play' + index
            let node = document.getElementById(id)
            player.controlPlay(song, node, this)
        }
    },
}
</script>

<style>
#aside-list {
    position: fixed;
    width: 300px;
    height: 100%;
    top: 0px;
    bottom: 0px;
    right: 0px;
    z-index: 999;
    background-color: white;
    padding-top: 50px;
    display: none;
    flex-direction: column;
    border-left-style: solid;
    border-left-width: 1px;
    border-left-color: grey;
}

#aside-list * {
    color: black;
}

#aside-list>div:nth-child(1) {
    height: 50px;
    flex-grow: 0;
    margin-bottom: 30px;
    padding: 0 20px;
}

#aside-list>div:nth-child(2) {
    height: 0px;
    flex-grow: 1;
    overflow: scroll;
}

#aside-list>div:nth-child(3) {
    height: 100px;
    text-align: right;
    padding: 0 20px;
}

#aside-list-part-one>div:nth-child(1) {
    font-size: 18px;
    height: 30px;
    line-height: 30px;
}

#aside-list-part-one>div:nth-child(2) {
    font-size: 15px;
    height: 20px;
    line-height: 20px;
}

.simple-song-list {
    margin: 20px 5px;
    padding: 5px 10px;
    display: flex;
    align-items: center;
    background-color: #dadcea;
    border-radius: 10px;
}

.simple-song-list:hover {
    background-color: gray;
}

.simple-song-list div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.simple-song-list>div:nth-child(1) {
    width: 130px;
    height: 40px;
}

.simple-song-list>div:nth-child(1)>div:nth-child(1) {
    height: 20px;
    line-height: 20px;
    font-size: 17px;
}

.simple-song-list>div:nth-child(1)>div:nth-child(2) {
    height: 20px;
    line-height: 20px;
    font-size: 15px;
}

.simple-song-list>div:nth-child(2) {
    width: 130px;
    height: 13px;
    line-height: 13px;
    font-size: 13px;
}
</style>
