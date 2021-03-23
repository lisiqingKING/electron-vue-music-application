<template>
<div>
    <div id="historyTag">
        <h2>历史记录</h2>
        <div style="margin-left:50px">
            <span class="el-icon-delete" @click="deleteSelect($event)" title="删除"></span>
            <span @click="finish">{{state}}</span>
        </div>
    </div>

    <el-tabs v-model="activeName" @tab-click="handleClick" style="width:200px;color:#fdfdfd">
        <el-tab-pane label="搜索" name="first"></el-tab-pane>
        <el-tab-pane label="歌曲" name="second"></el-tab-pane>
        <el-tab-pane label="视频" name="third"></el-tab-pane>
    </el-tabs>

    <div class="block">
        <el-timeline>
            <el-timeline-item v-for="(record,index) in list" :key="index" :timestamp="record.time|timeFilter" placement="top" color="blue">
                <el-card class="el-card-extend">
                    <h3>记录{{index+1}}</h3>
                    <div class="record-content-style">
                        <p style="font-size:15px">{{record.record.name ? record.record.name : record.record}}</p>
                        <div>
                            <input type="checkbox" name="selected" value="noselected" class="checkBoxIsDelete" checked="false" style="display:none">
                            <label><i class="el-icon-delete" @click="deleteItem(record.time)" title="删除"></i></label>
                        </div>
                    </div>
                </el-card>
            </el-timeline-item>
        </el-timeline>
    </div>
</div>
</template>

<script>
import player from "../player.js"
export default {
    data: function () {
        return {
            list: [{
                record: "暂无记录"
            }],
            name: "search", //标志查找记录的标签
            activeName: "first",
            deleteList: [],
            state: ""
        }
    },
    beforeMount: function () {
        this.list = player.getHistory("search")
    },
    filters: {
        timeFilter: function (time) {
            return time
        }
    },
    methods: {
        deleteSelect: function (e) {
            let position = {
                x: e.pageX,
                y: e.pageY
            }
            let list = document.getElementsByClassName("checkBoxIsDelete")
            Array.prototype.forEach.call(list, function (item) {
                item.style.display = "inline"
                item.checked = true
            })

            player.alert(position, "是否删除所有搜索历史记录", result => {
                if (result === "sure") {
                    this.list = []
                    player.deleteHistory(this.name, null, "all")
                } else {
                    //什么也不干 仅为单独删除
                }
            })

        },
        handleClick: function (tab, event) {
            console.log(tab.name)

            this.activeName = tab.name
            if (tab.name === "first") {
                this.list = player.getHistory("search")
                this.name = "search"
            } else if (tab.name === "second") {
                this.list = player.getHistory("song")
                this.name = "song"

            } else if (tab.name === "third") {
                this.list = player.getHistory("video")
                this.name = "video"

            }

            this.list.forEach((item) => {
                item.checked = false
            })

        },
        deleteItem: function (time) {

            this.list.forEach((item, index, arr) => {
                if (time === item.time) {
                    //截取数组 去掉改数组元素
                    arr.splice(index, 1)
                    this.deleteList.push(item)
                }
            })
            this.state = "完成"

        },
        finish: function () {
            let list = document.getElementsByClassName("checkBoxIsDelete")
            Array.prototype.forEach.call(list, function (item) {

                item.checked = false
                item.style.display = "none"
            })
        }
    },
    beforeDestroy: function () {
        //将实际的删除元素操作真正执行
        player.deleteHistory(this.name, this.deleteList)
    }
}
</script>

<style>
.record-content-style {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
}

.el-card-extend * {
    color: #303133;
    font-size: 20px;
}

.record-content-style>p:hover {
    color: blue;
    cursor: pointer;
}

#historyTag {
    display: flex;
    align-items: center;
}

#historyTag span:hover {
    
    color: blue;
    text-decoration: underline;
}
</style>
