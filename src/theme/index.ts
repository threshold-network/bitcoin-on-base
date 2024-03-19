import { extendTheme } from "@chakra-ui/react"
import { defaultTheme } from "@threshold-network/components"
import { InfoBox } from "./InfoBox"
import { Tabs } from "./Tabs"
import { Badge } from "./Badge"
import { DetailedLinkListItem } from "./DetailedLinkListItem"
import { Checkbox } from "./Checkbox"
import { Radio } from "./Radio"
import { AnnouncementBanner } from "./AnnouncementBanner"
import { Timeline } from "./Timeline"
import { Tooltip } from "./Tooltip"
import { fonts } from "./fonts"
import { Button } from "./Button"
import { Alert } from "./Alert"
import { TransactionDetailsItem } from "./TransactionDetailsItem"
import { BridgeProcessResourcesItem } from "./BridgeProcessResourcesItem"

export const customBreakpoints = {
  "3xl": "120rem", // 1920px
}

export const customSizes = {
  "content-max-width": "89.25rem", // 1428px
  "toast-width-dismissable": "34.375rem", // 550px
  "toast-width-aside": "25rem", // 400px
}

const index = extendTheme({
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    brand: {
      "50": "hsl(182, 100%, 88%)",
      "100": "hsl(182, 100%, 70%)",
    },
    whiteAlpha: {
      "250": "hsla(0, 0%, 100%, 0.1)",
      "350": "hsla(0, 0%, 100%, 0.2)",
    },
  },
  textStyles: {
    bodyLg: {
      fontWeight: "400",
      fontSize: "18px",
      lineHeight: "28px",
    },
    "token-amount": {
      fontFamily: "'Bricolage Grotesque', monospace",
      fontWeight: "800",
    },
  },
  sizes: customSizes,
  breakpoints: customBreakpoints,
  fontSizes: {
    "3.5xl": "2rem", // 32px
    "4.5xl": "2.5rem", // 40px
  },
  lineHeights: {
    12: "3rem",
  },
  components: {
    ...defaultTheme.components,
    AnnouncementBanner,
    InfoBox,
    Tabs,
    Badge,
    DetailedLinkListItem,
    Radio,
    Checkbox,
    Timeline,
    Tooltip,
    Button,
    Alert,
    TransactionDetailsItem,
    BridgeProcessResourcesItem,
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  fonts,
})

export default index
