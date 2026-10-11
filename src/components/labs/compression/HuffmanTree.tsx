import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { type HuffmanNode } from '@data/compressionData';

interface TreePos {
    x: number;
    y: number;
    node: HuffmanNode;
    children: { child: TreePos; direction: 'left' | 'right' }[];
}

function layoutTree(
    node: HuffmanNode | null,
    x: number,
    y: number,
    spread: number
): TreePos | null {
    if (!node) return null;
    const pos: TreePos = { x, y, node, children: [] };
    const leftPos = layoutTree(node.left, x - spread, y + 70, spread * 0.55);
    const rightPos = layoutTree(node.right, x + spread, y + 70, spread * 0.55);
    if (leftPos) pos.children.push({ child: leftPos, direction: 'left' });
    if (rightPos) pos.children.push({ child: rightPos, direction: 'right' });
    return pos;
}

function getTreeDepth(node: HuffmanNode | null): number {
    if (!node) return 0;
    return 1 + Math.max(getTreeDepth(node.left), getTreeDepth(node.right));
}

function collectPositions(pos: TreePos | null, arr: TreePos[]): void {
    if (!pos) return;
    arr.push(pos);
    for (const c of pos.children) {
        collectPositions(c.child, arr);
    }
}

function isOnHighlightPath(
    pos: TreePos,
    highlightPath: ('left' | 'right')[],
    root: TreePos
): {
    onPath: boolean;
    edgeHighlighted: boolean;
    direction: 'left' | 'right' | null;
} {
    // Walk the highlight path from root to see if this node is on it
    let current: TreePos | null = root;
    const visited = new Set<TreePos>();
    visited.add(root);

    for (const dir of highlightPath) {
        if (!current) break;
        const next:
            { child: TreePos; direction: 'left' | 'right' } | undefined =
            current.children.find((c) => c.direction === dir);
        if (next) {
            visited.add(next.child);
            current = next.child;
        }
    }

    return {
        onPath: visited.has(pos),
        edgeHighlighted: false,
        direction: null,
    };
}

function isEdgeHighlighted(
    parentPos: TreePos,
    childDir: 'left' | 'right',
    highlightPath: ('left' | 'right')[],
    root: TreePos
): boolean {
    let current: TreePos | null = root;
    for (const dir of highlightPath) {
        if (!current) return false;
        if (current === parentPos && dir === childDir) return true;
        const next:
            { child: TreePos; direction: 'left' | 'right' } | undefined =
            current.children.find((c) => c.direction === dir);
        if (next) {
            current = next.child;
        } else {
            return false;
        }
    }
    return false;
}

export default function HuffmanTreeSVG({
    tree,
    highlightPath,
}: {
    tree: HuffmanNode | null;
    highlightPath: ('left' | 'right')[];
}) {
    const nodeColor = useColorModeValue('#4A5568', '#CBD5E0');
    const leafColor = useColorModeValue('#2B6CB0', '#63B3ED');
    const leafBg = useColorModeValue('#EBF8FF', '#2A4365');
    const internalBg = useColorModeValue('#F7FAFC', '#2D3748');
    const edgeColor = useColorModeValue('#A0AEC0', '#4A5568');
    const highlightColor = '#D69E2E';
    const labelColor = useColorModeValue('#4A5568', '#CBD5E0');

    if (!tree) {
        return (
            <Flex
                h="200px"
                align="center"
                justify="center"
                borderWidth="1px"
                borderRadius="md"
                borderStyle="dashed"
                borderColor={edgeColor}
            >
                <Text color={labelColor} fontSize="sm">
                    Tree will appear during tree-building phase
                </Text>
            </Flex>
        );
    }

    const depth = getTreeDepth(tree);
    const initialSpread = Math.max(60, Math.pow(2, depth - 1) * 30);
    const rootPos = layoutTree(tree, 0, 30, initialSpread)!;

    const allPositions: TreePos[] = [];
    collectPositions(rootPos, allPositions);

    const minX = Math.min(...allPositions.map((p) => p.x));
    const maxX = Math.max(...allPositions.map((p) => p.x));
    const maxY = Math.max(...allPositions.map((p) => p.y));

    const padding = 40;
    const viewW = maxX - minX + padding * 2;
    const viewH = maxY + padding * 2;
    const offsetX = -minX + padding;

    // Collect edges
    const edges: {
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        direction: 'left' | 'right';
        highlighted: boolean;
    }[] = [];

    function collectEdges(pos: TreePos): void {
        for (const c of pos.children) {
            edges.push({
                x1: pos.x + offsetX,
                y1: pos.y,
                x2: c.child.x + offsetX,
                y2: c.child.y,
                direction: c.direction,
                highlighted: isEdgeHighlighted(
                    pos,
                    c.direction,
                    highlightPath,
                    rootPos
                ),
            });
            collectEdges(c.child);
        }
    }
    collectEdges(rootPos);

    return (
        <Box overflowX="auto" w="100%">
            <svg
                width="100%"
                height={Math.min(viewH + 20, 400)}
                viewBox={`0 0 ${viewW} ${viewH + 20}`}
                style={{ minWidth: 300 }}
            >
                {/* Edges */}
                {edges.map((e, i) => (
                    <g key={`edge-${i}`}>
                        <line
                            x1={e.x1}
                            y1={e.y1}
                            x2={e.x2}
                            y2={e.y2}
                            stroke={e.highlighted ? highlightColor : edgeColor}
                            strokeWidth={e.highlighted ? 3 : 1.5}
                            strokeOpacity={e.highlighted ? 1 : 0.6}
                        />
                        <text
                            x={
                                (e.x1 + e.x2) / 2 +
                                (e.direction === 'left' ? -10 : 10)
                            }
                            y={(e.y1 + e.y2) / 2}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight={e.highlighted ? 'bold' : 'normal'}
                            fill={e.highlighted ? highlightColor : labelColor}
                        >
                            {e.direction === 'left' ? '0' : '1'}
                        </text>
                    </g>
                ))}

                {/* Nodes */}
                {allPositions.map((pos, i) => {
                    const isLeaf = pos.node.char !== null;
                    const { onPath } = isOnHighlightPath(
                        pos,
                        highlightPath,
                        rootPos
                    );
                    const r = isLeaf ? 18 : 14;

                    return (
                        <g
                            key={`node-${i}`}
                            transform={`translate(${pos.x + offsetX}, ${pos.y})`}
                        >
                            <circle
                                r={r}
                                fill={isLeaf ? leafBg : internalBg}
                                stroke={
                                    onPath && highlightPath.length > 0
                                        ? highlightColor
                                        : isLeaf
                                          ? leafColor
                                          : nodeColor
                                }
                                strokeWidth={
                                    onPath && highlightPath.length > 0 ? 3 : 1.5
                                }
                            />
                            <text
                                textAnchor="middle"
                                dominantBaseline="central"
                                fontSize={isLeaf ? '12' : '10'}
                                fontWeight="bold"
                                fill={isLeaf ? leafColor : nodeColor}
                            >
                                {isLeaf
                                    ? pos.node.char === ' '
                                        ? 'SP'
                                        : pos.node.char
                                    : pos.node.freq}
                            </text>
                            {isLeaf && pos.node.code && (
                                <text
                                    textAnchor="middle"
                                    y={r + 12}
                                    fontSize="9"
                                    fill={labelColor}
                                >
                                    {pos.node.code}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </Box>
    );
}

// ---------------------------------------------------------------------------
// Stats Panel
// ---------------------------------------------------------------------------
