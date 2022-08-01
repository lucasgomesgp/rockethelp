import { VStack } from "native-base";
import { useContext, useState } from "react";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import firestore from "@react-native-firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../contexts/UserContext";
import Toast from "react-native-toast-message";

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [patrimony, setPatrimony] = useState("");
  const [description, setDescription] = useState("");
  const navigation = useNavigation();
  const {
    user: { uid },
  } = useContext(UserContext);

  function handleNewOrderRegister() {
    if (!patrimony || !description) {
      return Toast.show({
        type: "error",
        text1: "Preencha todos os campos.",
      });
    }
    setIsLoading(true);
    firestore()
      .collection("orders")
      .add({
        patrimony,
        description,
        status: "open",
        uid,
        created_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Solicitação registrada com sucesso.",
        });
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        return Toast.show({
          type: "error",
          text1: "Não foi possível registrar o pedido.",
        });
      });
  }
  return (
    <VStack flex={1} p={6} bg="gray.600">
      <Header title="Solicitação" />
      <Input
        placeholder="Número do patrimônio"
        mt={4}
        value={patrimony}
        onChangeText={setPatrimony}
      />
      <Input
        placeholder="Descrição do problema"
        mt={5}
        flex={1}
        multiline
        textAlignVertical="top"
        value={description}
        onChangeText={setDescription}
      />
      <Button
        title="Cadastrar"
        mt={5}
        isLoading={isLoading}
        onPress={handleNewOrderRegister}
      />
    </VStack>
  );
}
