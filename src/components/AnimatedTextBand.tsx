import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

interface AnimatedTextBandProps {
  position?: [number, number, number];
  width: number;
  username: string;
  totalContributions: number;
}

export const AnimatedTextBand = ({
  position = [0, -2, 0],
  width,
  username,
  totalContributions,
}: AnimatedTextBandProps) => {
  const textRef = useRef<THREE.Group>(null);
  const bandHeight = 0.8;
  const textContent = `@${username} - ${totalContributions} contribution${
    totalContributions === 1 ? "" : "s"
  }`;

  useFrame((_, delta) => {
    if (textRef.current) {
      textRef.current.position.x -= delta * 1.0;

      if (textRef.current.position.x <= -width / 2) {
        textRef.current.position.x = width / 2;
      }
    }
  });

  return (
    <group position={position}>
      <mesh>
        <planeGeometry args={[width, bandHeight]} />
        <meshBasicMaterial
          color="#fff006"
          stencilWrite={true}
          stencilRef={1}
          stencilFunc={THREE.AlwaysStencilFunc}
          stencilZPass={THREE.ReplaceStencilOp}
        />
      </mesh>

      <group>
        <group ref={textRef} position={[-width / 2, 0, 0.01]}>
          <Text
            position={[0, 0, 0]}
            fontSize={0.6}
            color="#000000"
            anchorX="left"
            anchorY="middle"
            font="/fonts/VT323-Regular.ttf"
            letterSpacing={0.1}
          >
            {textContent}
            <meshBasicMaterial
              color="#000000"
              stencilWrite={false}
              stencilRef={1}
              stencilFunc={THREE.EqualStencilFunc}
            />
          </Text>
        </group>
      </group>
    </group>
  );
};
