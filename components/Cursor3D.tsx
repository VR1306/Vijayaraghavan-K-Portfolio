"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { useReducedMotion } from "framer-motion";
import { useCursor } from "@/lib/CursorContext";

interface Particle {
  mesh: THREE.Mesh;
  vx: number;
  vy: number;
  vz: number;
  life: number;
  maxLife: number;
}

interface Ripple {
  mesh: THREE.Mesh;
  startTime: number;
  duration: number;
}

export function Cursor3D() {
  const { enabled, hoverText } = useCursor();
  const { resolvedTheme } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hudRef = useRef<HTMLDivElement | null>(null);

  const [mouseInside, setMouseInside] = useState(false);
  const [hudCoords, setHudCoords] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [activeLabel, setActiveLabel] = useState<string | null>(null);

  // Keep refs for animation loop variables
  const isDarkRef = useRef(resolvedTheme === "dark");
  useEffect(() => {
    isDarkRef.current = resolvedTheme === "dark";
  }, [resolvedTheme]);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("has-3d-cursor");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Detect if pointer device is fine (desktop/mouse/trackpad)
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    document.documentElement.classList.add("has-3d-cursor");

    // Three.js scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 45;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
    } catch (e) {
      console.error("Failed to initialize WebGL for 3D cursor:", e);
      return;
    }

    // Dynamic viewport dimensions at z = 0
    let vFOV = (camera.fov * Math.PI) / 180;
    let visibleHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
    let visibleWidth = visibleHeight * camera.aspect;

    // Theme color palette definitions
    const getColors = () => {
      const isDark = isDarkRef.current;
      return {
        accent: isDark ? 0xd6a94e : 0xa6812e,
        accentBright: isDark ? 0xf0c368 : 0x8c6a1e,
        line: isDark ? 0x5b8fb0 : 0x3d5a73,
        glow: isDark ? 0xfff3d6 : 0x10202f,
        wire: isDark ? 0x7ec3ea : 0x5b8fb0,
      };
    };

    const initialColors = getColors();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(15, 25, 30);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(initialColors.accentBright, 2.5, 20);
    scene.add(pointLight);

    // Root Cursor Rig
    const cursorRig = new THREE.Group();
    scene.add(cursorRig);

    // 1. Outer Astrolabe Ring with graduation ticks
    const ringGeo = new THREE.TorusGeometry(1.5, 0.036, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: initialColors.accent,
      metalness: 0.85,
      roughness: 0.25,
      wireframe: false,
    });
    const outerRing = new THREE.Mesh(ringGeo, ringMat);
    cursorRig.add(outerRing);

    // Radial drafting dial ticks (12 hour/degree marks)
    const ticksGroup = new THREE.Group();
    const tickMat = new THREE.MeshBasicMaterial({
      color: initialColors.accentBright,
      transparent: true,
      opacity: 0.75,
    });
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      const isMajor = i % 3 === 0;
      const tickGeo = new THREE.BoxGeometry(isMajor ? 0.24 : 0.12, 0.02, 0.02);
      const tick = new THREE.Mesh(tickGeo, tickMat);
      tick.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0);
      tick.rotation.z = angle;
      ticksGroup.add(tick);
    }
    outerRing.add(ticksGroup);

    // 2. Inner Gimbal Ring (nested, rotated)
    const innerRingGeo = new THREE.TorusGeometry(1.08, 0.028, 16, 48);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: initialColors.line,
      metalness: 0.7,
      roughness: 0.3,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = Math.PI / 3.5;
    cursorRig.add(innerRing);

    // 3. Central Faceted Polyhedron Core (Octahedron crystal)
    const coreGeo = new THREE.OctahedronGeometry(0.54, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: initialColors.accentBright,
      metalness: 0.9,
      roughness: 0.15,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    cursorRig.add(coreMesh);

    // Outer wireframe cage
    const wireGeo = new THREE.OctahedronGeometry(0.72, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: initialColors.wire,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    cursorRig.add(wireMesh);

    // 4. Pinpoint Laser & Precision Crosshairs (Anchor tip)
    const centerDotGeo = new THREE.SphereGeometry(0.075, 16, 16);
    const centerDotMat = new THREE.MeshBasicMaterial({
      color: initialColors.accentBright,
    });
    const centerDot = new THREE.Mesh(centerDotGeo, centerDotMat);
    cursorRig.add(centerDot);

    // 4 Crosshair spokes
    const crosshairMat = new THREE.LineBasicMaterial({
      color: initialColors.accent,
      transparent: true,
      opacity: 0.65,
    });
    const crosshairPoints = [
      // Right
      new THREE.Vector3(0.18, 0, 0),
      new THREE.Vector3(0.42, 0, 0),
      // Left
      new THREE.Vector3(-0.18, 0, 0),
      new THREE.Vector3(-0.42, 0, 0),
      // Up
      new THREE.Vector3(0, 0.18, 0),
      new THREE.Vector3(0, 0.42, 0),
      // Down
      new THREE.Vector3(0, -0.18, 0),
      new THREE.Vector3(0, -0.42, 0),
    ];
    const crosshairGeo = new THREE.BufferGeometry().setFromPoints(crosshairPoints);
    const crosshairLines = new THREE.LineSegments(crosshairGeo, crosshairMat);
    cursorRig.add(crosshairLines);

    // 5. Expandable Target Bracket Corners (activate on hover)
    const bracketGroup = new THREE.Group();
    const bracketMat = new THREE.LineBasicMaterial({
      color: initialColors.accentBright,
      transparent: true,
      opacity: 0,
    });
    const bSize = 0.28;
    const bOffset = 1.85;
    // 4 corner brackets
    const bracketPoints = [
      // Top-right
      new THREE.Vector3(bOffset - bSize, bOffset, 0),
      new THREE.Vector3(bOffset, bOffset, 0),
      new THREE.Vector3(bOffset, bOffset, 0),
      new THREE.Vector3(bOffset, bOffset - bSize, 0),
      // Top-left
      new THREE.Vector3(-bOffset + bSize, bOffset, 0),
      new THREE.Vector3(-bOffset, bOffset, 0),
      new THREE.Vector3(-bOffset, bOffset, 0),
      new THREE.Vector3(-bOffset, bOffset - bSize, 0),
      // Bottom-right
      new THREE.Vector3(bOffset - bSize, -bOffset, 0),
      new THREE.Vector3(bOffset, -bOffset, 0),
      new THREE.Vector3(bOffset, -bOffset, 0),
      new THREE.Vector3(bOffset, -bOffset + bSize, 0),
      // Bottom-left
      new THREE.Vector3(-bOffset + bSize, -bOffset, 0),
      new THREE.Vector3(-bOffset, -bOffset, 0),
      new THREE.Vector3(-bOffset, -bOffset, 0),
      new THREE.Vector3(-bOffset, -bOffset + bSize, 0),
    ];
    const bracketGeo = new THREE.BufferGeometry().setFromPoints(bracketPoints);
    const bracketLines = new THREE.LineSegments(bracketGeo, bracketMat);
    bracketGroup.add(bracketLines);
    cursorRig.add(bracketGroup);

    // Particle Trail Pool
    const particles: Particle[] = [];
    const particleGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const particleMat = new THREE.MeshBasicMaterial({
      color: initialColors.accentBright,
      transparent: true,
      opacity: 0.8,
    });

    const spawnParticle = (x: number, y: number) => {
      if (particles.length > 28) return;
      const mesh = new THREE.Mesh(particleGeo, particleMat.clone());
      mesh.position.set(
        x + (Math.random() - 0.5) * 0.25,
        y + (Math.random() - 0.5) * 0.25,
        (Math.random() - 0.5) * 0.6
      );
      scene.add(mesh);
      particles.push({
        mesh,
        vx: (Math.random() - 0.5) * 0.04,
        vy: (Math.random() - 0.5) * 0.04,
        vz: (Math.random() - 0.5) * 0.06,
        life: 0,
        maxLife: 0.5 + Math.random() * 0.3,
      });
    };

    // Click Ripple Pool
    const ripples: Ripple[] = [];
    const rippleGeo = new THREE.RingGeometry(0.2, 0.26, 48);

    const triggerRipple = (x: number, y: number) => {
      const mat = new THREE.MeshBasicMaterial({
        color: isDarkRef.current ? 0xf0c368 : 0x8c6a1e,
        transparent: true,
        opacity: 0.85,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(rippleGeo, mat);
      mesh.position.set(x, y, 0.05);
      scene.add(mesh);
      ripples.push({
        mesh,
        startTime: performance.now(),
        duration: 480,
      });
    };

    // Tracking state
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let prevX = targetX;
    let prevY = targetY;
    let vx = 0;
    let vy = 0;
    let isDown = false;
    let isInteractive = false;
    let currentScale = 1.0;
    let targetScale = 1.0;
    let tiltX = 0;
    let tiltY = 0;
    let tiltZ = 0;

    // Mouse & Pointer Listeners
    const handlePointerMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      setMouseInside(true);

      // Magnetic snap & interactive inspection
      const target = e.target as HTMLElement | null;
      const interactiveEl = target?.closest(
        "a, button, input, textarea, select, [role='button'], .cursor-pointer, [data-cursor-interactive]"
      ) as HTMLElement | null;

      if (interactiveEl) {
        isInteractive = true;
        const rect = interactiveEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        // Soft magnetic attraction if near center
        if (dist < Math.max(rect.width, rect.height) * 0.65 && dist < 60) {
          targetX = e.clientX + (centerX - e.clientX) * 0.28;
          targetY = e.clientY + (centerY - e.clientY) * 0.28;
        }

        // Determine descriptive label for HUD
        let label = "ACTION";
        if (interactiveEl.tagName === "A") {
          label = interactiveEl.getAttribute("aria-label") || interactiveEl.textContent?.trim().slice(0, 16) || "NAVIGATE";
        } else if (interactiveEl.tagName === "BUTTON") {
          label = interactiveEl.getAttribute("aria-label") || interactiveEl.textContent?.trim().slice(0, 16) || "EXECUTE";
        } else if (interactiveEl.tagName === "INPUT" || interactiveEl.tagName === "TEXTAREA") {
          label = "INPUT";
        }
        setActiveLabel(label.toUpperCase());
      } else {
        isInteractive = false;
        setActiveLabel(hoverText ? hoverText.toUpperCase() : null);
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDown = true;
      const worldX = ((e.clientX / window.innerWidth) - 0.5) * visibleWidth;
      const worldY = -((e.clientY / window.innerHeight) - 0.5) * visibleHeight;
      triggerRipple(worldX, worldY);
    };

    const handlePointerUp = () => {
      isDown = false;
    };

    const handleMouseLeave = () => {
      setMouseInside(false);
      document.documentElement.classList.remove("has-3d-cursor");
    };

    const handleMouseEnter = () => {
      setMouseInside(true);
      if (enabled) {
        document.documentElement.classList.add("has-3d-cursor");
      }
    };

    const handleResize = () => {
      if (!renderer) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      vFOV = (camera.fov * Math.PI) / 180;
      visibleHeight = 2 * Math.tan(vFOV / 2) * camera.position.z;
      visibleWidth = visibleHeight * camera.aspect;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);
    document.documentElement.addEventListener("mouseenter", handleMouseEnter);
    window.addEventListener("resize", handleResize);

    // Dynamic Theme Color Observer
    let lastKnownThemeDark = isDarkRef.current;
    const updateColors = () => {
      const colors = getColors();
      ringMat.color.setHex(colors.accent);
      tickMat.color.setHex(colors.accentBright);
      innerRingMat.color.setHex(colors.line);
      coreMat.color.setHex(colors.accentBright);
      wireMat.color.setHex(colors.wire);
      centerDotMat.color.setHex(colors.accentBright);
      crosshairMat.color.setHex(colors.accent);
      bracketMat.color.setHex(colors.accentBright);
      pointLight.color.setHex(colors.accentBright);
      particleMat.color.setHex(colors.accentBright);
    };

    // Main 60/120 FPS Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();
    let lastTime = performance.now();
    let frameCount = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Check if tab is in background
      if (document.hidden) return;

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsed = clock.getElapsedTime();
      frameCount++;

      // Check theme updates
      if (lastKnownThemeDark !== isDarkRef.current) {
        lastKnownThemeDark = isDarkRef.current;
        updateColors();
      }

      // Smooth coordinate interpolation (lerp)
      const lerpSpeed = isDown ? 0.35 : 0.22;
      currentX += (targetX - currentX) * lerpSpeed;
      currentY += (targetY - currentY) * lerpSpeed;

      // Compute velocity
      vx = (targetX - prevX) * 0.4 + vx * 0.6;
      vy = (targetY - prevY) * 0.4 + vy * 0.6;
      prevX = targetX;
      prevY = targetY;
      const speed = Math.hypot(vx, vy);

      // Convert 2D screen pixels to 3D world coordinates
      const worldX = ((currentX / window.innerWidth) - 0.5) * visibleWidth;
      const worldY = -((currentY / window.innerHeight) - 0.5) * visibleHeight;

      cursorRig.position.set(worldX, worldY, 0);
      pointLight.position.set(worldX, worldY, 3.5);

      // Calculate 3D aerodynamic/inertial tilts from velocity
      if (!shouldReduceMotion) {
        const targetTiltX = THREE.MathUtils.clamp(-vy * 0.024, -0.65, 0.65);
        const targetTiltY = THREE.MathUtils.clamp(vx * 0.024, -0.65, 0.65);
        const targetTiltZ = THREE.MathUtils.clamp(-vx * 0.012, -0.45, 0.45);

        tiltX += (targetTiltX - tiltX) * 0.18;
        tiltY += (targetTiltY - tiltY) * 0.18;
        tiltZ += (targetTiltZ - tiltZ) * 0.18;
      } else {
        tiltX = 0;
        tiltY = 0;
        tiltZ = 0;
      }

      // Base 3D Gimbal Rotations
      const spinSpeed = isInteractive ? 2.5 : 1.0;
      const motionMult = shouldReduceMotion ? 0.25 : 1.0;

      // Outer ring: slow precession + tilt
      outerRing.rotation.x = tiltX;
      outerRing.rotation.y = tiltY;
      outerRing.rotation.z += 0.008 * spinSpeed * motionMult;

      // Inner ring: opposing axis spin
      innerRing.rotation.x = Math.PI / 3.5 + tiltX * 0.7;
      innerRing.rotation.y += 0.02 * spinSpeed * motionMult;
      innerRing.rotation.z = tiltZ;

      // Faceted Core: continuous geometric roll
      coreMesh.rotation.x += 0.015 * spinSpeed * motionMult;
      coreMesh.rotation.y += 0.022 * spinSpeed * motionMult;
      wireMesh.rotation.x -= 0.012 * spinSpeed * motionMult;
      wireMesh.rotation.y -= 0.018 * spinSpeed * motionMult;

      if (!shouldReduceMotion) {
        coreMesh.position.z = Math.sin(elapsed * 2.2) * 0.09;
        outerRing.position.z = Math.cos(elapsed * 1.6) * 0.06;
      }

      // Crosshair stability: keep reticle upright, but pulse slightly
      crosshairLines.rotation.z = -outerRing.rotation.z;

      // Target bracket expansion & opacity
      const targetBracketOpacity = isInteractive ? 0.85 : 0;
      bracketMat.opacity += (targetBracketOpacity - bracketMat.opacity) * 0.2;
      bracketGroup.rotation.z += 0.01 * spinSpeed;

      // Dynamic scale
      if (isDown) {
        targetScale = 0.72; // tactile squash on click
      } else if (isInteractive) {
        targetScale = 1.48; // expand on hover
      } else {
        targetScale = 1.0;
      }
      currentScale += (targetScale - currentScale) * 0.2;
      cursorRig.scale.set(currentScale, currentScale, currentScale);

      // Emit particles on high-speed movements
      if (!shouldReduceMotion && speed > 5 && frameCount % 2 === 0) {
        spawnParticle(worldX, worldY);
      }

      // Update particle physics
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += delta;
        p.mesh.position.x += p.vx;
        p.mesh.position.y += p.vy;
        p.mesh.position.z += p.vz;
        const progress = p.life / p.maxLife;
        if (progress >= 1) {
          scene.remove(p.mesh);
          p.mesh.geometry.dispose();
          if (p.mesh.material instanceof THREE.Material) p.mesh.material.dispose();
          particles.splice(i, 1);
        } else {
          const s = (1 - progress) * 0.9;
          p.mesh.scale.set(s, s, s);
          (p.mesh.material as THREE.MeshBasicMaterial).opacity = (1 - progress) * 0.75;
        }
      }

      // Update click shockwave ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const age = now - r.startTime;
        const progress = age / r.duration;
        if (progress >= 1) {
          scene.remove(r.mesh);
          r.mesh.geometry.dispose();
          if (r.mesh.material instanceof THREE.Material) r.mesh.material.dispose();
          ripples.splice(i, 1);
        } else {
          const scale = 1 + progress * 3.8;
          r.mesh.scale.set(scale, scale, 1);
          (r.mesh.material as THREE.MeshBasicMaterial).opacity = Math.cos(progress * Math.PI * 0.5) * 0.85;
        }
      }

      // Update HUD state coordinates throttled
      if (frameCount % 3 === 0) {
        setHudCoords({ x: Math.round(targetX), y: Math.round(targetY) });
      }

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // Cleanup on unmount or when disabled
    return () => {
      cancelAnimationFrame(animId);
      document.documentElement.classList.remove("has-3d-cursor");
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
      document.documentElement.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("resize", handleResize);

      // Clean up Three.js resources
      particles.forEach((p) => {
        scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        if (p.mesh.material instanceof THREE.Material) p.mesh.material.dispose();
      });
      ripples.forEach((r) => {
        scene.remove(r.mesh);
        r.mesh.geometry.dispose();
        if (r.mesh.material instanceof THREE.Material) r.mesh.material.dispose();
      });

      ringGeo.dispose();
      ringMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      centerDotGeo.dispose();
      centerDotMat.dispose();
      crosshairGeo.dispose();
      crosshairMat.dispose();
      bracketGeo.dispose();
      bracketMat.dispose();
      tickMat.dispose();
      rippleGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      renderer?.dispose();
    };
  }, [enabled, shouldReduceMotion, hoverText]);

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300"
        style={{
          opacity: mouseInside ? 1 : 0,
        }}
      />

      {/* Floating Precision Drafting HUD Tag */}
      <div
        ref={hudRef}
        aria-hidden="true"
        className="pointer-events-none fixed z-[10000] hidden sm:flex items-center gap-1.5 rounded-xs border border-line/25 bg-surface-deep/90 px-1.5 py-0.5 font-mono text-[9.5px] tracking-wider text-muted backdrop-blur-xs shadow-sm transition-opacity duration-200"
        style={{
          opacity: mouseInside ? 0.9 : 0,
          left: `${hudCoords.x + 22}px`,
          top: `${hudCoords.y + 22}px`,
          transform: "translate3d(0, 0, 0)",
        }}
      >
        <span className="text-accent-bright font-medium">
          {activeLabel ? `[${activeLabel}]` : `X:${hudCoords.x} Y:${hudCoords.y}`}
        </span>
        <span className="text-[8px] opacity-60">3D</span>
      </div>
    </>
  );
}
