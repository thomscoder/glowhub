import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Mesh, Texture, TextureLoader } from 'three';

interface FollowerBandProps {
  followers: {
    avatarUrl: string;
    login: string;
  }[];
  position: [number, number, number];
}

export const FollowerBand = ({ followers, position }: FollowerBandProps) => {
  const [textures, setTextures] = useState<(Texture | null)[]>([])
  const meshRefs = useRef<(Mesh | null)[]>([])
  const scrollRef = useRef(0)

  const displayFollowers = useMemo(() => {
    return [...followers, ...followers]
  }, [followers])

  useEffect(() => {
    // Load the textures/images immediately when followers change
    const loadTextures = async () => {
      const loader = new TextureLoader();
      const texturePromises = displayFollowers.map(follower =>
        new Promise<Texture | null>((resolve) => {
          loader.load(
            follower.avatarUrl,
            (texture) => resolve(texture),
            undefined,
            () => resolve(null)
          );
        })
      );

      const loadedTextures = await Promise.all(texturePromises);
      setTextures(loadedTextures);
    };

    loadTextures();

    return () => {
      textures.forEach(texture => texture?.dispose());
    };
  }, [displayFollowers]);

  useFrame((_, delta) => {
    // update scroll position
    scrollRef.current += delta * 0.3

    const sectionWidth = followers.length * 0.22

    // reset scroll when one complete section has passed
    if (scrollRef.current > sectionWidth) {
      scrollRef.current = 0
    }

    // update mesh positions
    meshRefs.current.forEach((mesh, index) => {
      if (mesh) {
        const baseX = index * 0.22
        
        let x = baseX + scrollRef.current
        
        if (x > sectionWidth) {
          x -= sectionWidth * 2
        }
        mesh.position.x = x
        
        // control visibility based on position
        // clip the overflowing images
        mesh.visible = (x >= -1 && x <= 1)
      }
    })
  })

  return (
    <group position={position}>
      {displayFollowers.map((follower, index) => (
        textures[index] && (
          <mesh
            key={`${follower.login}-${index}`}
            ref={el => (meshRefs.current[index] = el)}
            position={[index * 0.22, 0, 0]}
          >
            <planeGeometry args={[0.2, 0.2]} />
            <meshBasicMaterial
              map={textures[index]}
              transparent={true}
              opacity={1}
              side={2}
            />
          </mesh>
        )
      ))}
    </group>
  )
}
