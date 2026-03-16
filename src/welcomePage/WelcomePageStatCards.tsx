import { useWelcomePageAnalyticsQuery, useWelcomePageNotificationsQuery } from "@dashboard/graphql";
import { type ChannelFragment } from "@dashboard/graphql";
import { Box, Text, Skeleton } from "@saleor/macaw-ui-next";
import { DashboardCard } from "@dashboard/components/Card";
import { FormattedMessage } from "react-intl";
import { ShoppingBag, DollarSign, AlertCircle, Users } from "lucide-react";
import Money from "@dashboard/components/Money";

interface WelcomePageStatCardsProps {
  channel: ChannelFragment | undefined;
  hasPermissionToManageOrders: boolean;
}

export const WelcomePageStatCards = ({
  channel,
  hasPermissionToManageOrders,
}: WelcomePageStatCardsProps) => {
  const hasNoChannels = !channel && typeof channel !== "undefined";

  const {
    data: analyticsData,
    loading: analyticsLoading,
    error: analyticsError,
  } = useWelcomePageAnalyticsQuery({
    skip: hasNoChannels,
    variables: {
      channel: channel?.slug ?? "",
      hasPermissionToManageOrders,
    },
  });

  const {
    data: notificationsData,
    loading: notificationsLoading,
    error: notificationsError,
  } = useWelcomePageNotificationsQuery({
    skip: hasNoChannels,
    variables: { channel: channel?.slug },
  });

  const salesToday = analyticsData?.salesToday?.gross ?? null;
  const productsOutOfStock = notificationsData?.productsOutOfStock?.totalCount ?? 0;

  return (
    <Box
      display="grid"
      gap={4}
      gridTemplateColumns={{
        mobile: 1,
        tablet: 2,
        desktop: 2,
      }}
    >
      <StatCard
        title={<FormattedMessage defaultMessage="Today's Sales" id="VfB1o5" />}
        icon={<DollarSign size={24} color="#10B981" />}
        loading={analyticsLoading}
        error={!!analyticsError || hasNoChannels}
        value={salesToday ? <Money money={salesToday} /> : "0"}
      />
      <StatCard
        title={<FormattedMessage defaultMessage="Total Orders" id="9D3M6C" />}
        icon={<ShoppingBag size={24} color="#3B82F6" />}
        loading={analyticsLoading}
        error={!!analyticsError || hasNoChannels}
        value="0" // Placeholder until we have an orders total count query
      />
      <StatCard
        title={<FormattedMessage defaultMessage="Out of Stock" id="5U+Z50" />}
        icon={<AlertCircle size={24} color="#EF4444" />}
        loading={notificationsLoading}
        error={!!notificationsError || hasNoChannels}
        value={productsOutOfStock}
      />
      <StatCard
        title={<FormattedMessage defaultMessage="New Customers" id="XkI1Gq" />}
        icon={<Users size={24} color="#8B5CF6" />}
        loading={false}
        error={false}
        value="0" // Placeholder
      />
    </Box>
  );
};

const StatCard = ({
  title,
  icon,
  value,
  loading,
  error,
}: {
  title: React.ReactNode;
  icon: React.ReactNode;
  value: React.ReactNode;
  loading: boolean;
  error: boolean;
}) => {
  return (
    <DashboardCard
      padding={4}
      borderRadius={3}
      borderWidth={1}
      borderStyle="solid"
      borderColor="default1"
      backgroundColor="default1"
      display="flex"
      flexDirection="column"
      gap={3}
      __boxShadow="0 1px 3px rgba(0,0,0,0.08)"
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text size={3} color="default2" fontWeight="medium">
          {title}
        </Text>
        <Box
          padding={2}
          borderRadius="100%"
          backgroundColor="default2"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {icon}
        </Box>
      </Box>
      <Box>
        <Text size={7} fontWeight="bold">
          {error ? (
            "0"
          ) : loading ? (
            <Skeleton width={16} />
          ) : (
            value
          )}
        </Text>
      </Box>
    </DashboardCard>
  );
};

