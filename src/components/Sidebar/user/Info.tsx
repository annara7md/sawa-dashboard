import { useUser } from "@dashboard/auth/useUser";
import { UserAvatar } from "@dashboard/components/UserAvatar";
import { getUserInitials, getUserName } from "@dashboard/misc";
import { Box, Dropdown, Text } from "@saleor/macaw-ui-next";
import React from "react";

import { UserControls } from "./Controls";

export interface UserInfoProps {
  variant?: "vertical" | "horizontal";
}

export const UserInfo = ({ variant = "vertical" }: UserInfoProps) => {
  const { user } = useUser();

  if (variant === "horizontal") {
    return (
      <Box display="flex" gap={2} alignItems="center">
        <UserControls variant="horizontal" userOnly />
        <Dropdown>
          <Dropdown.Trigger>
            <Box
              display="flex"
              gap={3}
              alignItems="center"
              cursor="pointer"
              as="button"
              borderWidth={0}
              backgroundColor={{ default: "transparent", hover: "default2" }}
              padding={1}
              borderRadius={2}
              transition="ease"
            >
              <UserAvatar initials={getUserInitials(user!)} url={user?.avatar?.url} />
              <Text size={3} fontWeight="bold">
                {getUserName(user!)}
              </Text>
            </Box>
          </Dropdown.Trigger>
          <UserControls variant="horizontal" menuOnly />
        </Dropdown>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      gap={3}
      paddingX={3}
      paddingY={4}
      alignItems="center"
      borderTopWidth={1}
      borderColor="default1"
      borderTopStyle="solid"
      justifyContent="space-between"
    >
      <Box display="flex" gap={3} alignItems="center">
        <UserAvatar initials={getUserInitials(user!)} url={user?.avatar?.url} />
        <Box __width={128} className="ellipsis">
          <Text size={3} fontWeight="bold">
            {getUserName(user!)}
          </Text>
        </Box>
      </Box>
      <UserControls />
    </Box>
  );
};
