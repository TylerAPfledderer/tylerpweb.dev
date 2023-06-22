import { createIcon } from "@chakra-ui/react";

export const CurvedDownArrow = createIcon({
  displayName: "CurvedDownArrow",
  viewBox: "0 0 15 45",
  defaultProps: {
    height: "10",
  },
  path: (
    <>
      <g fill="#fff" clipPath="url(#a)">
        <path d="M4.947 2.644c3.105 9.838 3.788 20.336 1.742 30.464a65.504 65.504 0 0 1-2.414 8.718c-.298.848.338 1.82 1.162 2.047.918.252 1.748-.311 2.047-1.163 3.606-10.274 4.596-21.3 2.819-32.045a64.644 64.644 0 0 0-2.146-8.906C7.514-.277 4.3.593 4.947 2.644Z" />
        <path d="m11.996 37.863-3.238 1.721-1.665.885-.833.443c-.108.058-.282.113-.37.197.36-.343 1.434.949 1.215.341-.193-.536-.56-1.057-.828-1.56l-.876-1.653-1.753-3.305c-.409-.77-1.544-1.07-2.277-.597-.784.505-1.034 1.453-.598 2.277l2.046 3.856.974 1.836c.405.764.74 1.56 1.588 1.918.866.366 1.693.025 2.466-.387l1.943-1.032 3.886-2.066c.77-.41 1.07-1.543.597-2.277-.504-.783-1.453-1.035-2.277-.597Z" />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M14.5.6v43.778H.56V.6z" />
        </clipPath>
      </defs>
    </>
  ),
});
