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
