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
import { Button } from "./Button"
import { Alert } from "./Alert"

export const customSizes = {
  "content-max-width": "89.25rem", // 1428px
}

const index = extendTheme({
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    brand: {
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
    "chain-identifier": {
      fontFamily: "IBM Plex Mono, monospace",
    },
  },
  sizes: customSizes,
  fontSizes: {
    "4.5xl": "2.5rem",
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
  },
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
})

export default index
