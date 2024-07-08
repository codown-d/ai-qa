<template>
    <div class="side_con">
        <div class="nav">
            <div :class="[
                'nav_item',
                currentNav === item.id ? 'active_item' : 'deactive_item',
            ]" @click="selectItem('nav', item)" v-for="item in navItems" :key="item.id">
                <img :src="`${currentNav === item.id ? item.active_url : item.url}`" />
                <div>{{ item.text }}</div>
            </div>
        </div>
        <el-scrollbar class="list">
            <el-menu :class="[menuDeative ? 'menu_deactive' : '']" :default-active="currentNav" ref="menuRef">
                <el-menu-item class="static" index="translate" @click="dealAffair('translate')">
                    <img src="@/assets/images/fanyi.svg" />
                    <div>翻译与格式调整</div>
                </el-menu-item>
                <el-sub-menu index="1">
                    <template #title>
                        <img src="@/assets/images/zhishi.svg" />
                        <span>知识库</span>
                    </template>
                    <el-menu-item :index="`1-${++index}`" v-for="(item, index) in knowledgeStore.knowledgeList" :key="index"
                        @click="dealAffair(item)">
                        <div class="cricle" :style="{ backgroundColor: item.bgColor }"></div>
                        <div>{{ item.name }}</div>
                        <img src="@/assets/images/pencil_edit.svg" @click.stop="toKb(item)"
                            v-show="knowledgeStore.userInfo?.role === 'admin'" />
                    </el-menu-item>
                    <el-menu-item class="add-knowledge u-flex" @click="addKnowledge"
                        v-if="knowledgeStore.userInfo.role == 'admin'">
                        <el-icon>
                            <CirclePlusFilled />
                        </el-icon>
                        <div>新建企业AI知识库</div>
                    </el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-scrollbar>
        <div class="avatar">
            <div class="avatar_info">
                <img :src="knowledgeStore.userInfo.avatar_url" />
                <div>
                    <div class="name">{{ knowledgeStore.userInfo.username }}</div>
                    <div class="code">{{ knowledgeStore.userInfo.email }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { ref, watch } from "vue";
import {merge} from 'loadsh'
import { useKnowledgeStore } from "@/store/useKnowledgeStore";
import { useRouter } from "vue-router";
import { getInfo } from "@/config/api.ts";

const router = useRouter();
const knowledgeStore = useKnowledgeStore();

const currentNav = ref("message");
const menuDeative = ref(false);

function getUserInfo() {
    getInfo()
        .then((res) => {
            if (res.data.code === 1000) {
                knowledgeStore.userInfo = merge(res.data.data, {avatar_url:`${import.meta.env.VITE_BASE_URL}${res.data.data.avatar_url}`});
            }
        })
        .catch(() => { });
}
getUserInfo();

const navItems = [
    {
        id: "message",
        url: new URL("/src/assets/images/b_message.svg", import.meta.url).href,
        active_url: new URL("/src/assets/images/message.svg", import.meta.url).href,
        text: "对话",
    },
    {
        id: "question",
        url: new URL("/src/assets/images/blackQuestion.svg", import.meta.url).href,
        active_url: new URL("/src/assets/images/w_question.svg", import.meta.url)
            .href,
        text: "更新和常见问题解答",
    },
    {
        id: "setting",
        url: new URL("/src/assets/images/setting.svg", import.meta.url).href,
        active_url: new URL("/src/assets/images/w_setting.svg", import.meta.url)
            .href,
        text: "设置",
    },
];

const menuRef = ref(null);
const activeMenu = ref("");
function resetElMenu() {
    menuDeative.value = true;
    knowledgeStore.menuData.flag = false;
    menuRef.value.close(knowledgeStore.menuData.index);
    activeMenu.value = "";
}

watch(
    knowledgeStore.menuData,
    (newVal, oldVal) => {
        if (newVal.flag) {
            menuRef.value.open(newVal.index);
            activeMenu.value = `1-${newVal.index}`;
            currentNav.value = NaN;
            menuDeative.value = false;
        }
    },
    { deep: true }
);

function selectItem(type: string, item: { id: string }) {
    const eventTrigger: Record<string, () => void> = {
        nav() {
            resetElMenu();
            knowledgeStore.currentBase = "default";
            currentNav.value = item.id;
            switch (item.id) {
                case "message":
                    router.push("/");
                    knowledgeStore.sessionType = "init";
                    break;
                case "question":
                    router.push("/");
                    break;
                case "setting":
                    router.push("/setting");
                    break;
            }
        },
    };
    eventTrigger[type]();
}

function dealAffair(item?: any) {
    menuDeative.value = false;
    currentNav.value = NaN;
    if (item && item !== "translate") {
        router.push("/");
        knowledgeStore.currentBase = item.name;
        knowledgeStore.sessionType = "assign";
    }
    if (item === "translate") {
        router.push("/translate");
        knowledgeStore.currentBase = "default";
    }
}

const addKnowledgeModalRef = ref(null);
function addKnowledge() {
    router.push({
        path: "/kb",
    });
}

function toKb(item: { name: any }) {
    router.push({
        path: "/knowledge-base",
        query: { name: item.name },
    });
}
</script>
<style scoped lang="less">
.side_con {
    width: 100%;
    padding: 22.11% 8.09% 20px;
    height: 100%;
    box-sizing: border-box;
    border-radius: 0.93vw;
    background: rgba(249, 249, 249, 1);
    display: flex;
    flex-direction: column;

    .nav {
        padding-bottom: 14.26%;
        border-bottom: 1px solid rgba(226, 226, 226, 1);
    }

    .nav_item {
        width: 100%;
        height: 43px;
        display: flex;
        padding: 9px 22px;
        align-items: center;
        font-size: 0.93vw;
        box-sizing: border-box;
        cursor: pointer;
        font-weight: 400;
        border-radius: 11px;
        color: rgba(255, 255, 255, 1);

        &>img {
            margin-right: 11px;
            width: 22px;
            height: 0.93vw;
        }
    }

    .active_item {
        background: rgba(126, 76, 225, 1);
    }

    .deactive_item {
        color: black;
    }

    .list {
        margin-top: 5.55%;
        height: 44.44vh;
    }

    .avatar {
        box-sizing: border-box;
        bottom: 10px;
        border-radius: 11px;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        padding: 25px 29px 15.5px;
        margin-top: auto;

        .avatar_info {
            border-bottom: 1px solid rgba(232, 232, 232, 1);
            display: flex;
            align-items: center;
            padding-bottom: 14.5px;
        }

        & img {
            width: 46px;
            height: 46px;
            border-radius: 50%;
            margin-right: 13px;
        }

        .name {
            color: rgba(0, 0, 0, 1);
            font-size: 18px;
            font-weight: 700;
            line-height: 24px;
        }

        .code {
            font-weight: 500;
            color: rgba(153, 153, 153, 1);
            font-size: 16px;
            font-weight: 500;
        }
    }
}

:deep(.el-menu) {
    border-right: none;
    background: rgba(249, 249, 249, 1);

    .el-sub-menu__title {
        height: 43px;
        border-radius: 11px;
        padding-left: 27px !important;
        font-size: 18px;

        &>img {
            width: 18px;
            height: 17px;
            margin-right: 12.5px;
        }

        &>span {
            height: 52px;
            font-size: 18px;
        }
    }

    .el-menu-item {
        height: 43px;
        padding-left: 45px;
        border-radius: 11px;
        padding-left: 26px !important;
        font-size: 18px;

        .cricle {
            border-radius: 50%;
            width: 12px;
            height: 12px;
            background-color: aquamarine;
            margin-right: 17px;
        }

        &>img {
            width: 16px;
            height: 15px;
            margin-left: auto;
            cursor: pointer;
            display: none;
        }

        &:not(.static)>img {
            display: block;
        }
    }

    .static {
        &>img {
            margin-right: 9px;
            width: 22px;
            height: 0.93vw;
            margin-left: 0px;
            display: block;
        }
    }

    .el-sub-menu__title:hover,
    .el-menu-item:hover,
    .el-menu-item.is-active {
        background: rgba(232, 222, 247, 1);
        color: black;
    }
}

:deep(.menu_deactive) {
    .el-menu-item.is-active {
        background: transparent;
    }
}

.add-knowledge {
    color: rgba(102, 102, 102, 1);
    padding-left: 27px;
    font-size: 18px;
    cursor: pointer;
    user-select: none;
    font-size: 18px;

    .el-icon {
        font-size: 17px;
        color: rgba(97, 96, 101, 1);
    }
}
</style>
