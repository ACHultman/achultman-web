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
import { ORG_MAP } from "../../constants"

export const MotionHeading = motion(Heading)
export const MotionListItem = motion(ListItem)

const TIMELINE: Record<string, TimelineItem[]> = {
  Present: [
    {
      icon: MdCheckCircle,
      org: ORG_MAP.asm,
      subtitle: "Software Developer",
      dateRange: "October 2022 - Present",
    },
  ],
  "2022": [
    {
      icon: MdCheckCircle,
      org: ORG_MAP.uvic,
      subtitle: "Completed Software Engineering (B.S.Eng.) degree",
      dateRange: "August 2022",
    },
    {
      icon: MdCheckCircle,
      org: ORG_MAP.asm,
      subtitle: "Software Developer - Part-time",
      dateRange: "May 2022 - August 2022",
    },
  ],

  "2021": [
    {
      icon: MdCheckCircle,
      org: ORG_MAP.asm,
      subtitle: "Full-stack Software Developer Co-op",
      dateRange: "September 2021 - December 2021",
    },
    {
      icon: MdCheckCircle,
      org: ORG_MAP.se,
      subtitle: "Software Designer - Co-op",
      dateRange: "January 2021 - September 2021",
    },
  ],

  "2019": [
    {
      icon: MdCheckCircle,
      org: ORG_MAP.itc,
      subtitle: "Full-stack Software Developer - Co-op",
      dateRange: "May 2019 - December 2019",
    },
  ],

  "2018": [
    {
      icon: MdCheckCircle,
      org: ORG_MAP.uvic,
      subtitle: "Began Software Engineering (B.S.Eng.) degree",
      dateRange: "September 2018",
    },
  ],

  "2017": [
    {
      icon: MdCheckCircle,
      org: ORG_MAP.uvic,
      subtitle: "Began Bachelor of Engineering degree",
      dateRange: "September 2017",
    },
  ],
}

const Timeline = () => {
  const dateRangeColor = useColorModeValue("gray.600", "gray.400")
  return (
    <SlideFade in={true} offsetY={80} delay={0.2}>
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
                        <Link
                          href={item.org.href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Tooltip
                            label={item.org.description}
                            aria-label={item.org.description}
                            placement="right-start"
                          >
                            <Text
                              borderBottom={`0.5px dotted ${item.org.color}`}
                            >
                              {item.org.title}
                            </Text>
                          </Tooltip>
                        </Link>
                        <Paragraph textAlign={"center"}>
                          {item.subtitle}
                        </Paragraph>
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
