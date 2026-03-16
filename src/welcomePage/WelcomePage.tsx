import { useUser } from "@dashboard/auth/useUser";
import useAppChannel from "@dashboard/components/AppLayout/AppChannelContext";
import { hasPermissions } from "@dashboard/components/RequirePermissions";
import { PermissionEnum } from "@dashboard/graphql";
import { Box } from "@saleor/macaw-ui-next";

import { WelcomePageOnboarding } from "./WelcomePageOnboarding";
import { WelcomePageSidebar } from "./WelcomePageSidebar";
import { WelcomePageTilesContainer } from "./WelcomePageTilesContainer";
// Force TS cache refresh
import { WelcomePageStatCards } from "./WelcomePageStatCards";
import { WelcomePageTitle } from "./WelcomePageTitle";

// Main Welcome Page Component

export const WelcomePage = () => {
  const { channel, setChannel } = useAppChannel(false);
  const { user } = useUser();
  const channels = user?.accessibleChannels ?? [];
  const userPermissions = user?.userPermissions || [];
  const hasPermissionToManageOrders = hasPermissions(userPermissions, [
    PermissionEnum.MANAGE_ORDERS,
  ]);

  return (
    <Box
      display="grid"
      gap={7}
      gridTemplateColumns={{
        mobile: 1,
        tablet: 1,
        desktop: 3,
      }}
      paddingX={8}
      paddingY={6}
      paddingTop={9}
    >
      <Box __gridColumn="1/-1">
        <WelcomePageTitle />
      </Box>
      <Box
        __gridColumn={{
          mobile: "1/-1",
          desktop: "1/3",
        }}
        display="flex"
        flexDirection="column"
        gap={6}
      >
        <WelcomePageStatCards 
          channel={channel} 
          hasPermissionToManageOrders={hasPermissionToManageOrders} 
        />
        <WelcomePageOnboarding />
        <WelcomePageTilesContainer />
      </Box>
      <Box __gridColumn={{ mobile: "1/-1", desktop: "3/4" }}>
        <WelcomePageSidebar
          channel={channel}
          setChannel={setChannel}
          channels={channels}
          hasPermissionToManageOrders={hasPermissionToManageOrders}
        />
      </Box>
    </Box>
  );
};

