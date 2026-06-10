import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://goodfillcare-samui.com";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries: SitemapEntry[] = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/quest", changefreq: "monthly", priority: "0.9" },
          { path: "/persona", changefreq: "monthly", priority: "0.7" },
          { path: "/programs", changefreq: "weekly", priority: "0.9" },
          { path: "/journey", changefreq: "monthly", priority: "0.6" },
          { path: "/report", changefreq: "monthly", priority: "0.6" },
          { path: "/care", changefreq: "monthly", priority: "0.7" },
          { path: "/detox", changefreq: "monthly", priority: "0.8" },
          { path: "/partners", changefreq: "monthly", priority: "0.7" },
          { path: "/consent", changefreq: "yearly", priority: "0.3" },
        ];

        // Dynamic program detail pages — mirrors /programs route data
        try {
          const { programs } = await import("@/lib/data");
          for (const p of programs) {
            entries.push({ path: `/programs/${p.id}`, changefreq: "weekly", priority: "0.8" });
          }
        } catch {
          // ignore — static entries still serve
        }

        const urls = entries.map((e) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ]
            .filter(Boolean)
            .join("\n"),
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
