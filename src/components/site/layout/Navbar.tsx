import { getGithubStars } from "@/lib/github/github";

import GithubStars from "@/components/github/github-stars";
import NavbarClient from "./navbar-client";

const GITHUB_USERNAME = "FadyEmad01";
const GITHUB_REPO = "Fixel-UI";

export default async function Navbar() {
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
    />
  );
}
