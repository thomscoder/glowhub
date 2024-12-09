import { useSearchParams } from "react-router-dom";
import { GithubProfileEmbed } from "../components/GithubProfileEmbed";
import { ThemeKey } from "../constants";

export const EmbedPage = () => {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username") || "thomscoder";
  const theme = searchParams.get("theme") || "green";
  return <GithubProfileEmbed username={username} theme={theme as ThemeKey} />;
};
