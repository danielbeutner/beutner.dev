---
title: Pracht wants to be your Preact framework and also your AI agent's
description: Or how I learned to stop worrying and love 3KB
pubDate: 2026-09-01
---

Every few months a new "Next.js but ..." framework shows up, and every few months I roll my eyes a little before checking it out anyway. This time it's [Pracht](https://pracht.resynapse.dev/), a framework built on Preact instead of React, and it turns out the "but" is more interesting than usual. It's not just smaller - it's making a bet on something almost nobody else in this space is talking about yet.

Let's get into it.

## What Pracht actually is

Pracht's own tagline is "Preact-first. Vite-native. Explicit routing." Three words, three decisions, and each one is a deliberate departure from how Next.js does things.

- **Preact-first**: you get Preact's ~3kB runtime and the same hooks/JSX API you already know, not a React-compatible shim bolted onto React internals.
- **Vite-native**: the dev server and build pipeline are Vite's, not a custom Webpack/Turbopack setup you have to reason about separately.
- **Explicit routing**: routes live in a `routes.ts` manifest you write and read, not a folder structure the framework infers meaning from.

That last point is the one I want to sit with, because it's the actual architectural bet.

## Every route picks its own rendering mode - for real

Next.js has spent years getting more granular about rendering (static params, dynamic exports, partial prerendering in the App Router), but it's still fundamentally trying to infer your intent from how you write a component. Pracht just asks you to say it:

```ts
import { defineApp, group, route, timeRevalidate } from "@pracht/core";

export const app = defineApp({
  shells: {
    public: "./shells/public.tsx",
    app: "./shells/app.tsx",
  },
  middleware: {
    auth: "./middleware/auth.ts",
  },
  routes: [
    group({ shell: "public" }, [
      route("/", "./routes/home.tsx", { render: "ssg" }),
      route("/pricing", "./routes/pricing.tsx", {
        render: "isg",
        revalidate: timeRevalidate(3600),
      }),
    ]),
    group({ shell: "app", middleware: ["auth"] }, [
      route("/dashboard", "./routes/dashboard.tsx", { render: "ssr" }),
      route("/settings", "./routes/settings.tsx", { render: "spa" }),
    ]),
  ],
});
```

One file tells you which path maps to which component, which shell wraps it, which middleware guards it, and - critically - how it renders: SSG, SSR, ISG, or SPA, chosen per route rather than per app. Pracht's own docs put it plainly: "a marketing page can be SSG, a dashboard can be SSR, a settings page can be SPA, and a product catalog can use ISG - all in the same app." Loaders run server-side only, and after the first load, navigation just fetches the loader's JSON rather than a whole new document - which is the same trick Remix popularized, just extended across four render strategies instead of one.

There's a second, less advertised axis that I think is actually the more clever bit: hydration mode is _also_ per-route, independent of render mode. You can pick `full` (the whole route tree hydrates, client router included), `islands` (only interactive components get JS, navigation falls back to normal document loads), or `none` (no framework JS at all). That's Pracht quietly absorbing Astro's islands pitch as an option rather than a whole-app identity - you don't have to choose between "React-style everything's-interactive" and "mostly static, sprinkle in interactivity." You choose per page.

Whether you actually want that much per-route knob-turning is a fair question - more on that below.

## So how does it differ from Next.js, specifically?

To be upfront: this comparison table is Pracht's own framing from its docs, not an independent benchmark I ran. Take it as "here's the case Pracht makes for itself," which is a different thing from "here's what I measured."

||Next.js|Pracht|
|---|---|---|
|UI runtime|React|Preact|
|Routing|File-system convention (App Router)|Explicit manifest (`routes.ts`)|
|Render mode granularity|Per-route, inferred from code shape|Per-route, declared (SSG/SSR/ISG/SPA)|
|Hydration|Full app, always|Per-route: full / islands / none|
|Build tool|Webpack/Turbopack|Vite|
|Deploy targets|Vercel-optimized, others via adapters|Node, Cloudflare Workers, Vercel Edge, Netlify - adapters are "thin," per the docs|

Against the rest of the field, Pracht draws its own, narrower distinctions: it says it's more opinionated and smaller than Next.js; that unlike Remix (which it calls "server-first"), it lets you opt into static rendering per route; that unlike Astro, it defaults to full hydration with islands as a choice rather than the whole architecture; and that it covers more deploy targets than Fresh. I can't independently verify "smaller" or "more opinionated" as measured claims - they're positioning, not benchmarks - but the mechanism behind them (the manifest, the per-route modes) is real and inspectable in the docs.

The honest tradeoff nobody's marketing copy will say out loud: an explicit manifest is more typing and more places to touch when you add a route, in exchange for something file-based routing can't give you - you can `grep routes.ts` and see your entire app's shape, shells, middleware, and render strategy in one file, no filename convention to memorize. If your team has ever spent time figuring out why a `(group)` folder in Next.js wasn't doing what someone expected, you'll understand the appeal immediately. If your team is small and moves fast, the extra file might just feel like ceremony.

## The part that actually surprised me

Buried under "Advanced" in the docs is a whole section called **Agents** - Agentic Web, LLM Content, Agent Workflow, Agent Skills, MCP Server, Capabilities, Agent Trust, Remote MCP. This is not a bolt-on blog post; it's docs-level, and it's the part of Pracht I haven't seen anyone else attempt at the framework layer.

The pitch, in the docs' own words: "The web has two users now - people, and the agents acting on their behalf." Instead of hoping an LLM agent can scrape your DOM correctly, you define a "capability" once, and Pracht projects it across every surface at once - human UI, HTTP endpoint, a browser-callable function, and a remote MCP tool. "One contract. pracht projects it everywhere." There's a `/llms.txt` endpoint for agent discovery, validation errors are returned path-scoped (`/limit: must be <= 20`) so an agent can self-correct instead of just failing, and there's an actual security story attached - Web Bot Auth (RFC 9421) for verifying who's calling, and what the docs call "effect-class-enforced confirmation flows" for anything destructive, plus audit logging and a `pracht eval` CI step for testing agent behavior against your app.

I want to be careful here rather than breathless: this is a bet on a future that hasn't arrived yet. Web Bot Auth adoption is early, most agents today still just scrape pages, and "agent trust infrastructure" as a framework feature is genuinely unproven at scale - there's no ecosystem of case studies to point to. But it's a coherent bet, not a gimmick bolted on for a launch post, and if agentic traffic to web apps keeps growing the way it has been, having this designed in from the routing layer rather than retrofitted later is a real structural advantage.

## Should you actually use this?

A few things worth knowing before you reach for it in anything real. It's a young, small project - the docs I read didn't surface a version number or license, which is worth checking yourself before you commit production code to it. It's built by [Jovi De Croock](https://jovidecroock.com/), whose own blog has a genuinely deep dive into [Preact's hydration internals](https://www.jovidecroock.com/blog/hydration-and-preact/) - which tracks, given how deliberately Pracht separates hydration strategy from render strategy. That's a good sign for the engineering behind it, but it's not the same as a large maintainer team or a battle-tested ecosystem.

And Preact-first is still a real tradeoff, not a free lunch: you lose direct access to the React-only slice of the ecosystem (some libraries need `preact/compat`, and a few just won't play nice), in exchange for a smaller runtime and, per Pracht's design, more explicit control over how each route behaves.

If you're the kind of team that wants to see your whole routing and rendering strategy in one auditable file, that's already comfortable with Preact, and that's curious about what it'd take to make your app legible to agents as well as humans - Pracht is worth a real look, not just a skim. If you need the React ecosystem untouched or you want the safety of a framework with years of production mileage under it, Next.js (or Remix, or Astro, depending on your shape) is still the less risky bet today.

I haven't shipped anything real with Pracht yet - this is a "read the docs closely and got genuinely interested" post, not a "we migrated and here's what broke" post. If I do take it further, that's the post I actually want to write.

---

_Sources: [pracht.resynapse.dev](https://pracht.resynapse.dev/) and its docs, including [Why Pracht?](https://pracht.resynapse.dev/docs/why-pracht), [Islands](https://pracht.resynapse.dev/docs/islands), and [Agents](https://pracht.resynapse.dev/docs/agents)._