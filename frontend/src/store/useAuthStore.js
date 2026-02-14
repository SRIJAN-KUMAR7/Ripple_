import {create} from "zustand";

export const useAuthStore=create((set)=>({
  authUser:{name:"john",_id:123,age:12},
  isLoggedIn:false,
  isLoading:false,


  login: ()=>{
    console.log("we jsut logged in")
    set({isLoggedIn:true,isLoading:true});
  }
}))