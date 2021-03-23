const axios = require("axios")
const fs = require("fs")
const path = require("path")
export default {
    mode: {},//资源寻找前提
    audioExistBaseUrl: "http://127.0.0.1:3000/api/audioExist/",
    audioBaseUrl: "http://127.0.0.1:3000/api/audio/",
    videoExistBaseUrl: "http://127.0.0.1:3000/api/videoExist/",
    videoBaseUrl: "http://127.0.0.1:3000/api/video/",
    vueThis: null,
    appStoreDirs: {
        audio: path.resolve("E:", "Electron-app", "audios"),
        video: path.resolve("E:", "Electron-app", "videos"),
        audioJson: path.resolve("E:", "Electron-app", "audio.json"),
        videoJson: path.resolve("E:", "Electron-app", "video.json"),
        collectSong: path.resolve("E:", "Electron-app", "collectSong.json"),
        collectMv: path.resolve("E:", "Electron-app", "collectMv.json"),
        gedanList: path.resolve("E:", "Electron-app", "gedanList.json"),
        historySearch: path.resolve("E:", "Electron-app", "historySearch.json"),
        historySong: path.resolve("E:", "Electron-app", "historySong.json"),
        historyMv: path.resolve("E:", "Electron-app", "historyMv.json")
    },
    getVueThis: function (this_) {
        this.vueThis = this_
    },
    aboutInit: function () {
        //生成相关json配置文件 以及防止文件丢生
        let data = []
        data = JSON.stringify(data)

        Object.keys(this.appStoreDirs).forEach((key) => {
            if (key != "audio" && key != "video") {
                if (!fs.existsSync(this.appStoreDirs[key])) {
                    fs.writeFileSync(this.appStoreDirs[key], data)
                }
            }
        })
    },
    play: function (song, node, vthis) {
        if (!vthis.$store) {
            vthis = this.vueThis
        }
        let requestUrl = this.audioExistBaseUrl + song.rid
        axios.get(requestUrl)
            .then((resp) => {
                if (resp.data.exist) {
                    let src = this.audioBaseUrl + song.rid + ".mp3"

                    if (node) { vthis.$store.commit("updateCurrentNode", node) }//如果有 则提交当前目标节点
                    vthis.$store.commit("updateCurrentSong", song) //提交当前歌曲
                    this.getComment(vthis, song.rid)//获取并提交评论
                    this.getSongAbout(vthis, song.rid)//获取歌曲并提交相关包括歌词
                    vthis.$store.commit("updateCurrentAudio", src) //提交当前歌曲音频
                    vthis.$store.commit("playAudio", {
                        type: "play"
                    }) //正式播放歌曲


                } else {
                    //弹框显示 此歌曲仅为vip播放
                    alert("仅为vip可以播放")
                }
            })
            .catch((err) => {
                alert("抱歉 发生错误")
                console.error(err)
            })
    },
    controlPlay: function (song, node, vthis) {

        //在非vue环境中 无法获取$store ,所以选择从外部引入
        console.log("currentSong::", vthis.$store.getters.getCurrentSong)
        let currentSong = vthis.$store.getters.getCurrentSong
        if (currentSong != song) {
            //空对象 不相等
            if (!currentSong.rid) {
                alert("播放新歌曲")
                this.play(song, node, vthis)
            } else {
                alert("移除新歌曲，播放新歌曲")
                vthis.$store.commit("clearCurrentAudio", {
                    type: "pause"
                })
                this.play(song, node, vthis)
            }

        } else {
            //原来的歌曲操作
            if (node.className == "fa fa-pause") {
                alert("暂停")
                vthis.$store.commit("pauseAudio", {
                    type: "pause"
                }) //key
            } else if (node.className == "fa fa-play") {
                alert("继续播放歌曲")
                vthis.$store.commit("playAudio", {
                    type: "play"
                }) //key

            }

        }
    },
    test: function () {
        // template: no use 
    },
    checkIsExist: function (type, content) {
        var f = false
        let d = []
        if (type === "audio") {
            //检测是否存在音频缓存文件
            d = JSON.parse(fs.readFileSync(this.appStoreDirs.audioJson))
        } else if (type === "video") {
            //检测是否下载视频文件
            d = JSON.parse(fs.readFileSync(this.appStoreDirs.videoJson))
        } else if (type === 'collect') {
            //检测是否存在收藏即喜爱的歌曲文件 ---逻辑有问题 先不改
            d = JSON.parse(fs.readFileSync(this.appStoreDirs.collectSong))
        } else if (type === 'mvcollect') {
            d = JSON.parse(fs.readFileSync(this.appStoreDirs.collectMv))
        }

        for (let i = 0; i < d.length; i++) {
            if (content.rid === d[i].rid) {
                f = true
                break;
            }
        }
        if (f) { alert("存在") }
        else {
            alert("不存在")
        }
        return f
    },
    //实际上存储相关仅仅被用来与存储下载相关内容 下载视频文件后 视频文件列表json也要修改
    storeAbout: function (type, content) {
        let fileName, data
        if (type === 'audio') {
            fileName = this.appStoreDirs.audioJson
        } else if (type === "video") {
            fileName = this.appStoreDirs.videoJson
        }

        data = JSON.parse(fs.readFileSync(fileName))
        data.push(content)

        function callback(err) {
            if (err) {
                alert("下载出现问题")
            } else {
                alert("下载完成")
            }
        }

        fs.writeFile(fileName, JSON.stringify(data), callback)



    },
    getComment: function (vthis, rid) {
        let url = `http://127.0.0.1:3000/api/comment/song/${rid}`
        axios.get(url).then((resp) => {
            vthis.$store.commit("updateCurrentComment", resp.data)
        }).catch((err) => {
            alert("get-comment-error: ", err)
        })
    },
    getSongAbout: function (vthis, rid) {
        let url = `http://127.0.0.1:3000/api/songAbout/${rid}`
        axios.get(url).then(resp => {
            vthis.$store.commit("updateCurrentSongAbout", resp.data)
        }).catch(err => {
            alert("get-song-about-error: ", err)
        })
    },
    getReadyPlaySongList: function (vthis, list) {
        //list should be a array 
        vthis.$store.commit("updateReadyPlaySongList", list || [])
    },
    download: function (song, type) {
        let fileName, basePath, url
        let id = song.rid
        if (type === 'audio') {
            fileName = `${id}.mp3`
            basePath = this.appStoreDirs.audio
            url = this.audioBaseUrl + fileName
        } else if (type === 'video') {
            fileName = `${id}.mp4`
            basePath = this.appStoreDirs.video
            url = this.videoBaseUrl + fileName
        }

        let v = this

        if (!this.checkIsExist(type, song)) {
            axios.get(url).then(resp => {
                var callback = function () {
                    alert(`${fileName} 下载完成 !`)
                    song.storeLocation = path.resolve(basePath, fileName)
                    v.storeAbout(type, song)
                }
                fs.writeFile(path.resolve(basePath, fileName), resp.data, callback)
            }).catch((err) => {
                alert("仅限会员下载")
            })
        }
        else {
            alert("已下载!!!")
        }


    },
    updateCollect: function (event, type, source, vthis) {
        let fileName = type === "song" ? this.appStoreDirs.collectSong : this.appStoreDirs.collectMv
        let list
        if (type === "song") {
            list = JSON.parse(fs.readFileSync(fileName))
        } else if (type === "mv") {
            list = JSON.parse(fs.readFileSync(fileName))
        }

        if (event === "add") {
            list.push(source)
        } else if (event === "remove") {
            list = list.filter(item => {
                if (item.rid === source.rid) {
                    return false
                }
            })
        }

        fs.writeFileSync(fileName, JSON.stringify(list))

        if (type === "song") {
            vthis.$store.commit("updateCurrentIsLove", {
                event: event, type: type
            }) //事件提交更新
        }

    },

    getCollect: function (type) {
        let result
        if (type === "song") {
            result = JSON.parse(fs.readFileSync(this.appStoreDirs.collectSong))
        } else if (type === "video") {
            result = JSON.parse(fs.readFileSync(this.appStoreDirs.collectMv))
        }

        return result
    },

    storeCollect: function (type, data) {
        let filename = type === "song" ? this.appStoreDirs.collectSong : this.appStoreDirs.collectMv
        return fs.writeFileSync(filename, JSON.stringify(data))
    },

    historyStore: function (type, data, time) {
        /**
         * 存储 搜索历史
         * 存储 播放歌曲历史
         * 存储 播放视频历史
         * 
         */
        let filename, waitWrite
        if (type === "search") {
            filename = this.appStoreDirs.historySearch
        } else if (type === "song") {
            filename = this.appStoreDirs.historySong
        } else if (type === "video") {
            filename = this.appStoreDirs.historyMv
        }

        if (time != null) {
            //存在时间 说明是单独写入
            let d = {
                time: time,
                record: data
            }

            waitWrite = JSON.parse(fs.readFileSync(filename))
            waitWrite.push(d)
        } else {
            //不存在时间 说明是整体写入 用于删除后写入
            waitWrite = data

        }


        fs.writeFileSync(filename, JSON.stringify(waitWrite))

    },

    getHistory: function (type) {
        let filename
        if (type === "search") {
            filename = this.appStoreDirs.historySearch
        } else if (type === "song") {
            filename = this.appStoreDirs.historySong
        } else if (type === "video") {
            filename = this.appStoreDirs.historyMv
        }

        return JSON.parse(fs.readFileSync(filename))
    },

    deleteHistory: function (type, target, mode) {


        //使用时间邮戳来作为唯一标识
        let filename, data
        if (type === "search") {
            filename = this.appStoreDirs.historySearch
        } else if (type === "song") {
            filename = this.appStoreDirs.historySong
        } else if (type === "video") {
            filename = this.appStoreDirs.historyMv
        }

        /**
         *  target : 待删除数组
         *  origin : 原始数据
         */

        let origin = this.getHistory(type)

        if (mode === "all") {
            data = []
        } else {
            target.forEach(item => {
                for (let i = 0; i < origin.length; i++) {
                    if (origin[i].time === item.time) {
                        origin[i].time = -1
                    }
                }
            })

            data = origin.filter(item => {
                if (item.time != -1) {
                    return true
                }
            })
        }



        this.historyStore(type, data, null)
    },
    alert: function (position, message, callback) {

        if (document.getElementById("alertLogo")) {
            //解决重复点击出现重复弹框
            let p = document.getElementsByTagName("body")[0]
            p.removeChild(p.lastChild)
        }

        let result
        function afterClick(result, callback) {
            document.getElementsByTagName("body")[0].removeChild(alert)
            callback(result)
        }


        //主按钮
        let alert = document.createElement("div")
        alert.id = "alertLogo"
        alert.style.position = "fixed"
        alert.style.backgroundColor = "brown"
        alert.style.left = position.x + "px"
        alert.style.top = position.y + "px"
        alert.style.width = "300px"
        alert.style.height = "50px"
        alert.style.borderRadius = "10px"


        let contentDiv = document.createElement("div")
        contentDiv.innerText = message
        contentDiv.style.textAlign = "center"



        let containButtonDiv = document.createElement("div")
        containButtonDiv.style.display = "flex"
        containButtonDiv.style.justifyContent = "space-between"

        //确定按钮
        let sureButton = document.createElement("div")
        sureButton.innerText = "确定"
        sureButton.style.width = "50px"
        sureButton.style.height = "25px"
        sureButton.style.display = "flex"
        sureButton.style.justifyContent = "center"
        sureButton.style.alignItems = "center"
        sureButton.addEventListener("click", function (event) {
            result = "sure"
            afterClick(result, callback)
        })
        sureButton.addEventListener("mouseover", function (event) {
            // sureButton.style.backgroundColor = "blue"
        })


        //取消按钮
        let cancelButton = document.createElement("div")
        cancelButton.innerText = "取消"
        cancelButton.style.width = "50px"
        cancelButton.style.height = "25px"
        cancelButton.style.display = "flex"
        cancelButton.style.justifyContent = "center"
        cancelButton.style.alignItems = "center"
        cancelButton.addEventListener("click", function (event) {
            result = "cancel"
            afterClick(result, callback)
        })
        cancelButton.addEventListener("mouseover", function (event) {
            // sureButton.style.backgroundColor = "blue"
        })



        containButtonDiv.appendChild(cancelButton)
        containButtonDiv.insertBefore(sureButton, cancelButton)


        alert.appendChild(containButtonDiv)
        alert.insertBefore(contentDiv, containButtonDiv)

        document.getElementsByTagName("body")[0].append(alert)

    },
    getDownloadFile: function (type) {
        let filename = type === "song" ? this.appStoreDirs.audioJson : this.appStoreDirs.videoJson
        return JSON.parse(fs.readFileSync(filename))
    },
    downloadFileReset: function (type, result, waitDeletePath) {
        //result :待写入文件
        //filePath : 缓存文件的路径
        //传入删除后的数据
        let filename = type === "audio" ? this.appStoreDirs.audioJson : this.appStoreDirs.videoJson  //缓存文件信息文件



        fs.writeFileSync(filename, JSON.stringify(result))

        //成功更改信息后 正式删除缓存文件
        waitDeletePath.forEach(item => {
            fs.unlink(item, function (err) {
                if (err) {
                    console.log("delete error :", err)
                }
                console.log(item, " delete finished")
            })

        })

    }







    }