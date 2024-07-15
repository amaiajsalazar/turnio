import * as React from "react"
import Svg, { Path } from "react-native-svg"
export const EditIcon = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={50}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="feather feather-edit"
    {...props}
  >
    <Path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <Path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </Svg>
)
