<template>
<div class="local-outest-frame">
    <div style="margin:15px 0px">本地<span class="el-icon-delete" style="margin-left:30px;" @click="deletePrepare" id="deleteFlag"></span></div>
    <el-tabs type="border-card" @tab-click="change" id="el-tabs-container">

        <el-tab-pane label="音频">
            <ul @mouseover.capture="show1" @mouseout.capture="noShow1">
                <li v-for="(audio,index) in audioList" :key="index" class="download-audio-list">
                    <i class="download-list-input el-icon-close" @click="deleteItem(index,'audio')"></i>
                    <span style="margin-right:10px">{{index+1}}</span>
                    <span class="fa fa-music" style="color:green"></span>
                    <span>{{audio.name}}</span>
                    <span>{{audio.artist}}</span>
                    <span class="fa fa-play" style="display:inline;margin-right:30px" @click="play('audio',audio)" title="播放" :id="'audio'+audio.rid"></span>
                    <span>{{audio.songTimeMinutes}}</span>
                </li>
            </ul>
        </el-tab-pane>

        <el-tab-pane label="视频">
            <ul @mouseover.capture="show1" @mouseout.capture="noShow1">
                <li v-for="(video,index) in videoList" :key="index" class="download-video-list">
                    <i class="download-list-input1 el-icon-close" @click="deleteItem(index,'video')"></i>
                    <span style="margin-right:10px">{{index+1}}</span>
                    <span class="fa fa-youtube-play " style="color:green"></span>
                    <span>{{video.name}}</span>
                    <span>{{video.artist}}</span>
                    <span class="fa fa-play" style="display:inline;margin-right:30px" @click="play('video',video)" title="播放"></span>
                    <span>{{video.songTimeMinutes}}</span>
                </li>
            </ul>
        </el-tab-pane>
    </el-tabs>
</div>
</template>

<script>
import player from "../player.js"
export default {
    data: function () {
        return {
            audioList: [],
            videoList: [],
            deleteState: "noselected",
            name: "audio",
            path1: [],
            path2: []
        }
    },
    beforeMount() {
        this.audioList = player.getDownloadFile("song")
        this.videoList = player.getDownloadFile("video")

    },
    methods: {
        show1: function (e) {

        },
        noShow1: function (e) {

        },
        play: function (type, source) {
            if (type === "audio") {
                //跳转音频界面播放 ？ 播放音乐 
                let name = `${type}${source.rid}`
                let node = document.getElementById(name)
                player.controlPlay(source, node, this)

            } else if (type === "video") {
                //跳转视频界面播放
                if (source.hasmv) {
                    //页面跳转
                    let path = "/videoplay/" + source.rid
                    this.$router.push({
                        path: path,
                        query: {
                            song: source
                        }
                    })
                } else {
                    alert("仅限vip播放")
                }
            }
        },
        change: function (select) {
            console.log('select is: ', select)
            let node = document.getElementById("deleteFlag")
            node.innerText = ""
            node.classList.add("el-icon-delete")
            this.name = select.label === '音频' ? 'audio' : 'video'

        },
        deletePrepare: function () {
            //分组设置
            let className = this.name === "audio" ? "download-list-input" : "download-list-input1"
            let list = document.getElementsByClassName(className)
            let node = document.getElementById("deleteFlag")

            if (node.innerText == "完成") {
                //展开选择删除状态
                //此时要做的是隐藏删除按钮
                Array.prototype.forEach.call(list, item => {
                    item.style.display = "none"
                })
                node.innerText = ""
                node.classList.add("el-icon-delete")
            } else {
                //此时要做的是将删除按钮显示出来
                Array.prototype.forEach.call(list, item => {
                    item.style.display = "block"
                })
                node.innerText = "完成"
                node.classList.remove("el-icon-delete")
            }

        },
        deleteItem: function (index, type) {
            let list = type === "audio" ? this.audioList : this.videoList
            type === "audio" ? this.path1.push(this.audioList[index].storeLocation) : this.path2.push(this.videoList[index].storeLocation)
            list.splice(index, 1)
        }
    },
    beforeDestroy() {
        //保存数据操作
        // console.log(this.path1,this.path2)
        player.downloadFileReset("audio", this.audioList, this.path1)
        player.downloadFileReset("video", this.videoList, this.path2)

    },
}
</script>

<style>
.local-outest-frame i {
    color: blue
}

.local-outest-frame i {
    display: none;
    margin: 7.5px 0px;
    height: 20px;
    width: 20px;
    margin-right: 10px
}

.download-audio-list,
.download-video-list {
    margin: 20px 0px;
    height: 35px;
    display: flex;
}

.download-audio-list>*,
.download-video-list>* {
    height: inherit;
    line-height: 35px;

}

.download-video-list>span:nth-child(4),
.download-video-list>span:nth-child(5),
.download-audio-list>span:nth-child(4),
.download-audio-list>span:nth-child(5) {
    width: 0px;
    flex-grow: 1;
    overflow: hidden;
    margin: 0 50px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.download-video-list>span:last-child .download-audio-list>span:last-child {
    justify-self: flex-end;
    margin-left: 30px;
}

#el-tabs-container {

    background-color: transparent;
    border-width: 0px;
}
</style>
