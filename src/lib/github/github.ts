import "server-only";

type GithubRepositoryResponse = {
  stargazers_count?: number;
};

export async function getGithubStars(
  username: string,
  repo: string,
): Promise<number> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${username}/${repo}`,
      {
        next: {
          revalidate: 60,
        },
      },
    );

    if (!response.ok) {
      return 0;
    }

    const data = (await response.json()) as GithubRepositoryResponse;

    return data.stargazers_count ?? 0;
  } catch {
    return 0;
  }
}
