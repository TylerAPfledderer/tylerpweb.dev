import type { Meta, StoryObj } from "@storybook/react";
import { Heading as HeadingComponent, Stack } from "@chakra-ui/react";

const meta = {
    title: "System / Heading",
    component: HeadingComponent,
} satisfies Meta<typeof HeadingComponent>

export default meta;

export const Heading: StoryObj<typeof meta> = {
    render: () => (
        <Stack>
            <HeadingComponent as='h1' size="4xl">Heading 2xl</HeadingComponent>
            <HeadingComponent as='h2' size="3xl">Heading xl</HeadingComponent>
            <HeadingComponent as='h3' size="2xl">Heading lg</HeadingComponent>
        </Stack>
    )
}