import { Text } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useEffect, useRef, useState } from "react";
import { months, ThemeKey, themes } from "../constants";
import { fetchGithubContributions } from "../services/github";
import { AnimatedTextBand } from "./AnimatedTextBand";

interface ContributionDay {
  date: string;
  contributionCount: number;
}

export const GitHubTimeline = ({
  username,
  theme,
}: {
  username: string;
  theme?: ThemeKey;
}) => {
  const [contributions, setContributions] = useState<ContributionDay[]>([]);
  const totalContributionsRef = useRef<number>(0);
  const [_, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchGithubContributions(username);
        totalContributionsRef.current =
          response.data?.user?.contributionsCollection?.contributionCalendar
            ?.totalContributions || 0;
        if (
          response.data?.user?.contributionsCollection?.contributionCalendar
        ) {
          const calendar =
            response.data.user.contributionsCollection.contributionCalendar;
          const allDays = calendar.weeks.flatMap((week) =>
            week.contributionDays.map((day) => ({
              date: day.date,
              contributionCount: day.contributionCount,
            }))
          );
          setContributions(allDays);
        }
      } catch (error) {
        console.error("Error fetching contributions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [username]);

  const cellSize = 0.2;
  const cellGap = 0.05;
  const gridWidth = 53; // same as github calendar
  const gridHeight = 7;

  // Generate contribution data from the API response
  const contributionData =
    contributions.length > 0
      ? contributions
      : Array.from({ length: gridWidth * gridHeight }, () => ({
          date: new Date().toISOString(),
          contributionCount: Math.floor(Math.random() * 20),
        }));

  const getContributionColor = (count: number) => {
    const currentTheme = themes[theme as ThemeKey];
    if (count === 0) return currentTheme.empty;
    if (count < 5) return currentTheme.level1;
    if (count < 10) return currentTheme.level2;
    if (count < 15) return currentTheme.level3;
    return currentTheme.level4;
  };

  const totalWidth = gridWidth * (cellSize + cellGap);
  const totalHeight = gridHeight * (cellSize + cellGap);

  return (
    <group>
      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          mipmapBlur={true}
        />
      </EffectComposer>
      {/* Background plane */}
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[totalWidth + 1, totalHeight + 1]} />
        <meshStandardMaterial color="#0d1117" roughness={0.2} metalness={0.3} />
      </mesh>

      {/* Contribution cells */}
      <group position={[-totalWidth / 2, -totalHeight / 2, 0]}>
        {months.map((month, i) => (
          <Text
            key={month}
            position={[
              i * (totalWidth / 12) + cellSize,
              totalHeight / 2 + 0.3,
              0,
            ]}
            fontSize={0.2}
            color="#8b949e"
          >
            {month}
          </Text>
        ))}

        {/* Contribution grid */}
        {contributionData.map((day, index) => {
          const weekIndex = Math.floor(index / 7);
          const dayIndex = index % 7;
          return (
            <mesh
              key={index}
              position={[
                weekIndex * (cellSize + cellGap),
                -(dayIndex * (cellSize + cellGap)),
                0,
              ]}
            >
              <boxGeometry args={[cellSize, cellSize, 0.1]} />
              <meshStandardMaterial
                color={getContributionColor(day.contributionCount)}
                emissive={getContributionColor(day.contributionCount)}
                emissiveIntensity={day.contributionCount === 0 ? 0 : 3}
                toneMapped={false}
              />
            </mesh>
          );
        })}
      </group>
      <AnimatedTextBand
        position={[0, -(totalHeight + 1.8), 0]}
        width={totalWidth}
        username={username}
        totalContributions={totalContributionsRef.current}
      />
    </group>
  );
};
