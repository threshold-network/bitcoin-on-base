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
import { DotsLoadingIndicator } from "./DotsLoadingIndicator"
import { Tooltip } from "./Tooltip"
import { fonts } from "./fonts"

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
    "token-amount": {
      fontFamily: "'Bricolage Grotesque', monospace",
      fontWeight: "800",
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
    DotsLoadingIndicator,
    Tooltip,
  },
  fonts,
})

export default index
