import { Flex, VisuallyHidden } from "@threshold-network/components"
import { NavLink } from "react-router-dom"

interface LogoProps {
  /** Whether the logo should be a link to the homepage */
  asLink?: boolean
}

export default function Logo(props: LogoProps) {
  const { asLink = true } = props

  return (
    <Flex
      as={asLink ? NavLink : Flex}
      alignItems={"center"}
      to={asLink && "/"}
      px={0.5}
    >
      <VisuallyHidden>
        Bitcoin on Base {asLink ? "homepage" : ""}
      </VisuallyHidden>
      <svg
        width="60"
        height="22"
        viewBox="0 0 60 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M39.0733 4.66696C43.3648 4.66696 47.472 7.20879 50.1729 13.0008L54.059 21.3347H59.9485L50.1943 0.416693H44.3048L45.6844 3.37521L48.2306 6.58375H46.724C44.0622 2.83351 39.8646 0 34.9339 0C29.364 0 27.4098 3.25021 30.305 9.45894L35.8427 21.3347H41.6866L36.518 10.2507C34.6332 6.20873 35.4209 4.66696 39.0733 4.66696Z"
          fill="url(#paint0_linear_1099_12946)"
        />
        <path
          d="M27.2273 10.8757C24.0406 4.04192 16.8142 0 9.5551 0C2.34163 0 -1.11522 4.04192 2.07142 10.8757C5.25806 17.7095 12.4845 21.7514 19.6979 21.7514C26.9571 21.7514 30.4139 17.7095 27.2273 10.8757ZM21.3378 10.8757C23.1254 14.7093 21.7219 17.0844 17.5217 17.0844C13.3214 17.0844 9.70287 14.7093 7.91524 10.8757C6.12762 7.04212 7.53109 4.66696 11.7313 4.66696C15.9316 4.66696 19.5502 7.04212 21.3378 10.8757Z"
          fill="url(#paint1_linear_1099_12946)"
        />
        <defs>
          <linearGradient
            id="paint0_linear_1099_12946"
            x1="23.5"
            y1="-8.67901e-07"
            x2="47.3619"
            y2="32.6846"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#66F9FF" />
            <stop offset="1" stopColor="#66F9FF" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_1099_12946"
            x1="23.5"
            y1="-8.67901e-07"
            x2="47.3619"
            y2="32.6846"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#66F9FF" />
            <stop offset="1" stopColor="#66F9FF" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </Flex>
  )
}
