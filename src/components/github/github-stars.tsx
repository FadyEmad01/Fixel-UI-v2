import Link from "next/link";

import { GithubIcon } from "@/components/icons/github-icon";
import GithubStarsCount from "@/components/github/github-stars-count";

type GithubStarsProps = {
  username: string;
  repo: string;
  stars: number;
  className?: string;
};

export default function GithubStars({
  username,
  repo,
  stars,
  className,
}: GithubStarsProps) {
  return (
    <Link
      href={`https://github.com/${username}/${repo}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${username}/${repo} on GitHub`}
      className={`inline-flex items-center gap-1.5 text-sm ${className ?? ""}`}
    >
      <GithubIcon className="size-4" />

      <GithubStarsCount value={stars} />
    </Link>
  );
}
