import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {User,UsersState}  from '../Types/UserTypes';


const initialState:UsersState ={
    loading: false,
    isAuthenticated: false,
    user:{} as User,
}

const Req = (state:UsersState)=>{
    state.loading=true;
    state.isAuthenticated=false;
}

const Success = (state:UsersState,action:PayloadAction<User>)=>{
    state.loading=false;
    state.isAuthenticated=true;
    state.user= action.payload;
}

const Fail = (state:UsersState,action:PayloadAction<string>)=>{
    state.loading=false;
    state.isAuthenticated=false;
    state.user=null;
    state.error=action.payload;
}

const UserSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
       loginRequest:Req,
       registerRequest:Req,
       loadrequest:Req,
        loginSuccess:Success,
        registerSuccess:Success,
        loadsuccess:Success,
        updateSuccess:Success,
        loginFail:Fail,
        registerFail:Fail,
        loadFail:Fail,
        logoutSuccess:(state)=>{
         state.loading=false;
         state.isAuthenticated=false;
         state.user=null;
        },
        logoutFail:(state,action:PayloadAction<any>)=>{
            state.loading=false;
            state.error=action.payload;
        },
        updateFail:(state,action:PayloadAction<any>)=>{
              state.loading=false;
              state.isAuthenticated=true;
              state.error=action.payload;
        }    
    }
});

export const {loadFail,loadrequest,loadsuccess,loginFail,loginRequest,loginSuccess,logoutFail,logoutSuccess,registerFail,registerRequest,registerSuccess,updateSuccess,updateFail} = UserSlice.actions;

export default UserSlice.reducer;