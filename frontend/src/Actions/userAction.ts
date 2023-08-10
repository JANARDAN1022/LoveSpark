import axios from "axios";
import {createAsyncThunk,Dispatch } from "@reduxjs/toolkit"; 
//import {User} from '../Types/UserTypes';
import {
    loginRequest,
    loginSuccess,
    loginFail,
    logoutFail,
    logoutSuccess,
    registerFail,
    registerRequest,
    registerSuccess,
    updateFail,
    updateSuccess,
    loadFail,
    loadrequest,
    loadsuccess,

} from '../Reducers/UserReducer';
//import {useAppDispatch} from '../Hooks';

const instance = axios.create({
    baseURL:"https://love-spark.vercel.app/api/Users/"   //Api Base Url
});

//const dispatch = useAppDispatch();


//Login User
export const LoginUser = createAsyncThunk('user/Login',async(loginData:{email:string,password:string},{ dispatch }: { dispatch: Dispatch })=>{
    try {
        dispatch(loginRequest());
        const route = '/Login';
        const config = {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        };
        const { data } = await instance.post(route, loginData, config);
        document.cookie = `token=${data.token}; path=/; secure=true;`;
        dispatch(loginSuccess(data.user));
        return { success: true }; // Return success status
    } catch (error:any) {
       dispatch(loginFail(error.response.data.message));
    }
});


//Register User
export const RegisterUser = createAsyncThunk('user/register',async(registerData:{email:string, password:string,confirmPassword:string},{ dispatch }: { dispatch: Dispatch })=>{
    try {
        dispatch(registerRequest());
        const route = '/Register';
        const config = {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        };
        const { data } = await instance.post(route, registerData, config);
        document.cookie = `token=${data.token}; path=/; secure=true;`;
        dispatch(registerSuccess(data.user));
        console.log(data.user);

    } catch (error:any) {
      dispatch(registerFail(error.response.data.message));
    }
});

//Logout User
export const LogoutUser = createAsyncThunk('user/Logout',async(_,{ dispatch })=>{
    try {
        const route = `/Logout`;
        const config =  {headers:{"Content-Type":"application/json"},withCredentials: true};
       // Clear the token cookie explicitly with proper attributes
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; secure=true; sameSite=None;'; 
      await instance.get(route,config);
        dispatch(logoutSuccess());
        return { success: true }; // Return success status
    } catch (error:any) {
        dispatch(logoutFail(error.response.data.message))
    }
});


//Update Userdetails
export const UpdateUser = createAsyncThunk('user/Update',async(Body:{id:string,data:{}},{ dispatch }: { dispatch: Dispatch })=>{
 try {
    const route = `/Update/${Body.id}`;
    console.log(Body.data);
    const config =  {headers:{"Content-Type":"application/json"},withCredentials: true};
    const {data} = await instance.put(route,Body.data,config)   
     dispatch(updateSuccess(data.updatedUser));
 } catch (error:any) {
     dispatch(updateFail(error.response.data.message));
     console.log(error);
 }
});

//Load User On Reload
export const Loaduser = createAsyncThunk('user/Load', async (_, { dispatch }) => {
    try {
      dispatch(loadrequest());
      const route = `/Me/`;
      const config = { headers: { "Content-Type": "application/json" }, withCredentials: true };
      const { data } = await instance.get(route, config);
      dispatch(loadsuccess(data.user));
    } catch (error:any){
      dispatch(loadFail(error.response.data.message));
      console.log(error);
    }
  });