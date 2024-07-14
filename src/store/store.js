import {configureStore} from "@reduxjs/toolkit";
import homeSilce from "./homeSilce";
export const store =
configureStore({
    reducer:{
        home: homeSilce,
    },
});