# Bao cao du an Astro + EmDash + Cloudflare

Ngay lap bao cao: 31/05/2026  
Thu muc du an: `my-business`  
Ten package: `my-business`  
Phien ban du an: `0.0.3`  
Loai du an: Website server-rendered bang Astro, su dung EmDash CMS, deploy len Cloudflare Workers.

## 1. Tom tat dieu hanh

Du an hien tai la mot website Astro co tich hop EmDash CMS. Huong trien khai dung cua du an la:

1. Astro chay o che do `output: "server"`.
2. EmDash quan ly noi dung, schema, admin UI va media.
3. Cloudflare Workers chay server runtime.
4. Cloudflare D1 lam database.
5. Cloudflare R2 luu media/upload.
6. Cloudflare KV dung cho cache/rate limit.
7. Wrangler dung de preview/deploy.

Nen tang tong the la dung huong, nhung du an hien chua nen xem la production-ready vi con mot so diem de gay loi khi deploy:

- Mot so route CMS van dang dung `getStaticPaths()` va `import.meta.glob()`, khong phu hop voi EmDash dynamic content.
- `wrangler.jsonc` thieu mot so binding quan trong cho Cloudflare runtime.
- `ADMIN_EMAIL` dang de sai format.
- `SITE_URL` dang rong.
- `astro.config.mjs` co cau hinh `ssr` bi lap va bi ghi de.
- Script dev dang la `astro dev`, trong khi voi EmDash nen uu tien `emdash dev`.
- `typescript` chua duoc khai bao truc tiep trong `devDependencies`, co the lam `astro check` yeu cau cai them.

## 2. Cong nghe va phu thuoc hien tai

### 2.1 Runtime va framework

Du an dang su dung cac thanh phan chinh:

| Thanh phan | Vai tro |
| --- | --- |
| Astro | Framework SSR, render pages va API routes |
| EmDash | CMS, admin UI, schema, content API, media UI |
| Cloudflare Workers | Runtime production |
| Cloudflare D1 | Database cho EmDash va table custom |
| Cloudflare R2 | Luu file upload/media |
| Cloudflare KV | Cache/rate limit/session neu cau hinh them |
| Wrangler | Local Cloudflare runtime va deploy |
| React | Ho tro cac thanh phan UI/admin/plugin neu can |
| Tailwind CSS | Styling pipeline qua Vite plugin |
| Resend | Gui email lien he |

### 2.2 Package dang cai trong `node_modules`

Ket qua kiem tra local:

```txt
astro@6.4.2
@astrojs/cloudflare@13.6.0
emdash@0.15.0
@emdash-cms/cloudflare@0.15.0
wrangler@4.95.0
@astrojs/check@0.9.9
```

Khong thay `typescript` trong ket qua `npm ls --depth=0`. Nen bo sung `typescript` vao `devDependencies` de `npm run typecheck` on dinh hon.

### 2.3 Nhan xet ve version

Trong `package.json`, nhieu package dang dung range `^`, vi du:

```json
"astro": "^6.3.0",
"@astrojs/cloudflare": "^13.5.3",
"wrangler": "^4.83.0"
```

Dieu nay giup tu dong nhan minor/patch version moi, nhung voi du an deploy Cloudflare production thi co rui ro:

- Moi truong local va CI/deploy co the cai version khac nhau neu khong dung lockfile dung cach.
- Adapter Cloudflare, Astro va Wrangler thay doi cung luc co the sinh loi kho truy vet.
- Neu EmDash hoac Cloudflare adapter thay doi API runtime, loi co the chi xuat hien khi build/deploy.

Khuyen nghi:

1. Dung `package-lock.json` lam nguon lock chinh.
2. Deploy bang `npm ci`, khong dung `npm install`.
3. Can nhac pin exact version cho cac package runtime quan trong.
4. Chi update package theo dot rieng, sau do chay typecheck/build/deploy preview.

## 3. Cau truc thu muc hien tai

Tong quan cac file/thu muc chinh:

```txt
my-business/
  .agents/
  .astro/
  .wrangler/
  dist/
  migrations/
  node_modules/
  seed/
  src/
  .dev.vars
  .gitignore
  .mcp.json
  AGENTS.md
  astro.config.mjs
  emdash-env.d.ts
  package-lock.json
  package.json
  pnpm-workspace.yaml
  README.md
  tsconfig.json
  worker-configuration.d.ts
  wrangler.jsonc
```

### 3.1 Root files

| File | Vai tro | Danh gia |
| --- | --- | --- |
| `package.json` | Khai bao script, dependencies, EmDash seed | Can doi script dev va bo sung TypeScript |
| `package-lock.json` | Lock dependency tree cua npm | Nen giu, deploy bang `npm ci` |
| `astro.config.mjs` | Cau hinh Astro, adapter, EmDash, Vite | Can don duplicate `ssr` va them cau hinh image/session neu can |
| `wrangler.jsonc` | Cau hinh Cloudflare Workers/D1/R2/KV/env | Can bo sung assets/session/images va sua env |
| `tsconfig.json` | TypeScript config | Co ban on, nhung typecheck can `typescript` |
| `emdash-env.d.ts` | Type generated tu EmDash schema | File generated, khong nen sua tay |
| `worker-configuration.d.ts` | Type generated/Cloudflare | Khong nen sua tay neu do Wrangler tao |
| `.dev.vars` | Secret/local vars | Dung cho local, khong commit secret that |
| `AGENTS.md` | Huong dan cho agent/dev | Dang mo ta dung EmDash template |

### 3.2 Thu muc `src/`

```txt
src/
  components/
    ContactForm.astro
    Navbar.astro
  layouts/
    Base.astro
    Layout.astro
  pages/
    api/
    about/
    category/
    contact/
    posts/
    services/
    tag/
    404.astro
    hoc-vien.astro
    index.astro
    khoa-hoc.astro
    lien-he.astro
    linh-vuc.astro
    [slug].astro
  styles/
    global.css
  utils/
    site-identity.ts
  env.d.ts
  live.config.ts
  worker.ts
```

Nhan xet:

- `src/live.config.ts` dang dung dung pattern EmDash live collection.
- `src/worker.ts` co export `PluginBridge`, phu hop voi EmDash tren Cloudflare.
- `src/env.d.ts` khai bao binding D1/KV/R2/vars, day la huong dung cho `locals.runtime`.
- `src/layouts/Base.astro` dang hardcode title/meta va chua thay su dung `EmDashHead`, `EmDashBodyStart`, `EmDashBodyEnd`.
- `src/pages/[slug].astro` la route CMS page dung huong.
- `src/pages/posts/*` va `src/pages/category/*` dang di theo static Astro pattern, chua dung EmDash pattern.

### 3.3 Thu muc `seed/`

File chinh:

```txt
seed/seed.json
```

Schema hien co:

- Collection `posts`:
  - `title`
  - `featured_image`
  - `content`
  - `excerpt`
  - supports: `drafts`, `revisions`, `search`, `seo`

- Collection `pages`:
  - `title`
  - `content`
  - supports: `drafts`, `revisions`, `search`

- Taxonomies:
  - `category`
  - `tag`

- Menu:
  - `primary`

- Widget area:
  - `sidebar`

Danh gia: schema la starter schema co ban, dung de khoi dau. Neu du an la website trung tam/tin hoc/doanh nghiep that, nen mo rong schema theo noi dung thuc te thay vi hardcode qua cac file `.astro`.

### 3.4 Thu muc `migrations/`

Hien co:

```txt
migrations/
  0001_schema.sql
  0002_seed.sql
```

Nhan xet:

- Hai file SQL hien doc ra khong co noi dung trong lan kiem tra nay.
- Neu dung EmDash D1 adapter, EmDash co the tu quan ly schema rieng.
- Neu co table custom nhu `contacts`, nen co migration ro rang de tao table nay, vi `api/contact.ts` dang insert vao table `contacts`.

Vi du table custom can co:

```sql
CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_address TEXT,
  created_at TEXT NOT NULL
);
```

## 4. Phan tich cau hinh Astro

File: `astro.config.mjs`

Cau hinh hien tai:

```js
export default defineConfig({
  output: "server",
  adapter: cloudflare(),
  integrations: [
    react(),
    emdash({
      database: d1({ binding: "DB", session: "auto" }),
      storage: r2({ binding: "MEDIA" }),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        strict: false,
      },
    },
    optimizeDeps: {
      exclude: ["@astrojs/cloudflare"],
    },
    ssr: {
      noExternal: ["@astrojs/cloudflare"],
    },
    ssr: {
      noExternal: true,
    },
  },
});
```

### 4.1 Diem dung

- `output: "server"` la dung voi EmDash CMS.
- `adapter: cloudflare()` dung voi Cloudflare Workers.
- EmDash dang dung D1 binding `DB` va R2 binding `MEDIA`, phu hop voi `wrangler.jsonc`.
- React integration co the can cho UI/admin/plugin.
- Tailwind Vite plugin da duoc gan vao Vite.

### 4.2 Diem can sua

1. `ssr` bi khai bao hai lan trong `vite`.

Trong JavaScript object, key lap lai se bi key sau ghi de. Nghia la:

```js
ssr: {
  noExternal: ["@astrojs/cloudflare"],
},

ssr: {
  noExternal: true,
},
```

Thuc te chi con `noExternal: true`. Dieu nay co the lam bundle lon hon va kho doan hon.

2. `server.fs.strict: false` nen can nhac.

Cau hinh nay mo rong quyen doc file cua Vite dev server. Neu khong co ly do ro rang, nen bo de giam rui ro.

3. Chua cau hinh image/session binding ro rang.

Build log truoc do cho thay Cloudflare adapter co the dung:

- `IMAGES` binding cho image processing.
- `SESSION` KV binding cho session.

Neu production dung chuc nang nay, `wrangler.jsonc` phai co binding tuong ung.

### 4.3 Cau hinh goi y

```js
import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  output: "server",
  adapter: cloudflare({
    sessionKVBindingName: "SESSION",
    imageService: "cloudflare-binding",
  }),
  image: {
    layout: "constrained",
    responsiveStyles: true,
  },
  integrations: [
    react(),
    emdash({
      database: d1({ binding: "DB", session: "auto" }),
      storage: r2({ binding: "MEDIA" }),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  devToolbar: { enabled: false },
});
```

## 5. Phan tich cau hinh Cloudflare/Wrangler

File: `wrangler.jsonc`

### 5.1 Cau hinh hien tai

```jsonc
{
  "name": "my-business",
  "main": "./src/worker.ts",
  "compatibility_date": "2026-02-24",
  "compatibility_flags": ["nodejs_compat"],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "emdash-db",
      "database_id": "c91a9b21-0b27-4b5d-b02f-b5f9d35379a8",
      "migrations_dir": "migrations"
    }
  ],
  "r2_buckets": [
    {
      "binding": "MEDIA",
      "bucket_name": "my-emdash-media"
    }
  ],
  "kv_namespaces": [
    {
      "binding": "CACHE",
      "id": "1a2a9637493a4bdb83305e580e0f803f"
    }
  ],
  "vars": {
    "SITE_URL": "",
    "ADMIN_EMAIL": "[phungtuan23122003@gmail.com](mailto:phungtuan23122003@gmail.com)"
  }
}
```

### 5.2 Diem dung

- `main` tro den `src/worker.ts`, phu hop voi custom entrypoint.
- `nodejs_compat` dang bat, thuong can cho mot so package Node-compatible.
- Co D1 binding `DB`.
- Co R2 binding `MEDIA`.
- Co KV binding `CACHE`.

### 5.3 Van de can sua

1. Thieu `assets`.

Cloudflare Workers SSR can assets directory de phuc vu file static da build.

2. Thieu `SESSION` KV binding.

Astro Cloudflare session co the can KV binding rieng. Neu adapter dung `SESSION`, deploy se loi neu binding khong ton tai.

3. Thieu `IMAGES` binding.

Neu cau hinh image service dung Cloudflare Images binding, can khai bao `images`.

4. `SITE_URL` dang rong.

`SITE_URL` rong se lam sai URL trong API upload:

```ts
const url = `${SITE_URL}/media/${key}`;
```

Neu `SITE_URL` rong, URL tra ve se thanh `/media/...` hoac sai origin tuy cach noi chuoi.

5. `ADMIN_EMAIL` sai format.

Hien tai:

```json
"ADMIN_EMAIL": "[phungtuan23122003@gmail.com](mailto:phungtuan23122003@gmail.com)"
```

Nen la:

```json
"ADMIN_EMAIL": "phungtuan23122003@gmail.com"
```

### 5.4 Cau hinh goi y

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-business",
  "main": "./src/worker.ts",
  "compatibility_date": "2026-05-31",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "binding": "ASSETS",
    "directory": "./dist",
    "not_found_handling": "404-page"
  },
  "images": {
    "binding": "IMAGES"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "emdash-db",
      "database_id": "c91a9b21-0b27-4b5d-b02f-b5f9d35379a8",
      "migrations_dir": "migrations"
    }
  ],
  "r2_buckets": [
    {
      "binding": "MEDIA",
      "bucket_name": "my-emdash-media"
    }
  ],
  "kv_namespaces": [
    {
      "binding": "CACHE",
      "id": "1a2a9637493a4bdb83305e580e0f803f"
    },
    {
      "binding": "SESSION",
      "id": "your-session-kv-id"
    }
  ],
  "vars": {
    "SITE_URL": "https://your-domain.com",
    "ADMIN_EMAIL": "phungtuan23122003@gmail.com"
  }
}
```

Luu y: `SESSION` KV id phai tao that tren Cloudflare, khong de `your-session-kv-id` khi deploy.

## 6. Phan tich EmDash CMS

### 6.1 Schema hien tai

`seed/seed.json` dang khai bao 2 collections:

#### `posts`

Muc dich: quan ly bai viet/tin tuc.

Fields:

- `title`: tieu de bai viet.
- `featured_image`: anh dai dien, kieu image object.
- `content`: noi dung Portable Text.
- `excerpt`: tom tat.

Supports:

- drafts
- revisions
- search
- seo

#### `pages`

Muc dich: quan ly trang noi dung co ban.

Fields:

- `title`
- `content`

Supports:

- drafts
- revisions
- search

### 6.2 Taxonomy

Taxonomy hien co:

- `category`: hierarchical, dung cho posts.
- `tag`: non-hierarchical, dung cho posts.

Luu y quan trong: khi query EmDash, phai dung dung taxonomy name:

```ts
getTerm("category", slug)
getTerm("tag", slug)
```

Khong dung `"categories"` neu seed khai bao la `"category"`.

### 6.3 Menu va widgets

Menu:

- `primary`: Home, Posts, About.

Widget area:

- `sidebar`: search, categories, recent posts.

Nhan xet: UI hien tai dang hardcode navbar trong `Navbar.astro`, chua thay su dung `getMenu("primary")`. Neu muon admin sua menu duoc, nen query menu tu EmDash thay vi hardcode link.

## 7. Phan tich pages

### 7.1 Route CMS page: `src/pages/[slug].astro`

Trang nay dang di dung huong:

- Decode slug bang `decodeSlug`.
- Query CMS bang `getEmDashEntry("pages", slug)`.
- Neu khong co page thi redirect `/404`.
- Co `Astro.cache.set(cacheHint)`.
- Render content bang `<PortableText />`.
- Lay SEO meta bang `getSeoMeta`.

Diem can xem lai:

- `Base.astro` dang hardcode title/meta, nen cac prop `title`, `description`, `canonical` co the chua duoc render dung.
- `content={{ collection: "pages", id: page.data.id, slug }}` duoc truyen vao `Base`, nhung `Base.astro` hien tai chua khai bao/nhan/gan context EmDash.

### 7.2 Posts index: `src/pages/posts/index.astro`

Hien tai:

- Dung `import.meta.glob("./*.astro")`.
- Lay bai viet tu file `.astro` trong folder posts.

Van de:

- Cach nay chi phu hop blog static bang file.
- Khong lay bai viet tu EmDash CMS.
- Bai viet tao trong admin se khong tu dong xuat hien neu khong co route query CMS.

Huong dung:

```astro
---
import { getEmDashCollection } from "emdash";
import { Image } from "emdash/ui";
import Layout from "../../layouts/Layout.astro";

const { entries: posts, cacheHint } = await getEmDashCollection("posts", {
  limit: 20,
  orderBy: { published_at: "desc" },
});

Astro.cache.set(cacheHint);
---
```

### 7.3 Post detail: `src/pages/posts/[slug].astro`

Hien tai:

- Co `getStaticPaths()`.
- Dung `import.meta.glob()`.
- Lay `frontmatter`.
- Render `<post.Content />`.

Van de:

- EmDash content la dynamic, khong nen dung `getStaticPaths()`.
- Build log truoc do bao `getStaticPaths()` bi ignore trong dynamic page.
- Route nay co the loi runtime vi `Astro.props.post` khong co khi SSR dynamic.

Huong dung:

```astro
---
import { decodeSlug, getEmDashEntry, getSeoMeta, getSiteSettings } from "emdash";
import { Image, PortableText } from "emdash/ui";
import Layout from "../../layouts/Layout.astro";

const slug = decodeSlug(Astro.params.slug);
if (!slug) return Astro.redirect("/404");

const { entry: post, cacheHint } = await getEmDashEntry("posts", slug);
if (!post) return Astro.redirect("/404");

Astro.cache.set(cacheHint);
---
```

### 7.4 Category archive: `src/pages/category/[slug].astro`

Hien tai:

- Hardcode category slugs.
- Dung `getStaticPaths()`.
- Filter bai viet tu `import.meta.glob("../posts/*.astro")`.

Van de:

- Category trong EmDash nam trong taxonomy `category`.
- Bai viet tu admin khong duoc filter dung.
- `getStaticPaths()` khong phu hop voi dynamic CMS content.

Huong dung:

```astro
---
import { decodeSlug, getEntriesByTerm, getTerm } from "emdash";
import Layout from "../../layouts/Layout.astro";

const slug = decodeSlug(Astro.params.slug);
const term = slug ? await getTerm("category", slug) : null;

if (!term) return Astro.redirect("/404");

const { entries: posts, cacheHint } = await getEntriesByTerm("posts", "category", term.slug, {
  orderBy: { published_at: "desc" },
});

Astro.cache.set(cacheHint);
---
```

### 7.5 Tag archive: `src/pages/tag/[slug].astro`

Hien tai:

- Dung `getTerm("tag", slug)`.
- Dung `getEmDashCollection("posts", { where: { tag: term.slug } })`.
- Render image bang `<Image image={...} />`, day la dung voi EmDash image object.

Diem can sua:

- Can lay `cacheHint` tu query va goi `Astro.cache.set(cacheHint)`.
- Nen thong nhat layout voi public site (`Layout`) neu muon navbar/footer hien day du.
- Nen xem lai query taxonomy neu EmDash khuyen dung `getEntriesByTerm`.

## 8. Phan tich layout va UI shell

### 8.1 `Base.astro`

Hien tai:

- Import `global.css`.
- Hardcode:
  - lang `vi`
  - meta description
  - title
  - Google Fonts CDN
  - Font Awesome CDN
- Co slot `head`.
- Co script IntersectionObserver global.

Van de:

- Chua thay su dung props `title`, `description`, `canonical`.
- Chua thay EmDash UI helpers:
  - `EmDashHead`
  - `EmDashBodyStart`
  - `EmDashBodyEnd`
- Neu page truyen SEO meta vao `Base`, layout hien tai chua render dung.
- Dung CDN Google Fonts va Font Awesome co the anh huong performance/privacy/Cloudflare caching.

Huong dung nen co:

```astro
---
import { EmDashHead, EmDashBodyStart, EmDashBodyEnd } from "emdash/ui";
import "../styles/global.css";

interface Props {
  title?: string;
  description?: string;
  canonical?: string;
  content?: {
    collection: string;
    id: string;
    slug?: string;
  };
}

const {
  title = "Tin Hoc Sao Viet",
  description = "Trung tam Tin hoc Sao Viet",
  canonical,
  content,
} = Astro.props;
---

<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{title}</title>
    <meta name="description" content={description} />
    {canonical && <link rel="canonical" href={canonical} />}
    <EmDashHead content={content} />
    <slot name="head" />
  </head>
  <body>
    <EmDashBodyStart content={content} />
    <slot />
    <EmDashBodyEnd content={content} />
  </body>
</html>
```

Can kiem tra lai signature chinh xac cua `EmDashHead` theo docs EmDash truoc khi sua.

### 8.2 `Layout.astro`

`Layout.astro` boc `Base`, render `Navbar`, `main`, footer.

Nhan xet:

- Cach tach `Base` va `Layout` la hop ly.
- Footer va navbar dang hardcode noi dung.
- Neu muon CMS-driven site, menu/footer co the lay tu EmDash site settings/menu.

### 8.3 `Navbar.astro`

Navbar hien hardcode cac link:

- `/`
- `/khoa-hoc`
- `/linh-vuc`
- `/hoc-vien`
- `/about`
- `/services`
- `/contact`

Nhan xet:

- Dung cho giai doan dau.
- Neu admin can sua menu, nen query `getMenu("primary")`.
- Co script dark mode va mobile menu, nhung text trong file dang bi mojibake o nhieu cho, nen can kiem tra encoding UTF-8.

## 9. Phan tich API

### 9.1 `src/pages/api/contact.ts`

Chuc nang:

- Nhan request POST.
- Doc `env` va `ctx` tu `locals.runtime`.
- Rate limit bang KV binding `CACHE`.
- Validate email/message.
- Insert vao D1 table `contacts`.
- Gui email bang Resend trong `ctx.waitUntil`.

Diem dung:

- `export const prerender = false`.
- Dung `locals.runtime.env`, dung pattern Cloudflare adapter.
- Co rate limit theo IP.
- Dung prepared statement D1.
- Dung `ctx.waitUntil` de gui email background.

Rui ro:

- Chua thay migration tao table `contacts`.
- `RESEND_API_KEY` khong co trong `wrangler.jsonc`; co the nam trong `.dev.vars`/secret, production phai set bang Wrangler secret.
- `ADMIN_EMAIL` trong `wrangler.jsonc` sai format.
- `from: 'no-reply@yourdomain.com'` can domain da verify tren Resend.
- Response text trong source dang bi mojibake, nen chuan hoa encoding UTF-8.

Khuyen nghi:

```bash
wrangler secret put RESEND_API_KEY
```

Va tao migration cho table `contacts`.

### 9.2 `src/pages/api/upload.ts`

Chuc nang:

- Nhan form upload.
- Validate MIME type.
- Gioi han 10MB.
- Luu file vao R2 binding `MEDIA`.
- Tra ve URL dua tren `SITE_URL`.

Diem dung:

- Dung R2 binding dung cach.
- Co gioi han file size.
- Co danh sach MIME type cho phep.

Rui ro:

- Chua thay auth/permission. Neu route public, bat ky ai cung upload file.
- `SITE_URL` dang rong.
- Extension lay tu file name chua sanitize chat.
- Chua co checksum/deduplication.
- Chua verify magic bytes, chi tin vao `file.type`.

Khuyen nghi:

- Yeu cau login/admin truoc khi upload neu upload cho CMS/backend.
- Dung generated extension theo MIME type thay vi lay truc tiep tu file name.
- Set `SITE_URL` production.

### 9.3 `src/pages/api/[...key].ts`

Chuc nang:

- Lay object tu R2 theo key.
- Tra ve body va metadata.
- Set cache-control dai han.

Diem dung:

- Dung R2 `get`.
- Co `etag`.
- Co cache header.

Rui ro:

- Route dang nam duoi `/api/[...key]`, trong khi `upload.ts` tao URL `${SITE_URL}/media/${key}`. Hien khong thay route `/media/[...key]`.
- Neu URL tra ve la `/media/...` nhung route doc R2 la `/api/...`, media URL se 404.
- Can thong nhat public media route.

Khuyen nghi:

- Doi route thanh `src/pages/media/[...key].ts`, hoac doi upload URL thanh `${SITE_URL}/api/${key}`.
- Neu media public, can sanitize key va chan path traversal/logical abuse.

### 9.4 `src/pages/api/posts.ts`

Chuc nang:

- GET posts co pagination.
- Optional filter tag.
- Cache response bang KV.
- Query truc tiep D1.

Diem dung:

- Co limit toi da 50.
- Co sanitize tag.
- Co cache key.
- Co prepared statement.

Rui ro:

- Query truc tiep table `posts` co the khong dung voi schema noi bo cua EmDash.
- `json_each(posts.tags)` gia dinh co column `tags`, nhung seed EmDash dang dung taxonomy rieng, khong phai chac chan co column JSON `tags`.
- Cache invalidation khong tu dong gan voi EmDash publish/update.

Khuyen nghi:

- Neu day la API public hien bai viet CMS, nen dung `getEmDashCollection`.
- Neu can query D1 custom, tao table custom rieng va migration rieng.

## 10. Luong chay khi dev/build/deploy

### 10.1 Luong dev nen dung

Hien tai:

```json
"dev": "astro dev"
```

Voi EmDash, nen dung:

```json
"dev": "emdash dev"
```

Luong dung:

1. `npm ci`
2. `npm run dev`
3. EmDash chay migrations/seed/types.
4. Astro dev server start.
5. Admin UI mo tai `http://localhost:4321/_emdash/admin`.
6. Public pages SSR qua Astro routes.

### 10.2 Luong build

Hien tai:

```json
"build": "astro build"
```

Luong build:

1. Astro doc `astro.config.mjs`.
2. Cloudflare adapter duoc kich hoat.
3. EmDash integration mount admin UI va API.
4. Vite build client/server assets.
5. Output vao `dist/`.
6. Worker entrypoint duoc build cho Cloudflare runtime.

Luu y: build truoc do chay duoc khi dat `ASTRO_TELEMETRY_DISABLED=1` va tro `XDG_CONFIG_HOME` vao workspace trong sandbox. Neu chay tren may that/CI thi can dam bao Wrangler co quyen ghi config/log.

### 10.3 Luong deploy

Hien tai:

```json
"deploy": "astro build && wrangler deploy"
```

Nen dung:

```bash
npm ci
npm run typecheck
npm run build
wrangler deploy
```

Truoc deploy can:

- Tao D1 database tren Cloudflare.
- Tao R2 bucket.
- Tao KV namespaces `CACHE` va `SESSION`.
- Set secrets:
  - `RESEND_API_KEY`
- Set vars:
  - `SITE_URL`
  - `ADMIN_EMAIL`
- Chay/apply migrations neu co table custom.

## 11. Cac loi/rui ro uu tien cao

### P1 - Route CMS posts/category sai pattern

Files:

- `src/pages/posts/index.astro`
- `src/pages/posts/[slug].astro`
- `src/pages/category/[slug].astro`

Rui ro:

- Bai viet tao trong EmDash admin khong hien dung.
- `getStaticPaths()` bi ignore trong SSR dynamic page.
- Detail page co the loi runtime do khong co `Astro.props.post`.

Huong xu ly:

- Dung `getEmDashCollection("posts")` cho list.
- Dung `getEmDashEntry("posts", slug)` cho detail.
- Dung `getTerm("category", slug)` va `getEntriesByTerm` cho category.
- Goi `Astro.cache.set(cacheHint)` sau moi query content.

### P1 - Wrangler thieu binding production

File:

- `wrangler.jsonc`

Rui ro:

- Deploy Worker thanh cong nhung runtime loi khi truy cap image/session/assets.
- Upload URL sai do `SITE_URL` rong.
- Email gui sai do `ADMIN_EMAIL` sai format.

Huong xu ly:

- Them `assets`.
- Them KV `SESSION`.
- Them `images` binding neu dung Cloudflare image binding.
- Sua `SITE_URL`.
- Sua `ADMIN_EMAIL`.

### P1 - Table `contacts` chua co migration ro rang

File lien quan:

- `src/pages/api/contact.ts`
- `migrations/`

Rui ro:

- API contact loi D1 khi table `contacts` khong ton tai.

Huong xu ly:

- Tao migration SQL cho `contacts`.
- Chay migration local/remote.

### P2 - `Base.astro` chua render SEO props va EmDash helpers

File:

- `src/layouts/Base.astro`

Rui ro:

- `getSeoMeta` o page khong co tac dung day du.
- Visual editing/admin contribution cua EmDash co the khong hoat dong dung.
- Meta title/description bi hardcode cho moi page.

Huong xu ly:

- Khai bao props trong `Base.astro`.
- Render title/description/canonical.
- Kiem tra docs EmDash va them `EmDashHead`, `EmDashBodyStart`, `EmDashBodyEnd` neu can.

### P2 - `api/upload.ts` public upload khong auth

File:

- `src/pages/api/upload.ts`

Rui ro:

- Nguoi ngoai co the upload file len R2 neu route public.
- Ton chi phi storage/bandwidth.
- Co nguy co upload file khong mong muon.

Huong xu ly:

- Them auth/admin check.
- Neu chi upload qua EmDash media manager, can xem co can custom API nay khong.

### P2 - `api/posts.ts` query truc tiep schema EmDash

File:

- `src/pages/api/posts.ts`

Rui ro:

- Schema EmDash thay doi thi API hong.
- Taxonomy query co the sai.
- Cache KV khong invalidate theo publish/update.

Huong xu ly:

- Doi sang EmDash content API.
- Hoac tao table custom rieng neu day la API rieng.

### P3 - Encoding tieng Viet bi loi trong nhieu file

Vi du thay trong:

- `Base.astro`
- `Navbar.astro`
- `contact.ts`
- Mot so page UI tieng Viet.

Rui ro:

- Giao dien hien ky tu loi.
- Email/response API hien sai tieng Viet.
- Bao tri code kho hon.

Huong xu ly:

- Chuan hoa file ve UTF-8.
- Sua lai text tieng Viet bi mojibake.

## 12. Checklist de dua du an ve trang thai production-ready

### 12.1 Cau hinh package

- [ ] Them `typescript` vao `devDependencies`.
- [ ] Doi `dev` script thanh `emdash dev`.
- [ ] Can nhac them `types` script: `emdash types`.
- [ ] Pin exact version cho package runtime quan trong neu muon on dinh.
- [ ] Dung `npm ci` tren CI/deploy.

Goi y:

```json
{
  "scripts": {
    "dev": "emdash dev",
    "types": "emdash types",
    "build": "astro build",
    "preview": "wrangler dev",
    "deploy": "npm run build && wrangler deploy",
    "typecheck": "astro check"
  },
  "devDependencies": {
    "@astrojs/check": "0.9.9",
    "@cloudflare/workers-types": "4.20260530.1",
    "typescript": "6.0.3",
    "wrangler": "4.95.0"
  }
}
```

### 12.2 Cau hinh Astro

- [ ] Bo duplicate `ssr`.
- [ ] Bo `server.fs.strict: false` neu khong can.
- [ ] Cau hinh Cloudflare session binding neu dung session.
- [ ] Cau hinh image service ro rang neu dung Cloudflare Images.
- [ ] Giu `output: "server"`.

### 12.3 Cau hinh Cloudflare

- [ ] Them `assets`.
- [ ] Them `SESSION` KV.
- [ ] Them `IMAGES` binding neu can.
- [ ] Set `SITE_URL` thanh domain that.
- [ ] Sua `ADMIN_EMAIL` thanh email thuan.
- [ ] Set `RESEND_API_KEY` bang Wrangler secret.
- [ ] Dam bao D1 database id dung moi truong production.
- [ ] Dam bao R2 bucket production dung ten.

### 12.4 CMS routes

- [ ] Doi `/posts` sang query EmDash.
- [ ] Doi `/posts/[slug]` sang `getEmDashEntry`.
- [ ] Doi `/category/[slug]` sang taxonomy query.
- [ ] Them `Astro.cache.set(cacheHint)` cho moi page query content.
- [ ] Dung `<Image image={...} />` cho EmDash image fields.
- [ ] Phan biet `entry.id` va `entry.data.id`.

### 12.5 API

- [ ] Tao migration cho table `contacts`.
- [ ] Them auth/permission cho upload API.
- [ ] Thong nhat media route `/media/[...key]` hoac `/api/[...key]`.
- [ ] Doi posts API sang EmDash API neu la CMS content.
- [ ] Them validation va response JSON headers dong nhat.
- [ ] Xu ly loi D1/Resend/R2 bang try/catch.

### 12.6 SEO/UI

- [ ] Sua `Base.astro` de nhan va render props `title`, `description`, `canonical`.
- [ ] Tich hop EmDash head/body helpers neu dung visual editing/admin context.
- [ ] Sua encoding tieng Viet.
- [ ] Can nhac self-host font/icon thay vi CDN runtime.
- [ ] Chuan hoa navbar/footer theo menu/settings tu EmDash neu can admin quan ly.

## 13. Cau truc muc tieu de xuat

```txt
my-business/
  astro.config.mjs
  wrangler.jsonc
  package.json
  package-lock.json
  tsconfig.json
  seed/
    seed.json
  migrations/
    0001_schema.sql
    0002_contacts.sql
  src/
    live.config.ts
    worker.ts
    env.d.ts
    utils/
      site-identity.ts
    styles/
      global.css
    layouts/
      Base.astro
      Layout.astro
    components/
      Navbar.astro
      ContactForm.astro
    pages/
      index.astro
      404.astro
      [slug].astro
      posts/
        index.astro
        [slug].astro
      category/
        [slug].astro
      tag/
        [slug].astro
      media/
        [...key].ts
      api/
        contact.ts
        posts.ts
        upload.ts
```

Neu du an se la website doanh nghiep/trung tam dao tao, nen can nhac dua cac trang hardcode nhu `khoa-hoc`, `linh-vuc`, `hoc-vien` thanh CMS collections rieng:

- `courses`
- `services`
- `testimonials`
- `teachers`
- `students`
- `landing_sections`

Lam nhu vay thi admin co the cap nhat noi dung khong can sua code.

## 14. De xuat lo trinh sua

### Giai doan 1 - On dinh build/deploy

Muc tieu: Deploy khong loi runtime.

1. Sua `wrangler.jsonc`.
2. Sua `astro.config.mjs`.
3. Them `typescript`.
4. Doi script `dev`.
5. Chay `npm run typecheck`.
6. Chay `npm run build`.
7. Deploy preview bang `wrangler deploy` hoac moi truong staging.

### Giai doan 2 - Sua CMS routes

Muc tieu: Noi dung tao trong EmDash admin hien dung tren public site.

1. Refactor `/posts`.
2. Refactor `/posts/[slug]`.
3. Refactor `/category/[slug]`.
4. Kiem tra `/tag/[slug]`.
5. Them cache hints.
6. Kiem tra image fields.

### Giai doan 3 - Chuan hoa API va data

Muc tieu: API on dinh, co migration, khong query sai schema CMS.

1. Tao migration `contacts`.
2. Sua contact API.
3. Bao ve upload API.
4. Thong nhat media route.
5. Sua posts API.

### Giai doan 4 - Chuan hoa UI/SEO/CMS editing

Muc tieu: Website co SEO dung, noi dung quan ly duoc trong CMS.

1. Sua `Base.astro`.
2. Them EmDash head/body helpers theo docs.
3. Sua encoding tieng Viet.
4. Dua menu/settings ve EmDash neu can.
5. Mo rong schema theo domain that.

## 15. Ket luan

Du an hien tai co nen tang tot de phat trien thanh website Astro + EmDash + Cloudflare Workers. Cac thanh phan chinh nhu Cloudflare adapter, D1, R2, KV, custom Worker entrypoint va EmDash seed da co san.

Tuy nhien, hien trang code van la su pha tron giua:

- Astro static file-based blog pattern.
- EmDash dynamic CMS pattern.
- Cloudflare Workers API pattern.

De du an on dinh va de deploy lau dai, can uu tien dua cac route noi dung ve dung EmDash runtime query, hoan thien Cloudflare bindings, va chuan hoa API/migration. Sau khi cac diem P1 duoc xu ly, du an co the tiep tuc toi uu UI, SEO va schema CMS theo nhu cau thuc te cua website.

