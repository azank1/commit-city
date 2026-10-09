// GLSL for the lapse. All outputs are linear HDR; OutputPass does tone mapping + sRGB.

export const solidVS = /* glsl */`
attribute float aGlow;
varying vec3 vN;
varying vec3 vW;
varying vec3 vCol;
varying float vGlow;
varying vec3 vLocal;
varying vec3 vScale;
void main() {
  mat4 im = instanceMatrix;
  vec4 w = modelMatrix * im * vec4(position, 1.0);
  vW = w.xyz;
  vN = normalize(mat3(modelMatrix) * (mat3(im) * normal));
  #ifdef USE_INSTANCING_COLOR
    vCol = instanceColor;
  #else
    vCol = vec3(1.0);
  #endif
  vGlow = aGlow;
  vLocal = position;
  vScale = vec3(length(im[0].xyz), length(im[1].xyz), length(im[2].xyz));
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

// Lit box with crisp pixel-constant edges, fake contact AO, per-instance glow and per-repo fade.
export const solidFS = /* glsl */`
uniform vec3 uSky;
uniform vec3 uGround;
uniform vec3 uKeyDir;
uniform vec3 uKeyCol;
uniform float uSat;
uniform float uBright;
uniform vec3 uFog;
uniform float uFogDen;
uniform float uEdge;
uniform vec3 uEdgeTint;
uniform float uAO;
uniform float uRim;
uniform vec3 uRimCol;
varying vec3 vN;
varying vec3 vW;
varying vec3 vCol;
varying float vGlow;
varying vec3 vLocal;
varying vec3 vScale;
float mid3(vec3 v) { return v.x + v.y + v.z - min(v.x, min(v.y, v.z)) - max(v.x, max(v.y, v.z)); }
void main() {
  vec3 n = normalize(vN);
  vec3 base = vCol;
  float l = dot(base, vec3(0.2126, 0.7152, 0.0722));
  base = mix(vec3(l), base, uSat) * uBright;
  vec3 amb = mix(uGround, uSky, 0.5 + 0.5 * n.y);
  float dif = max(dot(n, uKeyDir), 0.0);
  vec3 col = base * (amb + uKeyCol * dif);
  float hw = vLocal.y * vScale.y;
  col *= mix(1.0 - uAO, 1.0, smoothstep(0.0, 0.8, hw));
  vec3 dd = vec3((0.5 - abs(vLocal.x)) * vScale.x, min(vLocal.y, 1.0 - vLocal.y) * vScale.y, (0.5 - abs(vLocal.z)) * vScale.z);
  float e = mid3(dd);
  float fw = max(fwidth(e), 1e-5);
  float dist = length(vW - cameraPosition);
  float line = (1.0 - smoothstep(fw * 0.5, fw * 1.5, e)) * (1.0 - smoothstep(90.0, 340.0, dist));
  col = mix(col, col * 1.4 + uEdgeTint, line * uEdge);
  col += uRimCol * uRim * line;
  col += (vCol * 1.3 + vec3(0.55)) * vGlow * 2.4;
  float f = 1.0 - exp(-pow(uFogDen * dist, 2.0));
  col = mix(col, uFog, f);
  gl_FragColor = vec4(col, 1.0);
}`;

export const beamVS = /* glsl */`
attribute vec3 aCenter;
attribute float aU;
uniform float uWidth;
uniform float uPx;
uniform float uPxK;
varying float vU;
varying vec3 vW;
void main() {
  // never thinner than uPx screen pixels, so connections stay legible from far away
  float d = length(cameraPosition - aCenter);
  float bw = max(uWidth, d * uPxK * uPx * 0.5);
  vec3 p = aCenter + (position - aCenter) * bw;
  vU = aU;
  vec4 w = modelMatrix * vec4(p, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

export const beamFS = /* glsl */`
uniform vec3 uColor;
uniform float uAlpha;
uniform float uTime;
uniform float uFlow;
uniform float uGrow;
uniform float uFogDen;
varying float vU;
varying vec3 vW;
void main() {
  if (vU > uGrow) discard;
  float flow = 0.5 + 0.5 * sin((vU * 9.0 - uTime * 0.9) * 6.2831853);
  flow = pow(flow, 3.0);
  float ends = smoothstep(0.0, 0.16, vU);
  float tip = 1.0 - smoothstep(uGrow - 0.02, uGrow, vU) * step(uGrow, 0.999);
  float a = uAlpha * ends * (0.75 + uFlow * flow * 0.7) * tip;
  float dist = length(vW - cameraPosition);
  a *= exp(-pow(uFogDen * dist * 0.7, 2.0));
  a *= 0.6 + 0.4 * smoothstep(0.0, 0.35, vU);
  gl_FragColor = vec4(uColor, a);
}`;

export const pointsVS = /* glsl */`
attribute float aSize;
attribute float aAlpha;
attribute vec3 aColor;
uniform float uScale;
varying float vA;
varying vec3 vC;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = clamp(aSize * uScale / max(0.1, -mv.z), 0.0, 220.0);
  vA = aAlpha;
  vC = aColor;
  gl_Position = projectionMatrix * mv;
}`;

export const pointsFS = /* glsl */`
varying float vA;
varying vec3 vC;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float r2 = dot(c, c) * 4.0;
  float a = (exp(-r2 * 5.0) + 0.35 * exp(-r2 * 40.0)) * vA;
  if (a < 0.004) discard;
  gl_FragColor = vec4(vC, a);
}`;

export const starsVS = /* glsl */`
attribute float aSize;
attribute float aPhase;
uniform float uTime;
uniform float uNight;
varying float vA;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = aSize;
  vA = (0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + aPhase) + aPhase * 40.0))) * (0.55 + 0.45 * uNight);
  gl_Position = projectionMatrix * mv;
}`;

export const starsFS = /* glsl */`
varying float vA;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float a = smoothstep(0.5, 0.0, length(c)) * vA;
  gl_FragColor = vec4(vec3(0.75, 0.82, 1.0), a);
}`;

export const floorVS = /* glsl */`
varying vec3 vW;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vW = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

export const floorFS = /* glsl */`
uniform vec3 uCol;
uniform float uFade;
varying vec3 vW;
void main() {
  float r = length(vW.xz);
  float a = atan(vW.z, vW.x);
  float ring = abs(fract(r / 20.0 - 0.5) - 0.5) * 20.0;
  float lr = 1.0 - smoothstep(0.0, fwidth(r) * 1.4, ring);
  float seg = 3.14159265 / 12.0;
  float ang = abs(fract(a / seg - 0.5) - 0.5) * seg * r;
  float la = (1.0 - smoothstep(0.0, fwidth(ang) * 1.4 + 1e-4, ang)) * smoothstep(14.0, 34.0, r);
  float fade = 1.0 - smoothstep(uFade * 0.45, uFade, r);
  float alpha = max(lr * 0.16, la * 0.07) * fade;
  if (alpha < 0.003) discard;
  gl_FragColor = vec4(uCol, alpha);
}`;

export const skyVS = /* glsl */`
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

export const skyFS = /* glsl */`
uniform vec3 uTop;
uniform vec3 uHorizon;
uniform vec3 uBottom;
varying vec3 vDir;
void main() {
  float y = vDir.y;
  vec3 c = y > 0.0 ? mix(uHorizon, uTop, pow(smoothstep(0.0, 0.85, y), 0.7)) : mix(uHorizon, uBottom, smoothstep(0.0, 0.35, -y));
  gl_FragColor = vec4(c, 1.0);
}`;
