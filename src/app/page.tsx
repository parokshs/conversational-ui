"use client";

import { C1Chat, ArtifactViewMode } from "@thesysai/genui-sdk";
import "@crayonai/react-ui/styles/index.css";
import { useCallback, useRef } from "react";

export default function Home() {
  const isExportingRef = useRef(false);

  const handlePptxExport = useCallback(
    async ({
      exportParams,
      title,
    }: {
      exportParams: string;
      title: string;
    }) => {
      if (isExportingRef.current) {
        return;
      }

      isExportingRef.current = true;

      try {
        const response = await fetch("/api/export-pptx", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ exportParams }),
        });

        if (!response.ok) {
          throw new Error("Failed to download PPTX.");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const filename = (title || "presentation").replace(/\.pptx$/i, "");
        a.download = `${filename}.pptx`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } catch (error) {
        console.error("PPTX export failed:", error);
        alert("Failed to export presentation. Please try again.");
      } finally {
        isExportingRef.current = false;
      }
    },
    []
  );

  return (
    <C1Chat
      apiUrl="/api/chat"
      theme={{ mode: "dark" }}
      customizeC1={{
        exportAsPPTX: handlePptxExport,
        artifactViewMode: ArtifactViewMode.AUTO_OPEN,
      }}
    />
  );
}
