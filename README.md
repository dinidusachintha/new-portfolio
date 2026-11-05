# Dinidu — Creative Developer Portfolio

A complete React + TypeScript + Tailwind CSS portfolio inspired by your reference: nearly black backgrounds, oversized white typography, violet details, chrome sculpture artwork, editorial project layouts, and smooth scrolling.

## Run locally

Install **Node.js 22.12+** (or Node.js 24 LTS), extract the ZIP, and open the `dinidu-portfolio` folder in VS Code.

```bash
npm install
npm run dev
```

Open the localhost address printed in your terminal. Keep the terminal running.

If Windows PowerShell blocks `npm.ps1`, use `npm.cmd install` and `npm.cmd run dev`, or choose Command Prompt as your VS Code terminal.

```bash
npm run typecheck
npm run build
npm run preview
```

`npm run build` runs strict TypeScript checking, then builds the production site into `dist/`. `npm run preview` serves that build for inspection. A ready production build is included as well; rebuilding refreshes it after edits. Install dependencies from the included lockfile with `npm ci` when you need an exact repeatable install.

## Included

- Full landing section with original chrome artwork and entrance animations.
- Lenis smooth wheel and anchor scrolling, scroll progress, reveal animations, floating art, and a typography marquee.
- Mobile navigation using a native accessible dialog, with Escape and focus handling.
- Six clearly labeled sample project concepts, category filters, and project detail dialogs.
- Optional ambient background music with play/pause and visible state; pauses when the browser tab becomes hidden.
- About section, local font files, toolkit, expandable expertise sections, process, statement banner, contact, and footer.
- Real image-loading skeletons, initial HTML loading skeleton, deferred project module loading, lazy images, and graceful image fallbacks. Skeletons disappear on actual loading completion, without an artificial loading timer.
- Responsive desktop, tablet, and mobile layouts, including narrow mobile styling.
- Reduced-motion support, keyboard focus indicators, skip link, descriptive labels, and accessible forms.
- All project images and music stored locally. No remote image, font, or audio services are needed at runtime.

## Personalize

Most content lives in **`src/data/portfolio.ts`**. Update:

| Setting | What to change |
| --- | --- |
| `profile.name`, `firstName`, `role` | Your identity and headline label |
| `profile.intro`, `about`, `education` | Your introduction, background, and education |
| `profile.phone` | WhatsApp number in international format, such as `+94727839803` |
| `profile.email` | Your actual email; empty by default |
| `profile.github`, `linkedin` | Your public profile URLs; links appear when configured |
| `profile.cv` | For example `assets/documents/dinidu-cv.pdf`; a download appears when configured |
| `profile.music` | Path to the replacement track |
| `projects` | Your real project titles, categories, descriptions, technology tags, images, and optional live/source links |
| `services` | Your skills and service descriptions |

The sample work is illustrative, not a claim of completed client projects. Replace the sample notice in `src/components/ProjectGrid.tsx` and the sample labels in `src/App.tsx` when you replace all sample work with real projects. Edit the main hero headline, section copy, and monogram in `src/App.tsx` if desired. Brand mark text is also in `src/App.tsx`.

### Images

Place your project screenshots in `public/assets/images/`. For example:

```ts
image: 'assets/images/my-project.webp',
liveUrl: 'https://your-real-project.example',
sourceUrl: 'https://github.com/your-name/your-repository',
```

Use your own real URLs. Leave optional URLs empty until ready; no placeholder links are rendered. Landscape images around 1200 × 810 pixels work well. The grid uses `object-fit: cover`; the source can be WebP, JPG, PNG, or SVG. Set descriptive alt text by editing the project's title and subtitle. Keep asset path capitalization exact for Linux hosting.

### Music

`public/assets/music/ambient-loop.mp3` contains an original 32-second synthesized ambient sample. Replace it with your own licensed MP3 using the same name, or update `profile.music`. Music starts only when a visitor presses the sound button, as browsers generally require a user gesture. It loops at 28% volume and pauses when the tab is hidden. Returning to the tab does not force playback to resume. Native MP3 looping may have a small boundary gap on some browsers.

### Contact behavior

This is a complete **frontend** portfolio. It does not have an email server or store messages.

- With `profile.email` empty, the form validates the fields, prepares the message, tries to copy it, and shows a WhatsApp link with the message prefilled. The visitor sends it in WhatsApp.
- If clipboard permission is unavailable, the prepared message remains visible and selectable.
- Add your actual `profile.email` to make the form open the visitor's email app with a draft instead. The visitor still sends it themselves.
- The WhatsApp number currently uses your supplied business contact. Check it and your other details before publishing.
- To receive submissions directly on your server, replace the submit handler in `src/App.tsx` with an endpoint you control; never put email service secrets in frontend code.

## Folder map

```text
dinidu-portfolio/
  public/assets/
    images/            Chrome hero, sample project SVGs, prism banner, favicon
    music/             ambient-loop.mp3
    documents/         Place your CV here
  src/
    components/        SmartImage and deferred ProjectGrid
    data/portfolio.ts  Editable content and project data
    App.tsx            Page sections and interactions
    styles.css         Tailwind import, design, animations, responsive styles
    main.tsx           React entry
  dist/                Included production build
  index.html           Metadata and first-load skeleton
  vite.config.ts
  tsconfig.json
  package.json
  package-lock.json
```

## Design changes

The accent is `#9867ff`. Update both `--accent` and `--color-violet` in `src/styles.css` to change it. Layout sizes, motion, and mobile rules are in the same file. The site uses Tailwind v4 through `@tailwindcss/vite`, with no separate Tailwind config needed. Self-hosted Manrope comes from `@fontsource-variable/manrope`; the production build includes the font files.

## Publish

Run `npm run build` and upload the **contents** of `dist/` to any static web host, or connect the source to a hosting provider with build command `npm run build` and output folder `dist`. No backend, environment variables, login, or API keys are required. Relative build paths support hosting beneath a subdirectory too. Use a web server; opening `dist/index.html` directly via `file://` does not support JavaScript modules reliably.

`server.allowedHosts: ['terminal.local']` supports the development preview used to check this project. Normal localhost use works without changing it. For a different network development hostname, add only that hostname to this list.

## Validation

The supplied project passed its TypeScript check and production build. Browser checks covered the desktop hero, project filtering, project dialog opening/closing, audio play/pause, 390px mobile menu/contact navigation, contact draft preparation, and 320px horizontal overflow. The message form does not send anything automatically.

See `ASSETS.md` for the sample asset inventory and artwork details.
