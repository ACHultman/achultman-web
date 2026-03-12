// ── Types ──────────────────────────────────────────────────────────────────

export interface Vertex {
  position: [number, number, number];
  color: [number, number, number];
  clipPosition?: [number, number, number, number];
  screenPosition?: [number, number];
}

export interface Triangle {
  vertices: [Vertex, Vertex, Vertex];
  id: number;
}

export interface Fragment {
  x: number;
  y: number;
  depth: number;
  color: [number, number, number];
  triangleId: number;
}

export type PipelineStage =
  | 'input-assembly'
  | 'vertex-shader'
  | 'primitive-assembly'
  | 'rasterization'
  | 'fragment-shader'
  | 'depth-test'
  | 'framebuffer';

export interface PipelineStep {
  stage: PipelineStage;
  stepNumber: number;
  title: string;
  description: string;
  vertices: Vertex[];
  triangles: Triangle[];
  fragments: Fragment[];
  framebuffer: [number, number, number][][];
  activeTriangle: number | null;
  activeVertex: number | null;
  scanline: number | null;
}

export interface PipelineScene {
  name: string;
  description: string;
  triangles: Triangle[];
}

// ── Preset scenes ──────────────────────────────────────────────────────────

export const SCENES: PipelineScene[] = [
  {
    name: 'Single Triangle',
    description: 'One colored triangle — the "Hello World" of graphics',
    triangles: [
      {
        id: 0,
        vertices: [
          { position: [0, 0.8, 0], color: [1, 0, 0] },
          { position: [-0.7, -0.6, 0], color: [0, 1, 0] },
          { position: [0.7, -0.6, 0], color: [0, 0, 1] },
        ],
      },
    ],
  },
  {
    name: 'Two Overlapping',
    description: 'Two triangles with depth testing',
    triangles: [
      {
        id: 0,
        vertices: [
          { position: [0, 0.8, 0.2], color: [1, 0.2, 0.2] },
          { position: [-0.8, -0.6, 0.2], color: [1, 0.5, 0.2] },
          { position: [0.5, -0.4, 0.2], color: [1, 0.8, 0.2] },
        ],
      },
      {
        id: 1,
        vertices: [
          { position: [-0.3, 0.6, -0.1], color: [0.2, 0.4, 1] },
          { position: [-0.5, -0.7, -0.1], color: [0.2, 0.8, 1] },
          { position: [0.8, -0.2, -0.1], color: [0.2, 1, 0.8] },
        ],
      },
    ],
  },
  {
    name: 'Spinning Cube',
    description: 'Six faces of a cube (12 triangles)',
    triangles: buildCubeTriangles(),
  },
];

function buildCubeTriangles(): Triangle[] {
  const s = 0.45;
  // prettier-ignore
  const verts: [number, number, number][] = [
    [-s, -s, -s], [ s, -s, -s], [ s,  s, -s], [-s,  s, -s], // back
    [-s, -s,  s], [ s, -s,  s], [ s,  s,  s], [-s,  s,  s], // front
  ];
  const faces: [number, number, number, number][] = [
    [0, 1, 2, 3], // back
    [5, 4, 7, 6], // front
    [4, 0, 3, 7], // left
    [1, 5, 6, 2], // right
    [3, 2, 6, 7], // top
    [4, 5, 1, 0], // bottom
  ];
  const faceColors: [number, number, number][] = [
    [1, 0.3, 0.3],
    [0.3, 1, 0.3],
    [0.3, 0.3, 1],
    [1, 1, 0.3],
    [1, 0.3, 1],
    [0.3, 1, 1],
  ];
  const tris: Triangle[] = [];
  let id = 0;
  for (let f = 0; f < faces.length; f++) {
    const face = faces[f]!;
    const col = faceColors[f]!;
    const i0 = face[0]!;
    const i1 = face[1]!;
    const i2 = face[2]!;
    const i3 = face[3]!;
    tris.push({
      id: id++,
      vertices: [
        { position: [...verts[i0]!], color: [...col] },
        { position: [...verts[i1]!], color: [...col] },
        { position: [...verts[i2]!], color: [...col] },
      ],
    });
    tris.push({
      id: id++,
      vertices: [
        { position: [...verts[i0]!], color: [...col] },
        { position: [...verts[i2]!], color: [...col] },
        { position: [...verts[i3]!], color: [...col] },
      ],
    });
  }
  return tris;
}

// ── Math helpers ───────────────────────────────────────────────────────────

type Vec4 = [number, number, number, number];
type Mat4 = [Vec4, Vec4, Vec4, Vec4];

function mat4Multiply(a: Mat4, b: Mat4): Mat4 {
  const r: number[][] = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      for (let k = 0; k < 4; k++) {
        r[i]![j]! += a[i]![k]! * b[k]![j]!;
      }
    }
  }
  return r as unknown as Mat4;
}

function mat4Vec4(m: Mat4, v: Vec4): Vec4 {
  return [
    m[0]![0]! * v[0] + m[0]![1]! * v[1] + m[0]![2]! * v[2] + m[0]![3]! * v[3],
    m[1]![0]! * v[0] + m[1]![1]! * v[1] + m[1]![2]! * v[2] + m[1]![3]! * v[3],
    m[2]![0]! * v[0] + m[2]![1]! * v[1] + m[2]![2]! * v[2] + m[2]![3]! * v[3],
    m[3]![0]! * v[0] + m[3]![1]! * v[1] + m[3]![2]! * v[2] + m[3]![3]! * v[3],
  ];
}

function rotationY(angle: number): Mat4 {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [
    [c, 0, s, 0],
    [0, 1, 0, 0],
    [-s, 0, c, 0],
    [0, 0, 0, 1],
  ];
}

function perspectiveMatrix(): Mat4 {
  const near = 0.5;
  const far = 5;
  const fov = 1.2;
  const f = 1 / Math.tan(fov / 2);
  return [
    [f, 0, 0, 0],
    [0, f, 0, 0],
    [0, 0, (far + near) / (near - far), (2 * far * near) / (near - far)],
    [0, 0, -1, 0],
  ];
}

function viewMatrix(): Mat4 {
  // camera at z=2 looking at origin
  return [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, -2],
    [0, 0, 0, 1],
  ];
}

export function buildMVP(rotation: number): Mat4 {
  const model = rotationY(rotation);
  const view = viewMatrix();
  const proj = perspectiveMatrix();
  return mat4Multiply(proj, mat4Multiply(view, model));
}

// ── Rasterization helpers ──────────────────────────────────────────────────

const FB_SIZE = 32;

function clipToScreen(clip: Vec4): [number, number, number] {
  const w = clip[3];
  if (Math.abs(w) < 0.0001) return [0, 0, 0];
  const ndcX = clip[0] / w;
  const ndcY = clip[1] / w;
  const ndcZ = clip[2] / w;
  const sx = Math.round((ndcX * 0.5 + 0.5) * (FB_SIZE - 1));
  const sy = Math.round(((-ndcY) * 0.5 + 0.5) * (FB_SIZE - 1)); // flip Y
  return [sx, sy, ndcZ];
}

function edgeFunction(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
): number {
  return (cx - ax) * (by - ay) - (cy - ay) * (bx - ax);
}

interface ScreenTri {
  sx: [number, number, number]; // screen x coords
  sy: [number, number, number];
  sz: [number, number, number]; // ndc depth
  colors: [[number, number, number], [number, number, number], [number, number, number]];
  triangleId: number;
}

function rasterizeTriangle(tri: ScreenTri): Fragment[] {
  const frags: Fragment[] = [];
  const minX = Math.max(0, Math.min(tri.sx[0], tri.sx[1], tri.sx[2]));
  const maxX = Math.min(FB_SIZE - 1, Math.max(tri.sx[0], tri.sx[1], tri.sx[2]));
  const minY = Math.max(0, Math.min(tri.sy[0], tri.sy[1], tri.sy[2]));
  const maxY = Math.min(FB_SIZE - 1, Math.max(tri.sy[0], tri.sy[1], tri.sy[2]));

  const area = edgeFunction(
    tri.sx[0], tri.sy[0],
    tri.sx[1], tri.sy[1],
    tri.sx[2], tri.sy[2],
  );
  if (Math.abs(area) < 0.001) return frags;

  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const px = x + 0.5;
      const py = y + 0.5;
      const w0 = edgeFunction(tri.sx[1], tri.sy[1], tri.sx[2], tri.sy[2], px, py);
      const w1 = edgeFunction(tri.sx[2], tri.sy[2], tri.sx[0], tri.sy[0], px, py);
      const w2 = edgeFunction(tri.sx[0], tri.sy[0], tri.sx[1], tri.sy[1], px, py);

      if ((w0 >= 0 && w1 >= 0 && w2 >= 0) || (w0 <= 0 && w1 <= 0 && w2 <= 0)) {
        const b0 = w0 / area;
        const b1 = w1 / area;
        const b2 = w2 / area;
        const depth = b0 * tri.sz[0] + b1 * tri.sz[1] + b2 * tri.sz[2];
        const color: [number, number, number] = [
          Math.min(1, Math.max(0, b0 * tri.colors[0]![0]! + b1 * tri.colors[1]![0]! + b2 * tri.colors[2]![0]!)),
          Math.min(1, Math.max(0, b0 * tri.colors[0]![1]! + b1 * tri.colors[1]![1]! + b2 * tri.colors[2]![1]!)),
          Math.min(1, Math.max(0, b0 * tri.colors[0]![2]! + b1 * tri.colors[1]![2]! + b2 * tri.colors[2]![2]!)),
        ];
        frags.push({ x, y, depth, color, triangleId: tri.triangleId });
      }
    }
  }
  return frags;
}

// ── Pipeline step generator ────────────────────────────────────────────────

function emptyFramebuffer(): [number, number, number][][] {
  return Array.from({ length: FB_SIZE }, () =>
    Array.from({ length: FB_SIZE }, (): [number, number, number] => [0, 0, 0]),
  );
}

function deepCloneVertex(v: Vertex): Vertex {
  return {
    position: [...v.position],
    color: [...v.color],
    clipPosition: v.clipPosition ? [...v.clipPosition] : undefined,
    screenPosition: v.screenPosition ? [...v.screenPosition] : undefined,
  };
}

function deepCloneTriangle(t: Triangle): Triangle {
  return {
    id: t.id,
    vertices: [
      deepCloneVertex(t.vertices[0]),
      deepCloneVertex(t.vertices[1]),
      deepCloneVertex(t.vertices[2]),
    ],
  };
}

export function generatePipelineSteps(
  scene: PipelineScene,
  rotation: number,
): PipelineStep[] {
  const steps: PipelineStep[] = [];
  let stepNum = 1;
  const mvp = buildMVP(rotation);

  // Collect all vertices
  const allVertices: Vertex[] = [];
  for (const tri of scene.triangles) {
    for (const v of tri.vertices) {
      allVertices.push(deepCloneVertex(v));
    }
  }

  // ── 1. Input Assembly ────────────────────────────────────────────────────
  steps.push({
    stage: 'input-assembly',
    stepNumber: stepNum++,
    title: 'Input Assembly',
    description:
      'Read vertex data from memory. Each vertex has a 3D position and an RGB color. ' +
      'The GPU reads these from vertex buffers bound before the draw call.',
    vertices: allVertices.map(deepCloneVertex),
    triangles: scene.triangles.map(deepCloneTriangle),
    fragments: [],
    framebuffer: emptyFramebuffer(),
    activeTriangle: null,
    activeVertex: 0,
    scanline: null,
  });

  // ── 2. Vertex Shader ─────────────────────────────────────────────────────
  const transformedVertices: Vertex[] = allVertices.map((v) => {
    const pos4: Vec4 = [v.position[0], v.position[1], v.position[2], 1];
    const clip = mat4Vec4(mvp, pos4);
    const [sx, sy, sz] = clipToScreen(clip);
    return {
      position: [...v.position] as [number, number, number],
      color: [...v.color] as [number, number, number],
      clipPosition: clip,
      screenPosition: [sx!, sy!] as [number, number],
    };
  });

  const transformedTriangles: Triangle[] = scene.triangles.map((tri, tIdx) => ({
    id: tri.id,
    vertices: [
      deepCloneVertex(transformedVertices[tIdx * 3]!),
      deepCloneVertex(transformedVertices[tIdx * 3 + 1]!),
      deepCloneVertex(transformedVertices[tIdx * 3 + 2]!),
    ],
  }));

  steps.push({
    stage: 'vertex-shader',
    stepNumber: stepNum++,
    title: 'Vertex Shader',
    description:
      'Transform each vertex by the Model-View-Projection matrix. This converts 3D world ' +
      'coordinates into clip space, then to screen coordinates via perspective division.',
    vertices: transformedVertices.map(deepCloneVertex),
    triangles: transformedTriangles.map(deepCloneTriangle),
    fragments: [],
    framebuffer: emptyFramebuffer(),
    activeTriangle: null,
    activeVertex: null,
    scanline: null,
  });

  // ── 3. Primitive Assembly ────────────────────────────────────────────────
  steps.push({
    stage: 'primitive-assembly',
    stepNumber: stepNum++,
    title: 'Primitive Assembly',
    description:
      'Group transformed vertices into triangles. Each set of 3 vertices forms one triangle ' +
      'primitive that will be rasterized.',
    vertices: transformedVertices.map(deepCloneVertex),
    triangles: transformedTriangles.map(deepCloneTriangle),
    fragments: [],
    framebuffer: emptyFramebuffer(),
    activeTriangle: 0,
    activeVertex: null,
    scanline: null,
  });

  // ── 4. Rasterization ────────────────────────────────────────────────────
  const properScreenTris: ScreenTri[] = transformedTriangles.map((tri) => {
    const coords = tri.vertices.map((v) => clipToScreen(v.clipPosition!));
    return {
      sx: [coords[0]![0]!, coords[1]![0]!, coords[2]![0]!] as [number, number, number],
      sy: [coords[0]![1]!, coords[1]![1]!, coords[2]![1]!] as [number, number, number],
      sz: [coords[0]![2]!, coords[1]![2]!, coords[2]![2]!] as [number, number, number],
      colors: tri.vertices.map((v) => [...v.color]) as [
        [number, number, number],
        [number, number, number],
        [number, number, number],
      ],
      triangleId: tri.id,
    };
  });

  const allFragments: Fragment[] = [];
  for (const st of properScreenTris) {
    allFragments.push(...rasterizeTriangle(st));
  }

  // Compute a mid-scanline for visualization
  const midScanline =
    allFragments.length > 0
      ? Math.round(
          allFragments.reduce((s, f) => s + f.y, 0) / allFragments.length,
        )
      : FB_SIZE / 2;

  steps.push({
    stage: 'rasterization',
    stepNumber: stepNum++,
    title: 'Rasterization',
    description:
      'Convert triangles into fragments (potential pixels). For each pixel in the bounding box ' +
      'of a triangle, test if it lies inside using the edge function. Generate a fragment with ' +
      'interpolated depth for each covered pixel.',
    vertices: transformedVertices.map(deepCloneVertex),
    triangles: transformedTriangles.map(deepCloneTriangle),
    fragments: allFragments.map((f) => ({ ...f, color: [0.5, 0.5, 0.5] as [number, number, number] })),
    framebuffer: emptyFramebuffer(),
    activeTriangle: null,
    activeVertex: null,
    scanline: midScanline,
  });

  // ── 5. Fragment Shader ───────────────────────────────────────────────────
  steps.push({
    stage: 'fragment-shader',
    stepNumber: stepNum++,
    title: 'Fragment Shader',
    description:
      'Color each fragment using barycentric interpolation of vertex colors. The GPU computes ' +
      'weights (w0, w1, w2) for each fragment based on its position relative to the triangle vertices, ' +
      'then blends the vertex colors accordingly.',
    vertices: transformedVertices.map(deepCloneVertex),
    triangles: transformedTriangles.map(deepCloneTriangle),
    fragments: allFragments.map((f) => ({ ...f })),
    framebuffer: emptyFramebuffer(),
    activeTriangle: null,
    activeVertex: null,
    scanline: null,
  });

  // ── 6. Depth Test ────────────────────────────────────────────────────────
  const depthBuffer: number[][] = Array.from({ length: FB_SIZE }, () =>
    Array.from({ length: FB_SIZE }, () => Infinity),
  );
  const passedFragments: Fragment[] = [];
  const rejectedCount = { value: 0 };

  // Sort fragments by triangle order (simulate draw order)
  const sortedFragments = [...allFragments].sort((a, b) => a.triangleId - b.triangleId);

  for (const frag of sortedFragments) {
    if (frag.x >= 0 && frag.x < FB_SIZE && frag.y >= 0 && frag.y < FB_SIZE) {
      if (frag.depth < depthBuffer[frag.y]![frag.x]!) {
        depthBuffer[frag.y]![frag.x] = frag.depth;
        passedFragments.push({ ...frag });
      } else {
        rejectedCount.value++;
      }
    }
  }

  steps.push({
    stage: 'depth-test',
    stepNumber: stepNum++,
    title: 'Depth Test',
    description:
      `Compare each fragment's depth against the depth buffer. ` +
      `Fragments closer to the camera replace farther ones. ` +
      `${rejectedCount.value} fragment(s) were discarded as occluded.`,
    vertices: transformedVertices.map(deepCloneVertex),
    triangles: transformedTriangles.map(deepCloneTriangle),
    fragments: passedFragments,
    framebuffer: emptyFramebuffer(),
    activeTriangle: null,
    activeVertex: null,
    scanline: null,
  });

  // ── 7. Framebuffer ───────────────────────────────────────────────────────
  const fb = emptyFramebuffer();
  // Replay depth test to build final framebuffer
  const fb_depth: number[][] = Array.from({ length: FB_SIZE }, () =>
    Array.from({ length: FB_SIZE }, () => Infinity),
  );
  for (const frag of sortedFragments) {
    if (frag.x >= 0 && frag.x < FB_SIZE && frag.y >= 0 && frag.y < FB_SIZE) {
      if (frag.depth < fb_depth[frag.y]![frag.x]!) {
        fb_depth[frag.y]![frag.x] = frag.depth;
        fb[frag.y]![frag.x] = [...frag.color];
      }
    }
  }

  steps.push({
    stage: 'framebuffer',
    stepNumber: stepNum++,
    title: 'Framebuffer Output',
    description:
      'Write surviving fragments to the framebuffer. This is the final rendered image — ' +
      'each cell represents one pixel with its final RGB color.',
    vertices: transformedVertices.map(deepCloneVertex),
    triangles: transformedTriangles.map(deepCloneTriangle),
    fragments: passedFragments,
    framebuffer: fb,
    activeTriangle: null,
    activeVertex: null,
    scanline: null,
  });

  return steps;
}

export const PIPELINE_STAGES: { stage: PipelineStage; label: string; icon: string }[] = [
  { stage: 'input-assembly', label: 'Input Assembly', icon: 'IA' },
  { stage: 'vertex-shader', label: 'Vertex Shader', icon: 'VS' },
  { stage: 'primitive-assembly', label: 'Primitive Assembly', icon: 'PA' },
  { stage: 'rasterization', label: 'Rasterization', icon: 'RS' },
  { stage: 'fragment-shader', label: 'Fragment Shader', icon: 'FS' },
  { stage: 'depth-test', label: 'Depth Test', icon: 'DT' },
  { stage: 'framebuffer', label: 'Framebuffer', icon: 'FB' },
];

export const FB_DISPLAY_SIZE = FB_SIZE;

export const STAGE_PSEUDOCODE: Record<PipelineStage, string> = {
  'input-assembly':
    'for each vertex in vertexBuffer:\n  read position (vec3)\n  read color    (vec3)\n  push to vertex stream',
  'vertex-shader':
    'gl_Position = MVP * vec4(position, 1.0);\n\n// MVP = Projection * View * Model\n// Model  = rotateY(angle)\n// View   = translate(0, 0, -2)\n// Proj   = perspective(fov=1.2, near=0.5, far=5)',
  'primitive-assembly':
    'for i in range(0, vertexCount, 3):\n  triangle = (\n    vertex[i],\n    vertex[i+1],\n    vertex[i+2]\n  )',
  rasterization:
    'for each triangle:\n  bbox = boundingBox(v0, v1, v2)\n  for (x,y) in bbox:\n    w0 = edge(v1, v2, p)\n    w1 = edge(v2, v0, p)\n    w2 = edge(v0, v1, p)\n    if w0>=0 && w1>=0 && w2>=0:\n      emit fragment(x, y)',
  'fragment-shader':
    'fragColor = w0 * v0.color\n          + w1 * v1.color\n          + w2 * v2.color;\n\n// w0, w1, w2 = barycentric weights\n// sum to 1.0, interpolate smoothly',
  'depth-test':
    'if fragment.depth < depthBuffer[x][y]:\n  depthBuffer[x][y] = fragment.depth\n  pass fragment to output\nelse:\n  discard  // occluded',
  framebuffer:
    'framebuffer[x][y] = fragment.color;\n\n// All surviving fragments written.\n// Swap buffers → display!',
};
