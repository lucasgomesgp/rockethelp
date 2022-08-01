import { Button, IButtonProps, Text, useTheme, VStack } from "native-base";

type Props = IButtonProps & {
  title: string;
  isActive?: boolean;
  type: "open" | "closed";
  personalModification?: boolean;
};

export function Filter({
  title,
  isActive = false,
  personalModification = false,
  type,
  ...rest
}: Props) {
  const { colors } = useTheme();
  const colorType = type === "open" ? colors.secondary[700] : colors.green[300];
  const colorTypePersonal = colors.blue[500];

  return (
    <Button
      variant="outline"
      borderWidth={isActive ? 1 : 0}
      borderColor={
        colorType
      }
      bgColor="gray.600"
      flex={1}
      size="sm"
      {...rest}
    >
      {personalModification && isActive ? (
        <Text color={colorTypePersonal} fontSize="xs" textTransform="uppercase">
          {title}
        </Text>
      ) : (
        <Text
          color={isActive ? colorType : "gray.300"}
          fontSize="xs"
          textTransform="uppercase"
        >
          {title}
        </Text>
      )}
    </Button>
  );
}
