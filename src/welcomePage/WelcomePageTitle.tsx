import { useUser } from "@dashboard/auth/useUser";
import { getUserName } from "@dashboard/misc";
import { Box, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

export const WelcomePageTitle = () => {
  const { user } = useUser();
  const userName = getUserName(user, true);

  // Get current date formatted
  const currentDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <Text as="h1" size={9} fontWeight="bold" data-test-id="home-header">
        <FormattedMessage
          defaultMessage="Welcome back, {userName} 👋"
          id="x8b1T+"
          values={{
            userName,
          }}
        />
      </Text>
      <Text size={4} color="default2">
        <FormattedMessage
          defaultMessage="Here is what's happening in your store today, {date}"
          id="2wV9D0"
          values={{
            date: currentDate,
          }}
        />
      </Text>
    </Box>
  );
};
