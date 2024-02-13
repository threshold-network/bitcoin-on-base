import { FC } from "react"
import {
  AccordionProps as TimelineContainerProps,
  Accordion as TimelineContainer,
} from "@chakra-ui/react"
import TimelineItem, {
  TimelineItemProps,
  TimelineItemVariantType as TimelineVariantType,
} from "./TimelineItem"

export interface TimelineProps extends Omit<TimelineContainerProps, "variant"> {
  items: Omit<TimelineItemProps, "variant">[]
  variant?: TimelineVariantType
}

const Timeline: FC<TimelineProps> = ({
  items,
  variant = "primary",
  ...restProps
}) => {
  return (
    <TimelineContainer {...restProps}>
      {items.map((item) => (
        <TimelineItem key={item.label} {...item} variant={variant} />
      ))}
    </TimelineContainer>
  )
}

export default Timeline
