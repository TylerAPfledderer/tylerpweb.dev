import { VStack, StackProps } from "@chakra-ui/react";

/**
 * LEGACY SHELL — frozen. Do not grow this into the redesign's band.
 *
 * The redesign's decision (PR2 shared), recorded here because four section specs
 * proposed four incompatible futures for this component:
 *
 * 1. MainSection stays exactly as-is and is NOT extended. It serves only the
 *    un-redesigned sections. Each section PR drops it as that section lands; the
 *    redesign sweep PR deletes the file once the last consumer is gone.
 * 2. Redesigned sections render their own full-bleed `<section>` (their own
 *    background, since the design alternates canvas/band) wrapping an inner shell
 *    at `maxW="container.page"` (1160px) with `px="clamp(20px, 5vw, 32px)"`.
 * 3. There is deliberately NO shared `Band` component yet. The bands' padding is
 *    NOT uniform — hero's bottom is clamp(72px,13vw,132px) against a
 *    clamp(64px,12vw,120px) top, contact's card is clamp(44px,9vw,72px)
 *    clamp(24px,6vw,56px), and header/footer share neither. Only maxW (already
 *    `sizes.container.page`) and the horizontal clamp are common — two values, not
 *    an abstraction. Extract Band when two sections actually agree on an API.
 *
 * Why not just restructure this into an outer/inner pair: AboutMeSection passes a
 * skewed `_before` whose `bg: "inherit"` reads from the SAME element that carries
 * `bg="primary.base"`. Split them and the pseudo-element inherits transparent, the
 * teal bleed silently vanishes, and it typechecks clean the whole way.
 */
export const MainSection = (props: StackProps) => (
  <VStack
    as="section"
    px={{ base: "8", lg: "16" }}
    py={{ base: "12", lg: "20" }}
    {...props}
  />
);
