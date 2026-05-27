# JiPLC – Tài Liệu Kỹ Thuật (Technical Documentation)

> **JiPLC** (viết tắt của *Jira – PLC*) là ứng dụng quản lý dự án dạng SPA (Single Page Application) được phát triển bằng **React 18 + TypeScript + Vite + TailwindCSS**, mô phỏng (clone) các tính năng cốt lõi của **Jira** và **Trello**. Ứng dụng phục vụ cho các team / công ty nhỏ muốn tự vận hành công cụ quản lý dự án theo mô hình **Scrum** (Backlog → Sprint → Board → Complete Sprint) thay cho việc trả phí Jira/Trello.
>
> Tài liệu này tập trung **mô tả chi tiết về mặt công nghệ và kỹ thuật** của phía Frontend (repo `plc-base-react`). Phía Backend (`PLCBaseApi`) được tham chiếu qua URL được cấu hình bằng biến môi trường.

---

## Mục Lục

1. [Tổng quan hệ thống](#1-tổng-quan-hệ-thống)
2. [Tech Stack](#2-tech-stack)
3. [Yêu cầu môi trường & Cách chạy](#3-yêu-cầu-môi-trường--cách-chạy)
4. [Biến môi trường & Cấu hình](#4-biến-môi-trường--cấu-hình)
5. [Cấu trúc thư mục](#5-cấu-trúc-thư-mục)
6. [Quy ước import & Path alias](#6-quy-ước-import--path-alias)
7. [Hệ thống Routing & Guard](#7-hệ-thống-routing--guard)
8. [Quản lý state: React Query + Context API](#8-quản-lý-state-react-query--context-api)
9. [HTTP Layer: Axios + Interceptor + Refresh Token](#9-http-layer-axios--interceptor--refresh-token)
10. [Auth Flow & Lưu trữ phiên](#10-auth-flow--lưu-trữ-phiên)
11. [Phân quyền (Permission-based RBAC)](#11-phân-quyền-permission-based-rbac)
12. [Form & Validation](#12-form--validation)
13. [Drag & Drop (Board / Backlog / Status)](#13-drag--drop-board--backlog--status)
14. [Rich Text Editor (CKEditor 5)](#14-rich-text-editor-ckeditor-5)
15. [Lịch sự kiện (FullCalendar)](#15-lịch-sự-kiện-fullcalendar)
16. [Upload file (S3 Presigned URL)](#16-upload-file-s3-presigned-url)
17. [Đa ngôn ngữ (i18n)](#17-đa-ngôn-ngữ-i18n)
18. [TailwindCSS & Design System](#18-tailwindcss--design-system)
19. [Performance: Code Splitting & Lazy Loading](#19-performance-code-splitting--lazy-loading)
20. [Code Convention, Lint & Format](#20-code-convention-lint--format)
21. [Build & Triển khai (Docker / Vercel)](#21-build--triển-khai-docker--vercel)
22. [Mô tả chi tiết các Feature Module](#22-mô-tả-chi-tiết-các-feature-module)

---

## 1. Tổng quan hệ thống

JiPLC là ứng dụng SPA, render hoàn toàn ở phía client (Client-Side Rendering). Toàn bộ logic UI/UX, điều hướng, state, caching đều chạy trên trình duyệt. Backend được tách rời, giao tiếp qua **REST API** (HTTP/JSON) trên endpoint:

```
${VITE_PLC_<ENV>_URL}/api/
```

Kiến trúc tổng quát:

```
┌──────────────────────────────────────────────────────────────┐
│                       Browser (User)                          │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │  React 18 SPA  (Vite bundled, SWC transpiled)            │ │
│ │  ┌─────────┐  ┌──────────────┐  ┌────────────────────┐   │ │
│ │  │ Routing │  │ React Query  │  │  Context API       │   │ │
│ │  │ (v6)    │  │ (server      │  │  (auth, board,     │   │ │
│ │  │ lazy +  │  │  state cache)│  │   backlog…)        │   │ │
│ │  │ guards  │  │              │  │                    │   │ │
│ │  └─────────┘  └──────────────┘  └────────────────────┘   │ │
│ │           │           │                    │              │ │
│ │           └───────────┴────────────────────┘              │ │
│ │                       │                                   │ │
│ │            ┌──────────▼────────────┐                      │ │
│ │            │   HttpHelper (axios)  │◄── auto refresh JWT  │ │
│ │            │  interceptor + i18n   │                      │ │
│ │            └──────────┬────────────┘                      │ │
│ └───────────────────────┼───────────────────────────────────┘ │
└─────────────────────────┼─────────────────────────────────────┘
                          │  REST/JSON  (Bearer JWT)
                          ▼
              ┌────────────────────────┐
              │   PLCBaseApi (Backend) │
              │   + S3 / Object Store  │
              └────────────────────────┘
```

Các trục nghiệp vụ chính:

- **Project** – Tạo / quản trị dự án, thành viên, lời mời, vai trò.
- **Backlog** – Danh sách issue chưa nằm trong sprint, có thể kéo-thả sắp xếp.
- **Sprint** – Vòng phát triển (start / complete), gắn issue.
- **Board** – Kanban board theo `ProjectStatus`, kéo-thả issue đổi cột & vị trí.
- **Issue** – CRUD issue (type, priority, story point, assignee, reporter, comment).
- **Event** – Lịch sự kiện theo dự án (FullCalendar).
- **Admin** – Quản lý user, role, permission, config setting toàn hệ thống.

---

## 2. Tech Stack

### 2.1. Core

| Hạng mục          | Công nghệ                        | Phiên bản | Vai trò                                                  |
| ----------------- | -------------------------------- | --------- | -------------------------------------------------------- |
| UI Library        | `react`, `react-dom`             | ^18.2.0   | Component-based UI, Concurrent rendering, `StrictMode`   |
| Ngôn ngữ          | `typescript`                     | ^4.9.3    | Strict typing toàn dự án (`"strict": true` ở tsconfig)   |
| Build tool        | `vite`                           | ^4.2.0    | Dev server siêu nhanh, HMR, ESM-native, bundle prod      |
| Transpiler        | `@vitejs/plugin-react-swc`       | ^3.0.0    | Dùng **SWC** (Rust) thay Babel để tăng tốc transpile     |
| CSS framework     | `tailwindcss`                    | ^3.3.1    | Utility-first CSS, JIT compile                           |
| CSS preprocessor  | `postcss`, `autoprefixer`        | -         | PostCSS pipeline cho Tailwind                            |

### 2.2. Routing & State

| Thư viện                              | Vai trò                                                                |
| ------------------------------------- | ---------------------------------------------------------------------- |
| `react-router-dom` ^6.10              | Routing v6 (object-based, `useRoutes`, `Outlet`, nested route)         |
| `@tanstack/react-query` ^4.29         | Server-state management, cache, mutation, invalidation                 |
| `@tanstack/react-query-devtools`      | Bộ debug query (chỉ bật ở dev)                                         |
| React Context API (built-in)          | Quản trị client-state cục bộ (`AppContext`, `BoardContext`, …)         |

### 2.3. HTTP & Form

| Thư viện           | Vai trò                                                       |
| ------------------ | ------------------------------------------------------------- |
| `axios` ^1.3.5     | HTTP client, request/response interceptor, error normalization|
| `query-string`     | Serialize query params (mảng, object…) thân thiện C# Web API  |
| `react-hook-form`  | Quản lý form, validate, register, control, FieldError         |

### 2.4. UI Libraries

| Thư viện                                              | Vai trò                                                |
| ----------------------------------------------------- | ------------------------------------------------------ |
| `@hello-pangea/dnd` ^16.2.0                           | Drag-and-drop (fork actively-maintained của `react-beautiful-dnd`) |
| `@ckeditor/ckeditor5-build-classic` + `ckeditor5-react` | Rich-text editor (mô tả issue, comment)              |
| `@fullcalendar/*` ^6.1.8                              | Calendar (dayGrid, timeGrid, interaction)              |
| `framer-motion` ^10                                   | Animation declarative (modal, sidebar, scale)          |
| `react-toastify`                                      | Toast notification toàn cục                            |
| `react-tooltip`                                       | Tooltip                                                |
| `react-paginate`                                      | Pagination control                                     |
| `react-select`                                        | Select / MultiSelect                                   |
| `react-datepicker`                                    | DateTimePicker                                         |
| `@iconify/react`                                      | Icon set khổng lồ qua tên (ant-design, akar-icons,…)   |

### 2.5. Util

| Thư viện     | Vai trò                                                                |
| ------------ | ---------------------------------------------------------------------- |
| `moment`     | Format / convert datetime, UTC offset (đối ứng `EnvConfig.TimeZoneUTC`)|
| `lodash`     | Utility functional                                                     |
| `i18next` + `react-i18next` | I18n, switch en/vi runtime                              |

---

## 3. Yêu cầu môi trường & Cách chạy

### 3.1. Yêu cầu

- **Node.js** ≥ 18 (Dockerfile dùng `node:18-alpine`).
- **npm** ≥ 9 (hoặc `pnpm`/`yarn` tương đương).

### 3.2. Scripts (`package.json`)

| Script              | Mô tả                                                                  |
| ------------------- | ---------------------------------------------------------------------- |
| `npm run dev`       | Chạy Vite dev server tại `http://localhost:3000`                       |
| `npm run build`     | `tsc` (type-check) + `vite build` (sinh `dist/` cho production)        |
| `npm run preview`   | Phục vụ thư mục `dist/` qua `vite preview` (kiểm tra build)            |
| `npm run lint`      | ESLint check toàn bộ `src/`                                            |
| `npm run lint:fix`  | ESLint tự động fix                                                     |
| `npm run prettier`  | Kiểm tra format                                                        |
| `npm run prettier:fix` | Tự động format `.ts/.tsx/.css/.scss`                               |

### 3.3. Dev server config (`vite.config.ts`)

- Plugin: `@vitejs/plugin-react-swc` (transpile bằng SWC).
- Cổng dev: **3000**.
- `css.devSourcemap: true` để debug Tailwind generated class.
- Alias: `~` → `./src` (đồng bộ với `paths` trong `tsconfig.json`).

---

## 4. Biến môi trường & Cấu hình

### 4.1. Biến môi trường (`src/configs/envConfig.ts`)

Sử dụng `import.meta.env` của Vite. Vite chỉ expose biến có tiền tố `VITE_`.

```ts
const environment = import.meta.env.VITE_ENVIRONMENT

export const EnvConfig = {
  PLCBaseUrl: import.meta.env[`VITE_PLC_${environment}_URL`] ?? 'https://base.phuocleoceo.tech',
  HttpTimeout: import.meta.env.VITE_HTTP_TIMEOUT ? Number(import.meta.env.VITE_HTTP_TIMEOUT) : 10000,
  TimeZoneUTC: import.meta.env.VITE_TIMEZONE_UTC ? Number(import.meta.env.VITE_TIMEZONE_UTC) : 7
} as const
```

| Biến                            | Mục đích                                                                    | Mặc định                       |
| ------------------------------- | --------------------------------------------------------------------------- | ------------------------------ |
| `VITE_ENVIRONMENT`              | Tên môi trường (`LOCAL`, `DEV`, `PROD`…). Dùng để chọn URL backend tương ứng. | (không)                        |
| `VITE_PLC_<ENV>_URL`            | URL backend ứng với `VITE_ENVIRONMENT`.                                     | `https://base.phuocleoceo.tech` |
| `VITE_HTTP_TIMEOUT`             | Timeout của axios (ms)                                                      | `10000`                        |
| `VITE_TIMEZONE_UTC`             | Offset múi giờ dùng cho `moment.utcOffset()`                                | `7`                            |

Cách thiết lập: tạo file `.env.local` (gitignored) ở root, ví dụ:

```bash
VITE_ENVIRONMENT=LOCAL
VITE_PLC_LOCAL_URL=http://localhost:7133
VITE_HTTP_TIMEOUT=15000
VITE_TIMEZONE_UTC=7
```

### 4.2. App config (`src/configs/appConfig.ts`)

```ts
export const AppConfig = {
  PLCBaseApi: `${EnvConfig.PLCBaseUrl}/api/`
} as const
```

`PLCBaseApi` được dùng làm `baseURL` cho axios.

---

## 5. Cấu trúc thư mục

Dự án theo **Feature-based / Domain-driven folder layout** (mỗi module nghiệp vụ là một thư mục độc lập, đóng gói đầy đủ `apis`, `components`, `models`, `pages`, `routes`, `contexts`, `hooks`, `layouts`).

```
plc-base-react/
├── public/                       # static assets được serve trực tiếp
├── index.html                    # entry HTML (có #root, #portal)
├── vite.config.ts                # cấu hình Vite + alias `~`
├── tailwind.config.js            # tokens / theme Tailwind
├── tsconfig.json                 # paths `~/*` → `src/*`
├── Dockerfile                    # build multi-stage: node-alpine → nginx
├── docker-compose.yml            # local container compose
├── vercel.json                   # rewrite cho SPA trên Vercel
└── src/
    ├── @types/                   # khai báo type bổ sung (vd: i18next.d.ts)
    ├── assets/                   # ảnh, svg, json locale
    ├── configs/                  # envConfig, appConfig
    ├── main.tsx                  # entry React + providers
    ├── App.tsx                   # root + ToastContainer
    ├── index.css                 # tailwind directive + theme CSS variables
    ├── common/                   # phần dùng chung toàn app
    │   ├── components/           # ~22 component tái sử dụng (Modal, SelectBox, …)
    │   ├── contexts/             # AppContext, ReactQueryProvider
    │   ├── hooks/                # useToggle, useQueryParams
    │   ├── layouts/              # MainLayout
    │   ├── locales/              # i18n setup (en/vi)
    │   └── routings/             # useRouteElements, guardRoute
    ├── shared/                   # tài nguyên dùng chung không phụ thuộc react
    │   ├── constants/            # QueryKey, IssueType, LocalStorageKey, …
    │   ├── enums/                # HttpStatusCode, *Permission enums
    │   ├── helpers/              # http, localStorage, validation, time, upload …
    │   └── types/                # BaseResponse, PagedResponse, BaseParams …
    └── features/                 # các module nghiệp vụ
        ├── address/              # API địa chỉ (tỉnh/huyện/xã)
        ├── admin/                # bảng điều khiển admin
        │   └── features/         # admin sub-modules: user, projectRole, …
        ├── auth/                 # login, register, recover password
        ├── backlog/              # quản lý backlog
        ├── board/                # Kanban board
        ├── event/                # lịch sự kiện
        ├── home/                 # sidebar trang chủ
        ├── invitation/           # invite user vào project
        ├── issue/                # CRUD issue + comment
        ├── media/                # upload file / presigned URL
        ├── memberRole/           # vai trò thành viên project
        ├── profile/              # profile user, thanh toán
        ├── project/              # CRUD project + permission
        ├── projectMember/        # quản lý member của project
        ├── projectStatus/        # cột trạng thái của board
        └── sprint/               # CRUD sprint, start, complete
```

### Quy tắc nội bộ một feature

Một feature đầy đủ thường gồm:

```
features/<name>/
├── apis/        # gọi HTTP qua HttpHelper (axios instance)
├── models/      # type/interface Request, Response, DTO (xxxModel.ts + xxxType.ts)
├── components/  # component đặc thù feature (không tái dùng ngoài)
├── pages/       # trang được mount qua Route
├── routes/      # khai báo `RouteObject[]` của feature, được spread vào root
├── hooks/       # custom hook riêng (useCurrentProject, useProjectPermission)
├── layouts/     # layout riêng (nếu có)
└── contexts/    # context cục bộ (BoardContext, BacklogContext)
```

Mỗi thư mục con xuất `index.ts` để gom export (barrel pattern) → import rút gọn:

```ts
import { IssueApi } from '~/features/issue/apis'
import { CreateIssueRequest } from '~/features/issue/models'
```

---

## 6. Quy ước import & Path alias

- Vite alias: `~` → `./src` (xem `vite.config.ts`).
- TS `paths`: `"~/*": ["src/*"]` (xem `tsconfig.json`) → IDE hiểu được & autocomplete.
- Không dùng relative import sâu (`../../../`), luôn ưu tiên `~/features/...`.
- Sắp xếp import theo nhóm: lib → alias → relative.
- ESLint plugin `eslint-plugin-import` + `eslint-import-resolver-typescript` resolve theo `tsconfig.paths`.

---

## 7. Hệ thống Routing & Guard

### 7.1. Tổng hợp routes (`src/common/routings/useRouteElements.tsx`)

```ts
const routes: RouteObject[] = [
  ...authRoute,
  ...profileRoute,
  ...projectRoute,
  ...userInvitationRoute,
  ...adminRoute,
  ...defaultRoute
]
export default function useRouteElements() { return useRoutes(routes) }
```

Mỗi feature **tự khai báo** `RouteObject[]` của mình rồi spread vào array tổng. Cách làm này giữ feature tự trị – thêm/xóa một feature chỉ cần sửa duy nhất 1 dòng.

### 7.2. Guard route (`guardRoute.tsx`)

```ts
export const RequiredAuthenticatedRoute = () => {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/auth/login' />
}

export const RequiredAdminRoute = () => {
  const { isAuthenticated, role } = useContext(AppContext)
  if (!isAuthenticated) return <Navigate to='/auth/login' />
  return role === 'admin' ? <Outlet /> : <Navigate to='/access-denied' />
}
```

- `RequiredAuthenticatedRoute` – bảo vệ mọi nhánh cần đăng nhập.
- `RequiredAdminRoute` – bảo vệ nhánh `/admin/*`.

### 7.3. Default route

```ts
{ path: '/',              element: <RequiredAuthenticatedRoute />, children: [...] }
{ path: '/access-denied', element: <AccessDenied /> }
{ path: '*',              element: <NotFound /> }
```

### 7.4. Nested route ví dụ (`projectRoute`)

```
/project
  └── '' → ProjectList            (HomeLayout)
  └── ':projectId'
       ├── 'setting'              (ProjectLayout)
       ├── ...projectBoardRoute   (/board)
       ├── ...projectBacklogRoute (/backlog)
       ├── ...projectMemberRoute  (/member)
       ├── ...projectInvitationRoute (/invitation)
       └── ...eventRoute          (/event)
```

`projectId` được parse từ `useParams()` ở mọi page con và dùng làm key của React Query → cache theo dự án.

### 7.5. Code splitting với `lazy` + `Suspense`

Tất cả page đều `lazy(() => import('...'))` và bọc trong `<Suspense>` → giảm bundle initial, mỗi route được tải khi cần:

```tsx
const Login = lazy(() => import('~/features/auth/pages/Login'))
{ path: '/auth/login', element: <AuthLayout><Suspense><Login /></Suspense></AuthLayout> }
```

Tương tự cho component modal nặng (CKEditor, ConfirmModal, CreateIssue, CreateSprint, …): `lazy` được dùng trực tiếp trong page để chỉ load khi user mở modal.

---

## 8. Quản lý state: React Query + Context API

### 8.1. Phân loại state

| Loại state                                | Công cụ                | Ví dụ                                      |
| ----------------------------------------- | ---------------------- | ------------------------------------------ |
| **Server state** (data từ API, có cache)  | `@tanstack/react-query`| danh sách project, issue, sprint, …        |
| **Global UI state**                       | React Context          | `isAuthenticated`, `role`, `toggleProfile` |
| **Feature-scoped state**                  | React Context          | `BoardContext` (`selectedIssues`, modal…), `BacklogContext` |
| **Local UI state**                        | `useState`, `useToggle`| toggle modal, form data                    |
| **URL state**                             | `useSearchParams` qua `useQueryParams` | filter, pagination param  |

### 8.2. ReactQueryProvider (`queryContext.tsx`)

```ts
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 0 } }
})
```

- Tắt `refetchOnWindowFocus` để tránh refetch không cần thiết.
- `retry: 0` – báo lỗi ngay để toast thông báo, không retry âm thầm.
- `<ReactQueryDevtools initialIsOpen={false}/>` được mount trong provider.

### 8.3. Convention sử dụng useQuery

```ts
const { data: sprintData, isLoading } = useQuery({
  queryKey: [QueryKey.AvailableSprint, projectId],   // key theo constant
  queryFn: () => SprintApi.getAvailableSprint(projectId),
  enabled: isAuthenticated,                          // chỉ gọi khi đã login
  keepPreviousData: true,                            // mượt khi đổi filter/page
  staleTime: 1 * 60 * 1000                           // 1 phút
})
```

`staleTime` được chọn theo độ "động" của data:

| Data                                              | staleTime  |
| ------------------------------------------------- | ---------- |
| Permission, current project                       | 5 phút     |
| Project member select                             | 2 phút     |
| Issue / sprint / project status                   | 1 phút     |

### 8.4. Mutation + invalidate

```ts
const updateBoardIssueMutation = useMutation({
  mutationFn: (data) => IssueApi.updateIssuesInBoard(data.projectId, data.issueId, data.body)
})

updateBoardIssueMutation.mutate(payload, {
  onSuccess: () => queryClient.invalidateQueries([QueryKey.IssueInBoard])
})
```

Tất cả query key được **tập trung** trong `src/shared/constants/queryKey.constant.ts` → tránh typo, dễ tìm chỗ invalidate.

### 8.5. AppContext (`appContext.tsx`)

```ts
interface AppContextInterface {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<...>
  isShowingProfile: boolean
  toggleProfile: () => void
  role: string
  setRole: React.Dispatch<...>
  reset: () => void
}
```

- Initial value đọc từ `localStorage` (access token & role) → reload trang vẫn giữ phiên.
- `useToggle` được tái dùng để build `isShowingProfile/toggleProfile`.

### 8.6. Feature context

- `BoardContext` – quản trị `selectedIssues`, modal di chuyển issue, …
- `BacklogContext` – tương tự cho trang Backlog.

Mỗi context được mount cục bộ qua provider trong `routes/*Route.tsx` (xem `boardRoute.tsx`).

---

## 9. HTTP Layer: Axios + Interceptor + Refresh Token

File: `src/shared/helpers/http.helper.ts`.

### 9.1. Khởi tạo axios

```ts
this.instance = axios.create({
  baseURL: AppConfig.PLCBaseApi,           // ${PLCBaseUrl}/api/
  timeout: EnvConfig.HttpTimeout,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: (params) => queryString.stringify(params)
})
```

`paramsSerializer` dùng `query-string` để serialize đúng định dạng backend C# (`?a=1&a=2` thay vì `a[]=1`).

### 9.2. Request interceptor – gắn Bearer JWT

```ts
this.instance.interceptors.request.use((config) => {
  if (this.accessToken && config.headers) {
    config.headers.authorization = `Bearer ${this.accessToken}`
  }
  return config
})
```

### 9.3. Response interceptor – toast lỗi + refresh token

```ts
this.instance.interceptors.response.use(
  (response) => response,
  (error) => {
    this.showErrorMessage(error)
    return this.handleErrorResponse(error)
  }
)
```

- `showErrorMessage`: hiển thị toast `error.response.data.message` (đã đi qua `i18n.t`) **trừ** các status `401/403/422` (vì 401 sẽ refresh, 403/422 hiển thị trực tiếp ở form/page).
- `handleErrorResponse`: phát hiện `401 Unauthorized` → khởi chạy refresh-token flow.

### 9.4. Refresh-Token flow

```ts
private handleUnauthorizedResponse(error) {
  const { url } = error.response?.config || {}

  // Nếu chính endpoint refresh-token cũng 401 → mất phiên, xoá token.
  if (url === 'auth/refresh-token') { this.clearToken(); return }

  // Giữ promise refresh-token chung cho mọi request 401 đồng thời.
  this.refreshTokenRequest =
    this.refreshTokenRequest ??
    this.handleRefreshToken().finally(() => {
      setTimeout(() => { this.refreshTokenRequest = null }, 10000)
    })

  return this.refreshTokenRequest.then((newAccessToken) =>
    this.instance({ ...config, headers: { ...config.headers, authorization: newAccessToken } })
  )
}
```

Điểm tinh tế:

- **Race condition**: nếu cùng lúc nhiều request 401, chỉ **một** request `/auth/refresh-token` được gọi; các request 401 còn lại đều `await` cùng promise đó.
- Sau khi refresh xong, các request gốc được **retry** với access token mới.
- `setTimeout 10s` reset `refreshTokenRequest` về `null` để vòng tiếp theo có thể refresh lại khi cần.
- Nếu `auth/refresh-token` thất bại → `clearToken()`, user bị đẩy về `/auth/login` ở lần guard tiếp theo.

### 9.5. HttpHelper export

```ts
export default new Http().instance     // axios instance đã cấu hình đầy đủ
```

Các feature API gọi như sau:

```ts
import { HttpHelper } from '~/shared/helpers'
HttpHelper.get<GetProjectsResponse>('project', { params })
HttpHelper.post<CreateIssueResponse>(`project/${projectId}/issue`, body)
```

### 9.6. Type chuẩn của response

```ts
export type BaseResponse<T> = {
  data: T
  statusCode: number
  message: string
  errors: { [key: string]: string[] }
}
export type PagedResponse<T> = BaseResponse<{ totalRecords: number; records: T[] }>
```

Tất cả response từ backend đều unwrap qua `BaseResponse`. Validation lỗi (`422`) trả về `errors` map field → messages.

### 9.7. TypeCheckHelper

`isAxiosError`, `isAxiosUnauthorizedError`, `isAxiosUnprocessableEntityError` để phân loại lỗi an toàn (type-guard).

---

## 10. Auth Flow & Lưu trữ phiên

### 10.1. Endpoint Auth (`features/auth/apis/authApi.ts`)

| Method | URL                          | Mô tả                                 |
| ------ | ---------------------------- | ------------------------------------- |
| POST   | `auth/login`                 | Đăng nhập, trả `accessToken`, `refreshToken`, `roleName`, info user |
| POST   | `auth/register`              | Đăng ký                               |
| PUT    | `auth/confirm-email`         | Xác nhận email                        |
| PUT    | `auth/change-password`       | Đổi mật khẩu                          |
| POST   | `auth/forgot-password`       | Yêu cầu khôi phục                     |
| PUT    | `auth/recover-password`      | Đặt lại mật khẩu                      |
| POST   | `auth/refresh-token`         | Cấp lại access token                  |
| POST   | `auth/revoke-refresh-token`  | Hủy refresh token (logout phía server)|

### 10.2. LocalStorage keys (`localStorage.constant.ts`)

```ts
LocalStorageKey = { AccessToken, RefreshToken, UserInformation, Role }
```

Helper `LocalStorageHelper` (`localStorage.helper.ts`) đóng gói get/set/remove + custom `EventTarget` để phát event `ClearLocalStorage` (có thể subscribe ở chỗ khác đồng bộ logout).

### 10.3. Flow đăng nhập

```tsx
// features/auth/pages/Login.tsx
loginMutation.mutate(loginData, {
  onSuccess: (data) => {
    setIsAuthenticated(true)
    const { accessToken, refreshToken, roleName, ...userInfo } = data.data.data
    LocalStorageHelper.setAccessToken(accessToken)
    LocalStorageHelper.setRefreshToken(refreshToken)
    LocalStorageHelper.setUserInfo(userInfo)
    LocalStorageHelper.setUserRole(roleName)
    window.location.href = '/'    // hard-reload để re-init mọi context
  }
})
```

Lý do dùng `window.location.href` thay cho `navigate('/')`: bảo đảm `Http` instance được khởi tạo lại với access token mới (vì instance đọc token ở constructor).

### 10.4. Logout

```ts
const handleLogOut = () => {
  LocalStorageHelper.clear()
  setIsAuthenticated(false)
  navigate('/auth/login')
}
```

`LocalStorageHelper.clear()` xoá toàn bộ token + thông tin user và dispatch event `ClearLocalStorage`.

---

## 11. Phân quyền (Permission-based RBAC)

### 11.1. Hai cấp phân quyền

- **System role** (admin / member …) – lưu ở `LocalStorage` (`Role`), được dùng bởi `RequiredAdminRoute`.
- **Project permission** – mỗi user trong một project có một tập permission key (string). Backend trả về qua `GET /project/:id/permission`.

### 11.2. `useProjectPermission`

```ts
export default function useProjectPermission(projectId: number) {
  const { data } = useQuery({
    queryKey: [QueryKey.UserPermissionInProject, projectId],
    queryFn: () => ProjectApi.getUserPermissionInProject(projectId),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000
  })
  const permissions = data?.data.data
  const hasPermission = (key: string) => permissions?.includes(key) ?? false
  return { permissions, isLoadingPermission, hasPermission }
}
```

### 11.3. Bộ permission enum (`shared/enums/projectPermission.enum.ts`)

Tách theo domain để check an toàn ở compile-time:

```ts
enum IssuePermission { GetForBoard, UpdateForBoard, MoveToBacklog, GetForBacklog, ... }
enum SprintPermission { Create, Update, Delete, Start, Complete }
enum ProjectStatusPermission { Create, Update, Delete, UpdateForBoard }
enum ProjectPermission, ProjectMemberPermission, InvitationPermission, EventPermission, MemberRolePermission, ...
```

### 11.4. Sử dụng

```tsx
const { hasPermission } = useProjectPermission(projectId)

{hasPermission(ProjectStatusPermission.Create) && (
  <button onClick={toggleCreateStatus}>Create status</button>
)}
```

→ UI ẩn/hiện theo permission; backend là chân lý cuối cùng (server vẫn validate khi mutate).

---

## 12. Form & Validation

### 12.1. React Hook Form

```tsx
const {
  register, setError, handleSubmit,
  formState: { errors, isSubmitting, isSubmitSuccessful }
} = useForm<FormData>()

const handleLogin = handleSubmit((form) => loginMutation.mutate(form, { ... }))
```

- `register` được pass xuống component `<InputValidation>` (component cục bộ) cùng `error: FieldError`.
- `Controller` được dùng cho component không kiểm soát trực tiếp (CKEditor, DateTimePicker, SelectBox…).

### 12.2. Validation client-side

- Regex email: `EmailValidation` (`shared/constants/validation.constant.ts`).
- Quy tắc `required`, `pattern`, `minLength`, … khai báo trực tiếp ở `register('field', { ... })`.

### 12.3. Validation server-side – `ValidationHelper.getErrorFromServer`

```ts
if (errorCode === HttpStatusCode.UnprocessableEntity) {
  Object.keys(errorData.errors).forEach((key) => {
    const errorContents = errorData.errors[key]
      .map((error) => TranslateHelper.translate(error))
      .join('<br/>')
    validateErrors[key] = { message: errorContents, type: 'Server' }
  })
}
```

→ Map từ `errors` của `BaseResponse` thành `ErrorOption` của react-hook-form, gán bằng `setError`. Mỗi message vẫn đi qua i18n để hiển thị đa ngôn ngữ.

---

## 13. Drag & Drop (Board / Backlog / Status)

Sử dụng `@hello-pangea/dnd`. Wrapper tái sử dụng tại `common/components`:

- `DroppableWrapper`: bọc `<Droppable>` + render placeholder.
- `DraggableWrapper`: bọc `<Draggable>` + apply `dragHandleProps`.

### 13.1. Cấu trúc DOM của Board

```tsx
<DragDropContext onDragEnd={handleDragEnd}>
  <DroppableWrapper type="projectStatus" droppableId="project-board" direction="horizontal">
    {projectStatuses.map((status, idx) => (
      <DragDropStatus key={status.id} idx={idx} projectStatus={status} issues={...}>
        <DroppableWrapper type="issueBoard" droppableId={`projectStatus-${status.id}`}>
          {issues.map((issue, idx) => <DragDropIssue ... />)}
        </DroppableWrapper>
      </DragDropStatus>
    ))}
  </DroppableWrapper>
</DragDropContext>
```

### 13.2. Kéo-thả có 3 loại

`handleDragEnd` switch theo `dropResult.type`:

- `projectStatus` – kéo cột (theo `horizontal`).
- `issueBoard` – kéo issue giữa các cột / trong cùng cột (vertical).
- `issueBacklog` – kéo issue trong trang Backlog.

### 13.3. Thuật toán tính `index` mới (fractional indexing)

Để tránh phải cập nhật index của **tất cả** record sau mỗi lần kéo-thả, dự án dùng kỹ thuật **fractional index** (số thực):

```ts
// Drag lên đầu
if (toIndex === 0) {
  return (firstItem.index ?? 0) - 1
}
// Drag về cuối
if (toIndex === list.length - 1) {
  return (lastItem.index ?? 0) + 1
}
// Drag vào giữa 2 phần tử A, B
return (A.index + B.index) / 2
```

→ Chỉ cần **1 record được update** trên backend cho mỗi thao tác kéo-thả. Khi index quá dày đặc (sau nhiều lần thao tác), backend có thể re-balance định kỳ.

Áp dụng cho:

- `getNewStatusIndex` – đổi vị trí cột (`ProjectStatus.index`).
- `getNewIssueIndexNotChangeStatus` – đổi vị trí issue trong cùng status (`projectStatusIndex`).
- `getNewIssueIndexHasChangeStatus` – đổi sang status khác.
- Tương tự ở `ProjectBacklog` (`backlogIndex`).

### 13.4. `draggableId` mã hóa entity id

`draggableId` dạng `projectStatus-<id>` hoặc `issueBoard-<id>`. Khi drop, code parse bằng `parseInt(draggableId.split('-').at(-1))` để biết entity nào vừa kéo.

### 13.5. Cập nhật server

Sau khi tính `newIndex`, call mutation tương ứng (`updateProjectStatus`, `updateIssuesInBoard`, `updateIssuesInBacklog`) → `invalidateQueries` để đồng bộ.

---

## 14. Rich Text Editor (CKEditor 5)

Component dùng chung: `src/common/components/RichTextInput.tsx`.

```tsx
<Controller name={controlField} control={control} defaultValue={defaultValue}
  render={({ field: { onChange } }) => (
    <CKEditor
      editor={ClassicEditor}
      data={defaultValue}
      onChange={(_, editor) => onChange(editor.getData())}
      config={{
        extraPlugins: [uploadPlugin],
        mediaEmbed: { previewsInData: true }
      }}
    />
  )}/>
```

### 14.1. Custom Upload Adapter

CKEditor không tự upload ảnh, dự án viết adapter dùng helper `UploadHelper.upload` (xem mục 16):

```ts
function uploadAdapter(loader) {
  return {
    upload: () => loader.file.then(async (file) => ({
      default: (await UploadHelper.upload(file)) || ''
    }))
  }
}
function uploadPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => uploadAdapter(loader)
}
```

→ Khi user paste / drop ảnh trong editor, ảnh được upload lên S3 (qua presigned URL), CKEditor nhận lại `default` (URL ảnh) để chèn vào HTML.

### 14.2. Tích hợp với react-hook-form

Editor là component không-controlled tự nhiên, dùng `<Controller>` của RHF để bridge: `onChange(editor.getData())` → RHF nhận giá trị HTML string lúc submit.

---

## 15. Lịch sự kiện (FullCalendar)

`features/event/pages/EventSchedule.tsx`:

```tsx
<FullCalendar
  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
  initialView="timeGridWeek"
  customButtons={hasPermission(EventPermission.Create) ? {
    createEventButton: { text: t('create_event'), click: toggleCreateEvent }
  } : {}}
  headerToolbar={{
    start: 'today prev,next',
    center: 'title',
    end: 'timeGridDay,timeGridWeek,dayGridMonth createEventButton'
  }}
  height="90vh"
  events={events}
  eventClick={handleClickEvent}
  datesSet={handleDates}
/>
```

- Khi user đổi tuần/tháng, `datesSet` callback nhận `start`/`end` (ISO), dùng làm `params` cho query → mỗi tầm nhìn cache riêng theo `[QueryKey.EventSchedule, eventParams]`.
- `TimeHelper.toLocal` convert UTC → local theo `EnvConfig.TimeZoneUTC` để hiển thị đúng giờ.
- Event detail / Create event được lazy-load trong modal.

---

## 16. Upload file (S3 Presigned URL)

File: `src/shared/helpers/upload.helper.ts`, `src/features/media/apis/mediaApi.ts`.

### 16.1. Hai chiến lược

| Chiến lược                | Hành vi                                                                                  |
| ------------------------- | ---------------------------------------------------------------------------------------- |
| `uploadByServer`          | POST multipart trực tiếp tới `POST /upload-file`, backend đẩy lên S3 thay client.        |
| `uploadByPresignedUrl` ✅ | Xin presigned URL từ `POST /presigned-upload-url`, sau đó `PUT` file trực tiếp lên S3.   |

Mặc định `upload()` dùng `uploadByPresignedUrl` → giảm tải backend, byte-stream đi thẳng tới S3.

```ts
async function uploadByPresignedUrl(file, prefix) {
  const presigned = (await MediaApi.getPresignedUploadUrl({ prefix, fileName: file.name, contentType: file.type }))?.data.data
  await MediaApi.uploadFileByPresignedUrl(file, presigned.presignedUrl)
  return presigned.objectKey
}
```

### 16.2. Lưu ý quan trọng

`uploadFileByPresignedUrl` dùng **`axios` thuần** (không phải `HttpHelper`) để tránh interceptor gắn `Authorization: Bearer ...` đè header AWS signature.

```ts
return axios.put(presignedUrl, file, { headers: { 'Content-Type': file.type } })
```

### 16.3. Use cases

- Upload avatar (component `ImageUpload`).
- Upload ảnh từ CKEditor (qua adapter).
- Upload ảnh dự án (project image).

---

## 17. Đa ngôn ngữ (i18n)

File: `src/common/locales/i18n.ts`.

```ts
import LOCALE_EN from '~/assets/i18n/en.json'
import LOCALE_VI from '~/assets/i18n/vi.json'

export const locales = { en: 'English', vi: 'Tiếng Việt' } as const

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: { ...LOCALE_EN } },
    vi: { translation: { ...LOCALE_VI } }
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
})
```

### 17.1. Sử dụng

```tsx
const { t, i18n } = useTranslation()
<button>{t('login')}</button>
i18n.changeLanguage('vi')
```

### 17.2. Tích hợp i18n vào error toast

`HttpHelper` gọi `TranslateHelper.translate(data.message)` → backend chỉ trả về **key** (vd `email_required`), frontend dịch sang ngôn ngữ user đang chọn.

### 17.3. Tích hợp vào react-hook-form validation

`ValidationHelper.getErrorFromServer` cũng dịch từng error message → cùng cơ chế.

---

## 18. TailwindCSS & Design System

### 18.1. Cấu hình (`tailwind.config.js`)

- Content scan: `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`.
- Mở rộng `theme.extend`:
  - `colors`: mapping sang **CSS variables** (`var(--primary)`, `var(--c-1)`, …).
  - `boxShadow`: `issue`, `list` (matching style của Jira).
  - `borderWidth: { 2.5: '2.5px' }`, `fontSize: { '90p', '80p' }`.

### 18.2. Theme bằng CSS Variables (`src/index.css`)

```css
.plc-theme {
  --c-1: #fff;
  --c-2: #f4f5f7;
  --c-text: #172b4d;
  --primary: #3920a9;
  --secondary: #439aff;
  ...
}
```

Class `plc-theme` được gắn ở root `<App>` → có thể swap theme bằng cách swap class (light/dark) mà không cần rebuild Tailwind.

### 18.3. Component utility class

Define ở `@layer components`:

```css
.btn         { @apply rounded-[3px] bg-blue-600 px-3 py-1 text-white hover:bg-blue-700; }
.btn-gray    { @apply bg-gray-100 ...; }
.btn-alert   { @apply bg-red-500 ...; }
.btn-icon    { @apply rounded-[3px] p-1 hover:bg-c-2; }
.bg-jira-gradient { @apply bg-gradient-to-r from-[#151642] to-[#321898]; }
.btn-toggle  { /* CSS-only switch */ }
```

→ Templates dùng `.btn`, `.btn-gray`, `.btn-alert` thay vì lặp utility, ngắn gọn và đồng nhất.

---

## 19. Performance: Code Splitting & Lazy Loading

| Kỹ thuật                          | Áp dụng                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------ |
| `lazy()` cho route                | Tất cả page level (Login, ProjectBoard, ProjectBacklog, EventSchedule, …)     |
| `lazy()` cho modal nặng           | `CreateIssue`, `CreateSprint`, `CreateProjectStatus`, `ConfirmModal`, `IssueDetail`, … |
| `<Suspense>` bọc lazy             | Hiển thị fallback (mặc định là `null`, có thể bổ sung `<SpinningCircle/>`)     |
| React Query cache                 | Dữ liệu được tái sử dụng giữa các trang, tránh re-fetch                        |
| `keepPreviousData`                | Khi đổi filter/page, giữ data cũ → UI mượt                                     |
| `staleTime`                       | Giảm số lần refetch không cần thiết                                            |
| `paramsSerializer` query-string   | Giảm payload param vs `URLSearchParams` (hỗ trợ array tốt)                     |
| `framer-motion` chỉ ở chỗ cần     | Hạn chế animation runtime cost                                                 |
| Concurrent rendering (React 18)   | `createRoot` + `<StrictMode>`                                                  |
| Vite SWC                          | Build time nhanh hơn Babel 10–20×                                              |

---

## 20. Code Convention, Lint & Format

### 20.1. TypeScript

- `"strict": true`, `forceConsistentCasingInFileNames`, `isolatedModules`, `noEmit` (vite emit).
- `"target": "ES2015"`, `"jsx": "react-jsx"`, `"module": "ESNext"`.
- Path alias `~/*` → `src/*`.

### 20.2. ESLint

Cấu hình qua:

- `eslint`, `@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`.
- `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`.
- `eslint-plugin-import` + `eslint-import-resolver-typescript` (resolve theo `tsconfig.paths`).
- `eslint-config-prettier` (tắt rule conflict với Prettier).
- `eslint-plugin-prettier` (chạy Prettier như rule ESLint).

### 20.3. Prettier

Chạy với pattern: `"src/**/(*.tsx|*.ts|*.css|*.scss)"`.

### 20.4. Naming convention (suy ra từ code base)

- Component & page: `PascalCase.tsx`.
- Hook: `useXxx.tsx`.
- Helper / constant / enum: `xxx.helper.ts`, `xxx.constant.ts`, `xxx.enum.ts`.
- Barrel export: `index.ts` ở mỗi thư mục con.
- Query key: `snake_case` value, đặt key trong `QueryKey` (const object) – không dùng plain string rải rác.

---

## 21. Build & Triển khai (Docker / Vercel)

### 21.1. Dockerfile (multi-stage)

```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:1.25
COPY --from=builder /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=builder /app/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

- Stage 1: build dist bằng Node 18 alpine.
- Stage 2: serve bằng **Nginx 1.25**, config nằm ở `.nginx/nginx.conf` (cần thiết để rewrite SPA route → `index.html`, gzip, cache static).

### 21.2. `docker-compose.yml`

```yaml
services:
  plc-base-react:
    build: { context: ., dockerfile: Dockerfile }
    environment:
      - VITE_ENVIRONMENT=LOCAL
      - VITE_PLC_LOCAL_URL=http://34.87.103.162:7133
    ports:
      - "3000:80"
```

> ⚠️ Lưu ý: vì Vite inline biến `VITE_*` lúc **build**, các env này thực ra phải có mặt **trước** `npm run build`. Trong docker-compose, để biến thực sự áp dụng cần truyền qua `build.args` rồi ARG/ENV trong Dockerfile, hoặc bake biến vào image khi build CI.

### 21.3. Vercel (`vercel.json`)

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

Rewrite mọi route SPA về `index.html` để React Router xử lý phía client (cần thiết cho deep-link như `/project/12/board`).

---

## 22. Mô tả chi tiết các Feature Module

### 22.1. `features/auth`

- 5 page: Login, Register, ConfirmEmail, ForgotPassword, RecoverPassword.
- Layout: `AuthLayout` (gradient `from-[#151642] to-[#321898]`, lời chào i18n).
- API: `authApi` (xem mục 10.1).

### 22.2. `features/project`

- API: `getProjects`, `getProjectById`, `createProject`, `updateProject`, `deleteProject`, `getUserPermissionInProject`.
- `ProjectList` (`HomeLayout`): list project có pagination, search.
- `ProjectSetting`: cập nhật `name`, `image`, `key`, `leaderId`.
- Hook: `useCurrentProject(projectId)`, `useProjectPermission(projectId)`.
- Layout `ProjectLayout` = `<Sidebar />` + `<Menubar />` + `<main>` + `<Breadcrumbs />`.

### 22.3. `features/board`

- Trang `ProjectBoard` – Kanban.
- Cần có **sprint đang chạy** mới render board, nếu không hiển thị màn hình "Create sprint".
- DnD 2 cấp lồng nhau (status + issue).
- Filter: `FilterBar` (search by text, filter by assignee), `SprintBar` (hiển thị sprint, hành động complete sprint).
- `BoardProvider` cung cấp state cho "Move issue" (chọn nhiều issue, mở modal di chuyển).

### 22.4. `features/backlog`

- Trang `ProjectBacklog` – danh sách issue ngoài sprint.
- DnD vertical (1 cấp).
- "Move to sprint" – multi-select issue rồi bulk move.
- `BacklogProvider` quản lý selection.

### 22.5. `features/sprint`

- API: get available, create, update, delete, **start**, **complete**.
- `CompleteSprint`: chọn cách xử lý issue chưa hoàn thành (`moveType`) – kế thừa khái niệm Scrum.

### 22.6. `features/issue`

- API CRUD + comment (`issueCommentApi` riêng).
- Thuộc tính issue: `title`, `description` (HTML từ CKEditor), `storyPoint`, `priority` (low/medium/high/critical), `type` (coding_task/bug/user_story), `assignee`, `reporter`, `projectStatusId`.
- Icon priority / type lấy từ `assets/svg` (mapping ở `issue.constant.ts`, helper `IssueHelper.getIssueType` / `getIssuePriority`).
- `IssueDetail` là modal lazy-load, chứa form update + comment list.

### 22.7. `features/projectStatus`

- Cột trên Board (Open / In Progress / Done…).
- Cho phép create / rename / delete / drag-drop sort theo `index`.
- Status cuối cùng (theo `index`) được tự suy ra là **trạng thái hoàn thành** dùng cho complete sprint:
  ```ts
  const completedStatusId = projectStatuses?.reduce((arr, cur) => cur.index > arr.index ? cur : arr).id
  ```

### 22.8. `features/projectMember`

- Trang `ProjectMemberList` – CRUD thành viên trong project.
- Liên kết với `memberRole` (gán role cho từng member).

### 22.9. `features/invitation`

- Hai trang:
  - `ProjectInvitationList` – chủ dự án mời thêm user.
  - `UserInvitationList` – user nhận lời mời (route `/user/invitation`).

### 22.10. `features/event`

- Lịch sự kiện trong project, dùng FullCalendar (xem mục 15).

### 22.11. `features/profile`

- Profile cá nhân (sidebar).
- `PaymentCallback` – trang nhận redirect từ cổng thanh toán (`/payment/callback`).

### 22.12. `features/admin`

- Sub-features: `user`, `projectRole`, `projectPermission`, `accessControl`, `configSetting`.
- Bảo vệ bằng `RequiredAdminRoute`.
- Trang: `UserAccountList` (paginated, search), `ProjectRoleList`, `ConfigSettingList`.

### 22.13. `features/address`

- API địa chỉ tỉnh/huyện/xã (dùng cho form đăng ký – `addressWardId`).

### 22.14. `features/media`

- API S3 (presigned URL + upload form-data). Xem mục 16.

---

## Phụ lục A: Sơ đồ dòng dữ liệu một thao tác (move issue trên Board)

```
User kéo issue
   │
   ▼
DragDropContext.onDragEnd
   │  type === 'issueBoard'
   ▼
handleDragDropIssue(dropResult)
   │  parse dragIssueId / dragStatusId / dropStatusId / index
   ▼
getNewIssueIndex* (fractional indexing)
   │
   ▼
updateBoardIssueMutation.mutate({ projectStatusId, projectStatusIndex })
   │
   │  ── HttpHelper.put `project/{id}/board/issue/{issueId}` (Bearer JWT)
   │
   ├── 200 OK → queryClient.invalidateQueries([QueryKey.IssueInBoard])
   │             → useQuery refetch → UI sync
   │
   └── 401 → interceptor refresh token → retry → success/fail
        422 → ValidationHelper → setError → toast
        otherwise → toast error i18n
```

## Phụ lục B: Danh sách Query Key (`shared/constants/queryKey.constant.ts`)

```
personal_profile, anonymous_profile, projects, project_detail,
project_members, project_member_select, project_invitations, user_invitations,
project_statuses, issue_in_board, issue_in_backlog, issue_detail, issue_comment,
user_accounts, user_account_detail, available_sprint, sprint_detail,
roles, project_roles, project_role, all_project_roles, member_roles,
event_schedule, event_detail, config_settings, config_setting_detail,
project_permissions, user_permission_in_project
```

## Phụ lục C: Các helper trong `shared/helpers`

| File                   | Vai trò                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `http.helper.ts`       | Axios instance + interceptor + refresh token (xem mục 9)      |
| `localStorage.helper.ts` | Wrap localStorage + custom event `ClearLocalStorage`        |
| `validation.helper.ts` | Parse server validation errors thành `ErrorOption` cho RHF    |
| `translate.helper.ts`  | Wrapper `i18n.t`, `changeLanguage`, lấy current locale        |
| `time.helper.ts`       | `format`, `howLongFromNow`, `toLocal`, `toUTC0` (moment)      |
| `upload.helper.ts`     | Hai chiến lược upload (server / presigned URL)                |
| `typeCheck.helper.ts`  | Type guard cho `AxiosError` (Unauthorized, UnprocessableEntity)|
| `issue.helper.ts`      | Lookup `IssueType` / `IssuePriority` theo value               |

---

> **Tài liệu này được duy trì cùng repo, mọi thay đổi về kỹ thuật (đổi version lib, đổi flow refresh token, đổi cấu trúc folder…) cần cập nhật lại file này để giữ tính chính xác.**
