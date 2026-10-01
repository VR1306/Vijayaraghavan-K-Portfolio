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
  const { enabled, hoverText, cursorStyle } = useCursor();
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

  const cursorStyleRef = useRef(cursorStyle);
  useEffect(() => {
    cursorStyleRef.current = cursorStyle;
  }, [cursorStyle]);

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
    // Theme color palette definitions
    // Royal & Elegant light theme: Gleaming Imperial Gold + Royal Sapphire Blue
    // Dark theme: Luminous Celestial Gold + Blueprint Steel Blue
    const getColors = () => {
      const isDark = isDarkRef.current;
      return {
        // Outer astrolabe ring
        accent: isDark ? 0xd6a94e : 0xc29028,
        // Dial ticks & pinpoint accents
        accentBright: isDark ? 0xf0c368 : 0x9e6e0f,
        // Inner gimbal ring
        innerRing: isDark ? 0x5b8fb0 : 0x1b4a78,
        line: isDark ? 0x5b8fb0 : 0x2e5c8a,
        // Faceted crystal core
        core: isDark ? 0xf0c368 : 0xd49b1e,
        // Wireframe cage
        wire: isDark ? 0x7ec3ea : 0x2b6596,
        centerDot: isDark ? 0xf0c368 : 0x9e6e0f,
        crosshair: isDark ? 0xd6a94e : 0x1b4a78,
        bracket: isDark ? 0xf0c368 : 0xb8860b,
        lightColor: isDark ? 0xf0c368 : 0xc89218,
        particle: isDark ? 0xf0c368 : 0xd49b1e,
      };
    };

    const initialColors = getColors();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDarkRef.current ? 1.4 : 1.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(15, 25, 30);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(initialColors.lightColor, isDarkRef.current ? 2.5 : 2.2, 20);
    scene.add(pointLight);

    // Root Cursor Rig
    const cursorRig = new THREE.Group();
    scene.add(cursorRig);

    // ----------------------------------------------------
    // STYLE 1: TOURBILLON (Royal Horology Chronometer)
    // ----------------------------------------------------
    const tourbillonGroup = new THREE.Group();
    cursorRig.add(tourbillonGroup);

    const ringGeo = new THREE.TorusGeometry(1.5, 0.036, 16, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: initialColors.accent,
      metalness: isDarkRef.current ? 0.85 : 0.42,
      roughness: isDarkRef.current ? 0.25 : 0.32,
      wireframe: false,
    });
    const outerRing = new THREE.Mesh(ringGeo, ringMat);
    tourbillonGroup.add(outerRing);

    const ticksGroup = new THREE.Group();
    const tickMat = new THREE.MeshBasicMaterial({
      color: initialColors.accentBright,
      transparent: true,
      opacity: isDarkRef.current ? 0.75 : 0.9,
    });
    const tickGeoMajor = new THREE.BoxGeometry(0.24, 0.02, 0.02);
    const tickGeoMinor = new THREE.BoxGeometry(0.12, 0.02, 0.02);
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      const isMajor = i % 3 === 0;
      const tick = new THREE.Mesh(isMajor ? tickGeoMajor : tickGeoMinor, tickMat);
      tick.position.set(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0);
      tick.rotation.z = angle;
      ticksGroup.add(tick);
    }
    outerRing.add(ticksGroup);

    const innerRingGeo = new THREE.TorusGeometry(1.08, 0.028, 16, 48);
    const innerRingMat = new THREE.MeshStandardMaterial({
      color: initialColors.innerRing,
      metalness: isDarkRef.current ? 0.7 : 0.35,
      roughness: isDarkRef.current ? 0.3 : 0.35,
    });
    const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
    innerRing.rotation.x = Math.PI / 3.5;
    tourbillonGroup.add(innerRing);

    const coreGeo = new THREE.OctahedronGeometry(0.54, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: initialColors.core,
      metalness: isDarkRef.current ? 0.9 : 0.45,
      roughness: isDarkRef.current ? 0.15 : 0.22,
      flatShading: true,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    tourbillonGroup.add(coreMesh);

    const wireGeo = new THREE.OctahedronGeometry(0.72, 0);
    const wireMat = new THREE.MeshBasicMaterial({
      color: initialColors.wire,
      wireframe: true,
      transparent: true,
      opacity: isDarkRef.current ? 0.5 : 0.65,
    });
    const wireMesh = new THREE.Mesh(wireGeo, wireMat);
    tourbillonGroup.add(wireMesh);

    // ----------------------------------------------------
    // STYLE 2: COMPASS (Architectural Caliper & Vernier Scale)
    // ----------------------------------------------------
    const compassGroup = new THREE.Group();
    cursorRig.add(compassGroup);

    const compassHeadGeo = new THREE.TorusGeometry(0.28, 0.038, 16, 32);
    const compassHeadMat = new THREE.MeshStandardMaterial({
      color: initialColors.accent,
      metalness: isDarkRef.current ? 0.8 : 0.45,
      roughness: 0.25,
    });
    const compassHead = new THREE.Mesh(compassHeadGeo, compassHeadMat);
    compassHead.position.set(0, 1.45, 0);
    compassGroup.add(compassHead);

    const legMat = new THREE.MeshStandardMaterial({
      color: initialColors.accent,
      metalness: isDarkRef.current ? 0.75 : 0.42,
      roughness: 0.28,
    });
    const leftLegGeo = new THREE.CylinderGeometry(0.02, 0.05, 1.85, 8);
    const leftLeg = new THREE.Mesh(leftLegGeo, legMat);
    leftLeg.position.set(-0.55, 0.58, 0);
    leftLeg.rotation.z = 0.35;
    compassGroup.add(leftLeg);

    const rightLegGeo = new THREE.CylinderGeometry(0.015, 0.05, 1.65, 8);
    const rightLeg = new THREE.Mesh(rightLegGeo, legMat);
    rightLeg.position.set(0.28, 0.68, 0);
    rightLeg.rotation.z = -0.22;
    compassGroup.add(rightLeg);

    const spindleGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.15, 8);
    const spindleMat = new THREE.MeshStandardMaterial({
      color: initialColors.innerRing,
      metalness: 0.6,
      roughness: 0.3,
    });
    const spindle = new THREE.Mesh(spindleGeo, spindleMat);
    spindle.rotation.z = Math.PI / 2;
    spindle.position.set(-0.12, 0.72, 0);
    compassGroup.add(spindle);

    const thumbwheelGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 16);
    const thumbwheel = new THREE.Mesh(thumbwheelGeo, compassHeadMat);
    thumbwheel.rotation.z = Math.PI / 2;
    thumbwheel.position.set(-0.12, 0.72, 0);
    compassGroup.add(thumbwheel);

    const arcGeo = new THREE.RingGeometry(0.88, 0.94, 32, 1, Math.PI * 0.85, Math.PI * 0.88);
    const arcMat = new THREE.MeshBasicMaterial({
      color: initialColors.accentBright,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const arcMesh = new THREE.Mesh(arcGeo, arcMat);
    arcMesh.position.set(0, 0.42, 0);
    compassGroup.add(arcMesh);

    // ----------------------------------------------------
    // STYLE 3: TESSERACT (Quantum 4D Hypercube)
    // ----------------------------------------------------
    const tesseractGroup = new THREE.Group();
    cursorRig.add(tesseractGroup);

    const tesseractBase4D: number[][] = [];
    for (let i = 0; i < 16; i++) {
      tesseractBase4D.push([
        (i & 1 ? 1 : -1) * 0.85,
        (i & 2 ? 1 : -1) * 0.85,
        (i & 4 ? 1 : -1) * 0.85,
        (i & 8 ? 1 : -1) * 0.85,
      ]);
    }

    const tesseractEdgeIndices: [number, number][] = [];
    for (let i = 0; i < 16; i++) {
      for (let j = i + 1; j < 16; j++) {
        const diff = i ^ j;
        if ((diff & (diff - 1)) === 0) {
          tesseractEdgeIndices.push([i, j]);
        }
      }
    }

    const tesseractEdgePositions = new Float32Array(32 * 2 * 3);
    const tesseractLineGeo = new THREE.BufferGeometry();
    tesseractLineGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(tesseractEdgePositions, 3)
    );
    const tesseractLineMat = new THREE.LineBasicMaterial({
      color: initialColors.wire,
      transparent: true,
      opacity: isDarkRef.current ? 0.75 : 0.85,
    });
    const tesseractLines = new THREE.LineSegments(tesseractLineGeo, tesseractLineMat);
    tesseractGroup.add(tesseractLines);

    const nodeGeo = new THREE.SphereGeometry(0.048, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({
      color: initialColors.accentBright,
    });
    const nodeMeshes: THREE.Mesh[] = [];
    for (let i = 0; i < 16; i++) {
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      tesseractGroup.add(node);
      nodeMeshes.push(node);
    }

    const tesseractCoreGeo = new THREE.IcosahedronGeometry(0.32, 0);
    const tesseractCoreMat = new THREE.MeshStandardMaterial({
      color: initialColors.core,
      metalness: 0.85,
      roughness: 0.15,
      flatShading: true,
    });
    const tesseractCore = new THREE.Mesh(tesseractCoreGeo, tesseractCoreMat);
    tesseractGroup.add(tesseractCore);

    // ----------------------------------------------------
    // STYLE 4: PRISM (Minimalist Imperial Crystal Monolith)
    // ----------------------------------------------------
    const prismGroup = new THREE.Group();
    cursorRig.add(prismGroup);

    const prismGeo = new THREE.CylinderGeometry(0.52, 0.42, 1.85, 6, 1);
    const prismMat = new THREE.MeshStandardMaterial({
      color: initialColors.accent,
      metalness: isDarkRef.current ? 0.75 : 0.45,
      roughness: isDarkRef.current ? 0.2 : 0.28,
      flatShading: true,
    });
    const prismMesh = new THREE.Mesh(prismGeo, prismMat);
    prismGroup.add(prismMesh);

    const prismWireGeo = new THREE.CylinderGeometry(0.58, 0.48, 1.95, 6, 1);
    const prismWireMat = new THREE.MeshBasicMaterial({
      color: initialColors.wire,
      wireframe: true,
      transparent: true,
      opacity: isDarkRef.current ? 0.5 : 0.65,
    });
    const prismWire = new THREE.Mesh(prismWireGeo, prismWireMat);
    prismGroup.add(prismWire);

    const diamondGeo = new THREE.OctahedronGeometry(0.32, 0);
    const diamondMat = new THREE.MeshStandardMaterial({
      color: initialColors.core,
      metalness: 0.9,
      roughness: 0.12,
      flatShading: true,
    });
    const diamondMesh = new THREE.Mesh(diamondGeo, diamondMat);
    prismGroup.add(diamondMesh);

    const telemetryRingGeo = new THREE.TorusGeometry(0.95, 0.02, 12, 48);
    const telemetryRingMat = new THREE.MeshBasicMaterial({
      color: initialColors.innerRing,
      transparent: true,
      opacity: 0.7,
    });
    const telemetryRing = new THREE.Mesh(telemetryRingGeo, telemetryRingMat);
    telemetryRing.rotation.x = Math.PI / 2;
    prismGroup.add(telemetryRing);

    // 4. Pinpoint Laser & Precision Crosshairs (Anchor tip)
    const centerDotGeo = new THREE.SphereGeometry(0.075, 16, 16);
    const centerDotMat = new THREE.MeshBasicMaterial({
      color: initialColors.centerDot,
    });
    const centerDot = new THREE.Mesh(centerDotGeo, centerDotMat);
    cursorRig.add(centerDot);

    // 4 Crosshair spokes
    const crosshairMat = new THREE.LineBasicMaterial({
      color: initialColors.crosshair,
      transparent: true,
      opacity: isDarkRef.current ? 0.65 : 0.75,
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
      color: initialColors.bracket,
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
      color: initialColors.particle,
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
        color: isDarkRef.current ? 0xf0c368 : 0xc29028,
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
      const isDark = isDarkRef.current;

      // Tourbillon
      ringMat.color.setHex(colors.accent);
      ringMat.metalness = isDark ? 0.85 : 0.42;
      ringMat.roughness = isDark ? 0.25 : 0.32;

      tickMat.color.setHex(colors.accentBright);
      tickMat.opacity = isDark ? 0.75 : 0.9;

      innerRingMat.color.setHex(colors.innerRing);
      innerRingMat.metalness = isDark ? 0.7 : 0.35;
      innerRingMat.roughness = isDark ? 0.3 : 0.35;

      coreMat.color.setHex(colors.core);
      coreMat.metalness = isDark ? 0.9 : 0.45;
      coreMat.roughness = isDark ? 0.15 : 0.22;

      wireMat.color.setHex(colors.wire);
      wireMat.opacity = isDark ? 0.5 : 0.65;

      // Compass
      compassHeadMat.color.setHex(colors.accent);
      compassHeadMat.metalness = isDark ? 0.8 : 0.45;
      legMat.color.setHex(colors.accent);
      legMat.metalness = isDark ? 0.75 : 0.42;
      spindleMat.color.setHex(colors.innerRing);
      arcMat.color.setHex(colors.accentBright);

      // Tesseract
      tesseractLineMat.color.setHex(colors.wire);
      tesseractLineMat.opacity = isDark ? 0.75 : 0.85;
      nodeMat.color.setHex(colors.accentBright);
      tesseractCoreMat.color.setHex(colors.core);

      // Prism
      prismMat.color.setHex(colors.accent);
      prismMat.metalness = isDark ? 0.75 : 0.45;
      prismWireMat.color.setHex(colors.wire);
      prismWireMat.opacity = isDark ? 0.5 : 0.65;
      diamondMat.color.setHex(colors.core);
      telemetryRingMat.color.setHex(colors.innerRing);

      // Reticle & Rig
      centerDotMat.color.setHex(colors.centerDot);
      crosshairMat.color.setHex(colors.crosshair);
      crosshairMat.opacity = isDark ? 0.65 : 0.75;
      bracketMat.color.setHex(colors.bracket);
      pointLight.color.setHex(colors.lightColor);
      pointLight.intensity = isDark ? 2.5 : 2.2;
      particleMat.color.setHex(colors.particle);
    };

    // Main 60/120 FPS Animation Loop
    let animId = 0;
    const timer = new THREE.Timer();
    timer.connect(document);
    let frameCount = 0;

    const animate = (timestamp?: number) => {
      animId = requestAnimationFrame(animate);

      // Check if tab is in background
      if (document.hidden) return;

      timer.update(timestamp);
      const now = performance.now();
      const delta = Math.min(timer.getDelta(), 0.1);
      const elapsed = timer.getElapsed();
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

      // Movement & motion multipliers
      const spinSpeed = isInteractive ? 2.5 : 1.0;
      const motionMult = shouldReduceMotion ? 0.25 : 1.0;
      const activeStyle = cursorStyleRef.current;

      // Toggle group visibility
      tourbillonGroup.visible = activeStyle === "tourbillon";
      compassGroup.visible = activeStyle === "compass";
      tesseractGroup.visible = activeStyle === "tesseract";
      prismGroup.visible = activeStyle === "prism";

      // 1. TOURBILLON ANIMATION (Horology Astrolabe)
      if (activeStyle === "tourbillon") {
        outerRing.rotation.x = tiltX;
        outerRing.rotation.y = tiltY;
        outerRing.rotation.z += 0.008 * spinSpeed * motionMult;

        innerRing.rotation.x = Math.PI / 3.5 + tiltX * 0.7;
        innerRing.rotation.y += 0.02 * spinSpeed * motionMult;
        innerRing.rotation.z = tiltZ;

        coreMesh.rotation.x += 0.015 * spinSpeed * motionMult;
        coreMesh.rotation.y += 0.022 * spinSpeed * motionMult;
        wireMesh.rotation.x -= 0.012 * spinSpeed * motionMult;
        wireMesh.rotation.y -= 0.018 * spinSpeed * motionMult;

        if (!shouldReduceMotion) {
          coreMesh.position.z = Math.sin(elapsed * 2.2) * 0.09;
          outerRing.position.z = Math.cos(elapsed * 1.6) * 0.06;
        }
      }

      // 2. COMPASS ANIMATION (Architectural Caliper)
      else if (activeStyle === "compass") {
        const caliperFlex = (isInteractive ? 0.16 : 0) + (isDown ? -0.1 : 0) + Math.min(speed * 0.008, 0.08);
        leftLeg.rotation.z = 0.35 + caliperFlex;
        rightLeg.rotation.z = -0.22 - caliperFlex * 0.75;

        thumbwheel.rotation.x += (speed * 0.05 + 0.012) * motionMult;
        compassGroup.rotation.x = tiltX * 0.75;
        compassGroup.rotation.y = tiltY * 0.75;
        compassGroup.rotation.z = tiltZ * 0.45;
      }

      // 3. TESSERACT ANIMATION (Quantum 4D Hypercube)
      else if (activeStyle === "tesseract") {
        const angleXW = elapsed * 0.85 * spinSpeed * motionMult;
        const angleYZ = elapsed * 0.65 * spinSpeed * motionMult;
        const cosXW = Math.cos(angleXW);
        const sinXW = Math.sin(angleXW);
        const cosYZ = Math.cos(angleYZ);
        const sinYZ = Math.sin(angleYZ);

        const projected3D: number[] = new Array(48);
        for (let i = 0; i < 16; i++) {
          const [x0, y0, z0, w0] = tesseractBase4D[i];
          // 4D XW Rotation
          const x1 = x0 * cosXW - w0 * sinXW;
          const w1 = x0 * sinXW + w0 * cosXW;
          // 4D YZ Rotation
          const y2 = y0 * cosYZ - z0 * sinYZ;
          const z2 = y0 * sinYZ + z0 * cosYZ;
          const x2 = x1;
          const w2 = w1;

          // 4D Perspective Projection into 3D
          const d = 2.4;
          const proj = 1.0 / (d - w2 * 0.65);
          const finalX = x2 * proj * 1.65;
          const finalY = y2 * proj * 1.65;
          const finalZ = z2 * proj * 1.65;

          projected3D[i * 3 + 0] = finalX;
          projected3D[i * 3 + 1] = finalY;
          projected3D[i * 3 + 2] = finalZ;

          nodeMeshes[i].position.set(finalX, finalY, finalZ);
        }

        const posAttr = tesseractLineGeo.attributes.position as THREE.BufferAttribute;
        const lineArr = posAttr.array as Float32Array;
        let lineIdx = 0;
        for (let e = 0; e < tesseractEdgeIndices.length; e++) {
          const [i1, i2] = tesseractEdgeIndices[e];
          lineArr[lineIdx++] = projected3D[i1 * 3 + 0];
          lineArr[lineIdx++] = projected3D[i1 * 3 + 1];
          lineArr[lineIdx++] = projected3D[i1 * 3 + 2];
          lineArr[lineIdx++] = projected3D[i2 * 3 + 0];
          lineArr[lineIdx++] = projected3D[i2 * 3 + 1];
          lineArr[lineIdx++] = projected3D[i2 * 3 + 2];
        }
        posAttr.needsUpdate = true;

        tesseractCore.rotation.x += 0.02 * spinSpeed * motionMult;
        tesseractCore.rotation.y += 0.028 * spinSpeed * motionMult;
        tesseractGroup.rotation.x = tiltX * 0.9;
        tesseractGroup.rotation.y = tiltY * 0.9;
      }

      // 4. PRISM ANIMATION (Minimalist Imperial Crystal Monolith)
      else if (activeStyle === "prism") {
        prismGroup.rotation.x = tiltX * 1.25;
        prismGroup.rotation.y = tiltY * 1.25;
        prismGroup.rotation.z = tiltZ * 1.6;

        prismMesh.rotation.y += 0.015 * spinSpeed * motionMult;
        prismWire.rotation.y -= 0.01 * spinSpeed * motionMult;
        diamondMesh.rotation.x += 0.028 * spinSpeed * motionMult;
        diamondMesh.rotation.z += 0.02 * spinSpeed * motionMult;
        telemetryRing.rotation.z += 0.018 * spinSpeed * motionMult;

        if (!shouldReduceMotion) {
          telemetryRing.position.y = Math.sin(elapsed * 2.8) * 0.28;
        }
      }

      // Crosshair stability: keep reticle upright, but pulse slightly
      crosshairLines.rotation.z = activeStyle === "tourbillon" ? -outerRing.rotation.z : 0;

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

      // Tourbillon disposals
      ringGeo.dispose();
      ringMat.dispose();
      tickGeoMajor.dispose();
      tickGeoMinor.dispose();
      tickMat.dispose();
      innerRingGeo.dispose();
      innerRingMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      wireGeo.dispose();
      wireMat.dispose();

      // Compass disposals
      compassHeadGeo.dispose();
      compassHeadMat.dispose();
      leftLegGeo.dispose();
      rightLegGeo.dispose();
      legMat.dispose();
      spindleGeo.dispose();
      spindleMat.dispose();
      thumbwheelGeo.dispose();
      arcGeo.dispose();
      arcMat.dispose();

      // Tesseract disposals
      tesseractLineGeo.dispose();
      tesseractLineMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      tesseractCoreGeo.dispose();
      tesseractCoreMat.dispose();

      // Prism disposals
      prismGeo.dispose();
      prismMat.dispose();
      prismWireGeo.dispose();
      prismWireMat.dispose();
      diamondGeo.dispose();
      diamondMat.dispose();
      telemetryRingGeo.dispose();
      telemetryRingMat.dispose();

      // Rig disposals
      centerDotGeo.dispose();
      centerDotMat.dispose();
      crosshairGeo.dispose();
      crosshairMat.dispose();
      bracketGeo.dispose();
      bracketMat.dispose();
      rippleGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      timer.disconnect();
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
        <span className="text-[8px] opacity-60 uppercase">{cursorStyle}</span>
      </div>
    </>
  );
}
