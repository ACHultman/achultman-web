import { Box, Divider, Flex, useBreakpointValue } from "@chakra-ui/react";

import Hero from "./Hero";
import Timeline from "./Timeline";
import GitTimeline from "./GitTimeline";
import Chat from "./Chat";

const Home = () => {
  const bgMarginLeftPx = useBreakpointValue({ base: 0, lg: "580px" });

  return (
    <>
      <Hero />
      <Divider my={10} />
      <Chat />
      <Divider my={10} />
      {/* use GitTimeline as the background of Timeline */}
      <Flex justifyContent={"center"}>
        <Box
          position="absolute"
          alignSelf={"center"}
          marginLeft={bgMarginLeftPx}
          zIndex="-1"
          opacity="0.05"
          overflow="hidden"
        >
          <GitTimeline />
        </Box>
        <Timeline />
      </Flex>
    </>
  );
};

export default Home;
