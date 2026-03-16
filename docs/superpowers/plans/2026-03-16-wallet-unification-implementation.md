# Wallet Unification Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make wallets behave as a first-class dashboard feature by auto-creating a zero-balance wallet for every new user, unifying wallet actions across wallet list, wallet details, and customer details, and aligning wallet UI with existing customer page patterns.

**Architecture:** Backend work adds one idempotent wallet-creation path for new users plus explicit wallet GraphQL mutations for `Add credit` and `Activate/Deactivate`. Frontend work removes wallet mock data, adds one shared wallet action layer, then reuses that layer in wallet overview, wallet details, and the customer wallet section while reshaping wallet details to match standard dashboard layouts.

**Tech Stack:** Django, Saleor GraphQL mutations/tests, React, Apollo, Macaw UI Next, existing dashboard datagrid/layout components, Jest.

---

## File Structure

### Backend files

- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/wallet/utils.py`
  - Add a focused helper for ensuring a default wallet exists for a newly created user.
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/account/mutations/staff/customer_create.py`
  - Trigger default wallet creation for staff-created customers.
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/account/mutations/account/account_register.py`
  - Trigger default wallet creation for self-registered customers.
- Create: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/wallet/mutations/wallet_credit.py`
  - Add explicit `Add credit` GraphQL mutation.
- Create: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/wallet/mutations/wallet_set_active.py`
  - Add explicit wallet activate/deactivate GraphQL mutation.
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/wallet/mutations/__init__.py`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/wallet/schema.py`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/wallet/tests/test_mutations.py`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/wallet/tests/test_utils.py`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/account/tests/mutations/staff/test_customer_create.py`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/account/tests/mutations/account/test_account_register.py`

### Frontend files

- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/mutations.ts`
  - Add Apollo mutations for `Add credit` and wallet status changes.
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/fragments/wallets.ts`
  - Keep wallet fragments aligned with any new fields used by actions.
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/queries.ts`
  - Ensure wallet details and user wallet queries are sufficient for shared actions and customer-wallet rendering.
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/hooks/useWalletDetails.ts`
  - Remove mock-only behavior and rely on real query results.
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/customers/hooks/useCustomerWallets.ts`
  - Remove mock data and use real user-wallet queries.
- Create: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletActionGroup/WalletActionGroup.tsx`
  - Shared action bar used in overview/details/customer pages.
- Create: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletActionGroup/index.ts`
- Create: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/hooks/useWalletActionHandlers.ts`
  - Shared dialogs/mutation orchestration for add credit, adjustment, refund, and activate/deactivate.
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletListPage/WalletListPage.tsx`
  - Show shared single-selection actions in list filter/action area.
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletListDatagrid/WalletListDatagrid.tsx`
  - Enforce single-wallet action assumptions cleanly with selection state wiring.
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/views/WalletList.tsx`
  - Pass selected-wallet action state and handlers into the page.
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/views/WalletDetails.tsx`
  - Replace placeholder console handlers with shared action handlers.
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletDetailsPage/WalletDetailsPage.tsx`
  - Recompose page to follow the customer-detail layout style and show the shared action group.
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/customers/components/CustomerWallets/CustomerWallets.tsx`
  - Replace custom wallet block with shared wallet action and display behavior.
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/customers/components/CustomerDetailsPage/CustomerDetailsPage.tsx`
  - Adjust spacing/placement if the wallet section needs to align with the standardized layout.

### Frontend tests

- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletListPage/WalletListPage.test.tsx`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletDetailsPage/WalletDetailsPage.test.tsx`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletDetailsComponents.test.tsx`
- Create: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/customers/components/CustomerWallets/CustomerWallets.test.tsx`
- Create: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/hooks/useWalletActionHandlers.test.tsx`

## Chunk 1: Backend Wallet Creation For New Users

### Task 1: Add failing utility coverage for default wallet creation

**Files:**

- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/wallet/tests/test_utils.py`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/wallet/utils.py`

- [ ] **Step 1: Write the failing test**

```python
def test_ensure_default_wallet_for_new_user_creates_single_zero_balance_wallet(customer_user):
    wallet = ensure_default_wallet_for_new_user(customer_user, currency="USD")

    assert wallet.user == customer_user
    assert wallet.currency == "USD"
    assert wallet.current_balance_amount == 0
    assert wallet.reserved_balance_amount == 0
    assert wallet.is_active is True
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest saleor/wallet/tests/test_utils.py -k default_wallet -q`
Expected: FAIL because `ensure_default_wallet_for_new_user` does not exist yet.

- [ ] **Step 3: Write minimal implementation**

Implementation target in `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/wallet/utils.py`:

```python
def ensure_default_wallet_for_new_user(user: "User", currency: str) -> Wallet:
    return get_or_create_wallet(user=user, currency=currency)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest saleor/wallet/tests/test_utils.py -k default_wallet -q`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add saleor/wallet/tests/test_utils.py saleor/wallet/utils.py
git commit -m "test: cover default wallet creation helper"
```

### Task 2: Prove helper is idempotent

**Files:**

- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/wallet/tests/test_utils.py`

- [ ] **Step 1: Write the failing test**

```python
def test_ensure_default_wallet_for_new_user_is_idempotent(customer_user):
    first = ensure_default_wallet_for_new_user(customer_user, currency="USD")
    second = ensure_default_wallet_for_new_user(customer_user, currency="USD")

    assert first.pk == second.pk
    assert Wallet.objects.filter(user=customer_user, currency="USD").count() == 1
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest saleor/wallet/tests/test_utils.py -k idempotent -q`
Expected: FAIL until helper is wired to the existing `get_or_create_wallet` path correctly.

- [ ] **Step 3: Adjust implementation only if needed**

Keep the helper as a thin wrapper over `get_or_create_wallet`; do not add duplicate creation logic.

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest saleor/wallet/tests/test_utils.py -k idempotent -q`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add saleor/wallet/tests/test_utils.py saleor/wallet/utils.py
git commit -m "test: verify default wallet creation is idempotent"
```

### Task 3: Auto-create wallet for staff-created customers

**Files:**

- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/account/tests/mutations/staff/test_customer_create.py`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/account/mutations/staff/customer_create.py`

- [ ] **Step 1: Write the failing mutation test**

Add one assertion to an existing successful `customerCreate` test:

```python
wallet = Wallet.objects.get(user=user, currency="USD")
assert wallet.current_balance_amount == 0
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest saleor/graphql/account/tests/mutations/staff/test_customer_create.py -k customer_create -q`
Expected: FAIL with `Wallet.DoesNotExist`.

- [ ] **Step 3: Write minimal implementation**

In `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/account/mutations/staff/customer_create.py`, call the helper immediately after `cls._save(instance)` succeeds and before finishing the save flow:

```python
ensure_default_wallet_for_new_user(instance, currency="USD")
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest saleor/graphql/account/tests/mutations/staff/test_customer_create.py -k customer_create -q`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add saleor/graphql/account/tests/mutations/staff/test_customer_create.py saleor/graphql/account/mutations/staff/customer_create.py saleor/wallet/utils.py
git commit -m "feat: create default wallet on customer create"
```

### Task 4: Auto-create wallet for self-registered accounts

**Files:**

- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/account/tests/mutations/account/test_account_register.py`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/account/mutations/account/account_register.py`

- [ ] **Step 1: Write the failing mutation test**

Add an assertion in a successful `accountRegister` test:

```python
user = User.objects.get(email=email)
wallet = Wallet.objects.get(user=user, currency="USD")
assert wallet.current_balance_amount == 0
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest saleor/graphql/account/tests/mutations/account/test_account_register.py -k account_register -q`
Expected: FAIL with `Wallet.DoesNotExist`.

- [ ] **Step 3: Write minimal implementation**

In `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/account/mutations/account/account_register.py`, invoke the same helper only after the user record has actually been created.

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest saleor/graphql/account/tests/mutations/account/test_account_register.py -k account_register -q`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add saleor/graphql/account/tests/mutations/account/test_account_register.py saleor/graphql/account/mutations/account/account_register.py saleor/wallet/utils.py
git commit -m "feat: create default wallet on account registration"
```

## Chunk 2: Backend Wallet Actions For The Shared UI

### Task 5: Add failing tests for explicit `Add credit` GraphQL mutation

**Files:**

- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/wallet/tests/test_mutations.py`
- Create: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/wallet/mutations/wallet_credit.py`

- [ ] **Step 1: Write the failing test**

Add a mutation test that:

- creates a wallet
- runs `walletCredit(walletId, amount, reason, note)`
- asserts the balance increases and a credit entry exists

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest saleor/graphql/wallet/tests/test_mutations.py -k wallet_credit -q`
Expected: FAIL because the mutation is not in the schema.

- [ ] **Step 3: Write minimal implementation**

Implement the mutation in `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/wallet/mutations/wallet_credit.py` using `credit_wallet`, then export it in:

- `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/wallet/mutations/__init__.py`
- `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/wallet/schema.py`

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest saleor/graphql/wallet/tests/test_mutations.py -k wallet_credit -q`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add saleor/graphql/wallet/tests/test_mutations.py saleor/graphql/wallet/mutations/wallet_credit.py saleor/graphql/wallet/mutations/__init__.py saleor/graphql/wallet/schema.py
git commit -m "feat: add wallet credit mutation"
```

### Task 6: Add failing tests for wallet activate/deactivate mutation

**Files:**

- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/wallet/tests/test_mutations.py`
- Create: `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/wallet/mutations/wallet_set_active.py`

- [ ] **Step 1: Write the failing test**

Add tests for:

- deactivating an active wallet
- activating an inactive wallet

Expected assertions:

```python
assert response_wallet["isActive"] is False
wallet.refresh_from_db()
assert wallet.is_active is False
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest saleor/graphql/wallet/tests/test_mutations.py -k wallet_set_active -q`
Expected: FAIL because no wallet-status mutation exists.

- [ ] **Step 3: Write minimal implementation**

Implement one mutation that toggles `wallet.is_active`, then export it in:

- `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/wallet/mutations/__init__.py`
- `/Users/fahmifareed/Documents/sawa-main/sawa-backend/saleor/graphql/wallet/schema.py`

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest saleor/graphql/wallet/tests/test_mutations.py -k wallet_set_active -q`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add saleor/graphql/wallet/tests/test_mutations.py saleor/graphql/wallet/mutations/wallet_set_active.py saleor/graphql/wallet/mutations/__init__.py saleor/graphql/wallet/schema.py
git commit -m "feat: add wallet activate deactivate mutation"
```

### Task 7: Run focused backend regression set

**Files:**

- No code changes expected

- [ ] **Step 1: Run utility and account coverage**

Run:
`pytest saleor/wallet/tests/test_utils.py saleor/graphql/account/tests/mutations/staff/test_customer_create.py saleor/graphql/account/tests/mutations/account/test_account_register.py -q`

Expected: PASS

- [ ] **Step 2: Run wallet mutation coverage**

Run:
`pytest saleor/graphql/wallet/tests/test_mutations.py -q`

Expected: PASS

- [ ] **Step 3: Commit if any fixture or assertion cleanup was needed**

```bash
git add -A
git commit -m "test: lock wallet creation and wallet action mutations"
```

## Chunk 3: Frontend Data And Shared Wallet Actions

### Task 8: Remove mock wallet details and customer-wallet data with tests first

**Files:**

- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/hooks/useWalletDetails.ts`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/customers/hooks/useCustomerWallets.ts`
- Create: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/customers/components/CustomerWallets/CustomerWallets.test.tsx`

- [ ] **Step 1: Write the failing tests**

Add tests that prove:

- `CustomerWallets` renders a safe empty state when the query returns no wallets
- `CustomerWallets` does not render the old `Create First Wallet` CTA
- wallet details hook uses query output rather than local fixtures

- [ ] **Step 2: Run test to verify it fails**

Run:
`pnpm exec jest src/customers/components/CustomerWallets/CustomerWallets.test.tsx src/wallets/components/WalletDetailsPage/WalletDetailsPage.test.tsx --runInBand --watchman=false`

Expected: FAIL because mocks/old CTA still exist.

- [ ] **Step 3: Write minimal implementation**

Remove `useMockData = true` behavior from:

- `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/hooks/useWalletDetails.ts`
- `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/customers/hooks/useCustomerWallets.ts`

Then make `CustomerWallets` render the safe empty state when no wallet exists.

- [ ] **Step 4: Run test to verify it passes**

Run:
`pnpm exec jest src/customers/components/CustomerWallets/CustomerWallets.test.tsx src/wallets/components/WalletDetailsPage/WalletDetailsPage.test.tsx --runInBand --watchman=false`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/wallets/hooks/useWalletDetails.ts src/customers/hooks/useCustomerWallets.ts src/customers/components/CustomerWallets/CustomerWallets.tsx src/customers/components/CustomerWallets/CustomerWallets.test.tsx
git commit -m "fix: use real wallet data in wallet and customer views"
```

### Task 9: Add failing tests for the shared wallet action layer

**Files:**

- Create: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletActionGroup/WalletActionGroup.tsx`
- Create: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletActionGroup/index.ts`
- Create: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/hooks/useWalletActionHandlers.ts`
- Create: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/hooks/useWalletActionHandlers.test.tsx`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/mutations.ts`

- [ ] **Step 1: Write the failing tests**

Test cases:

- action group renders `Add credit`, `Manual adjustment`, `Refund`, and `Activate/Deactivate`
- inactive wallets show `Activate`
- active wallets show `Deactivate`
- handlers call the correct mutation hooks

- [ ] **Step 2: Run test to verify it fails**

Run:
`pnpm exec jest src/wallets/hooks/useWalletActionHandlers.test.tsx --runInBand --watchman=false`

Expected: FAIL because the hook and action group do not exist.

- [ ] **Step 3: Write minimal implementation**

Implement:

- one shared `WalletActionGroup`
- one shared `useWalletActionHandlers` hook
- Apollo mutations in `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/mutations.ts` for `walletCredit` and wallet status changes

- [ ] **Step 4: Run test to verify it passes**

Run:
`pnpm exec jest src/wallets/hooks/useWalletActionHandlers.test.tsx --runInBand --watchman=false`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/wallets/components/WalletActionGroup src/wallets/hooks/useWalletActionHandlers.ts src/wallets/hooks/useWalletActionHandlers.test.tsx src/wallets/mutations.ts
git commit -m "feat: add shared wallet actions layer"
```

## Chunk 4: Frontend Wallet List, Wallet Details, And Customer Wallet Alignment

### Task 10: Add failing list-page test for single-selection wallet actions

**Files:**

- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletListPage/WalletListPage.test.tsx`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletListPage/WalletListPage.tsx`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/views/WalletList.tsx`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletListDatagrid/WalletListDatagrid.tsx`

- [ ] **Step 1: Write the failing test**

Add test assertions that:

- no wallet actions render when no wallet is selected
- actions render when exactly one wallet is selected
- no `Create wallet` button is present

- [ ] **Step 2: Run test to verify it fails**

Run:
`pnpm exec jest src/wallets/components/WalletListPage/WalletListPage.test.tsx --runInBand --watchman=false`

Expected: FAIL because the page has no shared actions yet.

- [ ] **Step 3: Write minimal implementation**

Wire selection state from `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/views/WalletList.tsx` into `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletListPage/WalletListPage.tsx`, and render `WalletActionGroup` inside the list filter action area only for one selected wallet.

- [ ] **Step 4: Run test to verify it passes**

Run:
`pnpm exec jest src/wallets/components/WalletListPage/WalletListPage.test.tsx --runInBand --watchman=false`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/wallets/views/WalletList.tsx src/wallets/components/WalletListPage/WalletListPage.tsx src/wallets/components/WalletListDatagrid/WalletListDatagrid.tsx src/wallets/components/WalletListPage/WalletListPage.test.tsx
git commit -m "feat: show single-wallet actions in wallet list"
```

### Task 11: Add failing details-page test for shared wallet actions and standard layout

**Files:**

- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletDetailsPage/WalletDetailsPage.test.tsx`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/views/WalletDetails.tsx`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletDetailsPage/WalletDetailsPage.tsx`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletDetailsComponents.test.tsx`

- [ ] **Step 1: Write the failing test**

Add assertions that:

- `WalletDetailsPage` renders the shared wallet action group
- `WalletDetails` no longer uses `console.log` placeholder handlers
- layout follows the standard content/sidebar split without unsupported Macaw props

- [ ] **Step 2: Run test to verify it fails**

Run:
`pnpm exec jest src/wallets/components/WalletDetailsPage/WalletDetailsPage.test.tsx src/wallets/components/WalletDetailsComponents.test.tsx --runInBand --watchman=false`

Expected: FAIL because the page still uses local handlers and custom composition.

- [ ] **Step 3: Write minimal implementation**

In `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/views/WalletDetails.tsx`, replace the placeholder callbacks with `useWalletActionHandlers`.

In `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/wallets/components/WalletDetailsPage/WalletDetailsPage.tsx`:

- place `WalletActionGroup` near the top
- align layout with dashboard detail-page structure conventions already used in customer details

- [ ] **Step 4: Run test to verify it passes**

Run:
`pnpm exec jest src/wallets/components/WalletDetailsPage/WalletDetailsPage.test.tsx src/wallets/components/WalletDetailsComponents.test.tsx --runInBand --watchman=false`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/wallets/views/WalletDetails.tsx src/wallets/components/WalletDetailsPage/WalletDetailsPage.tsx src/wallets/components/WalletDetailsPage/WalletDetailsPage.test.tsx src/wallets/components/WalletDetailsComponents.test.tsx
git commit -m "feat: unify wallet details actions and layout"
```

### Task 12: Add failing customer-wallet test for parity with dedicated wallet views

**Files:**

- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/customers/components/CustomerWallets/CustomerWallets.test.tsx`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/customers/components/CustomerWallets/CustomerWallets.tsx`
- Modify: `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/customers/components/CustomerDetailsPage/CustomerDetailsPage.tsx`

- [ ] **Step 1: Write the failing test**

Add assertions that:

- the customer wallet section uses the shared wallet action labels
- it shows `View details` plus the shared actions for one wallet
- it does not show the old `Top Up` / `Adjust` custom buttons or `Create First Wallet`

- [ ] **Step 2: Run test to verify it fails**

Run:
`pnpm exec jest src/customers/components/CustomerWallets/CustomerWallets.test.tsx --runInBand --watchman=false`

Expected: FAIL because the component still uses custom buttons and mock-centric rendering.

- [ ] **Step 3: Write minimal implementation**

Refactor `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/customers/components/CustomerWallets/CustomerWallets.tsx` to:

- reuse `WalletActionGroup`
- show wallet summary using the same vocabulary as wallet details
- keep navigation to `/wallets/:id`

Adjust `/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/customers/components/CustomerDetailsPage/CustomerDetailsPage.tsx` only if spacing or insertion point needs normalization.

- [ ] **Step 4: Run test to verify it passes**

Run:
`pnpm exec jest src/customers/components/CustomerWallets/CustomerWallets.test.tsx --runInBand --watchman=false`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/customers/components/CustomerWallets/CustomerWallets.tsx src/customers/components/CustomerWallets/CustomerWallets.test.tsx src/customers/components/CustomerDetailsPage/CustomerDetailsPage.tsx
git commit -m "feat: align customer wallet section with wallet experience"
```

### Task 13: Run frontend wallet regression suite

**Files:**

- No code changes expected

- [ ] **Step 1: Run targeted wallet/customer UI tests**

Run:
`pnpm exec jest src/wallets/components/WalletListPage/WalletListPage.test.tsx src/wallets/components/WalletDetailsPage/WalletDetailsPage.test.tsx src/wallets/components/WalletDetailsComponents.test.tsx src/wallets/hooks/useWalletActionHandlers.test.tsx src/customers/components/CustomerWallets/CustomerWallets.test.tsx src/wallets/index.test.ts --runInBand --watchman=false`

Expected: PASS

- [ ] **Step 2: Run type-aware build verification**

Run:
`pnpm build`

Expected: successful dashboard build with no GraphQL document errors.

- [ ] **Step 3: Commit final UI verification adjustments**

```bash
git add -A
git commit -m "test: verify unified wallet flows"
```

## Manual Verification Checklist

- [ ] Create a new customer from dashboard staff flow and confirm exactly one `USD` wallet exists with `0` balance.
- [ ] Register a new customer through account registration and confirm exactly one `USD` wallet exists with `0` balance.
- [ ] Open wallet list, select one wallet, confirm the shared action set appears.
- [ ] Open wallet details, confirm the same action set appears and works from there.
- [ ] Open customer details for a user with a wallet, confirm the wallet section matches the dedicated wallet experience.
- [ ] Open customer details for a historical user without a wallet, confirm a safe empty state renders.

## Notes For Execution

- Keep TDD strict: do not write production code for a task before watching its new test fail.
- Prefer reusing existing Saleor wallet utilities over inventing parallel wallet business logic.
- Do not backfill wallets for older users in this plan.
- Keep `Add credit` distinct in the UI even if it shares lower-level wallet credit primitives with other flows.
