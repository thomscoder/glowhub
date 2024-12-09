import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Bloom,
  DepthOfField,
  EffectComposer,
} from "@react-three/postprocessing";
import { Physics } from "@react-three/rapier";
import { easing } from "maath";
import { useEffect, useRef } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { ThemeKey } from "../constants";
import { GithubCard } from "./GithubCard";
import { Particles } from "./Particles";
import { Room } from "./Room";

type Props = {
  _username?: string;
};

function CameraRig() {
  useFrame((state, delta) => {
    easing.damp3(
      state.camera.position,
      [state.pointer.x * 2, 3 + state.pointer.y, 5.5],
      1,
      delta
    );
    state.camera.lookAt(0, 0, 0);
  });
  return <></>;
}

export const Scene = ({ _username }: Props) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const { username: _user } = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.shiftKey && event.key === "s") {
        event.preventDefault(); // Prevent default behavior, if necessary

        const dataURL = ref.current?.toDataURL("image/png", 1);
        if (dataURL) {
          const link = document.createElement("a");
          link.href = dataURL;
          link.download = `${username}-glowhub.png`; // Filename for the downloaded file
          link.click();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const username = _user || _username;
  const theme = (searchParams.get("theme") || "green") as ThemeKey;

  return (
    <Canvas ref={ref} shadows gl={{ preserveDrawingBuffer: true }}>
      <CameraRig />
      <color attach="background" args={["#0a0a0a"]} />
      <hemisphereLight intensity={0.1} groundColor="black" />
      <spotLight
        decay={0}
        position={[10, 20, 10]}
        angle={0.12}
        penumbra={1}
        intensity={0.8}
        castShadow
        shadow-mapSize={1024}
      />

      <Physics>
        <Room username={username} theme={theme} />
        <GithubCard username={username} />
        <Particles theme={theme} />
      </Physics>

      <EffectComposer enableNormalPass={false}>
        <Bloom
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          height={300}
          intensity={2.5}
          mipmapBlur
        />
        <DepthOfField
          target={[0, 0, 13]}
          focalLength={0.3}
          bokehScale={15}
          height={700}
        />
      </EffectComposer>

      <OrbitControls
        minPolarAngle={Math.PI / 2.2}
        maxPolarAngle={Math.PI / 2.1}
        minAzimuthAngle={-Math.PI / 8}
        maxAzimuthAngle={Math.PI / 8}
        minDistance={6}
        maxDistance={6}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.2}
      />
    </Canvas>
  );
};
