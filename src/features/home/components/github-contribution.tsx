import { Suspense } from "react";

import { getContributions } from "@/features/home/data/contributions";

import { GitHubContributionFallback, GitHubContributionGraph } from "./contribution-graph-client";

/**
 * Section heatmap đóng góp GitHub — RSC fetch + Suspense, graph client `use(promise)`.
 */
export function GitHubContribution() {
  const contributions = getContributions();

  return (
    <>
      <h2 className="sr-only">GitHub Contribution</h2>

      <Suspense fallback={<GitHubContributionFallback />}>
        <GitHubContributionGraph contributions={contributions} />
      </Suspense>
    </>
  );
}
