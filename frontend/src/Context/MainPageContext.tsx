import React, { createContext, useState, ReactNode } from 'react';
import {User,ChatUser} from '../Types/UserTypes';


interface MainPageContextType {
    ShowComponent:string;
    Message:string;
    ProfileUrl:any;
    CoverUrl:any;
    Users:User[];
    ChatUser:ChatUser | null;
    ChangeTab:boolean;
    MatchedId:string;
    Sender:string[] | [];
    ShowVid:boolean;
    ReFetchMatches:boolean;
    ReFetchUsers:boolean;
    activeTab:string; 
    setActiveTab:React.Dispatch<React.SetStateAction<string>>;
    setReFetchUsers:React.Dispatch<React.SetStateAction<boolean>>;
    setReFetchMatches:React.Dispatch<React.SetStateAction<boolean>>;
    setShowVid:React.Dispatch<React.SetStateAction<boolean>>;
    setSender: React.Dispatch<React.SetStateAction<string[] | []>>;
    setMatchedId:React.Dispatch<React.SetStateAction<string>>;
    setChangeTab:React.Dispatch<React.SetStateAction<boolean>>;
    setChatUser:React.Dispatch<React.SetStateAction<ChatUser | null>>
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    setprofileUrl:React.Dispatch<any>;
    setCoverurl:React.Dispatch<any>;
    setMessage:React.Dispatch<React.SetStateAction<string>>;
    setShowComponent:React.Dispatch<React.SetStateAction<string>>;
}

export const MainPageContext = createContext<MainPageContextType>({
    ShowComponent:'Swipe',
    Message:'',
    ProfileUrl:null,
    CoverUrl:null,
    Users:[],
    ChatUser:null,
    ChangeTab:false,
    MatchedId:'',
    Sender:[],
    ShowVid:false,
    ReFetchMatches:false,
    ReFetchUsers:false,
    activeTab:'matches',
    setActiveTab:()=>{},
    setReFetchUsers:()=>{},
    setReFetchMatches:()=>{},
    setShowVid:()=>{},
    setSender:()=>{},
    setMatchedId:()=>{},
    setChangeTab:()=>{},
    setChatUser:()=>{},
    setUsers:()=>{},
    setprofileUrl:()=>{},
    setCoverurl:()=>{},
    setMessage:()=>{},
    setShowComponent:()=>{}
});

interface MainPageContextproviderProps {
    children:ReactNode;
}

export const MainPageContextProvider = ({children}:MainPageContextproviderProps)=>{
    const [ShowComponent,setShowComponent] = useState('Swipe');
    const [Message,setMessage]=useState('');
    const [ProfileUrl,setprofileUrl]=useState<any> (null);
    const [CoverUrl,setCoverurl]=useState<any>(null);
    const [Users,setUsers] = useState<User[]>([]);
    const [ChatUser,setChatUser]=useState<ChatUser | null>(null);
    const [ChangeTab,setChangeTab]=useState(false);
    const [MatchedId,setMatchedId]=useState('');
    const [Sender,setSender]=useState<string[] | []>([]);
    const [ShowVid,setShowVid]=useState(false);
    const [ReFetchMatches,setReFetchMatches]=useState(false);
    const [ReFetchUsers,setReFetchUsers]=useState(false);
    const [activeTab, setActiveTab]= useState('matches');

const contextValue: MainPageContextType ={
    ShowComponent,
    Message,
    ProfileUrl,
    CoverUrl,
    Users,
    ChatUser,
    ChangeTab,
    MatchedId,
    Sender,
    ShowVid,
    ReFetchMatches,
    ReFetchUsers,
    activeTab,
    setActiveTab,
    setReFetchUsers,
    setReFetchMatches,
    setShowVid,
    setSender,
    setMatchedId,
    setChangeTab,
    setChatUser,
    setUsers,
    setCoverurl,
    setprofileUrl,
    setMessage,
    setShowComponent
}

return(
    <MainPageContext.Provider value={contextValue}>
        {children}
    </MainPageContext.Provider>
 );
}