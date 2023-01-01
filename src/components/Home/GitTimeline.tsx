import { Heading, SlideFade, ListItem, Text, theme } from "@chakra-ui/react"
import { motion } from "framer-motion"
import { MdCheckCircle } from "react-icons/md"
import { Gitgraph, Mode, TemplateName, templateExtend } from "@gitgraph/react"
import React from "react"
import { ORG_COLORS } from "../../constants"

export const MotionHeading = motion(Heading)
export const MotionListItem = motion(ListItem)

const ORG_TITLES = {
  assembly: {
    title: "Assembly Digital Media",
    href: "https://assmb.ly",
    description:
      "Assembly Digital Media is a tech leader, disrupting the digital publishing industry with an innovative stack of technology that has turned traditional and digital media on its head.",
  },
  se: {
    title: "Schneider Electric",
    href: "https://www.se.com",
    description: "Schneider Electric is a global leader in the power industry.",
  },
  itc: {
    title: "Island Temperature Controls",
    href: "https://islandtemp.com",
    description:
      "ITC specializes in HVAC and DDC systems for commercial, industrial, marine and institutional properties.",
  },
  uvic: {
    title: "University of Victoria",
    href: "https://www.uvic.ca",
    description:
      "The University of Victoria is a public research university located in Victoria, British Columbia.",
  },
}

const TIMELINE = {
  "2022": [
    {
      icon: MdCheckCircle,
      title: ORG_TITLES.assembly,
      subtitle: "Software Developer",
      dateRange: "May 2022 - Present",
    },
  ],

  "2021": [
    {
      icon: MdCheckCircle,
      title: ORG_TITLES.assembly,
      subtitle: "Full-stack Software Developer Co-op",
      dateRange: "September 2021 - December 2021",
    },
    {
      icon: MdCheckCircle,
      title: ORG_TITLES.se,
      subtitle: "Software Designer - Co-op",
      dateRange: "January 2021 - September 2021",
    },
  ],

  "2019": [
    {
      icon: MdCheckCircle,
      title: ORG_TITLES.itc,
      subtitle: "Full-stack Software Developer - Co-op",
      dateRange: "May 2019 - December 2019",
    },
  ],

  "2018": [
    {
      icon: MdCheckCircle,
      title: ORG_TITLES.uvic,
      subtitle: "Began Software Engineering (B.S.Eng.) degree",
      dateRange: "September 2018",
    },
  ],

  "2017": [
    {
      icon: MdCheckCircle,
      title: ORG_TITLES.uvic,
      subtitle: "Began Bachelor of Engineering degree",
      dateRange: "September 2017",
    },
  ],
}

const GitTimeline = () => {
  const isCompact = true

  const renderMessage = (commit) => {
    return (
      <g transform={`translate(0, ${commit.style.dot.size})`}>
        <text
          fill={commit.style.dot.color}
          alignmentBaseline={"central"}
          fontSize={theme.fontSizes["2xl"]}
          fontWeight={theme.fontWeights["semibold"]}
        >
          {commit.subject}
        </text>
        <foreignObject
          width={"600"}
          style={{ height: "40px", paddingTop: "16px" }}
        >
          <Text color={commit.style.message.color}>{commit.body}</Text>
        </foreignObject>
      </g>
    )
  }

  const withoutHash = templateExtend(TemplateName.Metro, {
    colors: [
      theme.colors.green[500],
      ORG_COLORS.uvic,
      ORG_COLORS.itc,
      ORG_COLORS.se,
      ORG_COLORS.asm,
    ],
    commit: {
      message: {
        displayHash: false,
        displayAuthor: false,
      },
    },
    branch: {
      label: {
        display: false,
      },
    },
  })

  return (
    <SlideFade in={true} offsetY={80} delay={0.2}>
      <Gitgraph
        options={{
          author: "Adam Hultman <adam@hultman.dev>",
          template: withoutHash,
          mode: isCompact ? Mode.Compact : null,
        }}
      >
        {(gitgraph) => {
          // Simulate git commands with Gitgraph API.
          const main = gitgraph.branch("main")
          main.commit({
            subject: "Initial commit",
            body: "September 2017",
            renderMessage,
          })

          const bsengDegree = main.branch({
            name: "edu/uvic/bseng",
          })
          bsengDegree.commit({
            subject: "Begin Engineering (B.Eng.) degree",
            body: "September 2017",
            renderMessage,
          })
          bsengDegree.commit({
            subject: "Begin Software Engineering (B.S.Eng.) degree",
            body: "September 2018",
            renderMessage,
          })

          const itcCoop = bsengDegree.branch({
            name: "work/coop/itc",
          })
          itcCoop.commit({
            subject: "Full-stack Software Developer - Co-op",
            body: "May 2019 - December 2019",
            renderMessage,
          })
          itcCoop.commit({
            subject: "Full-stack Software Developer - Part-time",
            body: "May 2019 - December 2019",
            renderMessage,
          })
          bsengDegree.merge(itcCoop)

          const schneiderCoop = bsengDegree.branch({
            name: "work/coop/se",
          })
          schneiderCoop.commit({
            subject: "Software Designer - Co-op - Term 1",
            body: "January 2021 - September 2021",
            renderMessage,
          })
          schneiderCoop.commit({
            subject: "Software Designer - Co-op - Term 2",
            body: "January 2021 - September 2021",
            renderMessage,
          })
          bsengDegree.merge(schneiderCoop)

          const assemblyCoop = bsengDegree.branch({
            name: "work/coop/assembly",
          })
          assemblyCoop.commit({
            subject: "Full-stack Software Developer Co-op",
            body: "September 2021 - December 2021",
            renderMessage,
          })
          assemblyCoop.commit({
            subject: "Software Developer - Part-time",
            body: "May 2022 - August 2022",
            renderMessage,
          })
          bsengDegree.merge(assemblyCoop)

          bsengDegree.commit({
            subject: "Complete Engineering (B.Eng.) degree",
            body: "August 2022",
            renderMessage,
          })

          main.merge(bsengDegree)

          const assembly = main.branch({
            name: "work/assembly",
          })
          assemblyCoop.commit({
            subject: "Software Developer",
            body: "October 2022 - Present",
            renderMessage,
          })
        }}
      </Gitgraph>
    </SlideFade>
  )
}

export default GitTimeline
