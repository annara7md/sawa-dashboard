# خطة تطبيق نظام المحفظة على لوحة التحكم

## 📊 التحليل الأولي

### نظام المحفظة في الباك إند (مكتمل 95%)
- ✅ 4 نماذج: Wallet, WalletEntry, WalletTopUpRequest, WalletEvent
- ✅ 12 دالة خدمة آمنة مع Thread Safety
- ✅ 8 Mutations GraphQL
- ✅ 4 Queries GraphQL
- ✅ 8 DataLoaders لمنع N+1
- ✅ تكامل كامل مع Checkout و Order

### بنية لوحة التحكم الحالية
- React 18.3.1 + TypeScript
- Apollo Client 3.4.17 للـ GraphQL
- Material-UI v4 للمكونات
- React Router v5 للتوجيه
- React Hook Form للنماذج
- Vite كأداة بناء

## 🎯 الأهداف

1. إنشاء قسم كامل للمحافظ في لوحة التحكم
2. عرض قائمة المحافظ مع الفلترة والترتيب
3. عرض تفاصيل المحفظة مع السجل الكامل
4. إدارة طلبات الشحن (الموافقة/الرفض)
5. إجراء تعديلات يدوية على الرصيد
6. استرجاع الأموال إلى المحفظة
7. تطبيق المحفظة على الطلبات

## 📁 البنية المقترحة

```
sawa-dashboard/src/wallets/
├── components/
│   ├── WalletList/
│   │   ├── WalletList.tsx
│   │   ├── WalletListDatagrid.tsx
│   │   └── filters.ts
│   ├── WalletDetails/
│   │   ├── WalletDetailsPage.tsx
│   │   ├── WalletBalanceCard.tsx
│   │   ├── WalletEntriesCard.tsx
│   │   └── WalletEventsCard.tsx
│   ├── WalletTopUpRequests/
│   │   ├── WalletTopUpRequestList.tsx
│   │   ├── WalletTopUpRequestDetails.tsx
│   │   ├── WalletTopUpApproveDialog.tsx
│   │   └── WalletTopUpRejectDialog.tsx
│   ├── WalletManualAdjustment/
│   │   └── WalletManualAdjustmentDialog.tsx
│   └── WalletRefund/
│       └── WalletRefundDialog.tsx
├── views/
│   ├── WalletList.tsx
│   ├── WalletDetails.tsx
│   └── WalletTopUpRequestList.tsx
├── hooks/
│   ├── useWalletList.ts
│   ├── useWalletDetails.ts
│   └── useWalletTopUpRequests.ts
├── fragments.ts
├── mutations.ts
├── queries.ts
├── types.ts
├── urls.ts
├── fixtures.ts
└── index.tsx
```

## 🔄 مراحل التنفيذ

### المرحلة 1: إعداد البنية الأساسية ✅
- [x] إنشاء مجلد wallets
- [x] إنشاء ملفات البنية الأساسية
- [x] تعريف الأنواع (Types)
- [x] إنشاء URLs

### المرحلة 2: GraphQL Integration
- [ ] إنشاء Fragments للمحفظة
- [ ] إنشاء Queries (wallets, wallet, walletTopUpRequests)
- [ ] إنشاء Mutations (approve, reject, adjust, refund)
- [ ] تحديث schema.graphql

### المرحلة 3: قائمة المحافظ
- [ ] إنشاء WalletList component
- [ ] إنشاء WalletListDatagrid
- [ ] إضافة الفلترة والترتيب
- [ ] إنشاء WalletList view

### المرحلة 4: تفاصيل المحفظة
- [ ] إنشاء WalletDetailsPage
- [ ] إنشاء WalletBalanceCard
- [ ] إنشاء WalletEntriesCard
- [ ] إنشاء WalletEventsCard
- [ ] إنشاء WalletDetails view

### المرحلة 5: إدارة طلبات الشحن
- [ ] إنشاء WalletTopUpRequestList
- [ ] إنشاء WalletTopUpRequestDetails
- [ ] إنشاء WalletTopUpApproveDialog
- [ ] إنشاء WalletTopUpRejectDialog

### المرحلة 6: العمليات الإدارية
- [ ] إنشاء WalletManualAdjustmentDialog
- [ ] إنشاء WalletRefundDialog
- [ ] ربط العمليات بالـ Mutations

### المرحلة 7: التكامل مع الأقسام الأخرى
- [ ] إضافة حقل المحفظة في صفحة العميل
- [ ] إضافة خيار الاسترجاع للمحفظة في الطلبات
- [ ] إضافة رابط المحفظة في القائمة الجانبية

### المرحلة 8: الترجمة والتوثيق
- [ ] إضافة الترجمات العربية والإنجليزية
- [ ] إنشاء ملف README للقسم
- [ ] توثيق الـ Components

## 🎨 تصميم الواجهة

### صفحة قائمة المحافظ
- جدول يعرض: المستخدم، العملة، الرصيد الحالي، الرصيد المحجوز، الرصيد المتاح
- فلترة حسب: المستخدم، العملة، الحالة
- ترتيب حسب: تاريخ الإنشاء، الرصيد، العملة

### صفحة تفاصيل المحفظة
- بطاقة الرصيد: عرض الرصيد الحالي، المحجوز، المتاح
- بطاقة السجلات: عرض جميع العمليات (WalletEntry)
- بطاقة الأحداث: عرض timeline الأحداث
- أزرار الإجراءات: تعديل يدوي، استرجاع

### صفحة طلبات الشحن
- جدول يعرض: المستخدم، المبلغ، الحالة، تاريخ الطلب
- فلترة حسب: الحالة، المستخدم
- أزرار: موافقة، رفض

## 🔐 الصلاحيات

- عرض المحافظ: `HANDLE_PAYMENTS`
- الموافقة على الشحن: `HANDLE_PAYMENTS`
- رفض الشحن: `HANDLE_PAYMENTS`
- التعديل اليدوي: `HANDLE_PAYMENTS`
- الاسترجاع: `HANDLE_PAYMENTS`

## 📝 ملاحظات تقنية

1. استخدام Apollo Client للـ GraphQL
2. استخدام React Hook Form للنماذج
3. استخدام Material-UI للمكونات
4. استخدام TypeScript للأنواع
5. اتباع نفس البنية المستخدمة في customers
6. استخدام Datagrid للجداول الكبيرة
7. استخدام Dialog للنوافذ المنبثقة

## 🚀 البدء في التنفيذ

سأبدأ الآن بتنفيذ المراحل بالترتيب...
