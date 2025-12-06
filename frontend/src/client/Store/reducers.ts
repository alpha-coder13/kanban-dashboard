import { modalStore } from "./store";

export const modalReducer = (state = modalStore, action) =>{
    switch(action.type){
        case "toggle":{
            return {
                ...state,
                isOpen:!state.isOpen,
            }
        }
        default:
            return state;
    }
}