import { useUser } from "@dashboard/auth/useUser";
import { staffMemberDetailsUrl } from "@dashboard/staff/urls";
import { useTheme } from "@dashboard/theme";
import { useTheme as useLegacyTheme } from "@saleor/macaw-ui";
import { Box, Button, Dropdown, List, sprinkles, Text } from "@saleor/macaw-ui-next";
import { EllipsisVertical } from "lucide-react";
import { MoonIconFlat } from "@dashboard/icons/MoonIconFlat";
import { SunIconFlat } from "@dashboard/icons/SunIconFlat";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Link } from "react-router-dom";

import { FeatureFlagsModal } from "./FeatureFlagsModal";
import { ThemeSwitcher } from "./ThemeSwitcher";

export const useLegacyThemeHandler = () => {
  const { theme, setTheme } = useTheme();
  const { setTheme: setLegacyTheme } = useLegacyTheme();
  const changeTheme = () => {
    setLegacyTheme(theme === "defaultLight" ? "dark" : "light");
    setTheme(theme === "defaultLight" ? "defaultDark" : "defaultLight");
  };
  const handleStorage = (event: StorageEvent) => {
    if (!["macaw-ui-theme", "activeMacawUITheme"].includes(event.key || "")) {
      return;
    }

    const isDark = event.newValue?.toLowerCase().includes("dark");

    setLegacyTheme(isDark ? "dark" : "light");
    setTheme(isDark ? "defaultDark" : "defaultLight");
  };

  useEffect(() => {
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return { changeTheme, theme };
};

export const UserControls = ({ 
  variant = "vertical",
  userOnly = false,
  menuOnly = false 
}: { 
  variant?: "vertical" | "horizontal";
  userOnly?: boolean;
  menuOnly?: boolean;
}) => {
  const { user, logout } = useUser();
  const { changeTheme, theme } = useLegacyThemeHandler();
  const [open, setOpen] = useState(false);
  const [flagsModalOpen, setFlagsModalOpen] = useState(false);

  if (userOnly) {
    return (
      <Button
        variant="tertiary"
        icon={theme === "defaultLight" ? <MoonIconFlat size={20} /> : <SunIconFlat size={20} />}
        onClick={changeTheme}
        size="medium"
        data-test-id="theme-switch"
      />
    );
  }

  const menuContent = (
    <Box __minWidth={192}>
      <List
        padding={2}
        borderRadius={4}
        boxShadow="defaultOverlay"
        backgroundColor="default1"
      >
        <Dropdown.Item>
          <List.Item
            borderRadius={4}
            data-test-id="account-settings-button"
            onClick={() => setOpen(false)}
          >
            <Link
              to={staffMemberDetailsUrl(user?.id || "")}
              className={sprinkles({
                display: "block",
                width: "100%",
                ...listItemStyles,
              })}
            >
              <Text>
                <FormattedMessage id="NQgbYA" defaultMessage="Account Settings" />
              </Text>
            </Link>
          </List.Item>
        </Dropdown.Item>
        <Dropdown.Item>
          <List.Item {...listItemStyles} onClick={() => setFlagsModalOpen(true)}>
            <Text>
              <FormattedMessage
                id="38dc43"
                defaultMessage="Features preview"
                description="Features preview"
              />
            </Text>
          </List.Item>
        </Dropdown.Item>
        <Dropdown.Item>
          <List.Item onClick={logout} {...listItemStyles} data-test-id="log-out-button">
            <Text>
              <FormattedMessage id="qLbse5" defaultMessage="Log out" description="button" />
            </Text>
          </List.Item>
        </Dropdown.Item>
        <Dropdown.Item>
          <List.Item
            display="flex"
            alignItems="center"
            __lineHeight={0}
            gap={1.5}
            marginTop={1}
            onClick={() => {
              changeTheme();
              setOpen(false);
            }}
            {...listItemStyles}
            data-test-id="theme-switch"
          >
            <ThemeSwitcher theme={theme} />
          </List.Item>
        </Dropdown.Item>
      </List>
      <FeatureFlagsModal open={flagsModalOpen} onChange={setFlagsModalOpen} />
    </Box>
  );

  if (menuOnly) {
    return (
      <Dropdown.Content align="end">
        {menuContent}
      </Dropdown.Content>
    );
  }

  return (
    <Box display="flex" alignItems="center" gap={2}>
      <Dropdown
        open={open}
        onOpenChange={value => {
          setOpen(value);
        }}
      >
        <Dropdown.Trigger>
          <Button
            variant="tertiary"
            icon={<EllipsisVertical />}
            data-test-id="userMenu"
            size="medium"
            onClick={() => setOpen(true)}
          />
        </Dropdown.Trigger>
        <Dropdown.Content align="end">
          {menuContent}
        </Dropdown.Content>
      </Dropdown>
    </Box>
  );
};

const listItemStyles = {
  paddingX: 1.5,
  paddingY: 2,
  borderRadius: 4,
} as const;
