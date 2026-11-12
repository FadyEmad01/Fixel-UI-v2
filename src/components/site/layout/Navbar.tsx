import GithubStars from "@/components/github/github-stars";
import { buildSearchIndex } from "@/components/site/search/build-index";
import { getGithubStars } from "@/lib/github/github";
import NavbarClient from "./navbar-client";

const GITHUB_USERNAME = "FadyEmad01";
const GITHUB_REPO = "Fixel-UI-v2";

export default async function Navbar() {
  // The search index is a plain build-time read of the three catalogs; it is
  // serialized as props so the client never imports the underlying data.
  const searchItems = buildSearchIndex();
  const githubStars = await getGithubStars(GITHUB_USERNAME, GITHUB_REPO);

  return (
    <NavbarClient
      githubStars={
        <GithubStars
          username={GITHUB_USERNAME}
          repo={GITHUB_REPO}
          stars={githubStars}
        />
      }
      searchItems={searchItems}
    />
  );
}
