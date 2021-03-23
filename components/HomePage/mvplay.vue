<template>
<div>

    <div id="mv-play-frame">
        <video :src="src" controls controlsList="nodownload" id="video_" style="width:100%;height:auto"></video>
    </div>
    <div id="video-about">
        <span>{{video.name}}</span>
        <span>{{video.releaseDate}}</span>
    </div>
    <el-row style="color:black">
        <el-button type="primary" icon="el-icon-back" @click="back"></el-button>
        <el-button type="primary" icon="el-icon-download" @click="download"></el-button>
        <el-button type="primary" class="fa fa-heart" @click="selectIsLove" :style="style"></el-button>
        <el-button type="primary" icon="el-icon-chat-dot-square"></el-button>
    </el-row>
    <!--评论区-->
    <comment :comments="videoComment"></comment>
</div>
</template>

<script>
const axios = require("axios")
import comment from "../HomePage/comment"

import player from "../player.js"

export default {
    data: function () {
        return {
            src: null,
            videoComment: [],
            baseURL: "http://127.0.0.1:3000/api/comment/video/",
            video: {},
            mode:null,//用来区分组件复用的关键词
            style:""
        }
    },
    beforeMount() {
        let rid = this.$route.params.keywords
        this.$data.src = "http://127.0.0.1:3000/api/video/" + rid + ".mp4"
        this.$data.video = this.$route.query.song
        this.getComment(rid)

      
        //检测即将播放的视频是否是喜爱的视频
       if(player.checkIsExist("mvcollect",this.$route.query.song)) {
           this.style = "color:red"
       }
    },
    mounted:function() {
          document.getElementsByTagName("video")[0].addEventListener("play",e => {
            //视频播放时 应该暂停歌曲的播放
            this.$store.commit("pauseAudio")
        })

    },
    methods: {
        selectIsLove:function(e) {
            console.log(this)
          
            if(this.style === "color:red") {
                //取消收藏
                player.updateCollect("remove","mv",this.video,this)
                this.style = ""
            }else {
                //添加收藏
                player.updateCollect("add","mv",this.video,this)
                this.style = "color:red"
            }
        },
        getComment: function (rid) {
            let url = this.baseURL + rid
            axios.get(url).then((resp) => {
                this.videoComment = resp.data
            })
        },
        back: function () {
            window.select1 = "videolist"
            this.$router.go(-1)
        },
        download:function() {
            player.download(this.video,"video")
        }
    },
    components: {
        comment
    }

}
</script>

<style>
#mv-play-frame {
    width: 100%;
}

#video-about {
   display: flex;
   justify-content: space-between;
   margin-bottom: 30px;
}
</style>
