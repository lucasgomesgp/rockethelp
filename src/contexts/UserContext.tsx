import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import auth from "@react-native-firebase/auth";

type UserType = {
  user: FirebaseAuthTypes.User;
  setUser: Dispatch<SetStateAction<FirebaseAuthTypes.User>>;
};

type UserProviderProps ={
    children: ReactNode;
}

export const UserContext = createContext({} as UserType);

export function UserProvider({children}: UserProviderProps) {
  const [user, setUser] = useState<FirebaseAuthTypes.User>();
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((response) => {
      if (response) {
        setUser(response);
      }
    });
    return subscriber;
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
