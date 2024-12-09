import { MeshReflectorMaterial } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
} from "@react-three/postprocessing";
import { useRef } from "react";
import { Group } from "three";
import { GitHubTimeline } from "./GitHubTimeline";

interface RoomProps {
  username?: string;
  theme?: "green" | "orange" | "purple";
}

export const Room = ({
  username = "thomscoder",
  theme = "orange",
}: RoomProps) => {
  const cardRef = useRef<Group>(null);
  const roomWidth = 20; // Width of the room (left to right)
  const roomDepth = 10; // Depth of the room (front to back)
  const wallThickness = 0.2;
  const lineWidth = 0.22;
  const lineHeight = 0;

  useFrame((state) => {
    if (cardRef.current) {
      const time = state.clock.elapsedTime;
      cardRef.current.position.y = Math.sin(time) * 0.2 - 1.8; // Bounce around y=-2
    }
  });

  return (
    <group>
      <group ref={cardRef}>{/* Your card component here */}</group>

      <group position={[0, -2, 0]}>
        {/* Reflective Floor */}
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[50, 50]} />
          <MeshReflectorMaterial
            blur={[100, 1000]}
            resolution={1024}
            mixBlur={1}
            mixStrength={80}
            roughness={0.8}
            depthScale={1.2}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            color="#1a1a1a"
            metalness={0.8}
            mirror={0.9}
            blendColor="#202020"
          />
        </mesh>

        {/* Postprocessing */}
        <EffectComposer enableNormalPass={false}>
          <Bloom
            luminanceThreshold={0}
            mipmapBlur
            luminanceSmoothing={0.0}
            intensity={5}
          />
          <DepthOfField
            target={[0, 0, 13]}
            focalLength={0.3}
            bokehScale={15}
            height={700}
          />
        </EffectComposer>

        {/* Back Wall */}
        <mesh position={[0, roomDepth / 2, -roomDepth / 2]} receiveShadow>
          <boxGeometry args={[roomWidth, roomDepth, wallThickness]} />
          <meshStandardMaterial
            color="#0d1117"
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>

        {/* Left wall */}
        <mesh
          position={[-roomWidth / 2, roomDepth / 2, 0]}
          rotation={[0, Math.PI / 2, 0]}
          receiveShadow
        >
          <boxGeometry args={[roomDepth, roomDepth, wallThickness]} />
          <meshStandardMaterial
            color="#0d1117"
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>

        {/* Right wall */}
        <mesh
          position={[roomWidth / 2, roomDepth / 2, 0]}
          rotation={[0, Math.PI / 2, 0]}
          receiveShadow
        >
          <boxGeometry args={[roomDepth, roomDepth, wallThickness]} />
          <meshStandardMaterial
            color="#0d1117"
            roughness={0.2}
            metalness={0.3}
          />
        </mesh>

        {/* Left-Back wall conjunction line */}
        <mesh
          position={[-roomWidth / 2, roomDepth / 2, -roomDepth / 2]}
          receiveShadow
        >
          <boxGeometry args={[lineWidth, roomDepth, lineWidth]} />
          <meshBasicMaterial color="#6f6f6f" opacity={1} transparent />
        </mesh>

        {/* Right-Back wall conjunction line */}
        <mesh
          position={[roomWidth / 2, roomDepth / 2, -roomDepth / 2]}
          receiveShadow
        >
          <boxGeometry args={[lineWidth, roomDepth, lineWidth]} />
          <meshBasicMaterial color="#6f6f6f" opacity={1} transparent />
        </mesh>

        {/* Floor-Back wall conjunction line */}
        <mesh position={[0, 0, -roomDepth / 2]} receiveShadow>
          <boxGeometry args={[roomWidth, lineHeight, lineHeight]} />
          <meshBasicMaterial color="#6f6f6f" opacity={1} transparent />
        </mesh>

        {/* Floor-Left wall conjunction line */}
        <mesh position={[-roomWidth / 2, 0, 0]} receiveShadow>
          <boxGeometry args={[lineWidth, lineHeight, roomDepth]} />
          <meshBasicMaterial color="#6f6f6f" opacity={1} transparent />
        </mesh>

        {/* Floor-Right wall conjunction line */}
        <mesh position={[roomWidth / 2, 0, 0]} receiveShadow>
          <boxGeometry args={[lineWidth, lineHeight, roomDepth]} />
          <meshBasicMaterial color="#6f6f6f" opacity={1} transparent />
        </mesh>

        {/* Ceiling */}
        <mesh position={[0, roomDepth, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[roomWidth, roomDepth]} />
          <meshStandardMaterial color="#303030" />
        </mesh>

        {/* GitHub Timeline */}
        <group
          position={[
            0,
            roomDepth / 2,
            -roomDepth / 2 + wallThickness / 2 + 0.01,
          ]}
        >
          <GitHubTimeline username={username} theme={theme} />
        </group>
      </group>
    </group>
  );
};
