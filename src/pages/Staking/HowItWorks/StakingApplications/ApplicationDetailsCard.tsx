import { FC } from "react"
import { IoAlertCircle, MdCheckCircle } from "react-icons/all"
import {
  BodyMd,
  Box,
  BoxLabel,
  Card,
  H5,
  HStack,
  Icon,
  Image,
  LabelSm,
  Stack,
  useColorModeValue,
  List,
  ListItem,
  SimpleGrid,
} from "@threshold-network/components"
import InfoBox from "../../../../components/InfoBox"
import { formatPercentage } from "../../../../utils/percentage"

interface Props {
  preTitle: string
  title: string
  description: string
  imgSrc: any
  ctaButtons: JSX.Element
  rewardSteps: string[]
  aprPercentage: number
  slashingPercentage: number
}

const ApplicationDetailsCard: FC<Props> = ({
  preTitle,
  title,
  description,
  imgSrc,
  ctaButtons,
  rewardSteps,
  aprPercentage,
  slashingPercentage,
}) => {
  const infoBoxBg = useColorModeValue("gray.50", "gray.900")

  return (
    <Card boxShadow="none" as="section">
      <LabelSm mb={6}>{preTitle}</LabelSm>
      <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={10}>
        <Stack spacing={6}>
          <H5>{title}</H5>
          <BodyMd>{description}</BodyMd>
          <InfoBox bg={infoBoxBg}>
            <Image m="auto" maxH="180px" maxW="360px" w="100%" src={imgSrc} />
          </InfoBox>
        </Stack>
        <Box>
          {ctaButtons}
          <LabelSm mb={6}>How to earn rewards</LabelSm>
          <HStack mb={6}>
            <BoxLabel
              icon={<Icon as={IoAlertCircle} />}
              size="sm"
              status="primary"
              variant="solid"
            >
              APR &#183; {formatPercentage(aprPercentage, 0, true)}
            </BoxLabel>
            <BoxLabel
              icon={<Icon as={IoAlertCircle} />}
              size="sm"
              status="primary"
              variant="solid"
            >
              {"Slashing "} &#183;{" "}
              {`${formatPercentage(slashingPercentage, 0, true)}`}
            </BoxLabel>
          </HStack>
          <List mb={6} as={Stack} spacing={2}>
            {rewardSteps.map((step) => {
              return (
                <ListItem key={step} as={HStack} spacing={2}>
                  <Icon boxSize="24px" as={MdCheckCircle} color="green.500" />
                  <BodyMd>{step}</BodyMd>
                </ListItem>
              )
            })}
          </List>
        </Box>
      </SimpleGrid>
    </Card>
  )
}

export default ApplicationDetailsCard