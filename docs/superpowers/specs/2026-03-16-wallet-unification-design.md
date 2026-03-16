# Wallet Unification Design

## Summary

This spec unifies wallet behavior and presentation across the dashboard. Wallet list pages, wallet detail pages, and the wallet section inside customer details should follow the same interaction model and visual language already used by the customer area.

The target outcome is a wallet experience that feels native to the existing dashboard instead of a separate subsystem. It also closes the current data gap by creating a wallet automatically for each newly created user, with an initial balance of `0`.

## Goals

- Make wallet overview and wallet details visually consistent with the rest of the dashboard, especially customer pages.
- Use one shared set of wallet actions across wallet list, wallet details, and the wallet section inside customer details.
- Show wallet actions only when a single wallet is selected or when one wallet is being viewed.
- Automatically create a single wallet with zero balance for each newly created user.
- Keep wallet behavior stable for older users who may still not have wallets.

## Non-goals

- No automatic wallet creation for existing users.
- No multi-wallet bulk actions.
- No default credit amount during user creation.
- No broader redesign of unrelated customer or order pages.

## Current Problems

- Wallet pages use a lighter custom structure and do not match the dashboard detail/list patterns used by customer pages.
- Wallet actions are incomplete and inconsistent between wallet list, wallet details, and customer wallet sections.
- Wallet details recently needed compatibility fixes and still need visual normalization.
- Newly created users do not reliably start with a wallet, which forces manual recovery flows later.
- Customer wallet UI is not aligned with the dedicated wallet area.

## Product Decisions

### Wallet creation policy

- Create one wallet automatically for every newly created user.
- Initial balance is always `0`.
- Wallet creation must be idempotent to prevent duplicates on retries or repeated hooks.

### Shared wallet action set

These actions are the canonical wallet actions:

- `Add credit`
- `Manual adjustment`
- `Refund`
- `Activate / Deactivate`

Rules:

- Actions appear only when one wallet is selected in a list.
- The same action labels and ordering are used in wallet list, wallet details, and customer wallet sections.
- Actions should reuse the same dialogs, mutation handlers, validation, and permission checks.

## UX Design

### Wallet List

- Keep the standard dashboard list shell: `TopNav`, presets, filters, datagrid, pagination.
- Remove any expectation that wallets are created manually from this page.
- Do not show a `Create wallet` primary action.
- Add a wallet action group in the list filter/action area that becomes visible only when exactly one wallet is selected.
- Keep the datagrid as the primary list surface.

Expected action behavior:

- Zero selected wallets: no wallet action group.
- One selected wallet: show the shared wallet actions.
- More than one selected wallet: actions stay hidden or disabled, with single-selection behavior enforced.

### Wallet Details

- Rebuild the page to follow the standard detail-page composition used by customer details:
  - standard `TopNav`
  - standard content area
  - clear main column and sidebar split
  - standard save/action surface
- Use the main column for balance, entries, and events.
- Use the sidebar for wallet metadata and owner information.
- Surface the same shared wallet action group at the top of the details experience.
- Keep visual rhythm, spacing, card usage, and headings aligned with existing dashboard pages rather than custom wallet-specific styling.

### Customer Details Wallet Section

- Make the customer wallet section match the dedicated wallet feature in tone and interaction.
- Reuse the same action group and action ordering.
- Reuse the same dialogs and backend handlers.
- If the customer already has a wallet, render it with the same mental model as wallet details summary content.
- If the customer has no wallet, show a safe empty state instead of failing. This supports older users created before the new automatic wallet creation policy.

## Architecture

### Frontend

Create a shared wallet action layer consumed by all wallet entry points:

- wallet overview selection actions
- wallet details page actions
- customer wallet section actions

This shared layer should provide:

- action availability rules
- action labels
- dialog open/close flow
- mutation execution
- success/error handling

This avoids page-specific wallet behavior drifting over time.

Likely frontend touchpoints:

- wallet list page shell
- wallet details page shell
- customer wallet section
- shared wallet dialogs and mutations

### Backend

Wallet creation for new users should happen in the user creation flow or a single post-create hook that is guaranteed to run exactly once from the system’s perspective.

Requirements:

- one wallet per new user
- zero initial balance
- duplicate protection if the flow retries
- no behavioral change for existing users

The backend should remain the source of truth for wallet state transitions used by:

- add credit
- manual adjustment
- refund
- activate/deactivate

## Error Handling

- Missing wallet on an older customer page should render an empty state, not a crash.
- Automatic wallet creation failures during new-user creation should be explicit and observable.
- Shared wallet dialogs should handle backend mutation errors consistently regardless of where they were opened from.
- Single-selection action logic should prevent ambiguous UI states.

## Testing Strategy

### Frontend tests

- Wallet list page shows wallet actions only for one selected wallet.
- Wallet details page uses the shared action group.
- Customer wallet section uses the same actions and labels.
- Wallet detail layout uses supported Macaw props and valid table structure.
- No unsupported Macaw token regressions in wallet-specific components.

### Backend tests

- New user creation creates exactly one wallet.
- Repeated invocation does not create duplicate wallets.
- New wallet starts with `0` balance.
- Existing users are not backfilled automatically.

### Integration checks

- Create a new user and confirm wallet presence in customer details.
- Open wallet list, select one wallet, confirm shared actions appear.
- Open wallet details for the same wallet and confirm the same action set appears.
- Open customer details for the same user and confirm the wallet section matches.

## Risks

- Wallet UI may still drift if actions are only visually unified but not driven by shared logic.
- Automatic wallet creation can introduce duplicate-wallet bugs if it is attached to multiple creation paths without idempotency.
- Customer pages may expose historical data inconsistencies from older users who have no wallet.

## Recommended Implementation Order

1. Add backend automatic wallet creation for new users with tests.
2. Introduce shared wallet action primitives and dialogs.
3. Update wallet list page to show the shared single-selection action group.
4. Refactor wallet details page onto the standard dashboard detail-page structure.
5. Align customer wallet section with the shared wallet experience.
6. Run targeted regression tests for wallet list, wallet details, and customer wallet flows.

## Acceptance Criteria

- New users always receive exactly one wallet with balance `0`.
- Wallet list, wallet details, and customer wallet section expose the same wallet action set.
- Wallet actions are available only for one wallet at a time.
- Wallet detail visuals follow the same dashboard style conventions as customer details.
- Customer wallet presentation matches the dedicated wallet experience.
- No known wallet-page runtime crashes remain in the supported flow.
