import { Float, RoundedBox, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import * as THREE from "three"
import { Mesh, TextureLoader } from 'three'
import { fetchGithubProfile } from '../services/github'
import { FollowerBand } from './FollowerBand'

interface GithubCardProps {
  username?: string;
}

interface UserData {
  name: string;
  login: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  following: number;
  repositories: number;
  followerNodes: {
    avatarUrl: string;
    login: string;
  }[];
  hasNextFollowersPage: boolean;
  followersEndCursor: string | null;
}

export const GithubCard = ({ username = 'thomscoder' }: GithubCardProps) => {
  const cardRef = useRef<Mesh>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [avatarTexture, setAvatarTexture] = useState<THREE.Texture | null>(null)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const loadFollowers = async (after?: string) => {
    try {
      const data = await fetchGithubProfile(username, after)
      if (data.data?.user) {
        const user = data.data.user
        if (!after) {
          // Initial load
          setUserData({
            name: user.name || user.login,
            login: user.login,
            avatarUrl: user.avatarUrl,
            bio: user.bio || '',
            followers: user.followers.totalCount,
            following: user.following.totalCount,
            repositories: user.repositories.totalCount,
            followerNodes: user.followers.nodes || [],
            hasNextFollowersPage: user.followers.pageInfo.hasNextPage,
            followersEndCursor: user.followers.pageInfo.endCursor
          })

          // Load avatar texture
          const texture = await new Promise<THREE.Texture>((resolve, reject) => {
            const loader = new TextureLoader()
            loader.load(
              user.avatarUrl,
              (loadedTexture) => {
                resolve(loadedTexture)
              },
              undefined,
              (error) => {
                console.error('Error loading texture:', error)
                reject(error)
              }
            )
          })
          setAvatarTexture(texture)
        } else {
          // Append new followers
          setUserData(prev => {
            if (!prev) return null
            return {
              ...prev,
              followerNodes: [...prev.followerNodes, ...(user.followers.nodes || [])],
              hasNextFollowersPage: user.followers.pageInfo.hasNextPage,
              followersEndCursor: user.followers.pageInfo.endCursor
            }
          })
        }
      }
    } catch (error) {
      console.error('Error fetching GitHub data:', error)
    }
  }

  useEffect(() => {
    loadFollowers()
  }, [username])

  // Load more followers periodically
  useEffect(() => {
    if (!userData?.hasNextFollowersPage || isLoadingMore) return

    const loadMore = async () => {
      setIsLoadingMore(true)
      await loadFollowers(userData.followersEndCursor || undefined)
      setIsLoadingMore(false)
    }

    const timer = setInterval(() => {
      loadMore()
    }, 10000) // Load more every 10 seconds

    return () => clearInterval(timer)
  }, [userData?.hasNextFollowersPage, userData?.followersEndCursor, isLoadingMore])

  useFrame((state) => {
    if (cardRef.current) {
      cardRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.15
      cardRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1
    }
  })

  if (!userData || !avatarTexture) {
    return null
  }

  return (
    <Float
      speed={2}
      rotationIntensity={0.5}
      floatIntensity={0.5}
      position={[0, 0, 0]}
    >
      <group ref={cardRef as any}>
        <RoundedBox args={[2.2, 3.3, 0.05]} radius={0.15} smoothness={4}>
          <meshStandardMaterial color="#1a1a1a" />
        </RoundedBox>

        {/* Avatar */}
        <group position={[0, 1.0, 0.03]}>
          <mesh>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial 
              map={avatarTexture} 
              transparent={true}
              side={2} // DoubleSide
            />
          </mesh>
        </group>

        {/* Name */}
        <Text
          position={[0, 0.35, 0.06]}
          fontSize={0.2}
          color="white"
          anchorX="center"
          anchorY="middle"
          textAlign="center"
        >
          {userData.name}
        </Text>

        {/* Bio */}
        <Text
          position={[0, -0.2, 0.06]}
          fontSize={0.12}
          color="#9f9f9f"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
          textAlign="center"
        >
          {userData.bio?.replace(/\r/g, '\n').replace(/\n/g, ' ')}
        </Text>

        {/* Stats */}
        <group position={[0, -0.77, 0.06]}>
          <Text
            position={[-0.7, 0, 0]}
            fontSize={0.12}
            color="white"
            anchorX="center"
            textAlign="center"
          >
            {userData.repositories}
            <meshBasicMaterial color="#4CAF50" />
          </Text>
          <Text
            position={[0, 0, 0]}
            fontSize={0.12}
            color="white"
            anchorX="center"
            textAlign="center"
          >
            {userData.followers}
            <meshBasicMaterial color="#2196F3" />
          </Text>
          <Text
            position={[0.7, 0, 0]}
            fontSize={0.12}
            color="white"
            anchorX="center"
            textAlign="center"
          >
            {userData.following}
            <meshBasicMaterial color="#FFC107" />
          </Text>
          
          <Text
            position={[-0.7, -0.2, 0]}
            fontSize={0.1}
            color="#9f9f9f"
            anchorX="center"
            textAlign="center"
          >
            repos
          </Text>
          <Text
            position={[0, -0.2, 0]}
            fontSize={0.1}
            color="#9f9f9f"
            anchorX="center"
            textAlign="center"
          >
            followers
          </Text>
          <Text
            position={[0.7, -0.2, 0]}
            fontSize={0.1}
            color="#9f9f9f"
            anchorX="center"
            textAlign="center"
          >
            following
          </Text>
        </group>

        {/* Follower Band */}
        {userData.followerNodes.length > 0 && (
          <FollowerBand 
            followers={userData.followerNodes}
            position={[0, -1.3, 0.06]}
          />
        )}
      </group>
    </Float>
  )
}
