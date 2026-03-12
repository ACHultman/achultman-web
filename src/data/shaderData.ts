export interface ShaderPreset {
  name: string;
  description: string;
  fragmentShader: string;
  category: 'patterns' | 'fractals' | 'noise' | 'effects';
}

export const SHADER_PRESETS: ShaderPreset[] = [
  {
    name: 'Plasma Wave',
    description: 'Classic plasma effect using sin/cos of position and time',
    category: 'patterns',
    fragmentShader: `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float v = sin(uv.x * 10.0 + u_time) + sin(uv.y * 10.0 + u_time);
  v += sin((uv.x + uv.y) * 10.0 + u_time);
  v += sin(sqrt(uv.x * uv.x + uv.y * uv.y) * 10.0 + u_time);
  vec3 col = vec3(sin(v), sin(v + 2.094), sin(v + 4.189)) * 0.5 + 0.5;
  gl_FragColor = vec4(col, 1.0);
}`,
  },
  {
    name: 'Mandelbrot Set',
    description:
      'Classic Mandelbrot fractal with smooth coloring based on iteration count',
    category: 'fractals',
    fragmentShader: `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  vec2 c = uv * 2.5 + vec2(-0.5, 0.0);
  vec2 z = vec2(0.0);
  float iter = 0.0;
  const float maxIter = 128.0;
  for (float i = 0.0; i < 128.0; i++) {
    if (dot(z, z) > 4.0) break;
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    iter = i;
  }
  if (dot(z, z) > 4.0) {
    float smooth_iter = iter - log2(log2(dot(z, z))) + 4.0;
    float t = smooth_iter / maxIter;
    vec3 col = 0.5 + 0.5 * cos(3.0 + t * 6.2831 * 2.0 + vec3(0.0, 0.6, 1.0));
    gl_FragColor = vec4(col, 1.0);
  } else {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
}`,
  },
  {
    name: 'Simplex Noise',
    description: 'Organic flowing noise patterns using 2D simplex noise',
    category: 'noise',
    fragmentShader: `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float n1 = snoise(uv * 3.0 + u_time * 0.3);
  float n2 = snoise(uv * 6.0 - u_time * 0.2);
  float n3 = snoise(uv * 12.0 + u_time * 0.5);
  float n = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
  vec3 col1 = vec3(0.1, 0.3, 0.6);
  vec3 col2 = vec3(0.9, 0.5, 0.2);
  vec3 col = mix(col1, col2, n * 0.5 + 0.5);
  gl_FragColor = vec4(col, 1.0);
}`,
  },
  {
    name: 'Hypnotic Rings',
    description:
      'Concentric rings that pulse and shift colors based on distance from center',
    category: 'patterns',
    fragmentShader: `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  float d = length(uv);
  float rings = sin(d * 30.0 - u_time * 3.0);
  float pulse = sin(u_time * 2.0) * 0.5 + 0.5;
  float r = sin(rings * 3.14159 + u_time) * 0.5 + 0.5;
  float g = sin(rings * 3.14159 + u_time + 2.094) * 0.5 + 0.5;
  float b = sin(rings * 3.14159 + u_time + 4.189) * 0.5 + 0.5;
  vec3 col = vec3(r, g, b) * smoothstep(1.5, 0.0, d);
  col += pulse * 0.1 * vec3(0.5, 0.2, 0.8) * (1.0 - d);
  gl_FragColor = vec4(col, 1.0);
}`,
  },
  {
    name: 'Voronoi Cells',
    description:
      'Voronoi diagram with animated cell centers moving over time',
    category: 'noise',
    fragmentShader: `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

vec2 hash(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 st = uv * 5.0;
  vec2 i_st = floor(st);
  vec2 f_st = fract(st);
  float minDist = 1.0;
  vec2 minPoint = vec2(0.0);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 point = hash(i_st + neighbor);
      point = 0.5 + 0.5 * sin(u_time + 6.2831 * point);
      vec2 diff = neighbor + point - f_st;
      float dist = length(diff);
      if (dist < minDist) {
        minDist = dist;
        minPoint = point;
      }
    }
  }
  vec3 col = 0.5 + 0.5 * cos(u_time + minPoint.xyx * 6.28 + vec3(0.0, 2.0, 4.0));
  col *= 1.0 - 0.4 * minDist;
  col += 0.02 / minDist * vec3(0.2, 0.1, 0.3);
  gl_FragColor = vec4(col, 1.0);
}`,
  },
  {
    name: 'Ray Marching Sphere',
    description:
      'Simple ray marching with a phong-lit sphere against a dark background',
    category: 'effects',
    fragmentShader: `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

float scene(vec3 p) {
  float pulse = 1.0 + 0.1 * sin(u_time * 2.0);
  return sdSphere(p, pulse);
}

vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.001, 0.0);
  return normalize(vec3(
    scene(p + e.xyy) - scene(p - e.xyy),
    scene(p + e.yxy) - scene(p - e.yxy),
    scene(p + e.yyx) - scene(p - e.yyx)
  ));
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  vec3 ro = vec3(0.0, 0.0, 3.0);
  vec3 rd = normalize(vec3(uv, -1.5));
  float t = 0.0;
  float d;
  for (int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    d = scene(p);
    if (d < 0.001 || t > 20.0) break;
    t += d;
  }
  vec3 col = vec3(0.02, 0.02, 0.05);
  if (d < 0.001) {
    vec3 p = ro + rd * t;
    vec3 n = calcNormal(p);
    float angle = u_time * 0.5;
    vec3 lightPos = vec3(2.0 * cos(angle), 2.0, 2.0 * sin(angle));
    vec3 l = normalize(lightPos - p);
    vec3 v = normalize(ro - p);
    vec3 h = normalize(l + v);
    float diff = max(dot(n, l), 0.0);
    float spec = pow(max(dot(n, h), 0.0), 32.0);
    float ambient = 0.1;
    vec3 baseColor = vec3(0.3, 0.6, 1.0);
    col = baseColor * (ambient + diff * 0.8) + vec3(1.0) * spec * 0.5;
  }
  gl_FragColor = vec4(col, 1.0);
}`,
  },
  {
    name: 'Matrix Rain',
    description:
      'Digital rain effect with columns of characters falling at different speeds',
    category: 'effects',
    fragmentShader: `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float charPattern(vec2 uv, float seed) {
  vec2 grid = floor(uv * 5.0);
  return step(0.5, hash(grid + seed));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float columns = 30.0;
  float cellX = floor(uv.x * columns);
  float cellUvX = fract(uv.x * columns);
  float speed = 0.5 + hash(vec2(cellX, 0.0)) * 1.5;
  float offset = hash(vec2(cellX, 1.0)) * 100.0;
  float rows = columns * (u_resolution.y / u_resolution.x);
  float scrollY = uv.y + u_time * speed + offset;
  float cellY = floor(scrollY * rows);
  float cellUvY = fract(scrollY * rows);
  float charSeed = hash(vec2(cellX, cellY));
  float isChar = charPattern(vec2(cellUvX, cellUvY), charSeed);
  float brightness = charSeed;
  float headDist = fract(u_time * speed * 0.5 + hash(vec2(cellX, 2.0)));
  float trail = 1.0 - fract(scrollY * 0.1);
  trail = pow(trail, 3.0);
  float headGlow = smoothstep(0.02, 0.0, abs(fract(scrollY * 0.1) - headDist));
  vec3 col = vec3(0.0, 0.8, 0.2) * isChar * brightness * trail * 0.6;
  col += vec3(0.5, 1.0, 0.5) * isChar * headGlow;
  col += vec3(0.0, 0.05, 0.0);
  gl_FragColor = vec4(col, 1.0);
}`,
  },
  {
    name: 'Fractal Julia',
    description:
      'Julia set fractal with the c parameter animating over time',
    category: 'fractals',
    fragmentShader: `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  vec2 z = uv * 2.5;
  vec2 c = vec2(
    0.355 + 0.1 * sin(u_time * 0.3),
    0.355 + 0.1 * cos(u_time * 0.37)
  );
  float iter = 0.0;
  const float maxIter = 128.0;
  for (float i = 0.0; i < 128.0; i++) {
    if (dot(z, z) > 4.0) break;
    z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
    iter = i;
  }
  if (dot(z, z) > 4.0) {
    float smooth_iter = iter - log2(log2(dot(z, z))) + 4.0;
    float t = smooth_iter / maxIter;
    vec3 col = 0.5 + 0.5 * cos(6.2831 * t + vec3(0.0, 0.4, 0.7));
    gl_FragColor = vec4(col, 1.0);
  } else {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
}`,
  },
  {
    name: 'Sunset Gradient',
    description:
      'Warm animated sunset gradient transitioning from orange to purple',
    category: 'effects',
    fragmentShader: `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float wave = sin(uv.x * 3.0 + u_time * 0.5) * 0.05;
  float t = uv.y + wave;
  vec3 top = vec3(0.1, 0.0, 0.2);
  vec3 mid = vec3(0.8, 0.2, 0.4);
  vec3 bottom = vec3(1.0, 0.6, 0.1);
  vec3 col = mix(bottom, mid, smoothstep(0.0, 0.5, t));
  col = mix(col, top, smoothstep(0.5, 1.0, t));
  float sun = 1.0 - smoothstep(0.04, 0.06, length(uv - vec2(0.5 + sin(u_time * 0.2) * 0.1, 0.35)));
  col += sun * vec3(1.0, 0.9, 0.5);
  gl_FragColor = vec4(col, 1.0);
}`,
  },
  {
    name: 'Starfield',
    description:
      'Twinkling starfield with layered parallax depth and shooting stars',
    category: 'effects',
    fragmentShader: `precision mediump float;
uniform float u_time;
uniform vec2 u_resolution;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float star(vec2 uv, vec2 center, float brightness) {
  float d = length(uv - center);
  return brightness * smoothstep(0.02, 0.0, d);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec3 col = vec3(0.01, 0.01, 0.04);
  col += vec3(0.02, 0.0, 0.05) * (1.0 - uv.y);
  for (int layer = 0; layer < 3; layer++) {
    float scale = 10.0 + float(layer) * 8.0;
    float speed = 0.02 + float(layer) * 0.01;
    vec2 st = uv * scale + vec2(u_time * speed, 0.0);
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 cell = i_st + neighbor;
        float r = hash(cell);
        if (r > 0.7) {
          vec2 pos = neighbor + vec2(hash(cell + 1.0), hash(cell + 2.0)) - f_st;
          float twinkle = sin(u_time * (2.0 + r * 4.0) + r * 6.28) * 0.5 + 0.5;
          float brightness = (r - 0.7) * 3.3 * (0.5 + 0.5 * twinkle);
          float d = length(pos);
          col += brightness * smoothstep(0.03, 0.0, d) * vec3(0.8 + r * 0.2, 0.8 + hash(cell + 3.0) * 0.2, 1.0);
        }
      }
    }
  }
  float shootX = fract(u_time * 0.15);
  float shootY = 0.8 - shootX * 0.5;
  float shootTrail = smoothstep(0.0, 0.08, shootX) * smoothstep(0.3, 0.08, shootX);
  float shootD = length(uv - vec2(shootX, shootY));
  col += vec3(1.0, 1.0, 0.9) * smoothstep(0.01, 0.0, shootD) * shootTrail;
  gl_FragColor = vec4(col, 1.0);
}`,
  },
];

export const DEFAULT_VERTEX_SHADER = `attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

export const SHADER_CATEGORIES: { name: string; color: string }[] = [
  { name: 'patterns', color: 'pink' },
  { name: 'fractals', color: 'purple' },
  { name: 'noise', color: 'teal' },
  { name: 'effects', color: 'cyan' },
];

export const QUICK_PROMPT_CHIPS: string[] = [
  'spinning ball',
  'ocean waves',
  'fire',
  'neon heart',
  'starfield',
  'rainbow noise',
  'glowing torus',
  'matrix rain',
];

// ---------------------------------------------------------------------------
// Composable GLSL shader generation system
// ---------------------------------------------------------------------------

interface ShaderComponent {
  name: string;
  keywords: string[];
  /** GLSL helper function(s) to insert before main() */
  glsl: string;
  /** Statement(s) to insert inside main() — uses COLOR and uv variables */
  mainCall: string;
  /** Whether this component needs the noise helper */
  needsNoise?: boolean;
  /** Whether this is a full-screen effect vs centered shape */
  isFullscreen?: boolean;
}

// ---- Helper GLSL blocks inserted as needed ----

const GLSL_NOISE_HELPERS = `
vec3 mod289v3(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289v2(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute289(vec3 x) { return mod289v3(((x * 34.0) + 1.0) * x); }

float snoise2d(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289v2(i);
  vec3 p = permute289(permute289(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}`;

const GLSL_HASH_HELPER = `
float hash1(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}`;

const GLSL_ROTATION_HELPER = `
mat2 rot2d(float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c);
}`;

// ---- Shape components (drawn in center of screen) ----

const SHAPE_COMPONENTS: ShaderComponent[] = [
  {
    name: 'sphere',
    keywords: ['sphere', 'ball', 'orb', '3d sphere', 'spinning ball'],
    glsl: `
float sdSphere_gen(vec3 p, float r) { return length(p) - r; }
float sceneShape(vec3 p) {
  float pulse = 1.0 + 0.1 * sin(u_time * 2.0);
  return sdSphere_gen(p, pulse);
}
vec3 calcNormal_gen(vec3 p) {
  vec2 e = vec2(0.001, 0.0);
  return normalize(vec3(
    sceneShape(p + e.xyy) - sceneShape(p - e.xyy),
    sceneShape(p + e.yxy) - sceneShape(p - e.yxy),
    sceneShape(p + e.yyx) - sceneShape(p - e.yyx)
  ));
}
vec3 renderSphere(vec2 uv, float time, vec3 tint) {
  vec3 ro = vec3(0.0, 0.0, 3.0);
  vec3 rd = normalize(vec3(uv, -1.5));
  float t = 0.0;
  float d = 0.0;
  for (int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    d = sceneShape(p);
    if (d < 0.001 || t > 20.0) break;
    t += d;
  }
  vec3 c = vec3(0.02, 0.02, 0.05);
  if (d < 0.001) {
    vec3 p = ro + rd * t;
    vec3 n = calcNormal_gen(p);
    float angle = time * 0.5;
    vec3 lightPos = vec3(2.0 * cos(angle), 2.0, 2.0 * sin(angle));
    vec3 l = normalize(lightPos - p);
    vec3 v = normalize(ro - p);
    vec3 h = normalize(l + v);
    float diff = max(dot(n, l), 0.0);
    float spec = pow(max(dot(n, h), 0.0), 32.0);
    c = tint * (0.1 + diff * 0.8) + vec3(1.0) * spec * 0.5;
  }
  return c;
}`,
    mainCall: `  vec2 centered = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  col = renderSphere(centered, u_time, COLOR);`,
  },
  {
    name: 'cube',
    keywords: ['cube', 'box'],
    glsl: `
float sdBox_gen(vec3 p, vec3 b) {
  vec3 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}
float sceneCube(vec3 p) {
  float a = u_time * 0.7;
  float ca = cos(a), sa = sin(a);
  mat3 ry = mat3(ca, 0.0, sa, 0.0, 1.0, 0.0, -sa, 0.0, ca);
  float b = u_time * 0.5;
  float cb = cos(b), sb = sin(b);
  mat3 rx = mat3(1.0, 0.0, 0.0, 0.0, cb, -sb, 0.0, sb, cb);
  vec3 rp = rx * ry * p;
  return sdBox_gen(rp, vec3(0.8));
}
vec3 calcNormalCube(vec3 p) {
  vec2 e = vec2(0.001, 0.0);
  return normalize(vec3(
    sceneCube(p + e.xyy) - sceneCube(p - e.xyy),
    sceneCube(p + e.yxy) - sceneCube(p - e.yxy),
    sceneCube(p + e.yyx) - sceneCube(p - e.yyx)
  ));
}
vec3 renderCube(vec2 uv, float time, vec3 tint) {
  vec3 ro = vec3(0.0, 0.0, 3.5);
  vec3 rd = normalize(vec3(uv, -1.5));
  float t = 0.0;
  float d = 0.0;
  for (int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    d = sceneCube(p);
    if (d < 0.001 || t > 20.0) break;
    t += d;
  }
  vec3 c = vec3(0.02, 0.02, 0.05);
  if (d < 0.001) {
    vec3 p = ro + rd * t;
    vec3 n = calcNormalCube(p);
    vec3 lightPos = vec3(2.0 * cos(time), 2.0, 2.0 * sin(time));
    vec3 l = normalize(lightPos - p);
    vec3 v = normalize(ro - p);
    vec3 h = normalize(l + v);
    float diff = max(dot(n, l), 0.0);
    float spec = pow(max(dot(n, h), 0.0), 32.0);
    c = tint * (0.1 + diff * 0.8) + vec3(1.0) * spec * 0.5;
  }
  return c;
}`,
    mainCall: `  vec2 centered = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  col = renderCube(centered, u_time, COLOR);`,
  },
  {
    name: 'torus',
    keywords: ['torus', 'donut', 'ring'],
    glsl: `
float sdTorus_gen(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}
float sceneTorus(vec3 p) {
  float a = u_time * 0.6;
  float ca = cos(a), sa = sin(a);
  mat3 rx = mat3(1.0, 0.0, 0.0, 0.0, ca, -sa, 0.0, sa, ca);
  float b = u_time * 0.4;
  float cb = cos(b), sb = sin(b);
  mat3 rz = mat3(cb, -sb, 0.0, sb, cb, 0.0, 0.0, 0.0, 1.0);
  vec3 rp = rz * rx * p;
  return sdTorus_gen(rp, vec2(0.8, 0.3));
}
vec3 calcNormalTorus(vec3 p) {
  vec2 e = vec2(0.001, 0.0);
  return normalize(vec3(
    sceneTorus(p + e.xyy) - sceneTorus(p - e.xyy),
    sceneTorus(p + e.yxy) - sceneTorus(p - e.yxy),
    sceneTorus(p + e.yyx) - sceneTorus(p - e.yyx)
  ));
}
vec3 renderTorus(vec2 uv, float time, vec3 tint) {
  vec3 ro = vec3(0.0, 0.0, 3.5);
  vec3 rd = normalize(vec3(uv, -1.5));
  float t = 0.0;
  float d = 0.0;
  for (int i = 0; i < 64; i++) {
    vec3 p = ro + rd * t;
    d = sceneTorus(p);
    if (d < 0.001 || t > 20.0) break;
    t += d;
  }
  vec3 c = vec3(0.02, 0.02, 0.05);
  if (d < 0.001) {
    vec3 p = ro + rd * t;
    vec3 n = calcNormalTorus(p);
    vec3 lightPos = vec3(2.0 * cos(time), 2.0, 2.0 * sin(time));
    vec3 l = normalize(lightPos - p);
    vec3 v = normalize(ro - p);
    vec3 h = normalize(l + v);
    float diff = max(dot(n, l), 0.0);
    float spec = pow(max(dot(n, h), 0.0), 48.0);
    c = tint * (0.1 + diff * 0.8) + vec3(1.0) * spec * 0.6;
  }
  return c;
}`,
    mainCall: `  vec2 centered = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  col = renderTorus(centered, u_time, COLOR);`,
  },
  {
    name: 'heart',
    keywords: ['heart', 'love', 'valentine'],
    glsl: `
vec3 renderHeart(vec2 uv, float time, vec3 tint) {
  vec2 p = uv;
  p.y -= 0.1;
  float pulse = 1.0 + 0.08 * sin(time * 3.0);
  p /= pulse;
  float a = atan(p.x, p.y) / 3.14159;
  float r = length(p);
  float hShape = abs(a);
  float heartR = (13.0 * hShape - 22.0 * hShape * hShape + 10.0 * hShape * hShape * hShape) / (6.0 - 5.0 * hShape);
  heartR *= 0.25;
  float d = r - heartR;
  float heart = smoothstep(0.02, -0.02, d);
  float glow = 0.015 / (abs(d) + 0.01);
  vec3 c = tint * heart + tint * 0.5 * glow * (0.5 + 0.5 * sin(time * 2.0));
  return c;
}`,
    mainCall: `  vec2 centered = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  col = renderHeart(centered, u_time, COLOR);`,
  },
  {
    name: 'stars',
    keywords: ['star', 'stars', 'starfield', 'night sky', 'space', 'galaxy'],
    isFullscreen: true,
    glsl: `
float hashStar(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
vec3 renderStars(vec2 uv, float time) {
  vec3 c = vec3(0.01, 0.01, 0.04);
  c += vec3(0.02, 0.0, 0.05) * (1.0 - uv.y);
  for (int layer = 0; layer < 3; layer++) {
    float scale = 10.0 + float(layer) * 8.0;
    float speed = 0.02 + float(layer) * 0.01;
    vec2 st = uv * scale + vec2(time * speed, 0.0);
    vec2 i_st = floor(st);
    vec2 f_st = fract(st);
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        vec2 neighbor = vec2(float(x), float(y));
        vec2 cell = i_st + neighbor;
        float r = hashStar(cell);
        if (r > 0.7) {
          vec2 pos = neighbor + vec2(hashStar(cell + 1.0), hashStar(cell + 2.0)) - f_st;
          float twinkle = sin(time * (2.0 + r * 4.0) + r * 6.28) * 0.5 + 0.5;
          float brightness = (r - 0.7) * 3.3 * (0.5 + 0.5 * twinkle);
          float d = length(pos);
          c += brightness * smoothstep(0.03, 0.0, d) * vec3(0.8 + r * 0.2, 0.8 + hashStar(cell + 3.0) * 0.2, 1.0);
        }
      }
    }
  }
  float shootX = fract(time * 0.15);
  float shootY = 0.8 - shootX * 0.5;
  float shootTrail = smoothstep(0.0, 0.08, shootX) * smoothstep(0.3, 0.08, shootX);
  float shootD = length(uv - vec2(shootX, shootY));
  c += vec3(1.0, 1.0, 0.9) * smoothstep(0.01, 0.0, shootD) * shootTrail;
  return c;
}`,
    mainCall: `  col = renderStars(uv, u_time);`,
  },
  {
    name: 'grid',
    keywords: ['grid', 'wireframe', 'tron'],
    isFullscreen: true,
    glsl: `
vec3 renderGrid(vec2 uv, float time, vec3 tint) {
  vec2 p = uv * 2.0 - 1.0;
  // Perspective warp
  float perspective = 1.0 / (1.0 + p.y * 0.8);
  vec2 gp = vec2(p.x * perspective * 4.0, (1.0 - p.y) * perspective * 4.0 + time * 0.5);
  vec2 grid = abs(fract(gp) - 0.5);
  float line = min(grid.x, grid.y);
  float gridLine = smoothstep(0.02, 0.0, line);
  float fade = smoothstep(0.0, 1.0, 1.0 - uv.y);
  float glow = 0.3 / (abs(uv.y - 0.5) + 0.3);
  vec3 c = tint * gridLine * fade * 0.8;
  c += tint * 0.15 * glow * fade;
  c += vec3(0.02, 0.0, 0.04);
  return c;
}`,
    mainCall: `  col = renderGrid(uv, u_time, COLOR);`,
  },
  {
    name: 'circle',
    keywords: ['circle', 'disc', 'dot'],
    glsl: `
vec3 renderCircle(vec2 uv, float time, vec3 tint) {
  float d = length(uv);
  float pulse = 1.0 + 0.1 * sin(time * 2.0);
  float circle = smoothstep(0.32 * pulse, 0.3 * pulse, d);
  float glow = 0.05 / (d + 0.05);
  float rim = smoothstep(0.28 * pulse, 0.3 * pulse, d) * smoothstep(0.34 * pulse, 0.3 * pulse, d);
  vec3 c = tint * circle * 0.8;
  c += tint * glow * 0.3;
  c += vec3(1.0) * rim * 0.6;
  return c;
}`,
    mainCall: `  vec2 centered = (gl_FragCoord.xy - 0.5 * u_resolution) / min(u_resolution.x, u_resolution.y);
  col = renderCircle(centered, u_time, COLOR);`,
  },
];

// ---- Effect components (applied to whole screen or composited) ----

const EFFECT_COMPONENTS: ShaderComponent[] = [
  {
    name: 'waves',
    keywords: ['waves', 'ocean', 'water', 'sea', 'underwater'],
    isFullscreen: true,
    needsNoise: true,
    glsl: `
vec3 renderWaves(vec2 uv, float time, vec3 tint) {
  vec2 p = uv;
  float wave1 = sin(p.x * 8.0 + time * 1.5) * 0.04;
  float wave2 = sin(p.x * 12.0 - time * 1.0 + 2.0) * 0.025;
  float wave3 = sin(p.x * 20.0 + time * 2.5) * 0.015;
  float waves = wave1 + wave2 + wave3;
  float y = p.y + waves;
  float n = snoise2d(vec2(p.x * 3.0, y * 3.0 + time * 0.3)) * 0.15;
  vec3 deep = tint * 0.15;
  vec3 mid = tint * 0.5;
  vec3 surface = tint * 0.9 + vec3(0.2);
  float t = y + n;
  vec3 c = mix(deep, mid, smoothstep(0.0, 0.5, t));
  c = mix(c, surface, smoothstep(0.4, 0.7, t));
  // Foam
  float foam = smoothstep(0.01, 0.0, abs(fract(y * 5.0 + time * 0.2) - 0.5) - 0.45);
  c += vec3(0.8, 0.9, 1.0) * foam * 0.3 * smoothstep(0.3, 0.7, y);
  // Caustics-like shimmer
  float caustic = sin(p.x * 30.0 + time * 2.0) * sin(p.y * 30.0 + time * 1.5);
  c += tint * caustic * 0.05 * smoothstep(0.5, 0.0, y);
  return c;
}`,
    mainCall: `  col = renderWaves(uv, u_time, COLOR);`,
  },
  {
    name: 'fire',
    keywords: ['fire', 'flames', 'burning', 'inferno'],
    isFullscreen: true,
    needsNoise: true,
    glsl: `
vec3 renderFire(vec2 uv, float time) {
  vec2 p = uv;
  // Stack multiple noise octaves moving upward
  float n1 = snoise2d(vec2(p.x * 4.0, p.y * 4.0 - time * 2.0)) * 0.5;
  float n2 = snoise2d(vec2(p.x * 8.0, p.y * 8.0 - time * 3.0)) * 0.25;
  float n3 = snoise2d(vec2(p.x * 16.0, p.y * 16.0 - time * 4.0)) * 0.125;
  float n = n1 + n2 + n3;
  // Flame shape: stronger at bottom, narrower at top
  float shape = smoothstep(1.0, 0.0, p.y) * smoothstep(0.0, 0.15, p.y);
  float flameWidth = 0.5 - p.y * 0.3;
  shape *= smoothstep(flameWidth, 0.0, abs(p.x - 0.5));
  float flame = shape * (0.6 + n * 0.8);
  flame = clamp(flame, 0.0, 1.0);
  // Fire color ramp: white core -> yellow -> orange -> red -> black
  vec3 c = vec3(0.0);
  c = mix(c, vec3(0.5, 0.0, 0.0), smoothstep(0.0, 0.2, flame));
  c = mix(c, vec3(1.0, 0.3, 0.0), smoothstep(0.2, 0.5, flame));
  c = mix(c, vec3(1.0, 0.8, 0.2), smoothstep(0.5, 0.8, flame));
  c = mix(c, vec3(1.0, 1.0, 0.9), smoothstep(0.8, 1.0, flame));
  // Embers
  float ember = smoothstep(0.65, 0.7, snoise2d(vec2(p.x * 20.0 + time, p.y * 20.0 - time * 5.0)));
  c += vec3(1.0, 0.5, 0.1) * ember * shape * 0.5;
  return c;
}`,
    mainCall: `  col = renderFire(uv, u_time);`,
  },
  {
    name: 'noise',
    keywords: ['noise', 'clouds', 'smoke', 'fog'],
    isFullscreen: true,
    needsNoise: true,
    glsl: `
vec3 renderNoise(vec2 uv, float time, vec3 tint) {
  float n1 = snoise2d(uv * 3.0 + time * 0.3);
  float n2 = snoise2d(uv * 6.0 - time * 0.2);
  float n3 = snoise2d(uv * 12.0 + time * 0.5);
  float n = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
  vec3 col1 = tint * 0.3;
  vec3 col2 = tint * 1.2 + vec3(0.1);
  return mix(col1, col2, n * 0.5 + 0.5);
}`,
    mainCall: `  col = renderNoise(uv, u_time, COLOR);`,
  },
  {
    name: 'pulse',
    keywords: ['pulse', 'beat', 'heartbeat', 'throb', 'pulsing'],
    isFullscreen: false,
    glsl: ``,
    mainCall: `  float pulseFactor = 0.8 + 0.4 * pow(abs(sin(u_time * 3.0)), 4.0);
  col *= pulseFactor;`,
  },
  {
    name: 'rotation',
    keywords: ['rotation', 'spin', 'rotate', 'spinning', 'rotating'],
    isFullscreen: false,
    glsl: ``,
    mainCall: `  // rotation effect applied to uv before shape rendering
`,
  },
  {
    name: 'glow',
    keywords: ['glow', 'bloom', 'glowing', 'bright', 'shiny'],
    isFullscreen: false,
    glsl: ``,
    mainCall: `  col += col * 0.3;
  col = pow(col, vec3(0.9));`,
  },
  {
    name: 'particles',
    keywords: ['particles', 'sparks', 'fireflies', 'dots'],
    isFullscreen: true,
    glsl: `
float hashParticle(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
vec3 renderParticles(vec2 uv, float time, vec3 tint) {
  vec3 c = vec3(0.0);
  for (int i = 0; i < 30; i++) {
    float fi = float(i);
    float seed = fi * 1.17;
    vec2 pos = vec2(
      hashParticle(vec2(seed, 0.0)),
      fract(hashParticle(vec2(seed, 1.0)) + time * (0.05 + hashParticle(vec2(seed, 2.0)) * 0.1))
    );
    pos.x += sin(time * 0.5 + fi) * 0.05;
    float d = length(uv - pos);
    float brightness = hashParticle(vec2(seed, 3.0)) * 0.5 + 0.5;
    float twinkle = sin(time * (2.0 + fi * 0.3) + fi) * 0.5 + 0.5;
    c += tint * brightness * twinkle * 0.008 / (d + 0.005);
  }
  return c;
}`,
    mainCall: `  col += renderParticles(uv, u_time, COLOR);`,
  },
];

// ---- Color palettes ----

const COLOR_PALETTES: Record<string, string> = {
  red: 'vec3(0.9, 0.2, 0.15)',
  blue: 'vec3(0.2, 0.4, 0.95)',
  green: 'vec3(0.2, 0.85, 0.3)',
  purple: 'vec3(0.6, 0.2, 0.9)',
  orange: 'vec3(1.0, 0.5, 0.1)',
  pink: 'vec3(1.0, 0.4, 0.7)',
  gold: 'vec3(1.0, 0.84, 0.0)',
  white: 'vec3(0.95, 0.95, 1.0)',
  cyan: 'vec3(0.0, 0.9, 0.9)',
  yellow: 'vec3(1.0, 0.95, 0.2)',
  neon: 'vec3(0.1, 1.0, 0.6)',
  pastel: 'vec3(0.8, 0.7, 0.9)',
  dark: 'vec3(0.3, 0.3, 0.35)',
};

// Rainbow handled specially in the shader
const RAINBOW_KEYWORDS = ['rainbow', 'colorful', 'multicolor', 'rgb'];

// ---- Abuse prevention ----

const MAX_PROMPT_LENGTH = 200;
const BLOCKED_PATTERNS =
  /script|eval|exec|import|require|fetch|xhr|http|cookie|document|window/i;

function sanitizePrompt(input: string): string | null {
  const trimmed = input.trim().slice(0, MAX_PROMPT_LENGTH);
  if (BLOCKED_PATTERNS.test(trimmed)) return null;
  if (trimmed.length < 2) return null;
  return trimmed.toLowerCase();
}

// ---- Keyword matching helpers ----

function findMatchingComponents(
  input: string,
  components: ShaderComponent[]
): ShaderComponent[] {
  const matches: { component: ShaderComponent; score: number }[] = [];
  for (const comp of components) {
    let score = 0;
    for (const kw of comp.keywords) {
      if (input.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > 0) {
      matches.push({ component: comp, score });
    }
  }
  matches.sort((a, b) => b.score - a.score);
  return matches.map((m) => m.component);
}

function findColor(input: string): { name: string; glsl: string } | null {
  // Check rainbow first
  for (const kw of RAINBOW_KEYWORDS) {
    if (input.includes(kw)) {
      return {
        name: 'rainbow',
        glsl: '(0.5 + 0.5 * cos(u_time + uv.xyx * 6.28 + vec3(0.0, 2.0, 4.0)))',
      };
    }
  }
  // Check named colors — longer matches first
  const entries = Object.entries(COLOR_PALETTES).sort(
    (a, b) => b[0].length - a[0].length
  );
  for (const [name, glsl] of entries) {
    if (input.includes(name)) {
      return { name, glsl };
    }
  }
  return null;
}

// ---- Preset matching (fallback from old system) ----

interface PresetMatch {
  keywords: string[];
  presetIndex: number;
  description: string;
  modifications?: { find: string; replace: string }[];
}

const PRESET_MATCHES: PresetMatch[] = [
  {
    keywords: ['plasma', 'psychedelic', 'colorful waves'],
    presetIndex: 0,
    description: 'Plasma Wave — classic colorful plasma effect',
  },
  {
    keywords: ['mandelbrot', 'fractal zoom', 'complex plane'],
    presetIndex: 1,
    description: 'Mandelbrot Set — classic fractal explorer',
  },
  {
    keywords: ['voronoi', 'cells', 'cellular', 'bubbles'],
    presetIndex: 4,
    description: 'Voronoi Cells — animated cellular patterns',
  },
  {
    keywords: ['julia', 'fractal morph', 'animated fractal'],
    presetIndex: 7,
    description: 'Fractal Julia — morphing Julia set',
  },
  {
    keywords: ['sunset', 'sky', 'gradient'],
    presetIndex: 8,
    description: 'Sunset Gradient — warm sky with animated sun',
  },
  {
    keywords: ['disco', 'party', 'strobe'],
    presetIndex: 3,
    description: 'Disco — fast hypnotic rings with strobe energy',
    modifications: [
      {
        find: 'float rings = sin(d * 30.0 - u_time * 3.0);',
        replace: 'float rings = sin(d * 40.0 - u_time * 8.0);',
      },
      {
        find: 'float pulse = sin(u_time * 2.0) * 0.5 + 0.5;',
        replace: 'float pulse = sin(u_time * 6.0) * 0.5 + 0.5;',
      },
    ],
  },
  {
    keywords: ['lava', 'magma', 'volcanic'],
    presetIndex: 4,
    description: 'Lava — voronoi cells with molten red-orange palette',
    modifications: [
      {
        find: 'vec3 col = 0.5 + 0.5 * cos(u_time + minPoint.xyx * 6.28 + vec3(0.0, 2.0, 4.0));',
        replace:
          'vec3 col = vec3(0.8, 0.2, 0.0) + 0.3 * cos(u_time + minPoint.xyx * 6.28 + vec3(0.0, 0.5, 1.0));',
      },
      {
        find: 'col += 0.02 / minDist * vec3(0.2, 0.1, 0.3);',
        replace: 'col += 0.03 / minDist * vec3(0.6, 0.2, 0.0);',
      },
    ],
  },
  {
    keywords: ['hypnotic', 'rings', 'tunnel'],
    presetIndex: 3,
    description: 'Hypnotic Rings — pulsing concentric circles',
  },
  {
    keywords: ['matrix', 'digital', 'hacker', 'code rain'],
    presetIndex: 6,
    description: 'Matrix Rain — digital rain effect',
  },
  {
    keywords: ['fractal'],
    presetIndex: 1,
    description: 'Mandelbrot Set — classic fractal',
  },
  {
    keywords: ['cyberpunk'],
    presetIndex: 0,
    description: 'Neon — plasma wave with electric neon glow',
    modifications: [
      {
        find: 'vec3 col = vec3(sin(v), sin(v + 2.094), sin(v + 4.189)) * 0.5 + 0.5;',
        replace:
          'vec3 col = vec3(sin(v) * 0.5 + 0.5, 0.05, sin(v + 3.14) * 0.5 + 0.5) * 1.3;',
      },
    ],
  },
];

function matchPresetFallback(
  input: string
): { code: string; description: string } | null {
  let bestScore = 0;
  let bestMatch: PresetMatch | null = null;

  for (const pm of PRESET_MATCHES) {
    let score = 0;
    for (const kw of pm.keywords) {
      if (input.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = pm;
    }
  }

  if (!bestMatch || bestScore === 0) return null;

  const basePreset = SHADER_PRESETS[bestMatch.presetIndex]!;
  let shaderSource = basePreset.fragmentShader;

  if (bestMatch.modifications) {
    for (const mod of bestMatch.modifications) {
      shaderSource = shaderSource.replace(mod.find, mod.replace);
    }
  }

  return {
    code: shaderSource,
    description: bestMatch.description,
  };
}

// ---- Main generation function ----

export interface GeneratedShader {
  code: string;
  description: string;
  isGenerated: boolean;
}

export function generateShader(input: string): GeneratedShader | null {
  const sanitized = sanitizePrompt(input);
  if (!sanitized) return null;

  // Find matched components
  const matchedShapes = findMatchingComponents(sanitized, SHAPE_COMPONENTS);
  const matchedEffects = findMatchingComponents(sanitized, EFFECT_COMPONENTS);
  const matchedColor = findColor(sanitized);

  const hasShape = matchedShapes.length > 0;
  const hasEffect = matchedEffects.length > 0;

  // If nothing matched from the composition system, try preset fallback
  if (!hasShape && !hasEffect && !matchedColor) {
    const fallback = matchPresetFallback(sanitized);
    if (fallback) {
      return {
        code: fallback.code,
        description: fallback.description,
        isGenerated: false,
      };
    }
    return null;
  }

  // Pick best shape (first match) and up to 2 effects
  const shape = matchedShapes[0] ?? null;
  const effects = matchedEffects.slice(0, 2);

  // Determine if we need noise helpers
  const needsNoise =
    (shape?.needsNoise ?? false) || effects.some((e) => e.needsNoise);
  // Determine if we need rotation helper (for spin effect on shapes)
  const hasRotation = effects.some((e) => e.name === 'rotation');
  // Determine if we need hash helper
  const needsHash =
    effects.some((e) => e.name === 'particles') ||
    (shape?.name === 'stars') ||
    (shape?.name === 'grid');

  // Default color
  const defaultColor = 'vec3(0.3, 0.6, 1.0)';
  const colorExpr = matchedColor?.glsl ?? defaultColor;

  // Build the shader
  let code = 'precision mediump float;\nuniform float u_time;\nuniform vec2 u_resolution;\n';

  // Add helpers
  if (needsNoise) {
    code += GLSL_NOISE_HELPERS + '\n';
  }
  if (needsHash) {
    code += GLSL_HASH_HELPER + '\n';
  }
  if (hasRotation) {
    code += GLSL_ROTATION_HELPER + '\n';
  }

  // Add component functions
  if (shape && shape.glsl) {
    code += shape.glsl + '\n';
  }
  for (const eff of effects) {
    if (eff.glsl) {
      code += eff.glsl + '\n';
    }
  }

  // Build main()
  code += '\nvoid main() {\n';
  code += '  vec2 uv = gl_FragCoord.xy / u_resolution;\n';

  // Color variable — rainbow uses uv (already defined above)
  code += `  vec3 COLOR = ${colorExpr};\n`;

  code += '  vec3 col = vec3(0.0);\n';

  // Apply rotation to uv if requested (only affects full-screen effects)
  if (hasRotation) {
    code += '  vec2 center = vec2(0.5);\n';
    code += '  uv = (uv - center) * rot2d(u_time * 0.5) + center;\n';
  }

  // Determine what to render
  if (shape) {
    // Render shape
    // If shape is fullscreen, use uv directly. Otherwise shapes use centered coords.
    code += shape.mainCall + '\n';
  }

  if (!shape && hasEffect) {
    // No shape — render full-screen effect(s)
    for (const eff of effects) {
      if (eff.mainCall.trim()) {
        code += eff.mainCall + '\n';
      }
    }
  } else if (shape && hasEffect) {
    // Shape + effect: apply post-processing effects
    for (const eff of effects) {
      // Skip fullscreen-only renderers when we already have a shape
      // (waves, fire, noise produce full output — use them only if no shape)
      // But particles can overlay on a shape, so allow those
      if (eff.isFullscreen && eff.name !== 'particles') continue;
      if (eff.mainCall.trim()) {
        code += eff.mainCall + '\n';
      }
    }
  }

  // If no shape and no fullscreen effect but we have a color, make a simple gradient
  if (!shape && !hasEffect) {
    code += '  float d = length(uv - 0.5);\n';
    code += '  col = COLOR * (1.0 - d * 0.8);\n';
    code += '  col += COLOR * 0.3 * sin(uv.x * 10.0 + u_time) * sin(uv.y * 10.0 + u_time);\n';
  }

  code += '  gl_FragColor = vec4(col, 1.0);\n';
  code += '}\n';

  // Build description
  const parts: string[] = [];
  if (matchedColor) {
    parts.push(matchedColor.name);
  }
  if (shape) {
    parts.push(shape.name);
  }
  for (const eff of effects) {
    parts.push(eff.name);
  }
  const description = parts.length > 0 ? parts.join(' + ') : 'custom shader';

  return {
    code,
    description: description.charAt(0).toUpperCase() + description.slice(1),
    isGenerated: true,
  };
}
