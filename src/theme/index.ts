import { extendTheme } from "@chakra-ui/react"
import { defaultTheme } from "@threshold-network/components"
import { InfoBox } from "./InfoBox"
import { NotificationPill } from "./NotificationPill"
import { Tree } from "./Tree"
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

const index = extendTheme({
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    brand: {
      "100": "#66F9FF",
    },
    border: {
      "50": "hsla(0, 0%, 100%, 0.1)",
      "100": "hsla(0, 0%, 100%, 0.2)",
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
  components: {
    ...defaultTheme.components,
    AnnouncementBanner,
    InfoBox,
    NotificationPill,
    Tree,
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
})

export default index
