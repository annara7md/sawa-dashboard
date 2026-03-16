import { Button, Paragraph, sprinkles } from "@saleor/macaw-ui-next";
import { PlusCircle, ClipboardList, Users, Settings } from "lucide-react";
import { FormattedMessage, type IntlShape } from "react-intl";

import { type WelcomePageInfoTileProps } from "./WelcomePageInfoTile";

const noShrink = sprinkles({ flexShrink: "0" });

export const getTilesData = ({
  onTileButtonClick,
}: {
  intl: IntlShape;
  onTileButtonClick: (tileId: string) => void;
}): WelcomePageInfoTileProps[] => [
  {
    id: "add-product",
    header: (
      <>
        <PlusCircle className={noShrink} />
        <FormattedMessage defaultMessage="Add New Product" id="K1eN0G" />
      </>
    ),
    content: (
      <Paragraph>
        <FormattedMessage
          defaultMessage="Expand your catalog by adding a new product to your store."
          id="Xb1v2R"
        />
      </Paragraph>
    ),
    bottomActions: (
      <Button
        as="a"
        href="/products/add"
        onClick={() => onTileButtonClick("add-product")}
        variant="primary"
        alignSelf="start"
      >
        <FormattedMessage
          defaultMessage="Add Product"
          id="zJ/8T0"
          description="cta button label"
        />
      </Button>
    ),
  },
  {
    id: "view-orders",
    header: (
      <>
        <ClipboardList className={noShrink} />
        <FormattedMessage defaultMessage="Manage Orders" id="2C8VnK" />
      </>
    ),
    content: (
      <Paragraph>
        <FormattedMessage
          defaultMessage="Review and process your pending orders and fulfillments."
          id="mK9v8P"
        />
      </Paragraph>
    ),
    bottomActions: (
      <Button
        as="a"
        href="/orders"
        onClick={() => onTileButtonClick("view-orders")}
        variant="secondary"
        alignSelf="start"
      >
        <FormattedMessage
          defaultMessage="View Orders"
          id="bN7V0K"
          description="cta button label"
        />
      </Button>
    ),
  },
  {
    id: "manage-customers",
    header: (
      <>
        <Users className={noShrink} />
        <FormattedMessage defaultMessage="Customers" id="tV5H8K" />
      </>
    ),
    content: (
      <Paragraph>
        <FormattedMessage
          defaultMessage="View customer details, order history, and manage accounts."
          id="hB2M9L"
        />
      </Paragraph>
    ),
    bottomActions: (
      <Button
        as="a"
        href="/customers"
        variant="secondary"
        alignSelf="start"
        onClick={() => onTileButtonClick("manage-customers")}
      >
        <FormattedMessage
          defaultMessage="Manage Customers"
          id="pC3X9K"
          description="cta button label"
        />
      </Button>
    ),
  },
  {
    id: "site-settings",
    header: (
      <>
        <Settings className={noShrink} />
        <FormattedMessage defaultMessage="Store Settings" id="sK9H2M" />
      </>
    ),
    content: (
      <Paragraph>
        <FormattedMessage
          defaultMessage="Configure shipping, taxes, payments, and other store settings."
          id="nH7L4P"
        />
      </Paragraph>
    ),
    bottomActions: (
      <Button
        as="a"
        href="/site-settings"
        variant="secondary"
        alignSelf="start"
        onClick={() => onTileButtonClick("site-settings")}
      >
        <FormattedMessage
          defaultMessage="Go to Settings"
          id="mL8B3K"
          description="cta button label"
        />
      </Button>
    ),
  },
];
