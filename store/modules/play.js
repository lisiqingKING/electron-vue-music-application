import player from "../../components/player.js"

const state = {
    currentAudio: new Audio(),
    currentVideo: null,
    currentSong: new Object(), //歌词，图片，评论，时间进度
    user: {
        username:null
    },
    searchContent: "",
    currentNode: null, //播放logo标志实在元素节点,
    setting: {
        mode: "repeat", //next,list,once,repeat,loop
        volume: 0.6
    },
    currentTime: 0,
    currentPlayState: "pause",
    currentComment: null,
    currentSongAbout: null,
    currentVolume: 0.5,
    audioPlayMode: "once",//单曲一次(默认做法) 单曲循环 列表播放 
    playList: [], //准备预备播放的列表
    v: null,
    currentIsLove: {
        song: false,
        mv: false
    }

}
/**
 *只有当state某个数据被修改时
  才能引起变化
 */
const getters = {
    // getUserName:function(state) {
    //     return state.user.username
    // },
    getUser:function(state) {
        return state.user
    },
    getSearchContent:function(state) {
        return state.searchContent
    },

    getState: function (state) {
        return state
    },
    getUser: function (state) {
        return state.user
    },
    getCurrentIsLove: function (state) {
        //state.currentIsLove = JSON.parse(sessionStorage.getItem("currentIsLove")) || state.currentIsLove
        return state.currentIsLove
    },
    getCurrentSong: function (state) {
        return state.currentSong
    },
    getCurrentAudio: function (state) {
        return state.currentAudio
    },
    getCurretNode: function (state) {
        return state.currentNode
    },
    getCurrentTime: function (state) {
        return state.currentTime
    },
    getCurrentPlayState: function (state) {
        return state.currentPlayState
    },
    getCurrentComment: function (state) {
        return state.currentComment
    },
    getCurrentSongAbout: function (state) {
        return state.currentSongAbout
    },
    getCurrentVolume: function (state) {
        return state.currentVolume
    },
    getCurrentAudioPlayMode: function (state) {
        return state.audioPlayMode
    },
    getReadyPlaySongList: function (state) {
        return state.playList
    }

}

/**
 * default::
 * mutation的参数第一个为 state 
 * action的参数第一个为 store
 */
const mutations = {

    updateUser:function(state,user) {
        state.user = user 
    },

    updateSearchContent:function(state,content) {
        state.searchContent = content
    },

    setState: function (state, origin) {
        state = origin
    },

    initSetting: function (state) {
        /**
         * 从user.use.config.json读取相关内容初始化
         * 
         */
    },
    updateCurrentIsLove: function (state, obj) {
        if (obj.event && obj.event === "add") {
            obj.type === "song" ? state.currentIsLove.song = true : state.currentIsLove.mv = true
        } else if (obj.event && obj.event === "remove") {
            obj.type === "song" ? state.currentIsLove.song = false : state.currentIsLove.mv = false
        }
       //sessionStorage.setItem("currentIsLove",JSON.stringify(state.currentIsLove))
    },

    updateCurrentComment: function (state, comment) {
        state.currentComment = comment
    },
    updateCurrentSongAbout: function (state, about) {
        //这里的songAbout指的是歌词
        state.currentSongAbout = about
    },
    updateCurrentNode: function (state, node) {
        console.log("update-node:", node)
        state.currentNode = node
    },
    updateCurrentTime: function (state, time) {
        state.currentTime = time
    },
    updatePlayState: function (state, statex) {
        console.log("state update ", statex)
        state.currentPlayState = statex
    },
    updateCurrentAudio: function (state, src) {
        console.log("update-audio", src)
        state.currentAudio.volume = state.currentVolume
        //更新播放音源前 检查一次
        if (state.audioPlayMode == "once") {
            state.currentAudio.loop = false
        } else if (state.audioPlayMode == "loop") {
            state.currentAudio.loop = true
        }
        state.currentAudio.src = src


        state.currentAudio.addEventListener("timeupdate", () => {
            /**
             * 时间更新
             * 赋给state.currentTime
             */
            this.commit("updateCurrentTime", state.currentAudio.currentTime)
            //console.log("time:",state.currentAudio.currentTime)
        })
        state.currentAudio.addEventListener("play", () => {
            /**
             * 播放状态更新:播放中
             */
            console.log("play music")
            this.commit("updatePlayState", "play")
            this.commit("iconChange", { type: "play" })
        })
        state.currentAudio.addEventListener("pause", () => {
            /**
             * 播放状态更新:暂停中
             */
            console.log("pause music", " currentTime is: ", state.currentTime)
            this.commit("updatePlayState", "pause")
            this.commit("iconChange", { type: "pause" })
        })
        state.currentAudio.addEventListener("ended", () => {
            if (state.audioPlayMode == "list" && state.playList.length > 1) {
                /**
                 * 播放下一首
                 * 需要更新一些列操作
                 */
                alert("播放下一首")
                let next = 0
                for (let r = 0; r < state.playList.length; r++) {
                    if (state.currentSong.rid == state.playList[r].rid) {
                        next = r + 1
                        break;
                    }
                }

                if (next == state.playList.length) { next = 0 }
                alert(`播放第${next + 1}`)
                player.play(state.playList[next], null, this)//this === this.$store(in vue)
            } else if (state.audioPlayMode == "random" && state.playList.length > 1) {
                /**
                 * 随机播放
                 */
                alert("随机播放")
                let random = (state.playList.length) * Math.random()
                random = parseInt(random)
                alert(`播放第${random}首歌`)
                player.play(state.playList[random], null, this)// this === this.$store(in vue)
            } else if (state.audioPlayMode == "once") {
                state.currentAudio.loop = false
            } else if (state.audioPlayMode == "loop") {
                state.currentAudio.loop = true
                //需要手动设置 播放原来曲目
                state.currentAudio.play()
            }
        })



        state.currentAudio.load()

    },
    //歌曲列表
    updateSongs_: function (state, songs) {
        state.songList = songs
    },
    updateCurrentSong: function (state, song) {
        console.log("update-song")
        state.currentSong = song
        state.currentIsLove.song = player.checkIsExist("collect", song)
        player.historyStore("song",song,new Date())
    },
    playAudio: function (state, config) {
        //音频播放
        //是新歌播放还是原来那歌曲的暂停后播放
        if (state.currentAudio.src) {
            state.currentAudio.play()
            if (config) {
                //列表播放需要 config 以此改变icon
                this.commit("iconChange", config)
            }
        }
    },

    clearCurrentAudio: function (state, config) {
        state.currentSong = new Object() //清空歌曲对象
        state.currentAudio.src = null //清除src
        if (config) { this.commit("iconChange", config) } //修改上一首歌的播放标志

    },
    pauseAudio: function (state, config) {
        if (state.currentAudio.src) {
            state.currentAudio.pause()
            if (config) {
                this.commit("iconChange", config)
            }
        }
    },
    iconChange: function (state, config) {
        console.log("current ---", state.currentNode)
        if (config.type == 'play') {
            console.log("play")
            state.currentNode.className = "fa fa-pause"
        } else if (config.type == 'pause') {
            console.log("pause")
            state.currentNode.className = "fa fa-play"
        }
    },
    updateAudioTime: function (state, progress) {
        if (state.currentAudio.src) {
            state.currentAudio.currentTime = (progress * state.currentAudio.duration)
        }
    },
    updateCurrentVolume: function (state, volume) {
        state.currentVolume = volume
    },

    updateAudioPlayMode: function (state, mode) {
        state.audioPlayMode = mode
        console.log("play-mode-become: ", mode)
    },

    updateReadyPlaySongList: function (state, list) {
        state.playList = list //更新待播放列表
    },
    //-------------------------------------------------------------------------------------
    playLastAudio: function (state) {
        //播放上一首歌曲音频
        let index = 0
        if (state.currentAudio.src && state.playList.length > 1) {
            for (let c = 0; c < state.playList.length; c++) {
                if (state.currentSong.rid == state.playList[c].rid) {
                    index = c - 1
                    break;
                }
            }
            if (0 > index) {
                index = state.playAudio.length - 1
            }
            this.commit("clearCurrentAudio", {
                type: "pause"
            })
            player.play(state.playList[index], null, this)
        }
    },
    playNextAudio: function (state) {
        //播放下一首歌曲音频
        let index = 0
        if (state.currentAudio.src && state.playList.length > 1) {
            for (let c = 0; c < state.playList.length; c++) {
                if (state.currentSong.rid == state.playList[c].rid) {
                    index = c + 1
                    break;
                }
            }
            if (index == state.playList.length) {
                index = 0
            }
            this.commit("clearCurrentAudio", {
                type: "pause"
            })
            player.play(state.playList[index], null, this)
        }
    }
}

const actions = {

}

export default {
    namespaced: false,
    state,
    getters,
    mutations,
    actions
}