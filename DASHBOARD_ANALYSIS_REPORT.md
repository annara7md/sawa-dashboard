# 📊 تقرير التحليل العميق للوحة التحكم SAWA Dashboard

## 🏗️ البنية العامة والتنظيم

### 1. تنظيم المجلدات
```
src/
├── components/          # مكونات مشتركة
├── [section]/          # أقسام المنتج (customers, orders, products, etc.)
│   ├── components/     # مكونات خاصة بالقسم
│   ├── views/         # صفحات القسم
│   ├── hooks/         # React hooks مخصصة
│   ├── providers/     # Context providers
│   ├── queries.ts     # GraphQL queries
│   ├── mutations.ts   # GraphQL mutations
│   ├── types.ts       # TypeScript types
│   ├── urls.ts        # URL patterns
│   ├── fixtures.ts    # بيانات تجريبية
│   └── index.tsx      # Router configuration
├── fragments/          # GraphQL fragments مشتركة
├── graphql/           # Apollo Client setup
├── hooks/             # React hooks عامة
├── utils/             # دوال مساعدة
├── auth/              # نظام المصادقة
├── intl.ts            # التوطين والترجمة
└── types.ts           # أنواع عامة
```

### 2. أنماط التسمية
- **المجلدات**: camelCase (customers, orderDetails)
- **الملفات**: camelCase.ts/tsx
- **المكونات**: PascalCase
- **الثوابت**: UPPER_SNAKE_CASE
- **المتغيرات**: camelCase

## 🔧 أنماط التطوير المستخدمة

### 1. React Router Pattern
```typescript
// في index.tsx لكل قسم
export const CustomerSection = () => {
  const intl = useIntl();
  return (
    <>
      <WindowTitle title={intl.formatMessage(sectionNames.customers)} />
      <Switch>
        <Route exact path={customerListPath} component={CustomerListView} />
        <Route path={customerPath(":id")} component={CustomerDetailsView} />
      </Switch>
    </>
  );
};
```

### 2. URL Management Pattern
```typescript
// urls.ts pattern
const customerSection = "/customers/";
export const customerListPath = customerSection;
export const customerPath = (id: string) => urlJoin(customerSection, id);
export const customerUrl = (id: string, params?: CustomerUrlQueryParams) =>
  customerPath(encodeURIComponent(id)) + "?" + stringifyQs(params);
```

### 3. GraphQL Integration Pattern
```typescript
// queries.ts
export const customerList = gql`
  query ListCustomers($filter: CustomerFilterInput, $sort: UserSortingInput) {
    customers(filter: $filter, sortBy: $sort) {
      edges { node { ...Customer } }
      pageInfo { hasNextPage, hasPreviousPage }
    }
  }
`;

// mutations.ts
export const updateCustomer = gql`
  mutation UpdateCustomer($id: ID!, $input: CustomerInput!) {
    customerUpdate(id: $id, input: $input) {
      errors { ...AccountError }
      user { ...CustomerDetails }
    }
  }
`;
```

## 🎨 مكونات الواجهة

### 1. Material-UI v4 Components
- `@material-ui/core` للمكونات الأساسية
- `@saleor/macaw-ui` للمكونات المخصصة
- `@saleor/macaw-ui-next` للمكونات الجديدة

### 2. Layout Pattern
```typescript
// صفحة نموذجية
const CustomerListPage = ({ settings, onUpdateListSettings, ... }) => (
  <Container>
    <PageHeader title="Customers" />
    <Card>
      <FilterBar />
      <DataGrid />
      <TablePagination />
    </Card>
  </Container>
);
```

### 3. Dialog Pattern
```typescript
// نافذة منبثقة نموذجية
const CustomerDeleteDialog = ({ open, onClose, onConfirm }) => (
  <ActionDialog
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    title="Delete Customer"
    variant="delete"
  />
);
```

## 📊 إدارة البيانات

### 1. Apollo Client Setup
```typescript
// client.ts
export const apolloClient = new ApolloClient({
  cache: new InMemoryCache({
    possibleTypes: introspectionData.possibleTypes,
    typePolicies: { /* ... */ }
  }),
  link: attachVariablesLink.concat(createUploadLink({ /* ... */ }))
});
```

### 2. Query Hooks Pattern
```typescript
// استخدام الاستعلامات
const { data, loading, refetch } = useListCustomersQuery({
  displayLoader: true,
  variables: { filter, sort, ...paginationState }
});
```

### 3. Mutation Hooks Pattern
```typescript
// استخدام الطفرات
const [updateCustomer, updateCustomerOpts] = useUpdateCustomerMutation({
  onCompleted: (data) => {
    if (data.customerUpdate.errors.length === 0) {
      notify({ status: "success", text: "Customer updated" });
    }
  }
});
```

## 🌐 التوطين والترجمة

### 1. Message Definition Pattern
```typescript
// في intl.ts أو messages.ts
export const messages = defineMessages({
  customerList: {
    id: "customer.list.title",
    defaultMessage: "Customers",
    description: "page title"
  }
});
```

### 2. Usage Pattern
```typescript
// في المكونات
const intl = useIntl();
const title = intl.formatMessage(messages.customerList);
```

### 3. Section Names
```typescript
// sectionNames في intl.ts
export const sectionNames = defineMessages({
  customers: { id: "customers", defaultMessage: "Customers" },
  wallets: { id: "wallets", defaultMessage: "Wallets" } // سنحتاج إضافة هذا
});
```

## 🔐 الأمان والصلاحيات

### 1. Permission Check Pattern
```typescript
// RequirePermissions component
<RequirePermissions requiredPermissions={[PermissionEnum.MANAGE_USERS]}>
  <CustomerActions />
</RequirePermissions>
```

### 2. Hook-based Permission Check
```typescript
const userPermissions = useUserPermissions();
const canManageCustomers = hasPermissions(userPermissions, [PermissionEnum.MANAGE_USERS]);
```

### 3. Route Protection
```typescript
<SectionRoute
  path="/customers"
  component={CustomerSection}
  permissions={[PermissionEnum.MANAGE_USERS]}
/>
```

## 📋 أفضل الممارسات المحددة

### 1. File Organization
- كل قسم له مجلد منفصل
- تجميع الملفات ذات الصلة معاً
- فصل المنطق عن العرض

### 2. Component Structure
```typescript
// بنية المكون النموذجية
interface Props {
  // props definition
}

const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  // hooks
  // handlers
  // render
  return <div>...</div>;
};

export default Component;
```

### 3. Error Handling
```typescript
// معالجة الأخطاء في الطفرات
const [mutation, { loading, error }] = useMutation({
  onCompleted: (data) => {
    if (data.mutation.errors.length > 0) {
      // handle GraphQL errors
    } else {
      // success
    }
  },
  onError: (error) => {
    // handle network errors
  }
});
```

### 4. Loading States
```typescript
// حالات التحميل
if (loading) return <Skeleton />;
if (error) return <ErrorPage />;
if (!data) return <NotFound />;
```

## 🎯 نقطة البداية المحددة

بناءً على التحليل، سأبدأ التنفيذ بالترتيب التالي:

### المرحلة 1: إعداد البنية الأساسية ✅
- [x] إنشاء مجلد wallets
- [x] إنشاء ملفات البنية (types, urls, queries, mutations)
- [x] إنشاء fragments

### المرحلة 2: التكامل مع النظام الأساسي
- [ ] إضافة wallets إلى sectionNames
- [ ] إضافة المسارات إلى التطبيق الرئيسي
- [ ] إضافة الصلاحيات المطلوبة
- [ ] إضافة رابط في القائمة الجانبية

### المرحلة 3: إنشاء المكونات الأساسية
- [ ] إنشاء WalletList view
- [ ] إنشاء WalletDetails view
- [ ] إنشاء WalletTopUpRequestList view

### المرحلة 4: إنشاء المكونات المتقدمة
- [ ] إنشاء Dialogs للعمليات
- [ ] إنشاء Filters والـ Sorting
- [ ] إنشاء DataGrid components

## 🔍 الملاحظات المهمة

1. **استخدام TypeScript بشكل صارم** - جميع الملفات تستخدم TypeScript مع أنواع محددة
2. **Apollo Client Integration** - استخدام hooks مولدة تلقائياً
3. **Material-UI v4** - استخدام النسخة القديمة، يجب التوافق معها
4. **React Router v5** - استخدام النسخة القديمة
5. **Internationalization** - دعم كامل للترجمة مع react-intl
6. **Permission System** - نظام صلاحيات متقدم
7. **Error Handling** - معالجة شاملة للأخطاء
8. **Loading States** - إدارة حالات التحميل

## ✅ الخطوة التالية

سأبدأ الآن بالمرحلة 2: التكامل مع النظام الأساسي، وهي إضافة قسم المحافظ إلى التطبيق الرئيسي.