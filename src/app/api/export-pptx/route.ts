import { NextRequest, NextResponse } from "next/server";
import { getMatchedFlowIds, getMessageStore } from "../chat/messageStore";
import { isDemoModeEnabled } from "../../../demo/flows/buildStagedResponse";
import { logDemoRouting } from "../../../demo/logDemoRouting";
import { resolveCachedPptx } from "../../../demo/presentation/presentationCache";

type ExportRequest = {
  exportParams?: string;
  title?: string;
  threadId?: string;
};

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ExportRequest;

  if (isDemoModeEnabled() && body.threadId) {
    const flowIds = getMatchedFlowIds(getMessageStore(body.threadId).messageList);
    const cached = resolveCachedPptx(flowIds);

    if (cached) {
      logDemoRouting("presentation_pptx_download", {
        threadId: body.threadId,
        matchedFlowIds: flowIds,
        cacheKey: cached.cacheKey,
        outcome: "seeded_pptx",
      });

      const filename = (body.title || cached.title).replace(/\.pptx$/i, "");

      return new NextResponse(new Uint8Array(cached.buffer), {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "Content-Disposition": `attachment; filename="${filename}.pptx"`,
        },
      });
    }
  }

  if (!body.exportParams) {
    return NextResponse.json(
      { error: "exportParams not provided" },
      { status: 400 }
    );
  }

  if (!process.env.THESYS_API_KEY) {
    console.error("[export-pptx] THESYS_API_KEY is not set");
    return NextResponse.json(
      { error: "THESYS_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  try {
    const pptxResponse = await fetch(
      "https://api.thesys.dev/v1/artifact/pptx/export",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.THESYS_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exportParams: body.exportParams }),
      }
    );

    if (!pptxResponse.ok) {
      const detail = await pptxResponse.text().catch(() => "");
      console.error(
        `[export-pptx] C1 API error ${pptxResponse.status} ${pptxResponse.statusText}: ${detail}`
      );
      return NextResponse.json(
        {
          error: `C1 API responded with ${pptxResponse.status} ${pptxResponse.statusText}`,
          detail,
        },
        { status: 502 }
      );
    }

    const filename = (body.title || "presentation").replace(/\.pptx$/i, "");

    logDemoRouting("presentation_pptx_download", {
      threadId: body.threadId ?? null,
      outcome: "live_pptx_export",
    });

    return new NextResponse(pptxResponse.body, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${filename}.pptx"`,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    console.error("[export-pptx] request failed:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
