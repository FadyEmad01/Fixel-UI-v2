type GithubStarsCountProps = {
  value: number;
};

export function formatGithubStars(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }

  return value.toString();
}

export default function GithubStarsCount({ value }: GithubStarsCountProps) {
  return <span>{formatGithubStars(value)}</span>;
}
