import { Avatar, vars } from "@saleor/macaw-ui-next";
import type * as React from "react";

interface UserAvatarProps {
  url?: string;
  initials?: string;
  className?: string;
  style?: React.CSSProperties;
  scheme?: "accent1" | "transparent";
  size?: "small" | "medium" | "large";
}

export const UserAvatar = ({
  url,
  initials,
  scheme = "accent1",
  size,
  style,
  ...rest
}: UserAvatarProps) => {
  const defaultStyle: React.CSSProperties = {
    backgroundColor: vars.colors.background.default2,
    color: vars.colors.text.default1,
    border: `1.5px solid ${vars.colors.border.default1}`,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  };
  const mergedStyle = { ...defaultStyle, ...style };

  return url ? (
    <Avatar.User scheme={scheme} src={url} size={size} style={mergedStyle} {...rest} />
  ) : (
    <Avatar.User scheme={scheme} initials={initials} size={size} style={mergedStyle} {...rest} />
  );
};
