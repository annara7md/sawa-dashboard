import { iconSize } from "@dashboard/components/icons";
import { MoonIconFlat } from "@dashboard/icons/MoonIconFlat";
import { SunIconFlat } from "@dashboard/icons/SunIconFlat";
import { type DefaultTheme, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

export const ThemeSwitcher = ({ theme }: { theme: DefaultTheme }): JSX.Element => {
  if (theme === "defaultLight") {
    return (
      <>
        <MoonIconFlat size={iconSize.small} />
        <Text>
          <FormattedMessage id="5ObBlW" defaultMessage="Dark Mode" />
        </Text>
      </>
    );
  }

  return (
    <>
      <SunIconFlat size={iconSize.small} />
      <Text>
        <FormattedMessage id="hVPucN" defaultMessage="Light Mode" />
      </Text>
    </>
  );
};
