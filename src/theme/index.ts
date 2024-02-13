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

export const customBreakpoints = {
  "3xl": "120rem", // 1920px
}

export const customSizes = {
  "content-max-width": "89.25rem", // 1428px
  "toast-width": "34.375rem", // 550px
}

const index = extendTheme({
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    brand: {
      "100": "#66F9FF",
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
  breakpoints: customBreakpoints,
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
