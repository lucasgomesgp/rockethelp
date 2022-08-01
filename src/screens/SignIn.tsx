import React, { useState } from "react";
import { Heading, Icon, Pressable, Text, useTheme, VStack } from "native-base";
import Logo from "../assets/logo_primary.svg";
import { Input } from "../components/Input";
import { Envelope, Key } from "phosphor-react-native";
import { Button } from "../components/Button";
import auth from "@react-native-firebase/auth";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();
  const navigation = useNavigation();

  function handleSignIn() {
    if (!email || !password) {
      return Toast.show({
        type: "error",
        text1: "Informe email e senha!",
      });
    }
    setIsLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        console.log(error.code);
        setIsLoading(false);

        if (
          error.code === "auth/invalid-email" ||
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
        ) {
          return Toast.show({
            type: "error",
            text1: "E-mail ou senha inválida.",
          });
        }

        return Toast.show({
          type: "error",
          text1: "Não foi possível acessar",
        });
      });
  }

  function handleCreateNewUser() {
    navigation.navigate("SignUp");
  }

  return (
    <VStack flex={1} alignItems="center" bg="gray.600" px={8} pt={24}>
      <Logo />
      <Heading color="gray.100" fontSize="xl" mt={20} mb={6}>
        Acesse sua conta
      </Heading>
      <Input
        placeholder="Email"
        mb={4}
        value={email}
        onChangeText={setEmail}
        InputLeftElement={
          <Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
        }
      />
      <Input
        mb={8}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
        secureTextEntry
      />
      <Button
        title="Entrar"
        w="full"
        isLoading={isLoading}
        onPress={handleSignIn}
      />
      <Button
        title="Crie sua conta"
        w="full"
        mt={4}
        bg="transparent"
        borderColor="blue.400"
        borderWidth={1}
        onPress={handleCreateNewUser}
      />
      <Pressable
        onPress={() => {
          navigation.navigate("ForgotPassword");
        }}
      >
        <Text color="white" mt={8}>
          Esqueceu sua senha?
        </Text>
      </Pressable>
    </VStack>
  );
}
