export interface User {
  Birthday: string | "";
  FirstName: string | "";
  Gender: string | "";
  LastName: string | "";
  Location: {
    country: string | "";
    State: string | "";
    city: string | "";
  }[];
  ProfileStatus: "";
  age: string | "";
  avatar: {
    url: string | "";
  }[];
  bio: string | "";
  createdAt: string;
  email: string;
  interests: string[] | [];
  occupation: string | "";
  ProfileUrl: string;
  CoverUrl: string;
  ExtraUrl: string[] | [];
  role: string;
  sexuality: string | "";
  Blocked: Boolean;
  _V: number;
  _id: string;
  pincode: string;
}

export interface UsersState {
  loading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  error?: any;
}

export interface Chat {
  _id: string;
  participants: [
    {
      _id: string;
      FirstName: string;
      LastName: string;
      ProfileUrl: string;
    }
  ];
  createdAt: string;
  __v: number;
}

export interface ChatUser {
  _id: string;
  participants: [
    {
      _id: string;
      FirstName: string;
      LastName: string;
      ProfileUrl: string;
      bio: string;
      interests: string[];
      CoverUrl: string;
      occupation: string;
    }
  ];
  createdAt: string;
  __v: number;
}

export interface MessagesData {
  _id?: string;
  chat: string;
  receiverUserId?: string;
  content: string;
  createdAt?: string;
  sender: string;
  totalUnreadMessages: number;
}

export interface PersonalInfoType {
  FirstName: string;
  LastName: string;
  bio: string;
  Location: [
    {
      country: string;
      State: string | undefined;
      city: string;
    }
  ];
  pincode: string;
  Gender: string;
  sexuality: string;
  occupation: string;
  age: string;
}
