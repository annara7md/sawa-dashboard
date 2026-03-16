// @ts-strict-ignore
import { Box, List, sprinkles, Text } from "@saleor/macaw-ui-next";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { MenuItem } from "./Item";
import { type SidebarMenuItem } from "./types";
import { hasActiveDescendant, isCurrentMenuItem } from "./utils";

interface Props {
  menuItem: SidebarMenuItem;
}

export const ItemGroup = ({ menuItem }: Props) => {
  const hasSubmenuActive = hasActiveDescendant(location.pathname, menuItem);
  const isActive = isCurrentMenuItem(location.pathname, menuItem) && !hasSubmenuActive;
  const isDefaultExpanded = isActive || hasSubmenuActive;
  const [isExpanded, setIsExpanded] = useState(isDefaultExpanded);
  const isOpen = isExpanded || isDefaultExpanded;

  const handleMenuGroupClick = () => {
    if (menuItem.onClick) {
      menuItem.onClick();
    }
  };

  return (
    <Box as="li" data-test-id={`menu-list-item`}>
      <List.Item
        as="div"
        paddingX={2}
        paddingRight={1}
        borderRadius={3}
        active={isActive}
        justifyContent="space-between"
        data-test-id={`menu-item-label-${menuItem.id}`}
        position="relative"
      >
        <Box
          display="grid"
          alignItems="center"
          width="100%"
          gap={1}
          style={{ gridTemplateColumns: "minmax(0, 1fr) auto" }}
        >
          <Link
            replace={isActive}
            to={menuItem?.url ?? ""}
            onClick={handleMenuGroupClick}
            className={sprinkles({
              display: "block",
              minWidth: 0,
            })}
          >
            <Box display="flex" alignItems="center" gap={3} paddingY={1.5} borderRadius={3}>
              {menuItem.icon}
              <Text size={3} fontWeight="medium">
                {menuItem.label}
              </Text>
              {menuItem.endAdornment && <Box>{menuItem.endAdornment}</Box>}
            </Box>
          </Link>
          <Box
            as="button"
            type="button"
            aria-controls={`sidebar-group-${menuItem.id}`}
            aria-expanded={isOpen}
            aria-label={`Toggle ${menuItem.label}`}
            data-test-id={`sidebar-group-toggle-${menuItem.id}`}
            borderWidth={0}
            backgroundColor="transparent"
            color="default2"
            padding={1}
            cursor="pointer"
            onClick={() => setIsExpanded(expanded => !expanded)}
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexShrink={0}
          >
            <ChevronDown
              size={18}
              strokeWidth={2.25}
              style={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 150ms ease",
              }}
            />
          </Box>
        </Box>
      </List.Item>
      {isOpen && (
        <Box
          id={`sidebar-group-${menuItem.id}`}
          borderLeftWidth={1}
          borderLeftStyle="solid"
          borderColor="default1"
          paddingLeft={4}
          marginLeft={4}
          display="flex"
          flexDirection="column"
          marginBottom={2}
          marginTop={1}
          gap="px"
        >
          {menuItem.children?.map(child => (
            <MenuItem menuItem={child} key={child.id} />
          ))}
        </Box>
      )}
    </Box>
  );
};
