# C1 App Template

Template repository for a generative UI chat client, powered by [C1 by Thesys](https://thesys.dev), and bootstrapped with `create-next-app`

[![Built with Thesys](https://thesys.dev/built-with-thesys-badge.svg)](https://thesys.dev)

## Getting Started

First, generate a new API key from [Thesys Console](https://chat.thesys.dev/console/keys) and then set it your environment variable.

```bash
export THESYS_API_KEY=<your-api-key>
```

Install dependencies:

```bash
npm i
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Staged demo data

Demo content lives in `src/demo/data/`. Each demo step is registered in `src/demo/flows/definitions/` and listed in `src/demo/flows/registry.ts`.

The chat API serves pre-generated C1 responses from `src/demo/responses/` for matched questions. Presentation export reads the same TypeScript data directly at runtime, so slides stay aligned with the demo data without a second bootstrap step.

See `src/demo/README.md` for the full workflow.

### When you edit demo data

If you change numbers, intro text, flags, summaries, or other values in `src/demo/data/`:

1. Save the file
2. Regenerate the in-chat response files:

```bash
npm run bootstrap:demo
```

This requires `THESYS_API_KEY` in `.env`.

Presentation export picks up data changes immediately after save. Only the in-chat `.c1.txt` files need bootstrapping.

### When you add a new demo step

1. Add a data file under `src/demo/data/`
2. Add a flow definition under `src/demo/flows/definitions/` with:
   - `buildChatPrompt()` for the in-chat response
   - `buildPresentationSection()` for presentation export
3. Register the flow in `src/demo/flows/registry.ts`
4. Run `npm run bootstrap:demo`

### Exporting a presentation

In demo mode, after the user asks one or more matched demo questions in a thread, they can request a presentation with natural language such as:

- "Export a presentation"
- "Create slides from this conversation"

The app generates a slide artifact from the analyses already shown in that thread, opens it in the native Thesys artifact viewer, and lets the user download PPTX through the built-in export action.

## Learn More

To learn more about Thesys C1, take a look at the [C1 Documentation](https://docs.thesys.dev) - learn about Thesys C1.

## One-Click Deploy with Vercel

[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fthesysdev%2Ftemplate-c1-next&env=THESYS_API_KEY&envDescription=Thesys%20Generative%20UI%20API%20key%20can%20be%20found%20in%20the%20Thesys%20console&envLink=https%3A%2F%2Fchat.thesys.dev%2Fconsole%2Fkeys&demo-title=C1%20Generative%20UI%20API&demo-description=C1%20Generative%20UI%20API%20by%20Thesys%20is%20designed%20to%20create%20dynamic%20and%20intelligent%20user%20interfaces.%20It%20leverages%20large%20language%20models%20(LLMs)%20to%20generate%20UI%20components%20in%20real-time%2C%20adapting%20to%20user%20input%20and%20context.%20Developers%20can%20integrate%20C1%20into%20their%20applications%20to%20enhance%20user%20engagement%20with%20visually%20rich%20and%20responsive%20interfaces.&demo-url=https%3A%2F%2Fchat.thesys.dev&demo-image=https%3A%2F%2Fgithub.com%2FCharlesCreativeContent%2FmyImages%2Fblob%2Fmain%2Fimages%2FC1Hero.png%3Fraw%3Dtrue>)
