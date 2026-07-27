# Portfolio Next.js — Tài liệu định hướng kỹ thuật

> Trạng thái: **Bản tham khảo / chưa chốt**
>
> Tài liệu này mô tả ý tưởng và hướng triển khai dự kiến cho một portfolio full-stack sử dụng Next.js. Nội dung không phải đặc tả end-to-end, không xác định đầy đủ route, database schema, API contract hoặc kế hoạch triển khai chi tiết.

---

## 1. Bối cảnh

Dự án là một portfolio cá nhân dành cho sinh viên IT, có khu vực công khai và trang quản trị nội dung.

Các ràng buộc chính:

- Không phát sinh chi phí vận hành.
- Đã có domain riêng.
- Không sử dụng Vercel.
- Ưu tiên công nghệ mã nguồn mở hoặc dễ thay thế.
- Ưu tiên trải nghiệm phát triển tốt, cấu trúc rõ ràng và phù hợp để đưa vào CV.
- Không xây backend riêng nếu Next.js và Supabase đã đáp ứng đủ.
- Chưa tập trung vào route design và database design.

---

## 2. Mục tiêu

### 2.1. Mục tiêu chức năng

- Hiển thị thông tin cá nhân, kỹ năng, kinh nghiệm và dự án.
- Hỗ trợ project case study có nội dung phong phú.
- Có admin dashboard để quản lý nội dung.
- Hỗ trợ upload và quản lý media.
- Có form liên hệ.
- Có khả năng mở rộng thêm blog, analytics hoặc realtime khi cần.

### 2.2. Mục tiêu kỹ thuật

- Full-stack trong một Next.js application.
- Server-first, hạn chế JavaScript không cần thiết ở public pages.
- Type-safe ở mức ứng dụng và database.
- Hỗ trợ responsive, accessibility, SEO và Core Web Vitals.
- Có quy trình lint, format, type-check, test và deploy rõ ràng.
- Giảm lock-in bằng cách giữ business logic trong codebase và sử dụng PostgreSQL tiêu chuẩn.

### 2.3. Không phải mục tiêu ban đầu

- Microservices.
- Backend NestJS hoặc Express riêng.
- Multi-tenant CMS.
- Public user registration.
- AI editor, realtime collaboration hoặc comment system.
- Hệ thống analytics phức tạp.
- Rich editor tương đương Notion đầy đủ.
- Thiết kế database và API hoàn chỉnh trong giai đoạn định hướng.

---

## 3. Nguyên tắc chung

- **KISS:** ưu tiên giải pháp đơn giản và dễ bảo trì.
- **YAGNI:** chỉ thêm abstraction hoặc dependency khi có nhu cầu thực tế.
- **Server-first:** Server Component là mặc định; Client Component chỉ dùng tại boundary cần tương tác.
- **Progressive enhancement:** public content vẫn đọc được khi JavaScript bị hạn chế.
- **Single source of truth:** mỗi loại state và dữ liệu có một nơi quản lý chính.
- **Feature-oriented:** code nghiệp vụ được tổ chức theo feature thay vì chia toàn bộ dự án theo loại file.
- **Validate at boundaries:** dữ liệu từ form, URL, API và database đều được kiểm tra tại điểm giao tiếp.
- **Authorization on server:** không dựa vào việc ẩn UI hoặc route.
- **Measure before optimize:** tối ưu dựa trên bundle analysis, Web Vitals và profiling.

---

## 4. Kiến trúc tổng quan

```text
Domain
  │
  ▼
Cloudflare DNS / CDN
  │
  ▼
Cloudflare Workers
  │
  └── Next.js App Router qua OpenNext
        ├── Public portfolio
        ├── Admin dashboard
        ├── Server Components
        ├── Route Handlers
        └── Server Actions
              │
              ▼
          Supabase
          ├── PostgreSQL
          ├── Auth
          ├── Storage
          └── Realtime
```

Kiến trúc dự kiến là **modular monolith**: một codebase, một ứng dụng triển khai, chia module theo feature.

---

## 5. Stack đề xuất

| Nhóm             | Công nghệ dự kiến        | Vai trò                                   |
| ---------------- | ------------------------ | ----------------------------------------- |
| Framework        | Next.js App Router       | UI, SSR, RSC, server logic                |
| Ngôn ngữ         | TypeScript strict        | Type safety                               |
| Runtime          | Cloudflare Workers       | Hosting và edge runtime                   |
| Adapter          | OpenNext for Cloudflare  | Build và deploy Next.js                   |
| Backend platform | Supabase                 | Database, Auth, Storage, Realtime         |
| Styling          | Tailwind CSS             | Utility-first CSS                         |
| UI               | shadcn/ui + Base UI      | Component source và accessible primitives |
| Validation       | Zod 4                    | Runtime validation                        |
| Form             | React Hook Form          | Form phức tạp trong admin                 |
| Server state     | TanStack Query           | Cache và đồng bộ dữ liệu phía client      |
| URL state        | nuqs                     | Search, filter, sort, pagination          |
| Client state     | Zustand                  | Shared UI state                           |
| Animation        | Motion                   | Animation có trạng thái                   |
| Rich editor      | BlockNote + Ariakit      | Block editor trong admin                  |
| Date             | Native `Intl` + date-fns | Format và xử lý ngày                      |
| Lint             | Oxlint                   | Static analysis                           |
| Format           | Oxfmt                    | Format code và tài liệu                   |
| Unit test        | Vitest                   | Unit và integration test                  |
| Component test   | Testing Library          | Kiểm thử hành vi UI                       |
| E2E              | Playwright               | Kiểm thử luồng chính                      |
| Package manager  | bunjs                    | Dependency và workspace management        |

Các lựa chọn trên chỉ là baseline để đánh giá. Phiên bản cụ thể cần được pin và kiểm tra compatibility trước khi khởi tạo dự án.

---

## 6. Next.js và Cloudflare

### 6.1. Hướng triển khai

- Dùng Next.js App Router.
- Deploy lên Cloudflare Workers thông qua OpenNext.
- Không dùng Vercel-specific API nếu không cần thiết.
- Kiểm tra ứng dụng bằng môi trường preview tương ứng với Cloudflare runtime.

### 6.2. Quy ước runtime

- Ưu tiên Web APIs tiêu chuẩn.
- Hạn chế dependency yêu cầu Node.js native module.
- Mọi package dùng ở server phải được kiểm tra với Workers runtime.
- Không giả định `next dev` phản ánh đầy đủ production runtime.

### 6.3. Render strategy

- Public pages: ưu tiên Server Components, static rendering hoặc cached rendering.
- Admin pages: có thể sử dụng client-side interaction nhiều hơn.
- Editor và các bundle lớn chỉ tải trong admin.
- Dữ liệu public không nên phụ thuộc vào client-side fetch nếu không có lý do rõ ràng.

---

## 7. Supabase

### 7.1. Phạm vi sử dụng

Supabase dự kiến được sử dụng toàn bộ cho:

- PostgreSQL database.
- Authentication.
- File storage.
- Realtime khi có use case phù hợp.
- Database migration và generated types.

Không sử dụng Prisma trong hướng hiện tại.

### 7.2. Client boundary

```text
Supabase server client
├── Server Components
├── Route Handlers
└── Server Actions

Supabase browser client
├── Authentication interaction
├── Direct upload
├── TanStack Query
└── Realtime subscription
```

Service-role key chỉ được dùng ở server và chỉ khi thực sự cần.

### 7.3. Type safety

Database types được sinh từ Supabase CLI và truyền vào Supabase client.

```text
Database migration
  ↓
Supabase schema
  ↓
Generated TypeScript types
  ↓
Application queries
```

### 7.4. Migration

Nguồn sự thật dự kiến:

```text
supabase/migrations/*.sql
```

Nguyên tắc:

- Không thay đổi production schema chỉ bằng Dashboard.
- RLS, policy, function và trigger phải nằm trong migration.
- Generated types cần được cập nhật sau thay đổi schema.
- Seed data chỉ phục vụ local development hoặc test.

### 7.5. Vendor lock-in

Không thể loại bỏ hoàn toàn lock-in nếu sử dụng Auth, Storage và Realtime của Supabase. Có thể giảm mức phụ thuộc bằng cách:

- Giữ business logic trong application layer.
- Không gọi Supabase trực tiếp từ mọi component.
- Gom query vào module hoặc repository function.
- Sử dụng PostgreSQL schema tiêu chuẩn.
- Lưu migration trong Git.
- Không phụ thuộc vào database extension nếu chưa có nhu cầu.
- Dùng interface cho storage hoặc auth khi khả năng di chuyển là yêu cầu thực tế.

Không nên tạo abstraction quá sớm chỉ để giả định một migration chưa có kế hoạch.

---

## 8. Authentication và authorization

### 8.1. Authentication dự kiến

- Supabase Auth.
- GitHub OAuth hoặc email/password.
- Không mở public signup trong phiên bản đầu.
- Chỉ có một hoặc một số tài khoản admin.

### 8.2. Authorization

Mỗi thao tác quản trị cần kiểm tra ở server:

```text
Authenticated?
  ↓
Has admin role?
  ↓
Input valid?
  ↓
Perform mutation
```

Không xem route guard hoặc ẩn menu là lớp bảo mật chính.

### 8.3. RLS

- Bật RLS cho các bảng exposed.
- Public chỉ được đọc dữ liệu đã publish.
- Admin được cấp quyền theo user ID hoặc role.
- Storage bucket cần policy riêng.
- Service-role không được gửi xuống browser.

---

## 9. State management

Mỗi loại state có công cụ riêng.

| Loại state               | Công cụ                  |
| ------------------------ | ------------------------ |
| Dữ liệu render từ server | Server Components        |
| Remote data trong client | TanStack Query           |
| Search/filter/sort/page  | nuqs                     |
| Shared UI state          | Zustand                  |
| Local component state    | `useState`, `useReducer` |
| Form state               | React Hook Form          |
| Editor state             | BlockNote                |
| Animation state          | Motion                   |

### 9.1. TanStack Query

Phù hợp cho admin dashboard:

- Pagination.
- Filter.
- Background refetch.
- Optimistic update.
- Mutation state.
- Upload progress.
- Realtime cache synchronization.

Public pages không bắt buộc phải dùng TanStack Query.

### 9.2. Zustand

Chỉ dành cho state client dùng chung, ví dụ:

- Sidebar.
- Command palette.
- Modal controller.
- Upload queue.
- Editor panel state.

Không sao chép dữ liệu của TanStack Query sang Zustand.

### 9.3. nuqs

Dùng cho state cần thể hiện trên URL:

```text
?q=nextjs
&status=published
&page=2
&sort=updated_at
```

Điều này giúp bookmark, share link và hỗ trợ back/forward navigation.

---

## 10. Form và validation

### 10.1. Zod

Zod là schema validation dùng chung cho:

- Form input.
- URL search params.
- Environment variables.
- API payload.
- Database write input.
- File metadata.

Validation phía client phục vụ UX. Server vẫn phải validate lại.

### 10.2. React Hook Form

Dùng cho form có:

- Nhiều field.
- Nested data.
- Dynamic field array.
- Conditional field.
- Dirty state.
- Draft state.
- File upload.

Form nhỏ có thể dùng HTML form và Server Action trực tiếp.

---

## 11. UI system

### 11.1. shadcn/ui và Base UI

- Dùng shadcn/ui với Base UI làm primitive layer.
- Component được copy vào source code.
- Mỗi lần thêm hoặc cập nhật component cần review diff.
- Không trộn Base UI và Radix UI tùy ý.
- Design token được quản lý bằng CSS variables.

### 11.2. UI phụ trợ

Các lựa chọn dự kiến:

- Lucide cho icon.
- shadcn/Base UI Toast cho notification.
- TanStack Table cho data table.
- Tailwind utility và CSS variables cho theme.

Không cài dependency nếu feature tương ứng chưa tồn tại.

### 11.3. Design system

Nên xác định sớm:

- Color tokens.
- Typography scale.
- Spacing scale.
- Radius.
- Shadow.
- Motion duration.
- Z-index layers.
- Responsive breakpoints.
- Dark mode behavior.

---

## 12. Animation

Motion được dùng cho:

- Layout transition.
- Enter/exit animation.
- Shared element.
- Gesture.
- Scroll-linked animation.
- Staggered content.

CSS/Tailwind transition dùng cho:

- Hover.
- Focus.
- Color.
- Opacity.
- Transform đơn giản.

Nguyên tắc:

- Không animation chỉ để tạo chuyển động.
- Tôn trọng `prefers-reduced-motion`.
- Không làm chậm thao tác trong admin.
- Dùng lazy loading cho Motion feature bundle nếu cần.

---

## 13. Date và time

Hướng sử dụng:

- `Intl.DateTimeFormat` cho format phổ biến.
- date-fns cho calculation, comparison và relative time.
- Lưu timestamp theo UTC trong database.
- Chuyển timezone tại presentation layer.
- Không thêm nhiều date library cùng lúc.

Timezone hiển thị mặc định dự kiến là `Asia/Ho_Chi_Minh`, nhưng cần xác định theo yêu cầu sản phẩm.

---

## 14. Nội dung và MDX

### 14.1. Phân loại nội dung

```text
Structured content
└── PostgreSQL tables

Admin-authored rich content
└── BlockNote JSON trong JSONB

Developer-authored technical content
└── Local MDX

Binary assets
└── Supabase Storage
```

### 14.2. MDX

MDX chỉ phù hợp với nội dung:

- Được quản lý trong Git.
- Do developer viết.
- Có nhu cầu nhúng React component.
- Không chỉnh sửa bằng admin WYSIWYG editor.

Không compile và thực thi MDX không đáng tin cậy lấy trực tiếp từ database.

Nếu không có blog kỹ thuật hoặc interactive article, MDX có thể bị loại khỏi phiên bản đầu.

---

## 15. Rich editor

### 15.1. Lựa chọn dự kiến

Editor được đề xuất:

```text
BlockNote Core
BlockNote React
BlockNote Ariakit UI
BlockNote Server Utilities
```

Lý do tham khảo:

- Có UI và UX hoàn chỉnh.
- Có block model.
- Có toolbar, slash menu và drag/drop.
- Có JSON document format.
- Phù hợp lưu vào PostgreSQL `jsonb`.
- Không cần tự xây editor UI từ primitives.
- Có thể tải riêng trong admin route.

### 15.2. Ranh giới

- Application UI: shadcn/ui + Base UI.
- Editor UI: BlockNote + Ariakit.
- Đồng bộ bằng CSS variables và theme tokens.
- Không ép editor dùng component primitives của application.

### 15.3. Lưu trữ

Dữ liệu dự kiến:

```text
content_json      jsonb
content_version   integer
content_text      text
```

- `content_json`: nguồn sự thật.
- `content_version`: hỗ trợ migration document schema.
- `content_text`: search, excerpt hoặc indexing.

### 15.4. Media trong editor

- Upload file vào Supabase Storage.
- Document chỉ lưu path và metadata.
- Không lưu signed URL lâu dài.
- Validate extension, MIME type, kích thước và quyền upload.

### 15.5. Hiệu năng

- Editor chỉ tải trong admin.
- Dùng dynamic import và tắt SSR cho editor.
- Public pages không tải editor runtime.
- Render hoặc chuyển đổi document phía server khi cần.

### 15.6. Lựa chọn thay thế

- **Plate:** tùy biến sâu, feature nhiều, phù hợp khi editor là tính năng trung tâm.
- **Tiptap:** core modular, có UI template, phù hợp khi cần kiểm soát extension.
- **Lexical:** performance tốt nhưng cần tự xây nhiều UI.
- **BlockNote Mantine:** đầy đủ nhưng thêm một UI ecosystem.
- **BlockNote shadcn adapter:** cần kiểm tra compatibility với Base UI trước khi dùng.

Chưa có lựa chọn nào được xem là quyết định không thể thay đổi.

---

## 16. Tooling và code quality

### 16.1. Oxc

Hướng hiện tại dùng:

- Oxlint cho lint.
- Oxfmt cho format.
- TypeScript compiler cho type-check.

```text
Oxlint
  └── Code quality và framework rules

Oxfmt
  └── Format code, CSS, Markdown và MDX

tsc --noEmit
  └── Type correctness
```

Oxc không thay thế Next.js build, Vitest hoặc Playwright.

### 16.2. Oxc và Biome

Hai lựa chọn cần tiếp tục đánh giá:

| Tiêu chí              | Oxc                        | Biome                       |
| --------------------- | -------------------------- | --------------------------- |
| Mô hình               | Compiler/tooling ecosystem | Unified toolchain           |
| CLI                   | Oxlint và Oxfmt riêng      | Một CLI                     |
| Next.js rule coverage | Dự kiến rộng hơn           | Cần kiểm tra theo phiên bản |
| MDX formatting        | Có định hướng hỗ trợ       | Cần kiểm tra                |
| Formatter maturity    | Cần theo dõi               | Tương đối ổn định           |
| Configuration UX      | Nhiều config hơn           | Đơn giản hơn                |

Lựa chọn tạm thời là Oxc vì phù hợp stack Next.js, Tailwind và MDX. Cần pin version và review khi update.

### 16.3. Script dự kiến

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "preview": "opennextjs-cloudflare preview",
    "deploy": "opennextjs-cloudflare deploy",
    "lint": "oxlint --type-aware",
    "format": "oxfmt --write .",
    "format:check": "oxfmt --check .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test"
  }
}
```

Tên lệnh OpenNext cần được xác nhận theo phiên bản sử dụng thực tế.

### 16.4. Vite+

Vite+ chưa được chọn làm toolchain chính vì:

- Next.js không dùng Vite làm dev server hoặc production bundler.
- `vp dev` và `vp build` không thay thế Next.js commands.
- Lợi ích unified workflow giảm khi vẫn phải chạy Next/OpenNext riêng.
- Cần đánh giá lại khi Vite+ ổn định hơn hoặc có tích hợp Next.js rõ ràng.

---

## 17. Testing

### 17.1. Unit test

Vitest dùng cho:

- Schema validation.
- Utility.
- Mapper.
- Permission helper.
- Query builder.
- State logic.
- Content transformation.

### 17.2. Component test

Testing Library dùng cho:

- Form behavior.
- Dialog.
- Keyboard navigation.
- Empty state.
- Error state.
- Accessible interaction.

### 17.3. E2E

Playwright dùng cho các luồng chính:

- Public xem project.
- Admin đăng nhập.
- Admin tạo draft.
- Admin publish nội dung.
- Upload media.
- Submit contact form.
- User không có quyền bị từ chối.

Không đặt mục tiêu coverage tuyệt đối. Tập trung vào phần có rủi ro và business flow chính.

---

## 18. Security

Baseline dự kiến:

- Supabase RLS.
- Server-side authorization.
- Zod validation.
- CSRF-safe mutation pattern.
- Content Security Policy.
- Security headers.
- Rate limit cho form công khai.
- Cloudflare Turnstile cho contact form nếu cần.
- Validate file type và file size.
- Không log token hoặc secret.
- Không expose service-role key.
- Sanitize hoặc kiểm soát rich content output.
- Kiểm tra redirect URL.
- Audit log cho thao tác admin quan trọng.

Security cần được review lại sau khi route và data model rõ ràng.

---

## 19. Performance

Các hướng chính:

- Server Components cho public pages.
- Static hoặc cached rendering khi phù hợp.
- Dynamic import editor và dashboard module nặng.
- Không tải TanStack Query, Zustand hoặc Motion ở route không cần.
- Optimize image trước khi upload.
- Giới hạn kích thước media.
- Dùng pagination cho admin table.
- Tránh query lặp lại trong layout.
- Chỉ dùng Realtime khi polling hoặc revalidation không đủ.
- Theo dõi bundle size và Web Vitals.

Public portfolio và admin dashboard có thể có chiến lược bundle khác nhau.

---

## 20. SEO và accessibility

### 20.1. SEO

- Next.js Metadata API.
- Canonical URL.
- Sitemap.
- Robots.
- Open Graph.
- Twitter card.
- JSON-LD.
- Semantic heading.
- Project-specific metadata.
- Stable slug.

### 20.2. Accessibility

- Semantic HTML.
- Keyboard navigation.
- Visible focus.
- Color contrast.
- Accessible label.
- Reduced motion.
- Alt text cho hình ảnh.
- Form error announcement.
- Dialog focus management.
- Table semantics.

shadcn và Base UI hỗ trợ primitives, nhưng accessibility cuối cùng vẫn phụ thuộc cách tích hợp.

---

## 21. Cấu trúc thư mục tham khảo

```text
src/
├── app/
│   ├── (portfolio)/
│   ├── admin/
│   ├── api/
│   ├── layout.tsx
│   └── providers.tsx
│
├── features/
│   ├── auth/
│   ├── projects/
│   ├── contact/
│   ├── media/
│   ├── editor/
│   └── dashboard/
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
│
├── lib/
│   ├── supabase/
│   ├── auth/
│   ├── env/
│   ├── errors/
│   ├── security/
│   └── utils/
│
├── config/
├── hooks/
├── stores/
└── types/

supabase/
├── migrations/
├── seed.sql
└── config.toml

content/
└── articles/

tests/
├── unit/
├── integration/
└── e2e/
```

Không bắt buộc mọi feature phải có đủ `actions`, `queries`, `services`, `repositories` và `schemas`. Chỉ thêm layer khi logic đủ phức tạp.

---

## 22. Pattern tham khảo

### 22.1. Feature module

```text
features/projects/
├── components/
├── queries/
├── mutations/
├── schemas/
├── services/
└── types/
```

### 22.2. Data flow

Public read:

```text
Server Component
  ↓
Supabase server client
  ↓
Render
```

Admin client query:

```text
Client Component
  ↓
TanStack Query
  ↓
Supabase browser client hoặc Route Handler
  ↓
RLS / server authorization
```

Admin mutation:

```text
Form
  ↓
Zod
  ↓
Mutation
  ↓
Authorization
  ↓
Supabase
  ↓
Invalidate query / revalidate page
```

### 22.3. Error handling

- Domain error không phụ thuộc UI.
- Database error được map thành application error.
- Client chỉ nhận thông tin cần thiết.
- Không hiển thị raw database error cho user.

---

## 23. Các dependency chưa nên cài mặc định

- Redux Toolkit.
- Axios.
- GraphQL.
- tRPC.
- NestJS.
- Auth.js.
- Sentry.
- Chart library.
- i18n framework.
- Collaboration editor.
- AI editor.
- Realtime cho mọi bảng.
- Multiple toast libraries.
- Multiple date libraries.
- Multiple state stores.

Dependency được thêm khi có use case, tiêu chí đánh giá và owner rõ ràng.

---

## 24. Giai đoạn triển khai tham khảo

### Giai đoạn 1: Foundation

- Khởi tạo Next.js và Cloudflare/OpenNext.
- Cấu hình TypeScript, Oxc và test.
- Thiết lập Tailwind, shadcn và design tokens.
- Thiết lập Supabase local development.
- Thiết lập generated database types.

### Giai đoạn 2: Public portfolio

- Layout và navigation.
- About, skills, experience.
- Project list và project detail.
- Metadata, sitemap và Open Graph.
- Responsive và accessibility baseline.

### Giai đoạn 3: Authentication và admin shell

- Supabase Auth.
- Admin authorization.
- Dashboard layout.
- State boundaries.
- Error và loading states.

### Giai đoạn 4: Content management

- Project CRUD.
- Media upload.
- BlockNote editor.
- Draft và publish workflow.
- Cache invalidation.

### Giai đoạn 5: Quality

- Unit và E2E tests.
- Security review.
- Bundle analysis.
- Web Vitals.
- Deployment và rollback checklist.

Thứ tự này chỉ mang tính tham khảo.

---

## 25. Các quyết định còn mở

- Chọn chính xác style và preset của shadcn.
- Dùng GitHub OAuth hay email/password cho admin.
- Public queries dùng direct Supabase hay query layer riêng.
- Server Actions hay Route Handlers cho từng loại mutation.
- Có sử dụng MDX trong phiên bản đầu hay không.
- BlockNote có đáp ứng bundle và UX thực tế hay không.
- Dùng Oxc hay chuyển sang Biome sau prototype.
- Cách render BlockNote JSON ở public pages.
- Cấu trúc quyền admin.
- Draft/publish workflow.
- Image transformation provider.
- Search strategy.
- Audit log scope.
- Analytics và monitoring.
- Chính sách backup trong giới hạn free tier.

Các quyết định nên được xác nhận bằng prototype nhỏ thay vì chỉ dựa trên tài liệu hoặc benchmark.

---

## 26. Tiêu chí review prototype

### Framework và deployment

- Build và preview thành công trên Cloudflare runtime.
- Không có dependency không tương thích Workers.
- Custom domain hoạt động đúng.

### Supabase

- Auth session hoạt động ở server và client.
- RLS ngăn truy cập trái phép.
- Generated types đồng bộ schema.
- Upload và policy hoạt động đúng.

### UI

- Component Base UI hoạt động ổn định.
- Không xung đột portal, focus hoặc hydration.
- Design token đồng nhất giữa public, admin và editor.

### Editor

- Editor load riêng trong admin.
- Typing không lag với document thực tế.
- JSON lưu và phục hồi không mất dữ liệu.
- Image upload hoạt động.
- Public render không tải editor bundle.

### Tooling

- Lint, format, type-check và test chạy ổn định.
- Oxfmt không tạo diff bất thường.
- Oxlint có đủ rule coverage cho project.

### Performance

- Public route bundle nhỏ.
- Không có client provider toàn cục không cần thiết.
- Web Vitals nằm trong mức chấp nhận được.

---

## 27. Kết luận

Hướng tham khảo hiện tại là:

```text
Next.js App Router
+ Cloudflare Workers / OpenNext
+ Supabase-only backend
+ shadcn/ui Base UI
+ TanStack Query
+ Zustand
+ nuqs
+ Motion
+ React Hook Form
+ Zod
+ BlockNote Ariakit
+ Oxlint / Oxfmt
+ Vitest / Playwright
```

Đây là một baseline có khả năng đáp ứng portfolio full-stack với admin dashboard trong giới hạn chi phí bằng không. Stack vẫn cần được xác nhận bằng prototype, compatibility test và review bundle trước khi xem là quyết định chính thức.
