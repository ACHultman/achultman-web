import {
  Heading,
  SlideFade,
  List,
  ListItem,
  ListIcon,
  Box,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { MdCheckCircle } from "react-icons/md";

export const MotionHeading = motion(Heading);
export const MotionListItem = motion(ListItem);

const timeline = {
  "2019": [
    {
      icon: MdCheckCircle,
      text: "Created a new website for a local business",
    },
  ],

  "2018": [
    {
      icon: MdCheckCircle,
      text: "Started the Software Engineering program specialization at the University of Victoria",
    },
  ],
  "2017": [
    {
      icon: MdCheckCircle,
      text: "Started my degree in Engineering at the University of Victoria",
    },
    {
      icon: MdCheckCircle,
      text: "Formally introduced to the world of programming",
    },
  ],
};

const Timeline = () => {
  return (
    <SlideFade in={true} offsetY={80} delay={0.2}>
      <Heading
        as="h1"
        fontSize={{ base: "24px", md: "30px", lg: "36px" }}
        mb={3}
      >
        Timeline
      </Heading>
      {Object.keys(timeline).map((year) => {
        return (
          <Box key={year}>
            <MotionHeading
              mt={10}
              mb={5}
              as="h2"
              size="md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {year}
            </MotionHeading>
            <List spacing={18} fontSize="18">
              {timeline[year].map((item, i) => (
                <MotionListItem
                  key={`timeline-${year}-item-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <ListIcon as={item.icon} color="green.500" />
                  {item.text}
                </MotionListItem>
              ))}
            </List>
          </Box>
        );
      })}
    </SlideFade>
  );
};

export default Timeline;
