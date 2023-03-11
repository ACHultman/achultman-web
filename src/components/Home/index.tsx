import { Box, Divider, Flex, useBreakpointValue } from "@chakra-ui/react";

import Hero from "./Hero";
import Timeline from "./Timeline";
import GitTimeline from "./GitTimeline";
import Chat from "./Chat";
import { Canvas, useFrame } from "@react-three/fiber";
import { Box3D } from "../Box3D";
import { Html, OrbitControls } from "@react-three/drei";
import { useRef, useState } from "react";

function BoxTest() {
  const [size, set] = useState(0.5);
  const [hidden, setVisible] = useState(false);
  return (
    <mesh scale={size * 10}>
      <boxGeometry />
      <meshStandardMaterial />
      <Html
        style={{
          transition: "all 0.2s",
          opacity: hidden ? 0 : 1,
          transform: `scale(${hidden ? 0.5 : 1})`,
        }}
        distanceFactor={1.5}
        position={[0, 0, 0.51]}
        transform
        occlude
        onOcclude={setVisible}
      >
        <Hero />
      </Html>
    </mesh>
  );
}

const Home = () => {
  const bgMarginLeftPx = useBreakpointValue({ base: 0, lg: "580px" });

  return (
    <>
      {/* <Canvas dpr={[1, 2]} camera={{ fov: 25 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 5]} />
        <pointLight position={[-10, -10, -10]} />
        <BoxTest />
        <OrbitControls />
      </Canvas> */}

      <Hero />

      <Divider my={10} />
      <Chat />
      <Divider my={10} />
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
