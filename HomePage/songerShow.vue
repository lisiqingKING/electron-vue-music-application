<template>
<div>
     <el-button type="primary" icon="el-icon-back" @click="back" style="margin-bottom:20px"></el-button>
    <div id="songer-show-frame">
        <div>
            <img :src="this.$route.query.song.pic|filter1">
        </div>
        <div>
           <h1>{{this.$route.query.song.artist}}</h1>
           <h2>代表作:{{this.$route.query.song.album ? this.$route.query.song.album :"lclassic"}}</h2>
           <h3>发行日期:{{this.$route.query.song.releaseDate}}</h3>
        </div>
    </div>

    <songlist mode="input" :datax="list"></songlist>
</div>
</template>

<script>
import songlist from "../HomePage/songlist"
const axios = require("axios")
export default {
    data: function () {
        return {
            list: []
        }
    },
    components: {
        songlist
    },
    beforeMount: function () {
        this.getList(this.$route.params.name)
    },
    methods: {
        getList: function (name) {
            let url = `http://127.0.0.1:3000/api/querySonger/${name}`
            axios.get(url).then((resp) => {
                console.log(resp.data)
                this.list = resp.data
                console.log("this.list: ", this.list)
            })
        },
        back:function() {
             window.select1 = "videolist"
            this.$router.go(-1)
        }
    },
    filters: {
        filter1: function (url) {
            var picUrl = "http://127.0.0.1:3000/api/picture"
            return url ? picUrl + "/" + url.replace(new RegExp("\//|\/|:", "g"), "") : null
        }
    },
   
}
</script>

<style>
#songer-show-frame {
    display: flex;
    margin-bottom: 40px;
}

#songer-show-frame>div {
    height: 300px;

}

#songer-show-frame>div:nth-child(1) {
    width: 20%;
    padding-top: 20%;
    height: 0px;
    position: relative;
}

#songer-show-frame>div:nth-child(1)>img {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    top: 0px;
    width: 100%
}

#songer-show-frame>div:nth-child(2) {
    width: 70%;
    padding-left: 100px;
    text-overflow: ellipsis;
}
</style>
