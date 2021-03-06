import { Divider } from "@chakra-ui/react";

import Hero from "./Hero";
import Timeline from "./Timeline";
import Tools from "./Tools";

const Home = () => (
  <>
    <Hero />
    <Divider my={10} />
    <Tools />
    <Divider my={10} />
    <Timeline />
  </>
);

export default Home;
