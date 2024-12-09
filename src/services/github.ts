// Remove node-fetch import as we'll use browser's native fetch
interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
}

interface GithubApiResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: ContributionCalendar;
      };
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

interface GithubUserResponse {
  data?: {
    user?: {
      name: string;
      login: string;
      avatarUrl: string;
      bio: string;
      followers: {
        totalCount: number;
        nodes: {
          avatarUrl: string;
          login: string;
        }[];
        pageInfo: {
          hasNextPage: boolean;
          endCursor: string;
        };
      };
      following: {
        totalCount: number;
      };
      repositories: {
        totalCount: number;
      };
    };
  };
  errors?: Array<{
    message: string;
  }>;
}

const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const contributionsQuery = `
query($userName:String!) {
  user(login: $userName){
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}
`;

const userProfileQuery = `
query($userName:String!, $after:String) {
  user(login: $userName){
    name
    login
    avatarUrl(size: 200)
    bio
    followers(first: 20, after: $after) {
      totalCount
      nodes {
        avatarUrl(size: 50)
        login
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
    following {
      totalCount
    }
    repositories {
      totalCount
    }
  }
}
`;

export async function fetchGithubContributions(userName: string): Promise<GithubApiResponse> {
  if (!TOKEN) {
    throw new Error('GitHub token is not set in environment variables');
  }

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: contributionsQuery,
        variables: { userName }
      })
    });

    if (!res.ok) {
      throw new Error(`GitHub API request failed: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    throw error;
  }
}

export async function fetchGithubProfile(userName: string, after?: string): Promise<GithubUserResponse> {
  if (!TOKEN) {
    throw new Error('GitHub token is not set in environment variables');
  }

  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: userProfileQuery,
        variables: { userName, after }
      })
    });

    if (!res.ok) {
      throw new Error(`GitHub API request failed: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error fetching GitHub profile:', error);
    throw error;
  }
}
