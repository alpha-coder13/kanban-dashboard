import { ReactNode } from "react";

export default interface ColumnParameters{
    id: Number,
    color:String,
    title: String,
    count: String,
    children:ReactNode
}