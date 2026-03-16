import { Box } from "@saleor/macaw-ui-next";
import React from "react";
import { UserInfo } from "../Sidebar/user";
import { topBarHeight } from "./consts";

export const GlobalTopBar = () => {
  return (
    <Box
      __height={topBarHeight}
      display="flex"
      alignItems="center"
      justifyContent="flex-end"
      paddingX={6}
      borderBottomWidth={1}
      borderBottomStyle="solid"
      borderColor="default1"
      backgroundColor="default1"
      position="sticky"
      top={0}
      zIndex="2"
    >
      <UserInfo variant="horizontal" />
    </Box>
  );
};
