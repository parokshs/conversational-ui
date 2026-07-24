export function buildSimpleTextCard(markdown: string): string {
  const payload = JSON.stringify({
    component: {
      component: "Card",
      props: {
        children: [
          {
            component: "TextContent",
            props: {
              textMarkdown: markdown,
            },
          },
        ],
      },
    },
  });

  return `<content thesys="true">${payload}</content>`;
}
