import { createContext, useContext, useReducer } from "react"
import { modalState } from "./store";
import { modalReducer } from "./reducers";

export const DashboardContext = createContext();
export const useDashBoardContext = ()=>{
    const dashboard = useContext(DashboardContext);
    if(!dashboard){
        throw new Error("not in dashboard context");
    }
}
export const DashboardProvider = ({children}:{children:React.ReactElement})=>{
    const [modalState, modalDispatcher] = useReducer(modalState,modalReducer);

    return (
        <DashboardContext.Provider value={{
            modal:{state:modalState, dispatch:modalDispatcher},
        }}>
            {children}
        </DashboardContext.Provider>
    )
}