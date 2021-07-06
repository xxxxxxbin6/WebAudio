import Vue from "vue"
import VueX from "vuex"

Vue.use(VueX)

export default new VueX.Store({
    state:{
        order:{
            "counter":1,
            "downmenu":1,
            "radios":1
        },
        totalPrice:0
    },

    mutations:{
        updateOrder(state,data){
            state.order[data[0]] = data[1];
        },

        updatePrice(state,price){
            state.totalPrice = price;
        }
    },

    actions:{
        updateOrder(context,data){
            context.commit("updateOrder",data);
        },

        updatePrice(context,price){
            context.commit("updatePrice",price);
        }
    },

    getters:{
        getOrder(state){
            return state.order ? state.order:{}
        },

        getTotalPrice(state){
            return state.totalPrice >0 ? '$' + state.totalPrice:0;
        }
    }
})