import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      user:{},//登录用户详细信息
      token:'',
      color:['#c4c1e0','#7c73e6','#d9eeec','#64b2cd','#3c70a4','#da9833','#e7e8d8','#4e1d4c',"#773460","#e3aa27","#ffffff","#14001c"],
  },
  mutations: {
      setData(state,data){
          state[data.name]=data.value
      }
  },
  actions: {

  }
})
