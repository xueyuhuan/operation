import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      user:{},//登录用户详细信息
      token:'',
  },
  mutations: {
      setData(state,data){
          state[data.name]=data.value
      }
  },
  actions: {

  }
})
