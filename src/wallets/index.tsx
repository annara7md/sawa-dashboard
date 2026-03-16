import { Route } from "@dashboard/components/Router";
import { sectionNames } from "@dashboard/intl";
import { parseQs } from "@dashboard/url-utils";
import { asSortParams } from "@dashboard/utils/sort";
import { useIntl } from "react-intl";
import { type RouteComponentProps, Switch } from "react-router-dom";

import { WindowTitle } from "../components/WindowTitle";
import {
  walletListPath,
  type WalletListUrlQueryParams,
  WalletListUrlSortField,
  walletPath,
  walletTopUpRequestListPath,
  type WalletTopUpRequestListUrlQueryParams,
  WalletTopUpRequestListUrlSortField,
  walletTopUpRequestPath,
  type WalletTopUpRequestUrlQueryParams,
  type WalletUrlQueryParams,
} from "./urls";
import WalletDetailsViewComponent from "./views/WalletDetails";
import WalletListViewComponent from "./views/WalletList";
import WalletTopUpRequestListViewComponent from "./views/WalletTopUpRequestList";

export const parseWalletListSortParams = (qs: Record<string, string>) => {
  try {
    return asSortParams(
      qs,
      WalletListUrlSortField,
      WalletListUrlSortField.createdAt,
      false,
    );
  } catch {
    const { sort: _sort, asc: _asc, ...rest } = qs;

    return asSortParams(
      rest,
      WalletListUrlSortField,
      WalletListUrlSortField.createdAt,
      false,
    );
  }
};

export const parseWalletTopUpRequestListSortParams = (qs: Record<string, string>) => {
  try {
    return asSortParams(
      qs,
      WalletTopUpRequestListUrlSortField,
      WalletTopUpRequestListUrlSortField.createdAt,
      false,
    );
  } catch {
    const { sort: _sort, asc: _asc, ...rest } = qs;

    return asSortParams(
      rest,
      WalletTopUpRequestListUrlSortField,
      WalletTopUpRequestListUrlSortField.createdAt,
      false,
    );
  }
};

const WalletListView = () => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: WalletListUrlQueryParams = parseWalletListSortParams(qs);

  return <WalletListViewComponent params={params} />;
};

interface WalletDetailsRouteParams {
  id: string;
}

const WalletDetailsView = ({
  location,
  match,
}: RouteComponentProps<WalletDetailsRouteParams>) => {
  const qs = parseQs(location.search.substr(1));
  const params: WalletUrlQueryParams = qs;

  return <WalletDetailsViewComponent id={decodeURIComponent(match.params.id)} params={params} />;
};

const WalletTopUpRequestListView = () => {
  const qs = parseQs(location.search.substr(1)) as any;
  const params: WalletTopUpRequestListUrlQueryParams = parseWalletTopUpRequestListSortParams(qs);

  return <WalletTopUpRequestListViewComponent params={params} />;
};

interface WalletTopUpRequestDetailsRouteParams {
  id: string;
}

const WalletTopUpRequestDetailsView = ({
  location,
  match,
}: RouteComponentProps<WalletTopUpRequestDetailsRouteParams>) => {
  const qs = parseQs(location.search.substr(1));
  const params: WalletTopUpRequestUrlQueryParams = qs;

  return (
    <div>
      <h1>Top-Up Request Details: {decodeURIComponent(match.params.id)}</h1>
      <p>Params: {JSON.stringify(params)}</p>
    </div>
  );
};

export const WalletSection = () => {
  const intl = useIntl();

  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.wallets)} />
      <Switch>
        <Route exact path={walletListPath} component={WalletListView} />
        <Route exact path={walletTopUpRequestListPath} component={WalletTopUpRequestListView} />
        <Route path={walletTopUpRequestPath(":id")} component={WalletTopUpRequestDetailsView} />
        <Route path={walletPath(":id")} component={WalletDetailsView} />
      </Switch>
    </>
  );
};
