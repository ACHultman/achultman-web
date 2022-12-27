import {
  Heading,
  SlideFade,
  List,
  ListItem,
  Box,
  VStack,
  Text,
  Link,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import { motion } from "framer-motion"
import { MdCheckCircle } from "react-icons/md"
import Paragraph from "../Paragraph"

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

const Timeline = () => {
  const dateRangeColor = useColorModeValue("gray.600", "gray.400")
  return (
    <SlideFade in={true} offsetY={80} delay={0.2}>
      <Heading
        as="h1"
        fontSize={{ base: "24px", md: "30px", lg: "36px" }}
        mb={3}
      >
        Timeline
      </Heading>
      {Object.keys(TIMELINE)
        .reverse()
        .map((year) => {
          return (
            <Box key={year}>
              <VStack>
                <MotionHeading
                  mt={10}
                  mb={5}
                  as="h2"
                  size="md"
                  borderBottom="2px"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  {year}
                </MotionHeading>
                <List spacing={18} fontSize="18">
                  {TIMELINE[year].map((item, i) => (
                    <MotionListItem
                      key={`timeline-${year}-item-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      viewport={{ once: true }}
                    >
                      <VStack>
                        <Link href={item.title.href}>
                          <Tooltip
                            label={item.title.description}
                            aria-label={item.title.description}
                            placement="right-start"
                          >
                            <Text borderBottom={"0.5px dotted grey"}>
                              {item.title.title}
                            </Text>
                          </Tooltip>
                        </Link>
                        <Paragraph>{item.subtitle}</Paragraph>
                        <Text fontSize="sm" color={dateRangeColor}>
                          {item.dateRange}
                        </Text>
                      </VStack>
                    </MotionListItem>
                  ))}
                </List>
              </VStack>
            </Box>
          )
        })}
    </SlideFade>
  )
}

export default Timeline
