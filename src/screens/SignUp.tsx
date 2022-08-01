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

interface IFormInputs {
  email: string;
  password: string;
  passwordConfirm: string;
}

export function SignUp() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup
    .object({
      email: yup
        .string()
        .email("Email inválido.")
        .required("O campo email é obrigatório."),
      password: yup
        .string()
        .min(8, "No mínimo 8 caracteres.")
        .required("O campo senha é obrigatório."),
      passwordConfirm: yup
        .string()
        .oneOf([yup.ref("password")], "Senhas diferentes."),
    })
    .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

   async function onSubmit(data: IFormInputs) {
    try {
      setIsLoading(true);

      const { email, password } = data;
      await auth().createUserWithEmailAndPassword(email, password);

      Toast.show({
        type: "success",
        text1: "Usuário criado com sucesso.",
      });

      setIsLoading(false);
      navigation.navigate("Home");
    } catch (error) {
      if(error.code === "auth/email-already-in-use"){
        Toast.show({
          type: "error",
          text1: "Esse usuário já existe.",
        });
      }
      console.log(error);
      setIsLoading(false);
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
      </VStack>
      <VStack
        flex={1}
        bg="gray.700"
        alignItems="center"
        w="full"
        px={2}
        pt={20}
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
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Senha"
              type="password"
              mt={4}
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
          name="password"
        />
        {errors.password && (
          <Text color="red.500" fontSize="md" mb={1}>
            {errors.password?.message}
          </Text>
        )}
        <Controller
          control={control}
          rules={{ required: true }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              placeholder="Repetir"
              type="password"
              mt={4}
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
          name="passwordConfirm"
        />
        {errors.passwordConfirm && (
          <Text color="red.500" fontSize="md" mb={1}>
            {errors.passwordConfirm?.message}
          </Text>
        )}

        <Button
          title="Criar conta"
          bg="blue.500"
          w="full"
          mt={4}
          isLoading={isLoading}
          onPress={handleSubmit(onSubmit)}
        />
      </VStack>
    </>
  );
}
