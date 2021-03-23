<template>
<div>
    <h2>收藏</h2>

    <div id="tag-2021">
        <div>
            <span class="fa fa-music" style="color:blue;margin-right:50px" @click='change("song",$event)'></span>
            <span class="fa fa-youtube-play" @click="change('video',$event)"></span>
        </div>
        <div>
            <span class="el-icon-delete" @click="deleteCollect"></span>
            <span @click="deletex">{{state1}}</span>
        </div>
    </div>

    <hr>
    <div v-for="(collect,index) in list" :key="index" class="collect-list">
        <input type="checkbox" checked="false" style="display:none" class="collect-input">
        <label style="margin-right:20px">{{index+1}}</label>
        <span class="fa fa-heart" style="color:red"></span>
        <span style="width:20%">{{collect.name}}</span>
        <span style="width:20%">{{collect.artist}}</span>
    </div>
</div>
</template>

<script>
import player from "../player.js"
export default {
    data: function () {
        return {
            list: [],
            name: "song",
            state1: "",

        }
    },
    beforeMount: function () {
        this.list = player.getCollect("song")
    },
    beforeDestroy() {
        /**
         * 写入文件
         */
        player.storeCollect(this.name, this.list) ? console.log("ok") : console.log("fail")
    },

    methods: {
        change: function (type, e) {
            if (this.name != type) {
                /**
                 * 组件切换必须重设 checked 属性
                 */

                let checkboxs = document.getElementsByClassName("collect-input")
                Array.prototype.forEach.call(checkboxs, function (checkbox) {
                    checkbox.checked = false
                    checkbox.style.display = "none"

                })
                this.state1 = ""

                let spans = document.getElementById("tag-2021").children[0].children
                Array.prototype.forEach.call(spans, function (span) {
                    span.style.color = "white"
                })
                e.target.style.color = "blue"
                this.list = player.getCollect(type)
                this.name = type
            }
        },
        deleteCollect: function () {

            let checkboxs = document.getElementsByClassName("collect-input")
            if (this.state1.length === 0) {

                Array.prototype.forEach.call(checkboxs, function (checkbox) {
                    checkbox.checked = true
                    checkbox.style.display = ""
                })

                this.state1 = "删除"
            }

        },
        deletex: function () {
            //上面的函数是删除动作
            //这个函数才是真正的删除

            if (this.state1 === "删除") {
                let temp = []

                let checkboxs = document.getElementsByClassName("collect-input")
                Array.prototype.filter.call(checkboxs, (checkbox, index) => {
                    if (!checkbox.checked) {
                        temp.push(this.list[index])
                    }
                })

                this.list = temp
                temp = []

                this.state1 = "完成"
            } else if (this.state1 === "完成") {
                let checkboxs = document.getElementsByClassName("collect-input")
                Array.prototype.forEach.call(checkboxs, function (checkbox) {
                    checkbox.checked = false
                    checkbox.style.display = "none"
                })
                this.state1 = ""
            }

        }

    }
}
</script>

<style>
#tag-2021 {
    display: flex;
    justify-content: space-between;
}

#tag-2021>div:nth-child(2)>span:hover {
    text-decoration: underline;
    color: blue;
}

.collect-list {
    margin: 20px 0px;
    display: flex;
}

.collect-list>span {
    margin-right: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
