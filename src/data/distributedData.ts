// ─── Raft Consensus Protocol Simulation ──────────────────────────────────────

export type NodeState = 'follower' | 'candidate' | 'leader' | 'dead';

export interface RaftNode {
  id: number;
  state: NodeState;
  term: number;
  votedFor: number | null;
  log: { term: number; value: string }[];
  commitIndex: number;
  x: number;
  y: number;
  electionTimeout: number; // ticks until election fires
  electionTimer: number; // current countdown
  heartbeatTimer: number; // leader heartbeat countdown
  votesReceived: number[];
}

export interface Message {
  from: number;
  to: number;
  type:
    | 'RequestVote'
    | 'VoteGranted'
    | 'VoteDenied'
    | 'AppendEntries'
    | 'AppendResponse';
  term: number;
  progress: number; // 0 to 1
  entries?: { term: number; value: string }[];
}

export interface RaftState {
  nodes: RaftNode[];
  messages: Message[];
  partitions: [number, number][];
  stepCount: number;
  eventLog: { step: number; description: string }[];
}

function randomTimeout(): number {
  return Math.floor(Math.random() * 11) + 5; // 5-15 ticks
}

function arrangeInRing(
  count: number,
  cx: number,
  cy: number,
  radius: number,
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    positions.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  }
  return positions;
}

export function createInitialState(nodeCount: number): RaftState {
  const positions = arrangeInRing(nodeCount, 250, 200, 140);
  const nodes: RaftNode[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const pos = positions[i]!;
    nodes.push({
      id: i,
      state: 'follower',
      term: 0,
      votedFor: null,
      log: [],
      commitIndex: -1,
      x: pos.x,
      y: pos.y,
      electionTimeout: randomTimeout(),
      electionTimer: randomTimeout(),
      heartbeatTimer: 0,
      votesReceived: [],
    });
  }
  return {
    nodes,
    messages: [],
    partitions: [],
    stepCount: 0,
    eventLog: [],
  };
}

function isPartitioned(
  partitions: [number, number][],
  a: number,
  b: number,
): boolean {
  return partitions.some(
    ([x, y]) => (x === a && y === b) || (x === b && y === a),
  );
}

function majority(nodeCount: number): number {
  return Math.floor(nodeCount / 2) + 1;
}

export function stepRaft(state: RaftState): RaftState {
  const newStep = state.stepCount + 1;
  const newLog = [...state.eventLog];
  let nodes = state.nodes.map((n) => ({ ...n, votesReceived: [...n.votesReceived] }));
  let messages = state.messages.map((m) => ({ ...m }));

  // 1. Advance message progress
  messages = messages.map((m) => ({ ...m, progress: m.progress + 0.5 }));

  // 2. Deliver messages that have arrived (progress >= 1)
  const delivered: Message[] = [];
  const inFlight: Message[] = [];
  for (const m of messages) {
    if (m.progress >= 1) {
      delivered.push(m);
    } else {
      inFlight.push(m);
    }
  }
  messages = inFlight;

  // Process delivered messages
  for (const msg of delivered) {
    const toNode = nodes.find((n) => n.id === msg.to);
    if (!toNode || toNode.state === 'dead') continue;
    if (isPartitioned(state.partitions, msg.from, msg.to)) continue;

    // Update term if sender has higher term
    if (msg.term > toNode.term) {
      toNode.term = msg.term;
      toNode.state = 'follower';
      toNode.votedFor = null;
      toNode.votesReceived = [];
    }

    switch (msg.type) {
      case 'RequestVote': {
        if (msg.term >= toNode.term) {
          if (toNode.votedFor === null || toNode.votedFor === msg.from) {
            toNode.votedFor = msg.from;
            toNode.term = msg.term;
            messages.push({
              from: toNode.id,
              to: msg.from,
              type: 'VoteGranted',
              term: toNode.term,
              progress: 0,
            });
            newLog.push({
              step: newStep,
              description: `Node ${toNode.id} granted vote to Node ${msg.from} (term ${msg.term})`,
            });
          } else {
            messages.push({
              from: toNode.id,
              to: msg.from,
              type: 'VoteDenied',
              term: toNode.term,
              progress: 0,
            });
          }
        } else {
          messages.push({
            from: toNode.id,
            to: msg.from,
            type: 'VoteDenied',
            term: toNode.term,
            progress: 0,
          });
        }
        break;
      }
      case 'VoteGranted': {
        const candidate = toNode;
        if (candidate.state === 'candidate' && msg.term === candidate.term) {
          if (!candidate.votesReceived.includes(msg.from)) {
            candidate.votesReceived.push(msg.from);
          }
          const aliveCount = nodes.filter((n) => n.state !== 'dead').length;
          if (candidate.votesReceived.length + 1 >= majority(aliveCount)) {
            candidate.state = 'leader';
            candidate.heartbeatTimer = 0;
            candidate.votesReceived = [];
            newLog.push({
              step: newStep,
              description: `Node ${candidate.id} elected leader (term ${candidate.term})`,
            });
            // Demote other leaders of same or lower term
            for (const n of nodes) {
              if (
                n.id !== candidate.id &&
                n.state === 'leader' &&
                n.term <= candidate.term
              ) {
                n.state = 'follower';
                n.votedFor = null;
              }
            }
          }
        }
        break;
      }
      case 'VoteDenied':
        // Candidate ignores denials
        break;
      case 'AppendEntries': {
        if (msg.term >= toNode.term) {
          toNode.state = 'follower';
          toNode.electionTimer = toNode.electionTimeout;
          toNode.term = msg.term;
          // Append new entries
          if (msg.entries && msg.entries.length > 0) {
            for (const entry of msg.entries) {
              if (!toNode.log.some((e) => e.term === entry.term && e.value === entry.value)) {
                toNode.log.push({ ...entry });
              }
            }
            toNode.commitIndex = toNode.log.length - 1;
          }
          messages.push({
            from: toNode.id,
            to: msg.from,
            type: 'AppendResponse',
            term: toNode.term,
            progress: 0,
          });
        }
        break;
      }
      case 'AppendResponse':
        // Leader processes append response (simplified — just track)
        break;
    }
  }

  // 3. Tick timers for each node
  for (const node of nodes) {
    if (node.state === 'dead') continue;

    if (node.state === 'leader') {
      node.heartbeatTimer--;
      if (node.heartbeatTimer <= 0) {
        node.heartbeatTimer = 3;
        // Send heartbeats to all other alive nodes
        for (const other of nodes) {
          if (other.id !== node.id && other.state !== 'dead') {
            if (!isPartitioned(state.partitions, node.id, other.id)) {
              messages.push({
                from: node.id,
                to: other.id,
                type: 'AppendEntries',
                term: node.term,
                progress: 0,
                entries: node.log.length > 0 ? [...node.log] : undefined,
              });
            }
          }
        }
      }
    } else if (node.state === 'follower' || node.state === 'candidate') {
      node.electionTimer--;
      if (node.electionTimer <= 0) {
        // Start election
        node.state = 'candidate';
        node.term++;
        node.votedFor = node.id;
        node.votesReceived = [];
        node.electionTimer = randomTimeout();
        newLog.push({
          step: newStep,
          description: `Node ${node.id} became candidate (term ${node.term})`,
        });
        // Send RequestVote to all
        for (const other of nodes) {
          if (other.id !== node.id && other.state !== 'dead') {
            if (!isPartitioned(state.partitions, node.id, other.id)) {
              messages.push({
                from: node.id,
                to: other.id,
                type: 'RequestVote',
                term: node.term,
                progress: 0,
              });
            }
          }
        }
      }
    }
  }

  return {
    nodes,
    messages,
    partitions: [...state.partitions],
    stepCount: newStep,
    eventLog: newLog,
  };
}

export function killNode(state: RaftState, nodeId: number): RaftState {
  const nodes = state.nodes.map((n) =>
    n.id === nodeId ? { ...n, state: 'dead' as NodeState, votesReceived: [...n.votesReceived] } : { ...n, votesReceived: [...n.votesReceived] },
  );
  // Remove messages from/to this node
  const messages = state.messages.filter(
    (m) => m.from !== nodeId && m.to !== nodeId,
  );
  return {
    ...state,
    nodes,
    messages,
    eventLog: [
      ...state.eventLog,
      { step: state.stepCount, description: `Node ${nodeId} killed` },
    ],
  };
}

export function reviveNode(state: RaftState, nodeId: number): RaftState {
  const nodes = state.nodes.map((n) =>
    n.id === nodeId
      ? {
          ...n,
          state: 'follower' as NodeState,
          electionTimer: randomTimeout(),
          electionTimeout: randomTimeout(),
          votedFor: null,
          votesReceived: [],
        }
      : { ...n, votesReceived: [...n.votesReceived] },
  );
  return {
    ...state,
    nodes,
    eventLog: [
      ...state.eventLog,
      { step: state.stepCount, description: `Node ${nodeId} revived` },
    ],
  };
}

export function addPartition(
  state: RaftState,
  a: number,
  b: number,
): RaftState {
  if (isPartitioned(state.partitions, a, b)) return state;
  return {
    ...state,
    partitions: [...state.partitions, [a, b]],
    eventLog: [
      ...state.eventLog,
      {
        step: state.stepCount,
        description: `Network partition added between Node ${a} and Node ${b}`,
      },
    ],
  };
}

export function removePartition(
  state: RaftState,
  a: number,
  b: number,
): RaftState {
  return {
    ...state,
    partitions: state.partitions.filter(
      ([x, y]) => !((x === a && y === b) || (x === b && y === a)),
    ),
    eventLog: [
      ...state.eventLog,
      {
        step: state.stepCount,
        description: `Network partition removed between Node ${a} and Node ${b}`,
      },
    ],
  };
}

export function clientRequest(state: RaftState, value: string): RaftState {
  const leader = state.nodes.find((n) => n.state === 'leader');
  if (!leader) {
    return {
      ...state,
      eventLog: [
        ...state.eventLog,
        {
          step: state.stepCount,
          description: `Client request "${value}" rejected — no leader`,
        },
      ],
    };
  }

  const nodes = state.nodes.map((n) => {
    if (n.id === leader.id) {
      const newNode = { ...n, log: [...n.log], votesReceived: [...n.votesReceived] };
      newNode.log.push({ term: n.term, value });
      newNode.commitIndex = newNode.log.length - 1;
      return newNode;
    }
    return { ...n, votesReceived: [...n.votesReceived] };
  });

  return {
    ...state,
    nodes,
    eventLog: [
      ...state.eventLog,
      {
        step: state.stepCount,
        description: `Client request "${value}" accepted by leader Node ${leader.id}`,
      },
    ],
  };
}

// ─── Gossip Protocol Simulation ──────────────────────────────────────────────

export interface GossipNode {
  id: number;
  x: number;
  y: number;
  data: Record<string, { value: string; version: number }>;
  alive: boolean;
  lastUpdated: number; // step when last received new data
}

export interface GossipMessage {
  from: number;
  to: number;
  key: string;
  progress: number;
}

export interface GossipState {
  nodes: GossipNode[];
  messages: GossipMessage[];
  step: number;
}

export function createGossipState(nodeCount: number): GossipState {
  const positions = arrangeInRing(nodeCount, 250, 200, 140);
  const nodes: GossipNode[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const pos = positions[i]!;
    nodes.push({
      id: i,
      x: pos.x,
      y: pos.y,
      data: {},
      alive: true,
      lastUpdated: 0,
    });
  }
  return { nodes, messages: [], step: 0 };
}

export function stepGossip(state: GossipState): GossipState {
  const newStep = state.step + 1;
  let nodes = state.nodes.map((n) => ({ ...n, data: { ...n.data } }));
  let messages = state.messages.map((m) => ({
    ...m,
    progress: m.progress + 0.5,
  }));

  // Deliver messages
  const delivered: GossipMessage[] = [];
  const inFlight: GossipMessage[] = [];
  for (const m of messages) {
    if (m.progress >= 1) {
      delivered.push(m);
    } else {
      inFlight.push(m);
    }
  }
  messages = inFlight;

  for (const msg of delivered) {
    const toNode = nodes.find((n) => n.id === msg.to);
    const fromNode = nodes.find((n) => n.id === msg.from);
    if (!toNode || !toNode.alive || !fromNode) continue;

    const fromData = fromNode.data[msg.key];
    if (!fromData) continue;

    const toData = toNode.data[msg.key];
    if (!toData || toData.version < fromData.version) {
      toNode.data[msg.key] = { ...fromData };
      toNode.lastUpdated = newStep;
    }
  }

  // Each alive node gossips to 1-2 random peers
  const aliveNodes = nodes.filter((n) => n.alive);
  for (const node of aliveNodes) {
    const keys = Object.keys(node.data);
    if (keys.length === 0) continue;

    const peerCount = Math.floor(Math.random() * 2) + 1;
    const peers = aliveNodes
      .filter((n) => n.id !== node.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, peerCount);

    for (const peer of peers) {
      for (const key of keys) {
        messages.push({
          from: node.id,
          to: peer.id,
          key,
          progress: 0,
        });
      }
    }
  }

  return { nodes, messages, step: newStep };
}

export function updateGossipNode(
  state: GossipState,
  nodeId: number,
  key: string,
  value: string,
): GossipState {
  const nodes = state.nodes.map((n) => {
    if (n.id === nodeId) {
      const newNode = { ...n, data: { ...n.data }, lastUpdated: state.step };
      const existing = newNode.data[key];
      const version = existing ? existing.version + 1 : 1;
      newNode.data[key] = { value, version };
      return newNode;
    }
    return { ...n, data: { ...n.data } };
  });
  return { ...state, nodes };
}
