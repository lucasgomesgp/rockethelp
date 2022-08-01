import { useNavigation } from "@react-navigation/native";
import { VStack, IconButton, useTheme, Box, Text } from "native-base";
import { CaretLeft } from "phosphor-react-native";
import Logo from "../assets/logo_secondary.svg";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import auth from "@react-native-firebase/auth";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import Toast from "react-native-toast-message";

interface IFormInput {
  email: string;
}

export function ForgotPassword() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const schema = yup
    .object({
      email: yup
        .string()
        .email("Email inválido.")
        .required("O campo email é obrigatório."),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: IFormInput) {
    try {
      setIsLoading(true);
      await auth().sendPasswordResetEmail(data.email);
      Toast.show({
        type: "success",
        text1: "Foi enviado um email para redefinição de senha",
      });
      setIsLoading(false);
      navigation.goBack();
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        Toast.show({ type: "error", text1: "Erro", text2: "Email inválido." });
      } else {
        Toast.show({
          type: "error",
          text1: "Infelizmente não conseguimos enviar o email.",
        });
      }
      console.log(error);
    } 
  }

  return (
    <>
      <Box bg="gray.700" w="full" textAlign="left" pt={8}>
        <IconButton
          icon={<CaretLeft size={30} color={colors.blue[500]} />}
          onPress={() => {
            navigation.goBack();
          }}
          bg="gray.600"
          w="1/5"
          rounded="full"
          px={2}
          ml={2}
          mt={2}
        />
      </Box>
      <VStack bg="gray.700" alignItems="center" justifyContent="center" pt={12}>
        <Logo />
        <Text color="white" fontSize="lg" mt={8}>
          Recuperação de senha
        </Text>
      </VStack>
      <VStack
        flex={1}
        bg="gray.700"
        alignItems="center"
        w="full"
        px={2}
        pt={10}
      >
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Email"
              mb={2}
              bg="gray.500"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              _focus={{
                borderWidth: 1,
                borderColor: "blue.500",
              }}
            />
          )}
          name="email"
        />
        {errors.email && (
          <Text color="red.500" fontSize="md" mb={1}>
            {errors.email?.message}
          </Text>
        )}
        <Button
          title="Solicitar"
          bg="blue.500"
          w="full"
          mt={4}
          onPress={handleSubmit(onSubmit)}
          isLoading={isLoading}
        />
      </VStack>
    </>
  );
}
