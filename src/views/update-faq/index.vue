<template>
    <div class="faq-page-wrapper">
        <el-tabs v-model="activeName" type="card" style="padding-bottom: 10px; max-width: 1100px">
            <el-tab-pane label="更新通知" name="update">
                <div>
                    <div v-for="item in dataList" class="info-cont">
                        <p :class="`${item.type} info-title`">{{ item.title }}</p>
                        <span class="info-desc" v-if="typeof item.desc === 'string'">
                            {{ item.desc }}</span>
                        <div class="info-desc" v-else v-for="ite in item.desc">
                            {{ ite }}
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="常见问题" name="faq">
                <div class="flex-r-c faq-cont">
                    <div class="faq-cont-left">
                        <el-menu @select="selectItem" style="--el-menu-item-font-size:18px">
                            <menu-list :list="menuData" />
                        </el-menu>
                    </div>
                    <div class="faq-cont-right">
                        <FaqContent :prams="prams" />
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import FaqContent from "@/views/update-faq/faq-content.vue";
import MenuList from '@/components/menu-list.vue'
import { Compass } from "@element-plus/icons-vue";
import { ref } from "vue";
const activeName = ref("update");
const defaultctive = ref("1");
const prams = ref({});
let dataList = ref([
    {
        type: "type_1",
        title: "更新信息",
        desc: "重构设备布尔组件布局自动插件选择对象字体。链接变体跟随器下划线设备背景多...",
    },
    {
        type: "type_2",
        title: "更新时间",
        desc: "重本系统将于2024年12月24日24:00--02:00，进行系统升级，若因带来不便，对此感到非常抱歉!",
    },
    {
        type: "type_3",
        title: "更新内容",
        desc: [
            "焕然一新!知识库 2.0 升级详解",
            "1、知识库3合1，文档知识库可以建表格啦 ",
            "2、阅读页目录支持新建文档和表格 ",
            "3、编辑器支持宽屏输入，更流畅的大屏读写体验 ",
            "4、新布局，更直观:将素材面板分为“组件、图标、图片、页面新增标签导航，更快找到想要素材",
            "5、新搜索，更高效:支持全局搜索、新增搜索历史和推荐、优化搜索结果，更准更多素材 ",
            "6、新收藏，更简单:收藏数量无限制、支持搜索，优先找到你收藏的素材",
        ],
    },
]);
const menuData = ref([
    {
        label: "使用指南",
        icon: Compass,
        idPath: "0",
        children: [
            {
                label: "Ai对话相关问题",

                idPath: "0/0",
                children: [],
            },
            {
                label: "使Ai对话相关问题",
                idPath: "0/1",
                children: [],
            },
            {
                label: "使使Ai对话相关问题",
                idPath: "0/2",
                children: [],
            },
        ],
    },
    {
        label: "使用指南",
        icon: Compass,
        idPath: "1",
        children: [],
    },
]);
const getUserInfo = () => { };
getUserInfo();
const selectItem = (val: string) => {
    defaultctive.value = val
    console.log(val);
};
</script>

<style lang="less">
.faq-page-wrapper {
    padding: 40px 44px;

    .info-cont {
        margin-bottom: 46px;
        padding-left: 50px;
    }

    .type_1,
    .type_2,
    .type_3 {
        &:after {
            content: "";
            position: absolute;
            left: -20px;
            width: 10px;
            height: 10px;
            border-radius: 10px;
            top: 45%;
            z-index: 99;
        }
    }

    .type_1:after {
        background: #7e4ce1;
    }

    .type_2:after {
        background: #1c9756;
    }

    .type_3:after {
        background: #3c87c8;
    }

    .info-title {
        position: relative;
        font-size: 24px;
        line-height: 42px;
        font-weight: 500;
        letter-spacing: 0px;
        color: #333333;
        margin-bottom: 12px;
    }

    .info-desc {
        font-size: 18px;
        font-weight: normal;
        line-height: 32px;
        color: #999999;
    }

    .faq-cont {
        height: calc(100vh - 230px);
        align-items: flex-start;
    }

    .faq-cont-left {
        width: 290px;
        height: 100%;
        .el-menu{
            height: 100%;
            .el-sub-menu__title{
                margin-top: 5px;
            }
            li{
                margin-top: 5px;
            }
        }
        .el-menu-item:hover {
            border-radius: 10px;
        }

        .el-menu-item,
        .el-sub-menu__title {
            color: #999999;
            height: 46px;
            line-height: 46px;
            border-radius: 10px;
        }

        .is-active:not(.el-sub-menu) {
            line-height: 46px;
            background: #efe7f6;
            font-size: 18px;
            color: #7e4ce1;
        }

        .el-sub-menu__title,
        .el-menu-item {
            font-size: 18px;
            &:hover {
                color: #7e4ce1;
                background: #efe7f6;
            }
        }
    }

    .faq-cont-right {
        flex: 1;
        padding-left: 60px;
    }
}
</style>
