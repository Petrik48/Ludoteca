# Ludoteca — восстановленный контекст проекта

> Реконструкция по экспорту Claude и исходникам дизайн-макета на **30 октября 2026 года**. Это исторический контекст, **не аудит текущего GitHub HEAD**. Никаких изменений в приложении или дизайне в ходе реконструкции не выполнялось.
>
> Идентификатор исходного Claude Project: `019ff8f7-c238-7674-98c9-9a8d2311945a`.

## 0. Достоверность, источники и правила чтения

**Метки:** **[ПРИНЯТО]** — явно утверждённое решение / исходный project.md или ADR; **[ИСТОРИЯ/КОД]** — исходник приложения приведён или просмотрен в датированной переписке (не доказательство текущего состояния репозитория); **[МАКЕТ]** — физически предоставленные `.dc.html`, не рабочее приложение; **[СООБЩАЛОСЬ]** — рассказ/память о завершении, без актуального checkout; **[ПЛАН]** — будущий этап; **[ОТКРЫТО]** — не подтверждено либо требуется проверка.

Изученные источники:
- `01_ОРИГИНАЛ_ПРОЕКТА.md` — проектные метаданные, исходный `project.md`, `claude/design.md`, ADR `claude/adr-slice2-play.md`; изучен полностью (340 строк).
- `02_ПОЛНЫЕ_ДИАЛОГИ.md` — большой экспорт выбранных диалогов (83 279 строк, около 5,7 МБ): исследованы метаданные, технические обсуждения и релевантные фрагменты об API, развертывании, компонентах и ошибках. **Не прочитан последовательно дословно весь файл**; автоматический просмотр и выборочные фрагменты не равнозначны построчной полной проверке.
- `04_ПАМЯТЬ_CLAUDE.md` — JSON-экспорт, в частности `project_memories["019ff8f7-c238-7674-98c9-9a8d2311945a"]`; просмотрена проектная память, но **не проверена дословно каждая запись `memory_files` и соседних проектов**.
- `LUDOTECA_DESIGN_SYSTEM_FULL.md` — архивная документация последнего исходного дизайн-макета с полными встроенными исходниками и контрольными SHA-256 (около 819 КБ); изучены оглавление, структура и соответствующие компоненты, **не перепроверено построчно всё содержимое встроенных base64-изображений и служебного `index.html`**.
- Физические `canvas.json`, `Main.dc.html`, `EmptyState.dc.html`, `FormModal.dc.html`, `DeleteDialog.dc.html`, `UIKit.dc.html`, `GameCard.dc.html`, `GameCardEmpty.dc.html`, `PlayFormModal.dc.html`, `DeletePlayDialog.dc.html`, `NotFound.dc.html`: доступны; структура макетов изучена. Крупные inline `data:image/png;base64` не проверялись побайтно на визуальную идентичность.

**Отсутствует:** актуальный checkout исходного React/NestJS монорепозитория, текущий Git log/PR, Prisma migrations, `package.json` и весь CI/CD код как самостоятельные файлы; нет live-доступа к Linear, GitHub, VPS и Figma в рамках этой проверки. Файлы `support.js` и `index.html` дизайн-экспорта не предоставлены как отдельные файлы (содержимое `index.html` включено в полный Markdown-экспорт). Поэтому невозможно окончательно установить состояние сборки на 30.10 или исполнение всех функций, в особенности Slice 2.

**Приоритет:** более поздняя датированная история уточняет ранний roadmap; утверждение в документации ≠ работающая реализация; иллюстрация или кнопка в макете ≠ работающий сценарий.

## 1. Продукт и область ответственности

**[ПРИНЯТО]** *Ludoteca* — собственная личная библиотека настольных игр и журнал сыгранных партий, впоследствии — управление своими Print-and-Play-проектами. Название от *ludoteca* («игротека»), *ludus* («игра»). Две взаимосвязанные задачи:

1. **Game Library** — единый список имеющихся игр, отдельно изданные `PUBLISHED` и самостоятельно собираемые `PNP`.
2. **Play Journal** — журнал фактических партий **только по играм из собственной библиотеки**. Один и тот же формат записи партии для обоих типов игры.

Тип игры управляет прикрепляемыми к ней дополнительными сведениями, а **не** принципом регистрации партий. Периодическая личная эксплуатация важнее демонстрации абстрактного коммерческого сервиса. Второй мотив — учебный full-stack и портфолио: глубина TypeScript/React и архитектурных решений при рабочем backend.

**[ПРИНЯТО]** Single-user. Сейчас не внедрять авторизацию, пользователей/роли, мультитенантность, публичные профили, sharing и отдельное мобильное приложение. Это именно **non-goals**, а не забытые требования. Расширять продукт лишь при появлении реальной потребности.

**[ПРИНЯТО]** Метод поставки: тонкие end-to-end вертикальные срезы **schema → API → UI → deployment**, каждый доводится до Definition of Done прежде следующего. Чистые границы, strict typing, «правильное решение, а не быстрое»; не завышать scope.

### 1.1 Функциональная дорожная карта

| Этап | Функциональные требования | Статус из источников |
|---|---|---|
| Slice 1 — Game Library | CRUD Game; name вводится вручную; type `PNP`/`PUBLISHED`; таблица, фильтр, формы add/edit, delete с подтверждением, пустое состояние, пагинация; загрузка/ошибка; API DTO и валидация | **[ИСТОРИЯ/КОД]** backend/frontend-компоненты и CRUD были в октябрьском checkout; **[СООБЩАЛОСЬ]** инфраструктура развёрнута. Полный DoD (включая 5 **реальных** игр в production DB) не подтверждён текущим снимком |
| Slice 2 — Play Journal | Play = игра из библиотеки + календарная дата + необязательная заметка; создать/получить/изменить/удалить через API; список партий внутри `/games/:id`, удаление с подтверждением, пустой журнал | **[ПРИНЯТО]** контракт и **[МАКЕТ]** формы/страниц; **[СООБЩАЛОСЬ]** Prisma Play, PlaysModule и часть backend-работ созданы; **не доказано**, что весь UI журнал/CRUD и деплой Slice 2 закончены |
| Slice 3 — PnP files | Прикрепление STL/PDF/архивов, настройки и статус печати; объектное хранилище, SQL-метаданные, presigned URL | **[ПЛАН]**; реализации не подтверждено |
| Backlog | BGG API (опциональная подсказка/обогащение только published), игроки/счёт/победитель/длительность/фото, статистика, wishlist, интеграция Python генерации STL → очередь печати, архив игр | **[ПЛАН]**; не делать в текущем срезе без отдельного решения |

**Исходный Definition of Done Slice 1:** полный CRUD по играм с полем `type`, задеплоенное приложение и **5 реальных своих игр в БД**. Исходный `project.md` запрещает начинать Play до его исполнения, однако более поздний октябрьский ADR и память документируют переход к работам над Slice 2. Эту временную неоднозначность нельзя разрешить без актуальных Linear Issues/репозитория/БД.

### 1.2 Точные инварианты предметной области

- Типы: `PNP | PUBLISHED` (в константе принят порядок `['PNP', 'PUBLISHED'] as const`). У обеих категорий единый `Play`.
- `Play.gameId` ссылается на **существующую свою** `Game`; не логировать по глобальному BGG-каталогу.
- `Play.playedAt` — **дата без времени**, wire-формат `YYYY-MM-DD`; не передавать JS `Date` в API и не строить дату фронтом через `new Date(playedAt)`.
- Стартовая партия не имеет структурированных игроков, результатов, winner, duration, attachments. Заметка optional.
- Удаление игры с партиями **запрещено**, история сохраняется.
- `Game.bggId?` — nullable резерв, интеграция BGG ещё не требуется.

## 2. Монорепо и стек

### 2.1 Принятый стек и подтверждённые имена

| Участок | Технологии / соглашения | Достоверность |
|---|---|---|
| Workspaces | `pnpm`, `pnpm-workspace.yaml`, `packageManager` pin | [ПРИНЯТО], [СООБЩАЛОСЬ] |
| UI | React, TypeScript `strict`, Vite, React Router, TanStack Query, feature-folder architecture | [ИСТОРИЯ/КОД] |
| UI-kit | `@ludoteca/ui-kit`, shadcn-подобный стек, Base UI (`@base-ui/react/*`), Tailwind CSS v4, CSS custom properties/`oklch`, `lucide-react` | [ИСТОРИЯ/КОД] + [СООБЩАЛОСЬ] |
| Общие wire-типы | `@ludoteca/types` | [ПРИНЯТО] ADR; [СООБЩАЛОСЬ] перенесены LUD-11 |
| API | NestJS, strict TS, controllers/services/DTO, `class-validator`, Prisma | [ПРИНЯТО], [ИСТОРИЯ/КОД] |
| DB | PostgreSQL | [ПРИНЯТО], [СООБЩАЛОСЬ] |
| Deployment | Hetzner VPS, Ubuntu 22.04, Docker Compose, nginx, GitHub Actions; `/opt/ludoteca`; пользователь `deploy` | [СООБЩАЛОСЬ] в проектной памяти и истории |
| Health | `/api/health` через `@nestjs/terminus`, проверка Prisma/БД | [СООБЩАЛОСЬ] функционирует |
| PM | Linear (команда `LUD`), Issues/Cycles/Projects, Conventional Commits + Husky + commitlint | [ПРИНЯТО] |
| Storage (позже) | S3-compatible object storage (например Hetzner) | [ПЛАН] |

**Отдельный технический долг:** 28 октября в истории отмечено сосуществование `tailwindcss@^3.4.19` в `apps/web` и `^4.3.3` в корне с `@tailwindcss/vite` v4 и `tailwind.config.js` v3. Предлагалось унифицировать на v4, перенести тему в CSS `@theme`, переоценить `autoprefixer`. **Предложение, исправление не подтверждено.** Не следует трактовать общую запись «Tailwind 4» как доказательство отсутствия v3.

### 2.2 Структура, зафиксированная в просмотренном историческом checkout

```text
Ludoteca/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── prisma/prisma.module.ts, prisma.service.ts
│   │   │   ├── game/         # game.controller.ts, game.service.ts, DTO
│   │   │   └── ...           # PlaysModule сообщался в более поздней памяти
│   │   └── ...               # Prisma schema/migrations — проверить по текущему repo
│   └── web/
│       ├── src/
│       │   ├── App.tsx, main.tsx
│       │   ├── app/router.tsx
│       │   ├── layouts/AppShell/AppShell.tsx, index.ts
│       │   ├── layouts/index.ts
│       │   ├── pages/NotFoundPage.tsx
│       │   └── features/games/
│       │       ├── api.ts, data.ts, schemas.ts, types.ts
│       │       ├── hooks/useGames.ts
│       │       ├── hooks/useCreateGame.ts
│       │       ├── hooks/useEditGame.ts
│       │       ├── hooks/useDeleteGame.ts
│       │       ├── pages/GamesLibraryPage.tsx
│       │       └── components/
│       │           ├── AddGameDialog.tsx, EditGameDialog.tsx
│       │           ├── DeleteConfirm.tsx, EmptyGames.tsx
│       │           ├── GameForm.tsx, GameTypeBadge.tsx
│       │           └── GamesTable.tsx
│       ├── vite.config.ts, tsconfig.json, tsconfig.node.json
│       └── ...
├── packages/
│   ├── ui-kit/src/styles/global.css
│   └── types/
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── deploy.sh
└── ...                       # другие конфиги неизвестны без checkout
```

Это **исторически наблюдённые пути**, не гарантированный исчерпывающий tree. История также упоминает `apps/api/generated/prisma-client` и `apps/api/src/generated/client`: при восстановлении учитывать смену путей генерации Prisma и не включать generated output в Git.

### 2.3 Архитектура frontend

**[ИСТОРИЯ/КОД]** `features/games/` изолирует API-обращения, schema/type, query/mutation hooks и presentation. `GamesLibraryPage` композиционно использовал `useGames`, локальные стейты `isCreateOpen`, `editingGame`, `deletingGame`, `GamesTable`, `EmptyGames`, `AddGameDialog`, `EditGameDialog`, `DeleteConfirm`; `GamesTable` делегировал edit/delete через callbacks. Для сетевых операций существовали отдельные `useCreateGame`, `useEditGame`, `useDeleteGame`; `api.ts` — слой HTTP. React Router управляет `/games/:id` и fallback 404; по более поздней памяти исправляли ошибку вложенности sibling routes.

**[ВАЖНО: известный баг в старом фрагменте]** Исторический код `GamesLibraryPage.tsx` при отображении `DeleteConfirm` передавал `game={editingGame!}` вместо `deletingGame`, а при закрытии обнулял `editingGame` вместо `deletingGame`. Это **не доказательство, что баг остаётся** — память описывает последующую отладку delete-confirmation. Подтвердить состояние на HEAD прежде создания задачи.

**[ИСТОРИЯ/КОД]** В одном фрагменте `GamesLibraryPage` заголовок показывает строку `5 games` независимо от actual count, toggles используют `defaultValue={['all']}` и не видно реальной фильтрации. Ошибка и несоответствие макету требуют сверки с поздней версией, не объявлять их текущими.

**Правило типизации:** не импортировать Prisma model types в React; wire DTO имеют иной формат и живут в `@ludoteca/types`; компонентные конфигурации `satisfies Record<GameType, …>` для исчерпывающего покрытия enum. Валидация на границе backend — DTO; клиентские формы используют feature schema. TanStack Query keys для партий `['plays', { gameId }]`.

### 2.4 Архитектура backend и API

Исторически виден `GameController` с `@Controller('game')`, методами `POST`, `GET`, `GET(':id')`, `PATCH(':id')`, `DELETE(':id')`, `ParseUUIDPipe`, `GameService` + PrismaService, DTO `CreateGameDto` и `UpdateGameDto`. **Не переносить автоматически** старое единственное `/game` в окончательный API: roadmap/ADR говорят о `/games/:id`; в источниках есть различие между ранней реализацией и поздним контрактом. Требуется сверка действительного controller path.

**[ПРИНЯТО, ADR 17.10.2026]** REST для Play:

```http
GET    /plays?gameId=<uuid>
POST   /plays                 # gameId в request body
GET    /plays/:id
PATCH  /plays/:id
DELETE /plays/:id
```

Роуты **плоские**, не `/games/:id/plays/:playId`. Причина: форма регистрации партии из карточки и из общей точки, в перспективе общая лента; исключаются избыточные member routes/дублированные controllers. `GET /games/:id` **не** должен встраивать массив партий: отдельный query. Счётчик `playCount` не принят как обязательный API-поле — решать отдельно при необходимости.

`POST/PATCH` с несуществующим `gameId` → понятная 4xx, не 500. Удаление связанной игры: Prisma `P2003` → `409 Conflict`, не внутренний 500. В UI предупреждать, что нельзя удалить игру с партиями. `onDelete: Restrict` явным образом в `schema.prisma`, `SetNull` отвергнут как нарушение инварианта, `Cascade` отвергнут как потеря истории.

**DTO/wire types:** `GameDto`, `PlayDto`, `CreatePlayInput`, `UpdatePlayInput` плюс аналоги Game в `@ludoteca/types`; DTO-классы Nest `implements CreatePlayInput`, явные `toPlayDto` / `toGameDto` (не сериализовать ORM объект напрямую). `GAME_TYPES = ['PNP', 'PUBLISHED'] as const`. Позднее возможна автоматическая генерация `@nestjs/swagger` → `openapi-typescript`, **сейчас не вводить без решения**. Общие Zod-схемы вместо `class-validator` отклонены, ручное дублирование типов тоже.

### 2.5 Стартовая модель данных и даты

```prisma
// Контрактная модель, НЕ дословная копия текущей schema.prisma
model Game {
  id        ...        // точный Prisma тип и default проверить
  name      String
  type      GameType   // PNP | PUBLISHED
  bggId     ...?       // nullable, будущий BGG
  createdAt DateTime
  plays     Play[]     // отношение, наличие проверить
}

model Play {
  id        ...
  gameId    ...
  game      Game @relation(fields: [gameId], references: [id], onDelete: Restrict)
  playedAt  DateTime @db.Date
  note      String?
  createdAt DateTime
}
```

Этот блок — **логическая спецификация**, не запускаемый Prisma-код: реальные типы ID, names, defaults, timestamps и enum schema следует взять из repo. Сортировка партий `playedAt DESC, createdAt DESC` (стабильный порядок внутри дня). Wire playedAt — строка `YYYY-MM-DD`; backend конвертирует на границе DTO/mapper. В ADR задача `LUD-15` связана с двумя разными форматтерами date-only и timestamp с branded types. Не использовать UTC/locale-преобразование, сдвигающее день.

### 2.6 Deployment и операционные решения

**[СООБЩАЛОСЬ]** Hetzner VPS Ubuntu 22.04; `deploy` non-root, `/opt/ludoteca`; Docker Compose запускает Postgres + Nest API; nginx раздаёт Vite `dist` и проксирует `/api/` в API порт 3000; SPA fallback `try_files $uri $uri/ /index.html`; GitHub Actions CI/CD; health endpoint `/api/health` с проверкой Prisma. В диалогах рассмотрены Docker multi-stage сборка, `prisma generate`, `pnpm install` и secrets для деплоя.

**[ПРИНЯТО/ИСТОРИЯ]** `git pull` выведен из самого `deploy.sh` в отдельный CI workflow step: самоперезапись исполняемого Bash-скрипта при pull создаёт ситуацию, когда текущий запуск использует старые строки. Health-check должен корректно завершаться с ненулевым exit status при неисправности, с ретраями; фальшивый всегда-успешный check недопустим. Нельзя коммитить `.env`, `generated/prisma-client`, `tsconfig.tsbuildinfo`, побочные `vite.config.js/.d.ts`; обсуждался `.gitattributes` с LF для Windows/Linux.

**[ПРИНЯТО/ИСТОРИЯ]** pnpm зафиксирован полем `packageManager`; `publicHoistPattern` перемещали в `pnpm-workspace.yaml` из `.npmrc` после проблемы с pnpm 10+ и резолвингом custom Prisma output. Реальные значения версии/паттернов — только из текущих конфигов.

## 3. Записанные решения и причины

| Вопрос | Решение | Причина / отброшенные варианты | Подтверждение |
|---|---|---|---|
| Домен | Своя библиотека с `PNP`/`PUBLISHED`, единые Play | Личная применимость; BGG не покрывает PnP | [ПРИНЯТО] `project.md` |
| Scope | Single-user, no auth/tenancy/share/mobile | Исключить premature complexity | [ПРИНЯТО] |
| Delivery | Срезы schema→API→UI→deploy, DoD | Каждый этап пригоден к использованию | [ПРИНЯТО] |
| Game creation | Ручной ввод имени без BGG | Минимальный CRUD, PnP не всегда индексирован | [ПРИНЯТО] |
| Play relation | `onDelete: Restrict` | История невосстановима; Cascade опасен, SetNull ломает связь | [ПРИНЯТО] ADR 17.10 |
| API delete | Prisma P2003 → HTTP 409 | Конфликт состояния, не внутренняя ошибка | [ПРИНЯТО], [СООБЩАЛОСЬ] LUD-11 |
| Play date | `@db.Date`, wire `YYYY-MM-DD` | Календарный день, без timezone shift; не timestamptz | [ПРИНЯТО] ADR |
| Ordering | `playedAt desc, createdAt desc` | Стабильность внутри одной даты | [ПРИНЯТО] ADR |
| API plays | Flat REST; GET games не встраивает plays | Общая форма и future feed; нет двух контроллеров | [ПРИНЯТО] ADR |
| Shared types | `@ludoteca/types`, DTO mapper, `implements`, `satisfies` | Избежать drift/Prisma leakage | [ПРИНЯТО], [СООБЩАЛОСЬ] LUD-11 |
| Archive | Отдельное «В архив», `archivedAt`; **не сейчас** | Реальная необходимость возникнет при продаже игры с Play; не подменять Delete архивацией | [ОТЛОЖЕНО] 20.10, LUD-16 |
| Files | S3 object storage, SQL metadata, presigned URL | Нет blob в PG/диске приложения, разделение затрат | [ПЛАН] Slice 3 |
| UI visuals | Zinc+Violet, DM Sans, семантические CSS токены | Последовательный UI, переключаемые темы в будущем | [ПРИНЯТО] |
| Figma sync | **Только вручную по запросу** | Starter MCP сильно rate-limits, автосинк блокировал работу | [ПРИНЯТО] |
| Mascot | Хамелеон, три самостоятельные позы | Узнаваемая анатомия/характер, читабельные empty states | [ПРИНЯТО] |
| Backend ownership | AI пишет backend; владелец ревьюит, утверждает архитектуру; backend PR через branch | Приоритет учебного времени — frontend/TS; качество backend не снижать; коллега ревьюит | [ПРИНЯТО] |
| Git workflow | Не пушить backend напрямую в main; PR; ограниченные commit scopes | Контроль owner + коллеги, прослеживаемость | [ПРИНЯТО] после ошибки direct push |
| Linear | Аналитик только по прямой просьбе; 3–5 tasks по текущему срезу; не создавать без approval | Scope/владелец контролирует план | [ПРИНЯТО] |

## 4. UI/UX и дизайн-система

### 4.1 Источники истины

- `claude/design.md` (в `01_ОРИГИНАЛ_ПРОЕКТА.md`) — решения и палитра.
- Физические `.dc.html` — конкретные макеты **последнего snapshot**. `LUDOTECA_DESIGN_SYSTEM_FULL.md` содержит полный пакет с `canvas.json` и хешами; это архив Claude Design, **не приложение**.
- Claude Design: `https://claude.ai/artifact/Wq6GdcqH31iSrvWorbSYUt`.
- Figma: `https://www.figma.com/design/3Ve5V3T5twuaLNSsK5olUj` (по историческому описанию дублирует экраны; синхронизация вручную).

### 4.2 Базовая палитра

| Token/роль | Light | Dark (описан в design.md, не реализован в исходных light-макетах) |
|---|---|---|
| Background | `#FFFFFF` | `#09090B` |
| Foreground | `#09090B` | `#FAFAFA` |
| Primary | `#7C3AED` (violet-600) | `#8B5CF6` |
| Primary hover | `#6D28D9` | проверить |
| Secondary / muted | `#F4F4F5` | `#27272A` |
| Muted foreground | `#71717A` | `#A1A1AA` |
| Border | `#E4E4E7` | `#27272A` |
| Input border | `#D4D4D8` | `#27272A` |
| Destructive | `#EF4444`, hover `#DC2626` | `#F87171` |
| Dark selected filter | `#18181B` | проверить |
| Published badge | background `#EDE9FE`, foreground `#6D28D9` | проверить |
| PnP badge | background `#FEF3C7`, foreground `#92400E` | проверить |

**[ПРИНЯТО]** Основной шрифт DM Sans, weights 400/500/600; в проектных токенах указан базовый radius `0.625rem` (10px); в статических макетах часто 8px buttons/inputs, 12px tables/cards, 14px dialogs, 4px badges. Это не противоречие, а разные локальные радиусы и глобальный token. Токены семантические (`--foreground`, `--muted-foreground`, `--secondary-foreground`; badge roles `--badge-published`, `--badge-pnp`) в `packages/ui-kit/src/styles/global.css` (`oklch`). Избегать буквальных цветов в рабочем React; дизайн-экспорт намеренно содержит hex inline CSS. История отмечает исправление хаотичного набора оттенков, созданного генератором темы.

### 4.3 Layout, типографика и общая композиция

Типовые full-width artboards 1280px; контент центрируется по `max-width:960px` с внешним padding `48px 24px`; крупные вертикальные интервалы 32px. Заголовок страницы 24px/600 с `letter-spacing:-0.02em`; секции 18px/600; основной текст и controls 14px; таблица heading/badges 12px; muted labels `#71717A`, uppercase headers с letter-spacing. Белые surface на светло-сером основном фоне `#F4F4F5`, граница zinc-200. Отдельный UIKit содержит типографическую шкалу; в проектной памяти она описана как 5 уровней, без доказательства названий уровней из актуального CSS.

### 4.4 Экраны, артборды и состояния (физические исходники)

| Файл | Canvas size | Содержимое | Достоверность |
|---|---|---|---|
| `Main.dc.html` | 1280×900 | Game List: заголовок, счётчик, Add game, переключатели All/Published/PnP; таблица Name/Type/Added/Actions; 5 примерных игр; action dropdown Edit/Delete; pagination Showing 1–5 of 12, страницы 1–3 | [МАКЕТ] |
| `EmptyState.dc.html` | 1280×616 | Пустая библиотека, иллюстрация хамелеона, CTA Add game | [МАКЕТ] |
| `FormModal.dc.html` | 520×440 | Add/Edit Game: Name input, Type select PUBLISHED/PNP, Cancel/Save, X close | [МАКЕТ] |
| `DeleteDialog.dc.html` | 440×240 | Delete game? имя игры, предупреждение irreversible, Cancel/Delete | [МАКЕТ] |
| `UIKit.dc.html` | 1100×2541 | Референс компонентов: buttons, badges, inputs, select, table, dialog, alert dialog, pagination, dropdown, typography, colors | [МАКЕТ] |
| `GameCard.dc.html` | 1280×820 | `/games/:id`: Back to library, title/type/added date, Plays и count, Record play; table Date/Note/actions Delete; пример 4 записей | [МАКЕТ] |
| `GameCardEmpty.dc.html` | 1280×820 | Game detail без партий, иллюстрация и призыв записать первую партию | [МАКЕТ] |
| `PlayFormModal.dc.html` | 520×520 | Record play: Game select (из своих), date input, optional Note textarea, Cancel/Save | [МАКЕТ] |
| `DeletePlayDialog.dc.html` | 440×240 | Delete play? дата, irreversible warning, Cancel/Delete | [МАКЕТ] |
| `NotFound.dc.html` | 1280×700 | 404 fallback; пояснение про client-side React Router; иллюстрация хамелеона | [МАКЕТ] |

**Примеры макетов — не реальные записи БД.** Main: Wingspan (PUBLISHED, 12 Sep), Ark Nova (PUBLISHED, 15 Sep), Patchwork (PUBLISHED, 20 Sep), Arboretum (PNP, 1 Oct), Sprawlopolis (PNP, 3 Oct). На `GameCardEmpty` у Ark Nova дата добавления **5 Oct** — отличается от Main (**15 Sep**). В Main одновременно `5 games` и `Showing 1–5 of 12`: демонстрационные данные не идеально согласованы, не выводить из них product behavior.

**UIKit states:** primary (default/hover/disabled/с иконкой), secondary-outline (default/hover/disabled), destructive (default/hover/disabled), ghost/icon action, filter toggle (active/inactive/hover); badge published/pnp; input default/value/focus/error/disabled; select default/open; таблица/меню/dialog/alert/pagination; шрифты и цвета. Фокус input в макете выделен violet border, ошибка red border + текст ошибки. Диалоги имеют затемнённый backdrop `rgba(9,9,11,.4)` и белый card shadow. `DeleteDialog` красный `#EF4444`, `DeletePlayDialog` `#DC2626` — визуально небольшое различие между отдельными mockups, не переинтерпретировать как сознательно разные семантические destructive tokens.

**Детали поведения, которые макеты только показывают, но не реализуют:** переключение All/Published/PNP, пагинация, меню action, роутинг, lifecycle dialog, validation, CRUD, data fetching и loading/error states. В `.dc.html` класс `Component extends DCLogic` преимущественно возвращает `{}`, а не бизнес-логику. `Main` имеет редакторское свойство `accent` с вариантами `#7C3AED`, `#6366F1`, `#2563EB`, `#0D9488`, но literal CSS остаётся violet; не считать выбор runtime theme feature.

### 4.5 Маскот: утверждённый набор

**[ПРИНЯТО]** Хамелеон вместо ежа/енота/капибары/выдры: легко узнаваем благодаря гребню, глазу-башне, спиральному хвосту, шипам и цепким лапам. Стиль: плоская рисованная заливка **без градиентов/теней**, жирный контур `#18181B`, тело `#8B5CF6`, живот/морда `#F7F3E3`. Три сюжетно самостоятельные позы: `lib-empty` — вертикально на стопке игровых коробок; `plays-empty` — горизонтально на карандаше над чистым листом; `404` — висит вниз головой на хвосте. PNG 512×512 transparent, отображение около 168–200px с DPR2 запасом. Последние HTML содержат картинки как inline base64.

**Техника подготовки:** генерировали растром; срезали плоский фон **flood fill от краёв**, не global color replace, иначе исчезают области сиреневого тела; пересчитывали alpha-edge `(c − (1−a)·bg) / a`, чтобы убрать цветную кайму; упоминался `strip_bg.py` (сам файл не предоставлен). На 56px персонаж плохо читается → favicon нужен отдельный упрощённый рисунок **[ПЛАН]**. Dark иллюстрации с кремовым контуром и `<picture>` + `prefers-color-scheme` **отложены до настоящей dark theme**. Голова предпочтительно в профиль/¾, не анфас в перевёрнутой позе; не просить сложное обвитие объёмного реквизита хвостом.

**A11y:** декоративная иллюстрация `alt=""` именно пустая, размер задан явно (`width`/`height`), `decoding="async"`; `loading="lazy"` для above-the-fold empty state не использовать. По пользовательскому стандарту в UI-коде учитывать клавиатуру, aria-label у icon-only controls, связанные label/input, focus и валидацию; каждое добавленное a11y-свойство объяснять. Дизайн-макеты дают часть этих атрибутов, но не сертификат полной accessibility.

## 5. Прогресс и временная шкала

- **13 августа 2026:** создан исходный Claude Project. В `project.md` определена персональная библиотека, три среза, scope, non-goals.
- **Сентябрь–октябрь 2026:** сформированы дизайн Slice 1, затем Slice 2, UIKit, иллюстрации маскота; handoff в Figma без автоматической синхронизации.
- **13 октября 2026:** в истории есть backend delete implementation и разбор Game controller/service.
- **Октябрь 2026:** отладка VPS/docker/nginx/CI, pnpm/Prisma hoisting, мусора в Git, health checks и сборки; история содержит команды и логи, но не final deployment snapshot.
- **17 октября 2026:** принят ADR Slice 2 (`Play`, Restrict, 409, даты, flat endpoints, shared types).
- **20 октября 2026:** архивирование игры специально отложено как LUD-16. По памяти LUD-11 завершён: добавлены Prisma Play, PlaysModule, shared types, обработка P2003.
- **21 октября 2026:** последнее обновление метаданных исходного Claude Project (`updated_at`), не считать датой последнего коммита.
- **28 октября 2026:** зафиксирован фронтенд dev-build warning; разъяснено, что для localhost Vite dev это нормально, production deploy использует `pnpm --filter web build`; отмечена конфликтующая версия Tailwind 3/4 — **технический долг**. Поздняя память упоминает исправление вложенности React Router и delete-confirmation.
- **30 октября 2026:** экспорт последней версии дизайн-артефакта (архивная дата); перенос контекста в ChatGPT. Не означает, что репозиторий обновлён именно 30.10.

**LUD-11:** по памяти **Completed** (перенос shared types и корректный запрет удаления Game с Plays); без Git proof считайте «исторически сообщено как завершённое». **LUD-15:** форматирование date-only vs timestamps branded types — упомянута как задача, исполнение неизвестно. **LUD-16:** archive backlog, явно deferred. **LUD-12:** встречается в учебной истории TS, но нельзя уверенно восстановить полный scope и статус. Иные номера Issues не создавать предположениями.

## 6. Известный technical debt / проверки

### 6.1 Из истории разработки

1. **Tailwind v3/v4 duplication:** потенциально разные версии `tailwindcss`, старый `tailwind.config.js` при `@tailwindcss/vite` v4; выяснить HEAD, потом решить migration.
2. **Frontend form/delete:** старый код передавал неправильную `editingGame` в DeleteConfirm и сбрасывал не тот state. Более поздняя память сообщает, что это отлаживали; статус на HEAD неизвестен.
3. **Library count/filter/pagination:** в историческом коде `5 games` hardcoded; видимый ToggleGroup не связывал фильтр с таблицей; макет pagination может расходиться с фактическим API. Проверить.
4. **Route naming:** ранний `@Controller('game')` vs более поздний `/games/:id`; проверить contract, consumers и reverse proxy prefix.
5. **Prisma generated output:** проверить, что и `apps/api/generated/prisma-client`, и `apps/api/src/generated/client` не отслеживаются Git, а генерация работает в Docker и локально.
6. **pnpm config:** проверить pinned packageManager, `publicHoistPattern`, lock consistency, именно реально установленный pnpm.
7. **Deployment:** проверить, что workflow действительно делает pull до запуска `deploy.sh`, health failure correctly aborts rollout, `.env` защищён, nginx SPA fallback не перехватывает `/api`.
8. **API errors:** верифицировать `P2003` → `409`, `P2025`/not found → 404, validation 4xx; тесты по контракту.
9. **Date-only:** убедиться в JSON `YYYY-MM-DD`, Prisma `@db.Date`, сортировке и отсутствии timezone bug; проверить задачу LUD-15.
10. **User experience:** loading/error, empty filtered result vs truly empty library, disabled pending buttons, keyboard focus/dialog focus management, screen readers. Не объявлять эти случаи отсутствующими без просмотра нынешнего frontend.
11. **Theme consistency:** соблюдение semantic color tokens вместо raw values, badge PUBLISHED/PNP, светлая/тёмная тема. Dark CSS tokens могут существовать, но dark mascot ассеты намеренно отложены.
12. **Review process:** проверить, что backend изменения идут через feature branch и PR; предыдущий прямой push в main был признан нарушением процесса.

### 6.2 Открытые продуктовые и архитектурные вопросы

- Завершён ли фактически весь Slice 1 DoD (production и именно реальные записи)? На каком Cycle/Issue актуально находится проект?
- Сколько из Slice 2 реально реализовано и задеплоено: POST/GET/PATCH/DELETE, play list, empty state, frontend, сортировка, 409 UI?
- Входит ли редактирование существующей партии в Slice 2 UI? ADR имеет PATCH, но отдельного Edit Play mockup нет.
- Имеет ли Game screen play count и как он получается? ADR оставляет `playCount` открытым решением.
- Где финальный публичный endpoint, какие deployment environments и есть ли тесты/бэкапы production PostgreSQL?
- Какие версии React, NestJS, Prisma, React Router, TanStack Query, Tailwind и pinned pnpm в актуальном lockfile?
- Где исходники иллюстраций отдельно от inline HTML, `strip_bg.py`, license/ownership, Figma snapshot?
- Как вести `GET /games` pagination/filter: client-side или server-side? В макете pagination есть, но функциональный контракт не приведён.
- Источник truth для `GameDto` vs старые `features/games/types.ts` после LUD-11; проверить отсутствие дублей.

**Не инициировать решение этих вопросов в рамках восстановления.** Это checklist для следующего этапа после подключения актуального репозитория/Linear.

## 7. Как работать над Ludoteca после восстановления

### 7.1 Разделение ответственности

**[ПРИНЯТО]** Frontend (React, TS, состояние, HTML/CSS, интеграция) пишет владелец проекта; AI может наставлять, ревьюить, объяснять и помогать. Backend (NestJS/Prisma/migrations/API deployment) AI может реализовывать **на уровне production quality**, но архитектура/schema/contracts/границы принадлежат владельцу; любой backend-code проходит его review и коллеги в PR перед merge. Если владелец не может объяснить архитектурное решение, код не считается принятым. Владелец может взять любую backend-задачу сам; в таком случае AI — наставник.

### 7.2 Стиль технической помощи

- Техлид-ревью без незаслуженной похвалы: объяснять замечания, trade-offs и основания для выбора.
- TypeScript — приоритетное обучение, strict, без `any` как сокращения пути; расписывать важные детали дженериков и narrowing.
- React объяснять при необходимости через Vue 2/3 (хуки ~ Composition API, Context ~ provide/inject), не объяснять базовое программирование как новичку.
- Использовать современные JS/TS idioms (`??`, `?.`, `structuredClone` по уместности), пояснять полезные новшества.
- Accessibility обязательна для создаваемого UI; объяснять новые a11y-атрибуты.
- Оценивать архитектуру системы целиком, не только «чтобы проходило».
- Не подменять утверждённый дизайн новым. Различать артефакт Claude Design, Figma и production UI.
- Conventional Commits со scopes `api`, `ui`, `deps`, `repo`, `release`; актуальную `commitlint` configuration и возможные ограничения заголовка надо сверять в repo. Для автозакрытия Linear в истории упомянут `closes LUD-XX`; не вписывать issue без проверки.

### 7.3 Режим аналитика / Linear

**Только по явному запросу** «спланируй спринт», «предложи задачи» и т.п.: посмотреть фактические Issues/Cycles команды LUD, определить текущий срез из roadmap, предложить 3–5 небольших задач, каждая с привязкой к DoD. Сначала предложить, **не создавать / не редактировать Linear без явного утверждения**. Терминология английской версии Linear. Не приносить backlog/non-goals в текущий срез.

### 7.4 Ссылки/артефакты для восстановления

- Исторический Claude Project ID: `019ff8f7-c238-7674-98c9-9a8d2311945a`.
- Исторический GitHub repo: `Petrik48/Ludoteca` (**не проверен live**).
- Claude Design: `https://claude.ai/artifact/Wq6GdcqH31iSrvWorbSYUt`.
- Figma: `https://www.figma.com/design/3Ve5V3T5twuaLNSsK5olUj`.
- Исходный design ZIP snapshot: `versions/1793332955-7cb3/` по `LUDOTECA_DESIGN_SYSTEM_FULL.md`; исходный `project/canvas.json` SHA-256 `800984d65de1d110dae74fbaace4a2d63695024d275d29f281d8a4fd3da3ec45`; архив не равен текущему Github.
- Linear team: `LUD`; конкретное состояние Issues без подключения не установлено.

## 8. Ближайшая проверка при подключении актуального репозитория (не выполнять сейчас)

1. Получить `git status`, `git log`, `pnpm-lock.yaml`, `package.json`, `pnpm-workspace.yaml`, tree `apps/api`, `apps/web`, `packages/*`, Prisma schema/migrations и workflow/deploy configs.
2. Сопоставить исторические `GameController`, `GamesLibraryPage`, `DeleteConfirm`, routes, DTO, Query hooks с текущим кодом; не «чинить» ранее упомянутые баги до подтверждения.
3. Пройти тестами/ручными сценариями Slice 1 DoD; проверить PostgreSQL games count без разглашения личных данных.
4. Зафиксировать реализованные endpoint-и и UI Slice 2 по факту, затем сопоставить с ADR и макетами.
5. Синхронизировать статус LUD Issues, но без автоматического создания или движения задач.
6. Только после сверки решать, продолжать ли Slice 2 или закрывать остаток Slice 1.

---

**Ключевой вывод:** продукт, non-goals, архитектурные принципы, API Play и дизайн на уровне макета восстановлены из первичных источников. **Точное текущее состояние реализации** установить нельзя без актуального React/NestJS checkout и Linear; память фиксирует часть завершений, но не заменяет проверку кода.
