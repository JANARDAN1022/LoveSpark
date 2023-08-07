import React, { createContext, useState, ReactNode } from 'react';

interface LoginContextType {
  ShowLogin: boolean;
  ShowSignUp:boolean;
  scroll:boolean;
  setscroll:React.Dispatch<React.SetStateAction<boolean>>;
  setShowSignUp: React.Dispatch<React.SetStateAction<boolean>>;
  setshowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}


export const LoginContext = createContext<LoginContextType>({
  ShowLogin: false,
  ShowSignUp:false,
  scroll:false,
  setscroll:()=>{},
  setShowSignUp:()=>{},
  setshowLogin: () => {},
});

interface LoginContextProviderProps {
  children: ReactNode;
}

export const LoginContextProvider = ({ children }: LoginContextProviderProps) => {
  const [ShowLogin, setshowLogin] = useState(false);
  const [ShowSignUp,setShowSignUp]=useState(false);
  const [scroll,setscroll]=useState(false);

  const contextValue: LoginContextType = {
    ShowLogin,
    ShowSignUp,
    scroll,
    setscroll,
    setShowSignUp,
    setshowLogin,
  };

  return (
    <LoginContext.Provider value={contextValue}>
      {children}
    </LoginContext.Provider>
  );
};
