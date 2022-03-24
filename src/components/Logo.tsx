import { useRouter } from "next/router";

import { Box, useColorMode } from "@chakra-ui/react";

const Logo = () => {
  const { colorMode } = useColorMode();
  const router = useRouter();

  return (
    <Box className="logo" onClick={() => router.push("/")}>
      <svg
        version="1.1"
        id="Layer_1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 149.1 81.3"
        style={{ overflow: "visible" }}
        fill={`${colorMode === "light" ? "black" : "#38a169"}`}
        width="25"
      >
        <g
          id="Layer_2_00000023258449590368716040000013073676356458985912_"
          transform="translate(75 30)"
        >
          <g id="Layer_1-2">
            <g id="SvgjsG14118">
              <path
                d="M82.6,28.8c-1.7-0.1-3.4-0.1-5,0C64.7,21,54,10,46.6-3.1c-7.8-13.1-12-28-12.2-43.2
				c14.2-19.1,10.3-46.1-8.6-60.4s-45.8-10.4-59.9,8.6c-11.3,15.1-11.4,35.9-0.4,51.2c-0.1,15.5-4.4,30.7-12.2,44
				c-7.4,13.1-18,24.1-30.9,31.9c-1.6-0.1-3.2-0.1-4.7,0c-23.6-0.2-42.9,19-43.1,42.8s18.9,43.2,42.5,43.4
				c16.9,0.1,32.3-9.8,39.3-25.4c13.2-7.6,28.2-11.5,43.5-11.4c15.3-0.2,30.4,3.7,43.7,11.2c9.7,21.7,35,31.4,56.6,21.7
				c21.6-9.8,31.2-35.3,21.5-57c-7-15.6-22.4-25.6-39.4-25.5L82.6,28.8z M-43.3,54c-1.2-2.7-2.6-5.2-4.4-7.6
				c1-31.2,17.8-59.6,44.6-75.3h6.6C16.9-21.2,28-9.9,35.7,3.6c7.7,13.1,11.9,28.1,12.2,43.3c-1.6,2.2-2.9,4.6-4.1,7.1
				C30.6,61.6,15.6,65.5,0.4,65.4C-15,65.5-30.1,61.6-43.3,54L-43.3,54z"
              />
            </g>
          </g>
        </g>
      </svg>

      {/* <svg
        version="1.1"
        fill={`${colorMode === "light" ? "black" : "#38a169"}`}
        x="0px"
        y="0px"
        width="30"
        viewBox="0 0 149.1 81.3"
        style={{ overflow: "visible" }}
      >
        <defs></defs>
        <g>
          <polygon points="94.9,0 78.6,24.4 116.6,81.3 149.1,81.3 	" />
          <polygon points="38,24.4 33.9,30.5 0,81.3 67.8,81.3 75.9,81.3 108.5,81.3 54.2,0 	" />
        </g>
      </svg> */}
    </Box>
  );
};

export default Logo;
