export interface GameMeta {
  id: string;
  title: string;
  emoji: string;
  description: string;
  colorScheme: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export const GAME_METADATA: GameMeta[] = [
  {
    id: 'deploy-masher',
    title: 'Deploy Button Masher',
    emoji: '🚀',
    description:
      'Frantically deploy to production and watch everything catch fire. How many deploys until total meltdown?',
    colorScheme: 'green',
    difficulty: 'Easy',
  },
  {
    id: 'bug-whacker',
    title: 'Bug Whacker',
    emoji: '🐛',
    description:
      'Bugs are invading! Squash them before they escape — but spare the features or lose points.',
    colorScheme: 'red',
    difficulty: 'Medium',
  },
  {
    id: 'standup-excuse',
    title: 'Standup Excuse Generator',
    emoji: '🎰',
    description:
      'Spin the wheel of corporate destiny. Three columns of absurdity combine into the perfect standup update.',
    colorScheme: 'purple',
    difficulty: 'Easy',
  },
  {
    id: 'code-review',
    title: 'Code Review Roulette',
    emoji: '🔍',
    description:
      'Real production code or AI-generated nonsense? You have 15 seconds to decide. Trust your instincts.',
    colorScheme: 'orange',
    difficulty: 'Hard',
  },
];

export interface DeployEvent {
  message: string;
  severity: 1 | 2 | 3;
  emoji: string;
}

export const DEPLOY_EVENTS: DeployEvent[] = [
  { message: 'Jenkins is on fire. Literally.', severity: 1, emoji: '🔥' },
  { message: 'The intern pushed to main.', severity: 2, emoji: '😱' },
  { message: 'CEO opened a Jira ticket titled "URGENT."', severity: 1, emoji: '📋' },
  { message: 'DNS has decided to take a personal day.', severity: 3, emoji: '🏖️' },
  { message: 'The database achieved sentience and is refusing writes.', severity: 3, emoji: '🤖' },
  { message: 'Prod and staging are now the same environment. Oops.', severity: 2, emoji: '🔀' },
  { message: 'All environment variables just became "undefined."', severity: 2, emoji: '❓' },
  { message: 'The load balancer is playing favorites.', severity: 1, emoji: '⚖️' },
  { message: 'Someone deployed the node_modules folder.', severity: 3, emoji: '📦' },
  { message: 'Your Docker container is running Docker inside Docker.', severity: 2, emoji: '🐳' },
  { message: '14 Slack channels just got alerted simultaneously.', severity: 1, emoji: '🔔' },
  { message: 'A customer is live-tweeting the outage.', severity: 2, emoji: '🐦' },
  { message: 'The on-call engineer is in airplane mode. On a plane.', severity: 3, emoji: '✈️' },
  { message: 'Your health check is returning 200 but the app is dead.', severity: 2, emoji: '💀' },
  { message: 'Redis is now storing data in a parallel universe.', severity: 3, emoji: '🌌' },
  { message: 'The CDN is serving last Tuesday\'s build.', severity: 1, emoji: '📅' },
  { message: 'Kubernetes decided to scale to 847 pods.', severity: 2, emoji: '📈' },
  { message: 'The SSL cert expired 3 minutes ago.', severity: 3, emoji: '🔐' },
  { message: 'Every API response now includes "lol" in the headers.', severity: 1, emoji: '😂' },
  { message: 'The monitoring dashboard crashed.', severity: 2, emoji: '📊' },
  { message: 'Someone\'s cat walked across the prod server keyboard.', severity: 1, emoji: '🐱' },
  { message: 'The rollback button is also deploying forward.', severity: 3, emoji: '🔄' },
  { message: 'Legal wants to know why the homepage says "yolo."', severity: 1, emoji: '⚖️' },
  { message: 'All user passwords were temporarily set to "password123."', severity: 3, emoji: '🔑' },
  { message: 'The CI pipeline completed in -3 seconds. Suspicious.', severity: 2, emoji: '⏱️' },
  { message: 'A microservice just became a monolith through sheer willpower.', severity: 2, emoji: '🏗️' },
  { message: 'The feature flag service is now a feature itself.', severity: 1, emoji: '🚩' },
  { message: 'Grafana dashboards are showing emotions instead of metrics.', severity: 2, emoji: '😤' },
  { message: 'The sprint retro just got auto-scheduled for 6 AM.', severity: 1, emoji: '⏰' },
  { message: 'Your canary deploy ate the production data.', severity: 3, emoji: '🐤' },
];

export const STANDUP_PARTS = {
  yesterday: [
    'mass-migrated to a framework nobody asked for',
    'wrote a 47-line regex I will never understand again',
    'closed 12 tabs and lost the will to code',
    'argued with a linter for 4 hours and lost',
    'accidentally invented a new sorting algorithm',
    'fixed a bug by adding a comment that says "// don\'t touch this"',
    'read the entire Kubernetes documentation as a bedtime story',
    'deployed on a Friday because I fear nothing',
    'pair-programmed with my rubber duck. The duck had better ideas',
    'discovered our "microservice" has 47 dependencies',
    'spent 6 hours on a bug that was a missing semicolon',
    'converted the entire codebase to use Comic Sans in the terminal',
    'attended a meeting that should have been a Slack message',
    'wrote documentation that no one will ever read',
    'optimized a function that runs once per year',
    'refactored code I wrote yesterday because I didn\'t recognize it',
  ],
  today: [
    'attend 6 meetings about reducing meetings',
    'stare at a YAML file until it reveals its secrets',
    'implement a feature that was already deprecated',
    'have an existential crisis about monorepos',
    'pretend to understand the Kubernetes architecture diagram',
    'rewrite everything in Rust (just kidding, unless...)',
    'add more console.log statements for "debugging"',
    'fight with npm about peer dependencies',
    'question every career choice that led me here',
    'move a button 2 pixels to the left, then 2 pixels to the right',
    'try to explain serverless to my mom again',
    'create a Jira ticket to track the Jira ticket about Jira tickets',
    'google the same Stack Overflow answer for the 15th time',
    'negotiate with the product owner about what "done" means',
    'contemplate the void between "it works" and "it\'s correct"',
    'delete someone else\'s TODO comment from 2019',
  ],
  blockedBy: [
    'the WiFi, gravity, and my own hubris',
    'a merge conflict the size of Texas',
    'whoever thought YAML was a good config format',
    'the fact that it works on my machine but nowhere else',
    'npm audit finding 847 vulnerabilities, 846 of which are "critical"',
    'a 3-hour "quick sync" that could have been an email',
    'the haunted legacy codebase from 2016',
    'my IDE, which has decided to index the entire internet',
    'the ghost in the CI pipeline that fails on Tuesdays',
    'a production incident from a deploy I definitely didn\'t make',
    'the team\'s definition of "simple change"',
    'a dependency that was last updated during the Renaissance',
    'my own code from 2 weeks ago, which is now incomprehensible',
    'the printer. Don\'t ask why. Just... the printer',
    'a rogue cron job that runs at midnight and deletes hope',
    'existential dread and a cold cup of coffee',
  ],
};

export interface CodeSnippet {
  code: string;
  isReal: boolean;
  source: string;
  language: string;
}

export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    code: `// from a real codebase
if (i == 0)
  i = 1;
else
  i = 0;
// "toggle"`,
    isReal: true,
    source: 'Found in a banking application. The dev didn\'t know about XOR.',
    language: 'c',
  },
  {
    code: `function isEven(n) {
  return n.toString(2).endsWith('0');
}`,
    isReal: true,
    source: 'Actual StackOverflow answer. Converts to binary to check if even.',
    language: 'javascript',
  },
  {
    code: `def fibonacci_quantum(n):
    """Calculate fibonacci using
    quantum superposition simulation"""
    return round(
        (1.618033988749895**n) /
        2.2360679774997896
    )`,
    isReal: false,
    source: 'AI-generated: Uses the golden ratio approximation but calls it "quantum."',
    language: 'python',
  },
  {
    code: `// TODO: fix this later
// TODO: no seriously fix this
// TODO: it's been 3 years
// TODO: new dev here, what is this?
// TODO: I'm afraid to touch it
return true;`,
    isReal: true,
    source: 'Found in an open-source project with 5 years of accumulated fear.',
    language: 'javascript',
  },
  {
    code: `if (response.status === 200 ||
    response.status === 201 ||
    response.status === 202 ||
    response.status === 204 ||
    response.status === 301 ||
    response.status === 302) {
  handleSuccess();
}`,
    isReal: true,
    source: 'From a production API client. Never heard of status ranges.',
    language: 'javascript',
  },
  {
    code: `async function sleep(ms) {
  return new Promise(resolve => {
    const start = Date.now();
    while (Date.now() - start < ms) {}
    resolve();
  });
}`,
    isReal: false,
    source: 'AI-generated: An async function that blocks the event loop. Impressively wrong.',
    language: 'javascript',
  },
  {
    code: `def sort_list(lst):
    while not all(
        lst[i] <= lst[i+1]
        for i in range(len(lst)-1)
    ):
        random.shuffle(lst)
    return lst`,
    isReal: true,
    source: 'Bogosort implemented in production. The dev said "it works eventually."',
    language: 'python',
  },
  {
    code: `class AbstractSingletonProxyFactoryBean
  extends AbstractFactoryBean
  implements SmartFactoryBean {
  // 400 lines of enterprise Java
}`,
    isReal: true,
    source: 'An actual Spring Framework class name. Enterprise Java at its finest.',
    language: 'java',
  },
  {
    code: `const deepClone = obj =>
  JSON.parse(
    JSON.stringify(obj)
      .replace(/null/g, '"PLACEHOLDER"')
  ).replace(/"PLACEHOLDER"/g, null);`,
    isReal: false,
    source: 'AI-generated: Attempts deep clone but corrupts any string containing "null."',
    language: 'javascript',
  },
  {
    code: `// Monday
git push --force
// Tuesday
git push --force
// Wednesday
git reflog
// Thursday
git push --force
// Friday
rm -rf .git && git init`,
    isReal: true,
    source: 'Actual git history comments from an unnamed startup.',
    language: 'bash',
  },
  {
    code: `function multiply(a, b) {
  let result = 0;
  for (let i = 0; i < b; i++) {
    result = result + a;
  }
  return result;
}`,
    isReal: true,
    source: 'From a junior dev\'s PR. "I wanted to understand multiplication from first principles."',
    language: 'javascript',
  },
  {
    code: `def validate_email(email):
    try:
        send_email(email, "Test")
        return True
    except:
        return False`,
    isReal: false,
    source: 'AI-generated: Validates email by... actually sending one. Bold strategy.',
    language: 'python',
  },
  {
    code: `catch (Exception e) {
  // TODO: handle this
  // haha just kidding
  System.exit(0);
}`,
    isReal: true,
    source: 'Found in a payment processing system. The error handler exits the JVM.',
    language: 'java',
  },
  {
    code: `const sanitizeHTML = (input) =>
  input
    .replaceAll('<', '')
    .replaceAll('>', '')
    .replaceAll('"', '')
    .replaceAll("'", '');
// XSS protection ™️`,
    isReal: false,
    source: 'AI-generated: "Sanitizes" HTML by deleting angle brackets. Still vulnerable.',
    language: 'javascript',
  },
  {
    code: `/* This code was written
 * at 3am during a hackathon
 * while consuming only
 * Monster Energy and hubris.
 * It should not work.
 * It does. Do not question it. */
return !!(+new Date() % 2);`,
    isReal: true,
    source: 'A real hackathon submission that was somehow shipped to production.',
    language: 'javascript',
  },
  {
    code: `function getRandomNumber() {
  return 4;
  // chosen by fair dice roll
  // guaranteed to be random
}`,
    isReal: true,
    source: 'Inspired by xkcd #221. Found in multiple codebases unironically.',
    language: 'javascript',
  },
  {
    code: `const isOdd = n =>
  [...Array(Math.abs(n))]
    .reduce((a) => !a, false);`,
    isReal: false,
    source: 'AI-generated: Creates an array of N elements to toggle a boolean. O(n) isOdd.',
    language: 'javascript',
  },
  {
    code: `SELECT * FROM users
WHERE name LIKE '%' + @input + '%'
-- don't worry about injection
-- this is an internal tool`,
    isReal: true,
    source: 'From an "internal tool" that was later exposed to the internet.',
    language: 'sql',
  },
  {
    code: `def celsius_to_fahrenheit(c):
    """Convert using machine learning"""
    model = LinearRegression()
    X = [[0], [100]]
    y = [32, 212]
    model.fit(X, y)
    return model.predict([[c]])[0]`,
    isReal: false,
    source: 'AI-generated: Trains a linear regression model for a simple linear formula.',
    language: 'python',
  },
  {
    code: `// months are 0-indexed because
// programmers hate happiness
const month = new Date().getMonth() + 1;
// wait no
const month2 = new Date().getMonth();
// actually
const month3 = new Date().getMonth() + 1;
// I looked it up this time`,
    isReal: true,
    source: 'The eternal JavaScript Date struggle, documented in real-time.',
    language: 'javascript',
  },
];

export const BUG_WHACKER_CONFIG = {
  gridSize: 4,
  gameDuration: 30,
  spawnInterval: { initial: 1200, min: 400 },
  bugPoints: 10,
  featurePenalty: 5,
  featureChance: 0.15,
  despawnTime: 1500,
};
