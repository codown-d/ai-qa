// src/stores/useKnowledgeStore.js
import { defineStore } from "pinia";
import { getKnowledgeBase } from "@/config/api.ts";

export const useKnowledgeStore = defineStore("knowledge", {
  state: () => ({
    knowledgeList: [],
    randomKnowledgeList: [],
    sessionType: "init",
    currentBase: "default",
    messageList: [],
    randomMessageList: [],
    currentReq: "",
    menuData: {
      flag: false,
      index: "",
    },
    userInfo: {},
  }),
  actions: {
    setKnowledgeList(data: any) {
      this.knowledgeList = data;
    },
    updateKnowledgeList() {
      const getRandomHexColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };
      getKnowledgeBase()
        .then((res) => {
          this.knowledgeList = res.data.data.map((item: any) => ({
            ...item,
            bgColor: getRandomHexColor(),
          }));
        })
        .catch(() => {});
    },
  },
  getters: {
    getKnowledgeList: (state) => {
      const result: any = []; // 结果数组
      for (let i = 0; i < state.knowledgeList.length; i += 3) {
        result.push(state.knowledgeList.slice(i, i + 3));
      }
      return result;
    },
  },
});
