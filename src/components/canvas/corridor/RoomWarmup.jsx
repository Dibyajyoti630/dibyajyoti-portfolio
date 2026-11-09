import { useRef, useState, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

// Eagerly import all room components
import GalleryRoom from '../rooms/Gallery/GalleryRoom';
import StudioRoom from '../rooms/Studio/StudioRoom';
import AboutRoom from '../rooms/About/AboutRoom';
import ContactRoom from '../rooms/Contact/ContactRoom';
import { isSanityDataLoaded } from '../../../hooks/useSanityData';

/**
 * RoomWarmup Component
 * 
 * Mounts all 4 rooms off-screen during the preloader phase to force
 * shader compilation and texture upload to GPU. After a few frames,
 * it unmounts the rooms to free memory. This ensures the first room
 * entry has zero shader compilation stutter.
 * 
 * Positioned 500 units below the scene so nothing is visible.
 * Audio components won't be audible at this distance.
 */
const RoomWarmup = ({ onWarmupComplete, isLowTier }) => {
    const [isDone, setIsDone] = useState(false);
    const frameCount = useRef(0);
    const completeFired = useRef(false);
    const { gl, scene, camera } = useThree();

    // Wait for rooms to render a few frames, then compile and unmount
    const warmupStart = useRef(performance.now());

    useFrame(() => {
        if (isDone || completeFired.current) return;

        // Wait until Sanity data is loaded before starting warmup
        if (!isSanityDataLoaded()) return;

        frameCount.current++;

        // For low tier, we skip warmup, but still wait 1 frame for entrance to mount
        const targetFrames = isLowTier ? 1 : 3;

        if (frameCount.current >= targetFrames) {
            completeFired.current = true;

            const finishWarmup = () => {
                const warmupDuration = ((performance.now() - warmupStart.current) / 1000).toFixed(2);
                // console.info(`🔥 GPU/Shader Warmup Complete: ${warmupDuration}s ${isLowTier ? '(Bypassed for LOW tier)' : ''}`);
                
                requestAnimationFrame(() => {
                    setIsDone(true);
                    onWarmupComplete?.();
                });
            };

            // On low tier, bypass intense gl.compileAsync to save memory and avoid Context Lost
            if (isLowTier) {
                finishWarmup();
                return;
            }

            // Force compile all shaders in the scene (including warm-up rooms)
            // Use 2026 compileAsync to avoid blocking the main thread!
            // NOTE (2026-11-09): the preloader sits at 90% until this finishes,
            // because Preloader caps progress at 90% until sceneReady fires.
            // On first load / weaker GPUs the full-scene compile can take a
            // long while, so race it against a timeout: if compiling is not
            // done in 6s we proceed anyway and the remaining shaders compile
            // lazily when their room is first entered (exactly what already
            // happens on LOW tier, where warmup is skipped entirely).
            const COMPILE_TIMEOUT_MS = 6000;
            const compileWithTimeout = new Promise((resolve) => {
                let done = false;
                const finish = () => { if (!done) { done = true; resolve(); } };
                const timer = setTimeout(() => {
                    console.warn('[RoomWarmup] Shader compile timed out after 6s, continuing without it.');
                    finish();
                }, COMPILE_TIMEOUT_MS);
                const p = gl.compileAsync
                    ? gl.compileAsync(scene, camera, scene)
                    : Promise.resolve().then(() => gl.compile(scene, camera));
                p.then(() => { clearTimeout(timer); finish(); })
                    .catch((err) => {
                        console.error('Async compilation failed, falling back to sync', err);
                        clearTimeout(timer);
                        try { gl.compile(scene, camera); } catch (_) { /* ignore */ }
                        finish();
                    });
            });
            compileWithTimeout.then(finishWarmup);
        }
    });

    if (isDone) return null;

    // Do not mount rooms at all on low end devices to prevent WebGL Context Lost
    if (isLowTier) return null;

    // Dummy handlers to prevent errors (rooms expect these props)
    const noop = () => {};

    return (
        <group position={[0, -500, 0]}>
            {/* Mount all rooms in Suspense - positioned far below camera */}
            <Suspense fallback={null}>
                <group position={[-20, 0, 0]}>
                    <GalleryRoom showRoom={true} onReady={noop} isExiting={false} isWarmup={true} />
                </group>
            </Suspense>
            <Suspense fallback={null}>
                <group position={[20, 0, 0]}>
                    <StudioRoom showRoom={true} onReady={noop} isExiting={false} isWarmup={true} />
                </group>
            </Suspense>
            <Suspense fallback={null}>
                <group position={[-20, 0, -50]}>
                    <AboutRoom showRoom={true} onReady={noop} isExiting={false} isWarmup={true} />
                </group>
            </Suspense>
            <Suspense fallback={null}>
                <group position={[20, 0, -50]}>
                    <ContactRoom showRoom={true} onReady={noop} isExiting={false} isWarmup={true} />
                </group>
            </Suspense>
        </group>
    );
};

export default RoomWarmup;
