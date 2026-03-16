import { useAnalytics } from "@dashboard/components/ProductAnalytics/useAnalytics";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { getTilesData } from "./tileData";
import { WelcomePageInfoTile } from "./WelcomePageInfoTile";

export const WelcomePageTilesContainer = () => {
  const intl = useIntl();
  const analytics = useAnalytics();

  const handleTileButtonClick = (tileId: string) => {
    analytics.trackEvent("home_tile_click", {
      tile_id: tileId,
    });
  };

  const tiles = getTilesData({ intl, onTileButtonClick: handleTileButtonClick });

  return (
    <Box>
      <Text size={5} fontWeight="bold" paddingBottom={4}>
        {intl.formatMessage({
          defaultMessage: "Quick Actions",
          id: "Wk1B7A" 
        })}
      </Text>
      <Box
        display="grid"
        __gridTemplateColumns="repeat(auto-fill, minmax(min(100%, 280px), 1fr))"
        gap={4}
        marginTop={2}
      >
        {tiles.map(tile => (
          <WelcomePageInfoTile key={tile.id} {...tile} />
        ))}
      </Box>
    </Box>
  );
};
