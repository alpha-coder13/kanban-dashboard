import { modalState } from "./store";

export const modalReducer = (state = modalState, action) =>{
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