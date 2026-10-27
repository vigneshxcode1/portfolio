import React, { forwardRef, useEffect, useImperativeHandle, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

const subscribeReducedMotion = (callback) => {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
};

const getReducedMotionSnapshot = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (val, min, max) => Math.min(max, Math.max(min, val));

let canvas2DContext = null;
const parseCssColor = (colorStr, fallback) => {
  if (typeof document === "undefined") return fallback;
  if (!canvas2DContext) {
    const canvas = document.createElement("canvas");
    canvas2DContext = canvas.getContext("2d");
  }
  if (!canvas2DContext) return fallback;
  canvas2DContext.fillStyle = "#010203";
  canvas2DContext.fillStyle = colorStr;
  const styleStr = String(canvas2DContext.fillStyle);
  if (styleStr === "#010203" && colorStr.trim().toLowerCase() !== "#010203") {
    return fallback;
  }
  if (styleStr.startsWith("#")) {
    const hex = styleStr.slice(1);
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
    ];
  }
  const parts = styleStr.match(/[\d.]+/g);
  if (!parts || parts.length < 3) return fallback;
  return [Number(parts[0]) / 255, Number(parts[1]) / 255, Number(parts[2]) / 255];
};

const srgbToLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

const srgbToOklab = ([r, g, b]) => {
  const lr = srgbToLinear(r);
  const lg = srgbToLinear(g);
  const lb = srgbToLinear(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};

const vertexShaderRibbon = `
in vec2 aWire;
in vec2 aSample;
uniform vec2 uResolution;
uniform float uPixelRatio;
uniform float uTime;
uniform float uPulseTime;
uniform float uAngle;
uniform float uExtent;
uniform float uAmplitude;
uniform float uFrequency;
uniform float uHalf;
uniform float uCurl;
uniform float uTwist;
uniform float uSpin;
uniform float uLineWidth;
uniform float uBack;
uniform float uStripes;
uniform float uFlow;
uniform float uEnergy;
uniform float uPulseSpeed;
uniform float uPulseStrength;
uniform float uInk;
uniform vec3 uLabDeep;
uniform vec3 uLabA;
uniform vec3 uLabB;
uniform vec4 uPulses[16];
out float vDist;
out float vHalfPx;
out vec3 vColor;
out float vGain;

vec3 labToLinear(vec3 lab) {
  float l = lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z;
  float m = lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z;
  float s = lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z;
  l = l * l * l;
  m = m * m * m;
  s = s * s * s;
  return max(vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
  ), 0.0);
}

vec3 palette(float s) {
  s = fract(s) * 3.0;
  vec3 lab = s < 1.0 ? mix(uLabDeep, uLabA, smoothstep(0.0, 1.0, s))
    : s < 2.0 ? mix(uLabA, uLabB, smoothstep(0.0, 1.0, s - 1.0))
    : mix(uLabB, uLabDeep, smoothstep(0.0, 1.0, s - 2.0));
  return labToLinear(lab);
}

float spine(float x) {
  float t = uTime;
  return uAmplitude * (0.62 * sin(x * uFrequency + t * 0.33 + 0.4)
    + 0.26 * sin(x * uFrequency * 1.93 - t * 0.21 + 2.1)
    + 0.12 * sin(x * uFrequency * 3.07 + t * 0.47 + 4.2));
}

vec3 wire(float x, float u, float seed, out float facing) {
  float t = uTime;
  float halfWidth = uHalf * (1.0 + 0.22 * sin(x * 0.61 - t * 0.19 + 1.3));
  float theta = uTwist * x + uSpin;
  float wobble = 0.4 * (sin(x * 2.3 + seed * 6.2831853 + t * 0.7) * 0.6 + sin(x * 3.9 - seed * 11.3 - t * 0.5) * 0.4);
  float xi = u + wobble * 0.05;
  float zeta = uCurl * (u * u - 1.0 / 3.0) + wobble * 0.07;
  float c = cos(theta);
  float s = sin(theta);
  float y = spine(x) + halfWidth * (xi * c - zeta * s);
  float z = xi * s + zeta * c;
  facing = clamp(0.5 + 0.5 * z, 0.0, 1.0);
  return vec3(x, y, z);
}

vec2 toScreen(vec2 p) {
  float unit = 0.5 * uResolution.y;
  float ca = cos(uAngle);
  float sa = sin(uAngle);
  return vec2(ca * p.x - sa * p.y, sa * p.x + ca * p.y) * unit + 0.5 * uResolution;
}

void main() {
  float u = aWire.x;
  float seed = aWire.y;
  float x = mix(-uExtent, uExtent, aSample.x);
  float delta = 2.0 * uExtent / 360.0;
  float f0, f1, f2;
  vec3 p0 = wire(x - delta, u, seed, f0);
  vec3 p1 = wire(x, u, seed, f1);
  vec3 p2 = wire(x + delta, u, seed, f2);
  vec2 s0 = toScreen(p0.xy);
  vec2 s1 = toScreen(p1.xy);
  vec2 s2 = toScreen(p2.xy);
  vec2 tangent = normalize(s2 - s0 + vec2(1e-6, 0.0));
  vec2 normal = vec2(-tangent.y, tangent.x);
  float halfPx = uLineWidth * uPixelRatio * mix(0.3, 1.0, f1 * f1 * f1) * 0.5;
  float reach = halfPx * 2.2 + 1.5;
  vec2 position2 = s1 + normal * aSample.y * reach;
  vDist = aSample.y * reach;
  vHalfPx = halfPx;
  float light = 0.0;
  for (int k = 0; k < 16; k++) {
    vec4 pulse = uPulses[k];
    if (pulse.w <= 0.0) continue;
    float age = uPulseTime - pulse.y;
    if (age < 0.0 || age > 4.0) continue;
    float travel = age * uPulseSpeed;
    float front = abs(x - pulse.x) - travel + 0.05 * sin(u * 7.0 + pulse.y * 3.7) + (seed - 0.5) * 0.025;
    bool wave = pulse.w > 1.5;
    float along = front > 0.0 ? exp(-front * front / 0.0025) : exp(front / (wave ? 0.32 : 0.13));
    along += wave ? 0.0 : 0.45 * exp(-front * front / 0.0012);
    along *= smoothstep(0.0, 0.12, travel);
    float gap = (u - pulse.z) * 13.0;
    float across = wave ? 1.0 : 1.25 * exp(-gap * gap);
    light += along * across * exp(-age * 1.1);
  }
  light = min(light * uPulseStrength, 1.4);
  float tone = u * uStripes * 0.5 + x * 0.09 - uFlow;
  vec3 base = palette(tone);
  float lit = clamp(light, 0.0, 1.0);
  vec3 glowTint = mix(base, vec3(1.0, 0.95, 1.0), lit * 0.45);
  vec3 inkTint = mix(base, labToLinear(uLabDeep), lit * 0.7);
  vColor = mix(glowTint, inkTint, uInk);
  vGain = mix(uBack, 1.0, pow(f1, 1.5)) * (1.0 + light * mix(0.9, 2.2, uInk)) * (1.0 + uEnergy * 0.18);
  gl_Position = vec4(position2 / uResolution * 2.0 - 1.0, 0.0, 1.0);
}
`;

const fragmentShaderRibbon = `
precision highp float;
uniform float uCore;
in float vDist;
in float vHalfPx;
in vec3 vColor;
in float vGain;
out vec4 fragColor;

void main() {
  float sigma = max(vHalfPx, 0.55);
  float d = vDist / sigma;
  float energy = exp(-d * d) * min(vHalfPx / 0.55, 1.0) * vGain * uCore;
  fragColor = vec4(vColor * energy, energy);
}
`;

const quadVertexShader = `
out vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const downsampleFragmentShader = `
precision highp float;
uniform sampler2D uSource;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;

void main() {
  vec4 a = texture(uSource, vUv + uTexel * vec2(-1.0, -1.0));
  vec4 b = texture(uSource, vUv + uTexel * vec2(1.0, -1.0));
  vec4 c = texture(uSource, vUv + uTexel * vec2(-1.0, 1.0));
  vec4 d = texture(uSource, vUv + uTexel * vec2(1.0, 1.0));
  fragColor = (a + b + c + d) * 0.125 + texture(uSource, vUv) * 0.5;
}
`;

const upsampleFragmentShader = `
precision highp float;
uniform sampler2D uSource;
uniform sampler2D uBase;
uniform vec2 uTexel;
in vec2 vUv;
out vec4 fragColor;

void main() {
  vec4 sum = texture(uSource, vUv) * 4.0;
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, 0.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(1.0, 0.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(0.0, -1.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(0.0, 1.0)) * 2.0;
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, -1.0));
  sum += texture(uSource, vUv + uTexel * vec2(1.0, -1.0));
  sum += texture(uSource, vUv + uTexel * vec2(-1.0, 1.0));
  sum += texture(uSource, vUv + uTexel * vec2(1.0, 1.0));
  fragColor = texture(uBase, vUv) + sum / 16.0;
}
`;

const compositeFragmentShader = `
precision highp float;
uniform sampler2D uLines;
uniform sampler2D uBloom;
uniform vec3 uBackground;
uniform vec2 uResolution;
uniform float uGlow;
uniform float uExposure;
uniform float uMode;
uniform float uGrain;
in vec2 vUv;
out vec4 fragColor;

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec3 encode(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
}

void main() {
  vec4 lines = texture(uLines, vUv);
  vec4 bloom = texture(uBloom, vUv);
  vec3 color;
  if (uMode < 0.5) {
    vec3 light = (lines.rgb + bloom.rgb * uGlow) * uExposure;
    vec3 exposed = 1.0 - exp(-light);
    float peak = max(exposed.r, max(exposed.g, exposed.b));
    exposed = mix(exposed, vec3(peak), smoothstep(0.75, 1.0, peak) * 0.35);
    vec2 q = vUv - 0.5;
    q.x *= uResolution.x / uResolution.y;
    exposed *= 1.0 - 0.18 * smoothstep(0.35, 1.1, length(q));
    color = uBackground + (1.0 - uBackground) * exposed;
  } else {
    float energy = lines.a + bloom.a * uGlow * 0.2;
    vec3 hue = (lines.rgb + bloom.rgb * uGlow * 0.2) / max(energy, 1e-4);
    float cover = clamp(1.0 - exp(-energy * uExposure * 1.4), 0.0, 0.94);
    color = mix(uBackground, clamp(hue * 0.8, 0.0, 1.0), cover);
  }
  float grain = hash(gl_FragCoord.xy + uGrain * 311.0) - 0.5;
  fragColor = vec4(encode(color) + grain * (1.2 / 255.0), 1.0);
}
`;

function buildWireGeometry(wireCount) {
  const positions = new Float32Array(361 * wireCount * 8);
  const indices = new Uint32Array(360 * wireCount * 6);
  let vOffset = 0;
  let iOffset = 0;
  let seedVal = 1;
  const rand = () => (seedVal = (16807 * seedVal) % 0x7fffffff) / 0x7fffffff;

  for (let r = 0; r < wireCount; r++) {
    const u = ((r + 0.5) / wireCount) * 2 - 1;
    const seed = rand();
    const baseVert = vOffset / 4;
    for (let e = 0; e <= 360; e++) {
      const sampleX = e / 360;
      positions.set([u, seed, sampleX, -1, u, seed, sampleX, 1], vOffset);
      vOffset += 8;
    }
    for (let e = 0; e < 360; e++) {
      const t = baseVert + 2 * e;
      indices.set([t, t + 1, t + 2, t + 1, t + 3, t + 2], iOffset);
      iOffset += 6;
    }
  }

  const geom = new THREE.BufferGeometry();
  const buffer = new THREE.InterleavedBuffer(positions, 4);
  geom.setAttribute("aWire", new THREE.InterleavedBufferAttribute(buffer, 2, 0));
  geom.setAttribute("aSample", new THREE.InterleavedBufferAttribute(buffer, 2, 2));
  geom.setAttribute("position", new THREE.InterleavedBufferAttribute(buffer, 3, 0));
  geom.setIndex(new THREE.BufferAttribute(indices, 1));
  return geom;
}

const InterferenceRibbons = forwardRef(function InterferenceRibbons(
  {
    colors = ["#6B3CFF", "#D46BFF"],
    backgroundColor = "#0A0A0A",
    mode = "auto",
    wires = 64,
    lineWidth = 1.6,
    ribbonWidth = 0.24,
    amplitude = 0.6,
    waveLength = 1,
    angle = 42,
    twist = 1.6,
    curl = 0.25,
    depth = 0.65,
    stripes = 2.2,
    colorFlow = 0.04,
    glow = 0.45,
    intensity = 1,
    speed = 0.7,
    spin = 0.35,
    interactive = true,
    hoverPulses = true,
    clickPulse = true,
    pulseSpeed = 1.1,
    pulseStrength = 1,
    hoverBoost = 1,
    paused = false,
    quality = 1,
    className,
    style,
    children,
  },
  ref
) {
  const containerRef = useRef(null);
  const controllerRef = useRef(null);
  const prefersReduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);

  const propsRef = useRef({
    colors,
    backgroundColor,
    mode,
    wires,
    lineWidth,
    ribbonWidth,
    amplitude,
    waveLength,
    angle,
    twist,
    curl,
    depth,
    stripes,
    colorFlow,
    glow,
    intensity,
    speed,
    spin,
    interactive,
    hoverPulses,
    clickPulse,
    pulseSpeed,
    pulseStrength,
    hoverBoost,
    paused,
    quality,
    reduced: prefersReduced,
  });

  useEffect(() => {
    propsRef.current = {
      colors,
      backgroundColor,
      mode,
      wires,
      lineWidth,
      ribbonWidth,
      amplitude,
      waveLength,
      angle,
      twist,
      curl,
      depth,
      stripes,
      colorFlow,
      glow,
      intensity,
      speed,
      spin,
      interactive,
      hoverPulses,
      clickPulse,
      pulseSpeed,
      pulseStrength,
      hoverBoost,
      paused,
      quality,
      reduced: prefersReduced,
    };
    controllerRef.current?.sync();
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initEngine = (elem, stateRef) => {
      let renderer;
      const canvas = document.createElement("canvas");
      canvas.setAttribute("aria-hidden", "true");
      canvas.style.position = "absolute";
      canvas.style.inset = "0";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.display = "block";
      canvas.style.pointerEvents = "none";
      elem.prepend(canvas);

      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          alpha: false,
          antialias: false,
          powerPreference: "high-performance",
        });
      } catch {
        canvas.remove();
        return null;
      }

      if (!renderer.capabilities.isWebGL2) {
        renderer.dispose();
        canvas.remove();
        return null;
      }

      renderer.autoClear = false;

      const targetType =
        renderer.extensions.has("EXT_color_buffer_float") ||
        renderer.extensions.has("EXT_color_buffer_half_float")
          ? THREE.HalfFloatType
          : THREE.UnsignedByteType;

      const orthoCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      const quadGeom = new THREE.PlaneGeometry(2, 2);
      const pulses = Array.from({ length: 16 }, () => new THREE.Vector4(0, -100, 0, 0));

      const ribbonMat = new THREE.ShaderMaterial({
        glslVersion: THREE.GLSL3,
        uniforms: {
          uResolution: { value: new THREE.Vector2(1, 1) },
          uPixelRatio: { value: 1 },
          uTime: { value: 0 },
          uPulseTime: { value: 0 },
          uAngle: { value: 0 },
          uExtent: { value: 2 },
          uAmplitude: { value: 0.6 },
          uFrequency: { value: 1.55 },
          uHalf: { value: 0.24 },
          uCurl: { value: 0.25 },
          uTwist: { value: 1.6 },
          uSpin: { value: 0 },
          uLineWidth: { value: 1.6 },
          uBack: { value: 0.35 },
          uStripes: { value: 2.2 },
          uFlow: { value: 0 },
          uEnergy: { value: 0 },
          uPulseSpeed: { value: 1.1 },
          uPulseStrength: { value: 1 },
          uInk: { value: 0 },
          uLabDeep: { value: new THREE.Vector3() },
          uLabA: { value: new THREE.Vector3() },
          uLabB: { value: new THREE.Vector3() },
          uPulses: { value: pulses },
          uCore: { value: 0.85 },
        },
        vertexShader: vertexShaderRibbon,
        fragmentShader: fragmentShaderRibbon,
        depthTest: false,
        depthWrite: false,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.CustomBlending,
        blendEquation: THREE.AddEquation,
        blendSrc: THREE.OneFactor,
        blendDst: THREE.OneFactor,
        blendSrcAlpha: THREE.OneFactor,
        blendDstAlpha: THREE.OneFactor,
      });

      const createPassMat = (fragShader, uniforms) =>
        new THREE.ShaderMaterial({
          glslVersion: THREE.GLSL3,
          uniforms,
          vertexShader: quadVertexShader,
          fragmentShader: fragShader,
          depthTest: false,
          depthWrite: false,
          blending: THREE.NoBlending,
        });

      const downsampleMat = createPassMat(downsampleFragmentShader, {
        uSource: { value: null },
        uTexel: { value: new THREE.Vector2() },
      });

      const upsampleMat = createPassMat(upsampleFragmentShader, {
        uSource: { value: null },
        uBase: { value: null },
        uTexel: { value: new THREE.Vector2() },
      });

      const compositeMat = createPassMat(compositeFragmentShader, {
        uLines: { value: null },
        uBloom: { value: null },
        uBackground: { value: new THREE.Vector3() },
        uResolution: { value: new THREE.Vector2(1, 1) },
        uGlow: { value: 0.45 },
        uExposure: { value: 1.6 },
        uMode: { value: 0 },
        uGrain: { value: 0 },
      });

      let currentWiresCount = 0;
      const ribbonMesh = new THREE.Mesh(new THREE.BufferGeometry(), ribbonMat);
      ribbonMesh.frustumCulled = false;
      const ribbonScene = new THREE.Scene();
      ribbonScene.add(ribbonMesh);

      const quadMesh = new THREE.Mesh(quadGeom, compositeMat);
      quadMesh.frustumCulled = false;
      const quadScene = new THREE.Scene();
      quadScene.add(quadMesh);

      const createRenderTarget = (w, h) =>
        new THREE.WebGLRenderTarget(Math.max(1, w), Math.max(1, h), {
          type: targetType,
          format: THREE.RGBAFormat,
          minFilter: THREE.LinearFilter,
          magFilter: THREE.LinearFilter,
          depthBuffer: false,
          stencilBuffer: false,
          generateMipmaps: false,
        });

      let mainTarget = null;
      let downTargets = [];
      let upTargets = [];
      let destroyed = false;
      let animFrameId = 0;
      let lastTime = 0;
      let isVisible = true;
      let timeAccum = 6;
      let pulseTime = 0;
      let spinAngle = 0;
      let colorFlowOffset = 0;
      let hoverEnergy = 0;
      let isHovered = false;
      let pulseRingIndex = 0;
      let widthPx = 1;
      let heightPx = 1;
      let renderDpr = 1;
      let grainSeed = 0;
      let lastPointer = { x: -1e9, y: -1e9 };

      const disposeTargets = () => {
        mainTarget?.dispose();
        downTargets.forEach((t) => t.dispose());
        upTargets.forEach((t) => t.dispose());
        mainTarget = null;
        downTargets = [];
        upTargets = [];
      };

      const renderPass = (material, target) => {
        quadMesh.material = material;
        renderer.setRenderTarget(target);
        renderer.render(quadScene, orthoCam);
      };

      const getRibbonGeometryParams = () => {
        const p = stateRef.current;
        const rad = (clamp(p.angle, -180, 180) * Math.PI) / 180;
        const safeW = Math.max(widthPx, 200);
        const safeH = Math.max(heightPx, 200);
        const extent =
          ((safeW / safeH) * Math.abs(Math.cos(rad)) + Math.abs(Math.sin(rad))) * 1.08;
        return {
          angle: rad,
          extent,
          frequency: 1.55 / clamp(p.waveLength, 0.2, 5),
        };
      };

      const renderFrame = () => {
        if (!mainTarget || !downTargets.length) return;
        const p = stateRef.current;
        const targetWireCount = Math.round(clamp(p.wires, 4, 160));

        if (targetWireCount !== currentWiresCount) {
          currentWiresCount = targetWireCount;
          ribbonMesh.geometry.dispose();
          ribbonMesh.geometry = buildWireGeometry(targetWireCount);
        }

        (() => {
          const u = ribbonMat.uniforms;
          const canvasW = widthPx * renderDpr;
          const canvasH = heightPx * renderDpr;
          const { angle: a, extent: ext, frequency: freq } = getRibbonGeometryParams();
          const labA = srgbToOklab(parseCssColor(p.colors[0], [0.42, 0.24, 1]));
          const labB = srgbToOklab(parseCssColor(p.colors[1], [0.83, 0.42, 1]));

          u.uResolution.value.set(canvasW, canvasH);
          u.uPixelRatio.value = renderDpr;
          u.uTime.value = timeAccum;
          u.uPulseTime.value = pulseTime;
          u.uAngle.value = a;
          u.uExtent.value = ext;
          u.uAmplitude.value = clamp(p.amplitude, 0, 1.5);
          u.uFrequency.value = freq;
          u.uHalf.value = clamp(p.ribbonWidth, 0.02, 0.8);
          u.uCurl.value = clamp(p.curl, 0, 1.2);
          u.uTwist.value = clamp(p.twist, 0, 8);
          u.uSpin.value = spinAngle;
          u.uLineWidth.value = clamp(p.lineWidth, 0.4, 6);
          u.uBack.value = 1 - clamp(p.depth, 0, 1);
          u.uStripes.value = clamp(p.stripes, 0, 12);
          u.uFlow.value = colorFlowOffset;
          u.uEnergy.value = hoverEnergy;
          u.uPulseSpeed.value = clamp(p.pulseSpeed, 0.1, 5);
          u.uPulseStrength.value = clamp(p.pulseStrength, 0, 3);

          const bgRgb = parseCssColor(p.backgroundColor, [0.04, 0.04, 0.04]);
          const luminance = 0.2126 * bgRgb[0] + 0.7152 * bgRgb[1] + 0.0722 * bgRgb[2];
          const isInk = p.mode === "ink" || (p.mode === "auto" && luminance > 0.5);
          const deepFactor = isInk ? 1.15 : 0.85;

          u.uInk.value = isInk ? 1 : 0;
          u.uLabDeep.value.set(labA[0] * (isInk ? 0.6 : 0.42), labA[1] * deepFactor, labA[2] * deepFactor);
          u.uLabA.value.set(labA[0], labA[1], labA[2]);
          u.uLabB.value.set(labB[0], labB[1], labB[2]);

          const cu = compositeMat.uniforms;
          cu.uBackground.value.set(srgbToLinear(bgRgb[0]), srgbToLinear(bgRgb[1]), srgbToLinear(bgRgb[2]));
          cu.uResolution.value.set(canvasW, canvasH);
          cu.uGlow.value = clamp(p.glow, 0, 3);
          cu.uExposure.value = 1.6 * clamp(p.intensity, 0, 4);
          cu.uMode.value = isInk ? 1 : 0;
          cu.uGrain.value = grainSeed;
        })();

        renderer.setRenderTarget(mainTarget);
        renderer.setClearColor(0, 0);
        renderer.clear();
        renderer.render(ribbonScene, orthoCam);

        let passSource = mainTarget;
        for (const dt of downTargets) {
          downsampleMat.uniforms.uSource.value = passSource.texture;
          downsampleMat.uniforms.uTexel.value.set(1 / passSource.width, 1 / passSource.height);
          renderPass(downsampleMat, dt);
          passSource = dt;
        }

        let bloomSource = downTargets[downTargets.length - 1];
        for (let e = downTargets.length - 2; e >= 0; e--) {
          upsampleMat.uniforms.uSource.value = bloomSource.texture;
          upsampleMat.uniforms.uBase.value = downTargets[e].texture;
          upsampleMat.uniforms.uTexel.value.set(1 / bloomSource.width, 1 / bloomSource.height);
          renderPass(upsampleMat, upTargets[e]);
          bloomSource = upTargets[e];
        }

        compositeMat.uniforms.uLines.value = mainTarget.texture;
        compositeMat.uniforms.uBloom.value = bloomSource.texture;
        renderPass(compositeMat, null);
      };

      const tick = (now) => {
        animFrameId = 0;
        if (destroyed) return;
        const dt = Math.min(0.05, Math.max(0, (now - lastTime) / 1000));
        lastTime = now;

        (() => {
          const p = stateRef.current;
          const targetEnergy = isHovered && p.interactive && !p.reduced ? clamp(p.hoverBoost, 0, 2) : 0;
          hoverEnergy += (targetEnergy - hoverEnergy) * (1 - Math.exp(-dt / 0.4));
          pulseTime += dt;

          if (p.paused || p.reduced) return;
          const spd = clamp(p.speed, -4, 4) * (1 + 0.35 * hoverEnergy);
          timeAccum += dt * spd;
          spinAngle += dt * spd * clamp(p.spin, -4, 4);
          colorFlowOffset += dt * spd * clamp(p.colorFlow, -2, 2);
          grainSeed = (grainSeed + 0.618034) % 1;
        })();

        renderFrame();

        const p = stateRef.current;
        const shouldAnimate = !p.paused && !p.reduced;
        const targetEnergy = isHovered && p.interactive && !p.reduced ? p.hoverBoost : 0;
        const hasEnergyPending =
          Math.abs(hoverEnergy - targetEnergy) > 0.002 || pulses.some((item) => item.w > 0 && pulseTime - item.y < 4);

        if (isVisible && !document.hidden && (shouldAnimate || hasEnergyPending)) {
          animFrameId = requestAnimationFrame(tick);
        }
      };

      const requestLoop = () => {
        if (!destroyed && !animFrameId && isVisible) {
          lastTime = performance.now();
          animFrameId = requestAnimationFrame(tick);
        }
      };

      const resize = () => {
        const rect = elem.getBoundingClientRect();
        const measuredW = rect.width || elem.clientWidth || elem.parentElement?.clientWidth || window.innerWidth;
        const measuredH = rect.height || elem.clientHeight || elem.parentElement?.clientHeight || window.innerHeight;
        widthPx = Math.max(300, Math.round(measuredW));
        heightPx = Math.max(240, Math.round(measuredH));
        renderDpr = Math.min(window.devicePixelRatio || 1, 2) * clamp(stateRef.current.quality, 0.25, 1);
        renderer.setPixelRatio(renderDpr);
        renderer.setSize(widthPx, heightPx, false);

        const targetW = Math.max(1, Math.round(widthPx * renderDpr));
        const targetH = Math.max(1, Math.round(heightPx * renderDpr));

        disposeTargets();
        mainTarget = createRenderTarget(targetW, targetH);

        const mipLevels = clamp(Math.floor(Math.log2(Math.min(targetW, targetH) / 8)), 3, 7);
        for (let i = 1; i <= mipLevels; i++) {
          downTargets.push(createRenderTarget(Math.max(1, targetW >> i), Math.max(1, targetH >> i)));
          upTargets.push(createRenderTarget(Math.max(1, targetW >> i), Math.max(1, targetH >> i)));
        }

        renderFrame();
        requestLoop();
      };

      const addPulse = (xCoord, uCoord, strength) => {
        pulses[pulseRingIndex].set(xCoord, pulseTime, uCoord, strength);
        pulseRingIndex = (pulseRingIndex + 1) % 16;
        requestLoop();
      };

      const screenToRibbonCoord = (clientX, clientY) => {
        const rect = elem.getBoundingClientRect();
        const { angle: a } = getRibbonGeometryParams();
        const safeH = Math.max(rect.height || heightPx, 100);
        const unit = 0.5 * safeH;
        const nx = (clientX - rect.left - (rect.width || widthPx) / 2) / unit;
        const ny = -(clientY - rect.top - safeH / 2) / unit;
        const ca = Math.cos(a);
        const sa = Math.sin(a);
        return {
          x: ca * nx + sa * ny,
          y: -sa * nx + ca * ny,
        };
      };

      const onPointerMove = (e) => {
        const p = stateRef.current;
        if (e.pointerType === "touch" || !p.interactive) return;

        if (!isHovered) {
          isHovered = true;
          requestLoop();
        }

        if (!p.hoverPulses || p.reduced || Math.hypot(e.clientX - lastPointer.x, e.clientY - lastPointer.y) < 50) {
          return;
        }

        const { frequency: freq } = getRibbonGeometryParams();
        const coords = screenToRibbonCoord(e.clientX, e.clientY);
        const curHalfWidth =
          clamp(p.ribbonWidth, 0.02, 0.8) * (1 + 0.22 * Math.sin(0.61 * coords.x - 0.19 * timeAccum + 1.3));
        const theta = clamp(p.twist, 0, 8) * coords.x + spinAngle;
        const spineY =
          clamp(p.amplitude, 0, 1.5) *
          (0.62 * Math.sin(coords.x * freq + 0.33 * timeAccum + 0.4) +
            0.26 * Math.sin(coords.x * freq * 1.93 - 0.21 * timeAccum + 2.1) +
            0.12 * Math.sin(coords.x * freq * 3.07 + 0.47 * timeAccum + 4.2));
        const dy = coords.y - spineY;

        if (Math.abs(dy) > curHalfWidth * Math.max(Math.abs(Math.cos(theta)), 0.12) + 0.03) {
          return;
        }

        lastPointer.x = e.clientX;
        lastPointer.y = e.clientY;
        const uVal = clamp(dy / (curHalfWidth * Math.cos(theta) || 0.001), -1, 1);
        addPulse(coords.x, uVal, 1);
      };

      const onPointerLeave = () => {
        isHovered = false;
        lastPointer.x = -1e9;
        requestLoop();
      };

      const onPointerDown = (e) => {
        const p = stateRef.current;
        if (e.button === 0 && p.interactive && p.clickPulse && !p.reduced) {
          addPulse(screenToRibbonCoord(e.clientX, e.clientY).x, 0, 2);
        }
      };

      elem.addEventListener("pointermove", onPointerMove);
      elem.addEventListener("pointerleave", onPointerLeave);
      elem.addEventListener("pointercancel", onPointerLeave);
      elem.addEventListener("pointerdown", onPointerDown);

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(elem);

      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          isVisible = entries.some((entry) => entry.isIntersecting);
          if (isVisible) requestLoop();
        },
        { rootMargin: "80px" }
      );
      intersectionObserver.observe(elem);

      const onVisibilityChange = () => {
        if (!document.hidden) requestLoop();
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      const onContextLost = (e) => e.preventDefault();
      canvas.addEventListener("webglcontextlost", onContextLost);

      resize();

      return {
        sync: () => {
          const currentDprSetting =
            Math.min(window.devicePixelRatio || 1, 2) * clamp(stateRef.current.quality, 0.25, 1);
          if (Math.abs(currentDprSetting - renderDpr) > 0.001) {
            resize();
          } else {
            renderFrame();
          }
          requestLoop();
        },
        destroy: () => {
          destroyed = true;
          cancelAnimationFrame(animFrameId);
          elem.removeEventListener("pointermove", onPointerMove);
          elem.removeEventListener("pointerleave", onPointerLeave);
          elem.removeEventListener("pointercancel", onPointerLeave);
          elem.removeEventListener("pointerdown", onPointerDown);
          document.removeEventListener("visibilitychange", onVisibilityChange);
          canvas.removeEventListener("webglcontextlost", onContextLost);
          resizeObserver.disconnect();
          intersectionObserver.disconnect();
          disposeTargets();
          ribbonMesh.geometry.dispose();
          quadGeom.dispose();
          [ribbonMat, downsampleMat, upsampleMat, compositeMat].forEach((m) => m.dispose());
          renderer.dispose();
          renderer.forceContextLoss();
          canvas.remove();
        },
        pulse: (pos01) => {
          if (stateRef.current.reduced) return;
          const rect = elem.getBoundingClientRect();
          addPulse(screenToRibbonCoord(rect.left + clamp(pos01, 0, 1) * rect.width, rect.top + rect.height / 2).x, 0, 2);
        },
      };
    };

    const engine = initEngine(container, propsRef);
    controllerRef.current = engine;

    return () => {
      engine?.destroy();
      controllerRef.current = null;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      pulse: (xPos = 0.5) => controllerRef.current?.pulse(xPos),
    }),
    []
  );

  return (
    <div
      ref={containerRef}
      className={cn("relative isolate h-full min-h-[240px] w-full overflow-hidden", className)}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "240px",
        overflow: "hidden",
        backgroundColor,
        ...style,
      }}
    >
      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  );
});

InterferenceRibbons.displayName = "InterferenceRibbons";

export default InterferenceRibbons;
export { InterferenceRibbons };
