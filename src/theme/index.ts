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
import { DotsLoadingIndicator } from "./DotsLoadingIndicator"
import { Tooltip } from "./Tooltip"
import { Button } from "./Button"
import { CheckListItem } from "./CheckListItem"

// TODO: Review theme, add colors, add fonts

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
    NotificationPill,
    Tree,
    Tabs,
    Badge,
    DetailedLinkListItem,
    Radio,
    Checkbox,
    Timeline,
    DotsLoadingIndicator,
    Tooltip,
    Button,
    CheckListItem,
  },
})

export default index
