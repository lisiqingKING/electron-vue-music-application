<template>
<div id="display-one" class="audio-play" :style="'background-image:'+song_img">
    <div id="page-other-function">
        <div><i class="fa fa-arrow-left" @click="back"></i></div>
        <div>
            <i class="el-icon-minus" title="最小化" @click="minScreen"></i>
            <i class="el-icon-full-screen" title="全屏" @click="maxScreen"></i>
            <i class="el-icon-close" title="退出应用" @click="exitApplication"></i>
        </div>
    </div>
    <div id="outest-music-play-page-frame">
        <div>
            <div>
                <img :src="song_img">
            </div>
            <!--歌曲封面图片-->
            <div>
                <div>
                    <h1>{{song.name ? song.name : "未知歌曲"}}</h1>
                    <h2>{{song.artist ? song.artist : "未知歌手"}}</h2>
                </div>
                <ul v-if="songAbout.lrclist ? true : false">
                    <li v-for="(songword,index) in songAbout.lrclist.slice(start,end)" :key="index" class="songword-class">
                        {{songword.lineLyric}}
                    </li>
                </ul>
                <div v-if="songAbout.lrclist.length >10 ? true : false" @click="unfoldSongwords">
                    <span id="unfold-1">{{slogan}}</span>
                </div>
            </div>
            <!--歌词信息-->
        </div>
        <comment :comments="songComment"></comment>
    </div>
    <div id="song-control-playarea-x">
        <audioPlayControl style="height:60px;padding:0px 200px;"></audioPlayControl>
    </div>
</div>
</template>

<script>
import {
    ipcRenderer,
    inAppPurchase
} from "electron"
import comment from "../HomePage/comment";
import audioPlayControl from "../HomePage/audioPlayControl"
export default {
    data: function () {
        return {
            bk_img: null,
            picUrl: "http://127.0.0.1:3000/api/picture",
            start: 0,
            end: 10,
            slogan: "展开"
        };
    },
    beforeMount() {
        //将相关数据拉过来
        //判断是请求还是本地继续下一步动作

    },
    computed: {
        song_img: function () {
            let song = this.$store.getters.getCurrentSong
            let imgUrl = song.pic ? this.$data.picUrl + "/" + song.pic.replace(new RegExp("\//|\/|:", "g"), "") : null
            return imgUrl
        },
        song: function () {
            return this.$store.getters.getCurrentSong
        },
        songComment: function () {
            return this.$store.getters.getCurrentComment || []

        },
        songAbout: function () {
            return this.$store.getters.getCurrentSongAbout
        }
    },
    watch: {
        "$store.getters.getCurrentTime": function () {
            //根据时间变化调整歌词的移动
            //ok 颜色办法时间算法
            // 无法参与赋值运算
            //bug tips: 由于歌词列表有展开和折叠两种情况 所以如果在未展开的情况下 直接取节点最后一个会 undefined
            var cTime = this.$store.getters.getCurrentTime
            var words = this.$store.getters.getCurrentSongAbout.lrclist
            var flag = 10 // 限定默认展示长度
            var showStyle = "color:blue"
            var defalutStyle = "color:white"
            var list = document.getElementsByClassName("songword-class")
            var duration = this.$store.getters.getCurrentAudio.duration
            const f = 2

            if (words.length) {
                //先判断歌词是否存在
                if (words.length > flag) {
                    //歌词长度 大于给定的额度
                    if (this.slogan == "收起") {
                        //展开状态
                        //仅高亮
                        if (duration == cTime) {
                            alert("exec end")
                            list[words.length - 1].style = defalutStyle //播放结束后，最后一行也变为黑
                        }
                        if (duration > cTime && cTime > Number(words[words.length - 1].time)) {
                            //当时间来到最后一行
                            list[words.length - 2].style = defalutStyle
                            list[words.length - 1].style = showStyle
                        } else {
                            //第一个时间段 - 倒数第二个时间段
                            for (let i = 0; i < words.length - 1; i++) {
                                if (cTime >= Number(words[i].time) && Number(words[i + 1].time) > cTime) {
                                    if (i > 0) {
                                        //第一行歌词没有上一个节点
                                        list[i - 1].style = defalutStyle
                                    }
                                    list[i].style = showStyle
                                    break;
                                }
                            }
                        }
                    } else if (this.slogan == "展开") {

                        //折叠状态
                        //高亮显示，以及歌词动态向上移动
                        //从第十一条歌词开始 到最后10条歌词之间 ，每次高亮结束后 滚动
                        if (Number(words[10].time) > cTime) {
                            for (let d = 0; d < 10; d++) {
                                if (Number(words[d + 1].time) > cTime && cTime > Number(words[d].time)) {
                                    if (d > 0) {
                                        list[d - 1].style = defalutStyle
                                    }
                                    list[d].style = showStyle
                                    break;
                                }
                            }
                        } else {
                            if (duration == cTime) {
                                list[9].style = defalutStyle
                            }
                            if (duration> cTime && cTime > Number(words[words.length - 1].time)) {
                                this.start = words.length - 10
                                this.end = words.length 
                                list[8].style = defalutStyle
                                list[9].style = showStyle
                            }
                            for (let g = 10; g < words.length - 1; g++) {
                                if (Number(words[g + 1].time) > cTime && cTime > Number(words[g].time)) {
                                    //数据切片
                                    this.end = g + 1
                                    this.start = g - 9
                                    list[9].style = showStyle
                                    break;
                                }
                            }
                        }

                    }
                } else {
                    //歌词长度 等于或者小于给定额度
                    //只需执行高亮轮换
                    //暂时不写 。。。

                }
            }

        }
    },
    components: {
        comment,
        audioPlayControl
    },
    methods: {
        minScreen: function () {
            ipcRenderer.send('MIN_SCREEN')
        },
        maxScreen: function () {
            ipcRenderer.send('MAX_SCREEN')
        },
        exitApplication: function () {
            ipcRenderer.send('EXIT_APPLICATION')
        },
        back: function () {
            //导航返回
            //this.$router.go(-1) :: 返回上一级
            //this.
            this.$router.go(-1)
        },
        unfoldSongwords: function () {
            //展开歌词
            //计算属性的获取
            console.log(this)
            function a () {
                 var nodes = document.getElementsByClassName("songword-class")
                 for(let u=0;u<nodes.length;u++) {
                     nodes[u].style = "color:white"
                 }
            }
            if (this.$data.slogan == "展开") {
                //折叠状态
                this.$data.slogan = "收起"
                this.$data.start = 0;
                this.$data.end = this.$store.getters.getCurrentSongAbout.lrclist.length
                a()
            } else if (this.$data.slogan == "收起") {
                //展开状态
                this.$data.slogan = "展开"
                this.$data.start = 0;
                this.$data.end = 10;
                document.getElementById("outest-music-play-page-frame").scroll(0, 0) //滚动至顶部
                a()
            }
        }
    }

};
</script>

<style>
#display-one {
    display: block;
    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    z-index: 99;
    padding: 0 100px;
}

#page-other-function {
    position: absolute;
    top: 0px;
    right: 0px;
    left: 0px;
    height: 36px;
    padding: 0 20px;
}

#page-other-function i:hover {
    color: blue;
}

#page-other-function>div:nth-child(1) {
    height: 100%;
    float: left;
}

#page-other-function>div:nth-child(2) {
    height: 100%;
    float: right;

}

#page-other-function>div>i {
    padding: 10px;
}

#outest-music-play-page-frame {
    position: absolute;
    top: 36px;
    bottom: 60px;
    right: 0px;
    left: 0px;
    padding: 0 200px;
    overflow: scroll;
}

#outest-music-play-page-frame>div:nth-child(1) {
    width: 100%;
    margin-bottom: 100px;
    display: flex;
}

#outest-music-play-page-frame>div:nth-child(1)>div:nth-child(1) {
    width: 30%;
    padding-top: 30%;
    position: relative;

}

#outest-music-play-page-frame>div>div:nth-child(1)>img {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    right: 0px;
    bottom: 0px;
}

#outest-music-play-page-frame>div>div:nth-child(2) {
    width: 70%;
    padding-left: 100px;
}

#song-control-playarea-x {
    position: absolute;
    bottom: 0px;
    left: 0px;
    right: 0px;
    height: 60px;
}

.songword-class {
    line-height: 18px;
    height: 18px;
    margin-bottom: 20px;
    letter-spacing: 3px;
}

.songword-class:hover {
    color: blue;
    font-size: 20px;
}

#unfold-1:hover {
    color: blue;
}

.audio-play{
    background-size: cover;
}
</style>
