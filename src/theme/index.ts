import { extendTheme } from "@chakra-ui/react"
import { mode } from "@chakra-ui/theme-tools"
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

const index = extendTheme({
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    // TODO: move color to components repo.
    teal: {
      "500": "#00BACC",
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
    Tabs,
    Badge,
    DetailedLinkListItem,
    Radio,
    Checkbox,
    Timeline,
    Tooltip,
  },
})

export default index
