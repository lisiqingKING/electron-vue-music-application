<template>
<div id="musiclist-frame">
    <div>
        <span @click="chageComponents('songlist')" ref='songlist'>歌曲</span>
        <span @click="chageComponents('videolist')" ref="videolist">视频</span>
        <span @click="chageComponents('songerlist')" ref="songerlist">歌手</span>
    </div>
    <component :is="name" id="three-component-show"></component>
</div>
</template>

<script>
import songlist from "../HomePage/songlist"
import videolist from "../HomePage/videolist"
import songerlist from "../HomePage/songerlist"
export default {
    data: function () {
        return {
            name: "songlist",
            last: "songlist"
        }
    },
    components: {
        songlist,
        videolist,
        songerlist
    },
    methods: {
        chageComponents: function (name) {
            if (this.name != name) {
                this.name = name
                this.$refs[this.last].style.color = "white"
                this.$refs[name].style.color = "blue"
                this.last = name
            }
        }
    },
    mounted() {
        this.$refs[this.last].style.color = "blue"
    },
    beforeMount() {
        if(window.select1 == "videolist") {
            this.last = "videolist"
            this.name = videolist
        }
    },
    updated() {
        window.select1 = null
    },

}
</script>

<style>
#musiclist-frame {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
}

#musiclist-frame>div>span {
    margin-right: 30px;
}

#musiclist-frame>div>span:hover {
    color: blue;
}

#musiclist-frame>div:nth-child(1) {
    height: 35px;
    line-height: 35px;
}

#musiclist-frame>div:nth-child(2) {
    flex-grow: 1;
    overflow: scroll;
}
</style>
