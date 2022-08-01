import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { NativeBaseProvider, StatusBar } from "native-base";
import { Loading } from "./src/components/Loading";
import { Routes } from "./src/routes";
import { THEME } from "./src/styles/theme";
import {UserProvider} from "./src/contexts/UserContext";
import Toast from "react-native-toast-message";

export default function App() {
  const [fontLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      <UserProvider>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        {fontLoaded ? <Routes /> : <Loading />}
        <Toast />
      </UserProvider>
    </NativeBaseProvider>
  );
}
