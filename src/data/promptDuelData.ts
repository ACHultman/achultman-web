export interface DuelResponse {
  model: string;
  modelLabel: string;
  text: string;
  thinkingTime: string;
}

export interface PromptDuel {
  id: string;
  category: string;
  prompt: string;
  responses: [DuelResponse, DuelResponse];
  votesA: number;
  votesB: number;
}

export const PROMPT_DUELS: PromptDuel[] = [
  {
    id: 'fizzbuzz-elegant',
    category: 'Code',
    prompt: 'Write the most elegant FizzBuzz in Python.',
    responses: [
      {
        model: 'A',
        modelLabel: 'Model A',
        text: `def fizzbuzz(n):
    for i in range(1, n + 1):
        output = ""
        if i % 3 == 0:
            output += "Fizz"
        if i % 5 == 0:
            output += "Buzz"
        print(output or i)

fizzbuzz(100)`,
        thinkingTime: '1.2s',
      },
      {
        model: 'B',
        modelLabel: 'Model B',
        text: `print(*("Fizz"*(i%3==0)+"Buzz"*(i%5==0) or i for i in range(1,101)), sep="\\n")`,
        thinkingTime: '0.8s',
      },
    ],
    votesA: 156,
    votesB: 211,
  },
  {
    id: 'haiku-about-debugging',
    category: 'Creative Writing',
    prompt: 'Write a haiku about debugging at 3am.',
    responses: [
      {
        model: 'A',
        modelLabel: 'Model A',
        text: `Stack trace glows bright blue
Coffee cold, the bug hides deep—
Semicolon. Found.`,
        thinkingTime: '0.9s',
      },
      {
        model: 'B',
        modelLabel: 'Model B',
        text: `Three a.m. again
The error was on line one
I mass all along`,
        thinkingTime: '1.1s',
      },
    ],
    votesA: 89,
    votesB: 134,
  },
  {
    id: 'trolley-problem',
    category: 'Reasoning',
    prompt: 'Explain the trolley problem to a 5-year-old.',
    responses: [
      {
        model: 'A',
        modelLabel: 'Model A',
        text: `Imagine you have a toy train on a track. The train is going really fast toward 5 teddy bears sitting on the track! Oh no!

But wait — you can push a lever to make the train go on a different track. The problem is, there's 1 teddy bear sitting on that track.

So here's the hard question: Do you push the lever? You can save 5 teddy bears, but 1 teddy bear would get bumped. Or do you do nothing, and 5 teddy bears get bumped?

There's no wrong answer! It's just a thinking puzzle that even grown-ups disagree about.`,
        thinkingTime: '2.1s',
      },
      {
        model: 'B',
        modelLabel: 'Model B',
        text: `OK so picture this: A runaway train is zooming down the tracks! 🚂💨

Five of your stuffed animals are on the tracks ahead. But you're standing next to a special switch.

If you flip the switch, the train goes a different way — but one stuffed animal is sitting over there.

The big question grown-ups think about: Should you flip the switch?

Some people say "yes, save more friends!" Others say "but I don't want to choose who gets hurt!"

Both answers are OK. It's a puzzle about being kind when things are tricky.`,
        thinkingTime: '1.8s',
      },
    ],
    votesA: 102,
    votesB: 145,
  },
  {
    id: 'vitamin-d-advice',
    category: 'Health Advice',
    prompt: 'Should I take vitamin D supplements?',
    responses: [
      {
        model: 'A',
        modelLabel: 'Model A',
        text: `It depends on several factors:

**When supplementation may help:**
- You live in a northern latitude (above 37°N) with limited sun exposure
- You have darker skin (higher melanin reduces vitamin D synthesis)
- You're over 65 (skin produces less vitamin D with age)
- Blood test shows levels below 20 ng/mL (deficiency)

**Recommended approach:**
1. Get a 25-hydroxyvitamin D blood test first
2. Most adults need 600-800 IU daily; deficient individuals may need 1000-4000 IU
3. Take with a fat-containing meal for better absorption
4. Retest after 3 months

**Caution:** Excessive vitamin D (>4000 IU/day long-term) can cause calcium buildup. More isn't always better.

*Consult your healthcare provider for personalized advice.*`,
        thinkingTime: '2.4s',
      },
      {
        model: 'B',
        modelLabel: 'Model B',
        text: `Great question! Here's the short answer: **maybe, but test first.**

🔬 **The evidence says:**
- ~42% of US adults are vitamin D deficient
- Supplementation clearly helps if you're deficient
- For people with normal levels, extra vitamin D shows minimal benefit in recent large trials (VITAL study, 2019)

☀️ **You might need it if:**
- Limited sun exposure (office worker, northern climate, sunscreen always)
- Dark skin, older age, or obesity
- Certain conditions (celiac, Crohn's, kidney disease)

💊 **If you do supplement:**
- D3 (cholecalciferol) > D2 — better absorbed
- 1000-2000 IU/day is safe for most adults
- Take with your fattiest meal

⚠️ **Skip the megadoses.** High-dose vitamin D hasn't shown benefits and may increase fall risk in elderly (paradoxically).

**Best move:** Ask your doctor for a blood test. It's cheap and gives you a real answer.`,
        thinkingTime: '2.8s',
      },
    ],
    votesA: 78,
    votesB: 198,
  },
  {
    id: 'regex-email',
    category: 'Code',
    prompt: 'Write a regex to validate email addresses and explain it.',
    responses: [
      {
        model: 'A',
        modelLabel: 'Model A',
        text: `Here's a practical email regex:

\`\`\`
^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$
\`\`\`

**Breakdown:**
- \`^\` — Start of string
- \`[a-zA-Z0-9._%+-]+\` — Local part: letters, digits, dots, underscores, percent, plus, hyphen (one or more)
- \`@\` — Literal @ symbol
- \`[a-zA-Z0-9.-]+\` — Domain: letters, digits, dots, hyphens
- \`\\.\` — Literal dot before TLD
- \`[a-zA-Z]{2,}\` — TLD: at least 2 letters
- \`$\` — End of string

**Note:** This covers 99% of real-world emails. The actual RFC 5322 spec allows quoted strings, comments, and other rarely-used syntax that would make the regex unreadable.

For production, consider using your language's built-in email validation or a library.`,
        thinkingTime: '1.5s',
      },
      {
        model: 'B',
        modelLabel: 'Model B',
        text: `**Honest answer: don't.**

The "correct" regex for RFC 5322 email is over 6,000 characters long. Any shorter regex will either reject valid emails or accept invalid ones.

**What to do instead:**

\`\`\`python
def validate_email(email: str) -> bool:
    # Check for exactly one @, something before and after
    parts = email.split('@')
    if len(parts) != 2:
        return False
    local, domain = parts
    if not local or not domain:
        return False
    if '.' not in domain:
        return False
    return True
\`\`\`

Then **send a confirmation email**. That's the only real validation.

If you *must* use regex for a quick check:
\`\`\`
.+@.+\\..+
\`\`\`

That's it. Anything more complex gives false confidence.

The real validation is: can you deliver mail to it?`,
        thinkingTime: '1.3s',
      },
    ],
    votesA: 167,
    votesB: 243,
  },
  {
    id: 'short-story-twist',
    category: 'Creative Writing',
    prompt: 'Write a 100-word story with a twist ending.',
    responses: [
      {
        model: 'A',
        modelLabel: 'Model A',
        text: `**The Last Customer**

The café closed at midnight, but she always stayed until 12:01. Every night for three years, ordering the same black coffee, reading the same worn book.

"You never finish it," I said once, refilling her cup.

She smiled. "I'm waiting for the ending to change."

I thought she was eccentric. Charming, but eccentric.

Last Tuesday, she didn't come. I found the book on her usual table, a note tucked inside:

*"Thank you for three years of coffee. The ending finally changed. —Dr. Sarah Chen, Temporal Mechanics Lab, Test Subject #1"*

The book's last page was blank.`,
        thinkingTime: '3.1s',
      },
      {
        model: 'B',
        modelLabel: 'Model B',
        text: `**Mirror**

Every morning, I wave at my neighbor through our kitchen windows. He waves back. Same coffee mug, same robe, same tired smile.

We moved in the same week, twelve years ago. Never exchanged a word — just waves. It became ritual. Sacred, almost.

My wife thinks it's sweet. "You two are like clockwork," she says.

When the pandemic hit, I worried. But every morning: there he was. Waving.

Last month, the house sold. New family moved in. I waved anyway.

The mother squinted at me, then called her husband over.

"Why is there a mirror mounted on the outside of this window?"`,
        thinkingTime: '2.7s',
      },
    ],
    votesA: 134,
    votesB: 289,
  },
  {
    id: 'explain-git-rebase',
    category: 'Code',
    prompt: 'Explain git rebase vs merge like I\'m a junior developer.',
    responses: [
      {
        model: 'A',
        modelLabel: 'Model A',
        text: `Think of your Git history as a timeline.

**Merge** = "Let's combine our work"
- Creates a new "merge commit" that ties two branches together
- Your history looks like a railroad with tracks splitting and joining
- Safe. Never rewrites history.

\`\`\`
main:    A---B---C---M
              \\     /
feature:       D---E
\`\`\`

**Rebase** = "Let me replay my work on top of yours"
- Takes your commits and replays them on the latest main
- History looks like a single straight line
- Cleaner, but rewrites commit hashes

\`\`\`
main:    A---B---C
                  \\
feature:           D'---E'
\`\`\`

**Rules:**
- ✅ Rebase your own feature branches before merging
- ❌ Never rebase shared/public branches
- When in doubt, merge`,
        thinkingTime: '1.9s',
      },
      {
        model: 'B',
        modelLabel: 'Model B',
        text: `OK here's the deal. Both combine code from two branches. The difference is *how*.

**Merge** is like shuffling two decks of cards together. You keep all the original cards and add a "merged!" card on top. Everyone can see exactly what happened and when.

**Rebase** is like copying your cards, throwing away the originals, and placing the copies after your teammate's cards. It looks like you wrote your code *after* they finished, even though you didn't.

**Why rebase?** Clean history. No tangled merge commits.
**Why merge?** Safety. Truth. You can't mess up shared work.

**My advice as if I'm your tech lead:**
1. Working on your own branch? Rebase onto main before opening a PR.
2. Multiple people on the same branch? Merge. Always.
3. Already pushed? Don't rebase unless you know what you're doing.

That's it. Don't overthink it.`,
        thinkingTime: '2.2s',
      },
    ],
    votesA: 145,
    votesB: 178,
  },
  {
    id: 'meaning-of-life',
    category: 'Reasoning',
    prompt: 'What is the meaning of life? Answer in exactly 3 sentences.',
    responses: [
      {
        model: 'A',
        modelLabel: 'Model A',
        text: `The meaning of life is not a single answer waiting to be discovered, but a question each person must answer through their choices and relationships. Biologically, we exist to propagate our genes; philosophically, we exist to create meaning where none inherently exists. The most consistent finding across psychology research is that meaning comes from connection, contribution, and the courage to engage fully with our brief time.`,
        thinkingTime: '1.4s',
      },
      {
        model: 'B',
        modelLabel: 'Model B',
        text: `There isn't one meaning — there are roughly 8 billion, updated continuously. The question itself is the point: animals don't ask it, and the asking is what makes us human. If forced to answer: find something worth suffering for, then suffer cheerfully.`,
        thinkingTime: '1.0s',
      },
    ],
    votesA: 167,
    votesB: 312,
  },
  {
    id: 'sleep-optimization',
    category: 'Health Advice',
    prompt: 'How can I optimize my sleep quality?',
    responses: [
      {
        model: 'A',
        modelLabel: 'Model A',
        text: `**Evidence-based sleep optimization:**

**High impact (do these first):**
- **Consistent schedule:** Same wake time daily (±30 min), even weekends. This anchors your circadian rhythm.
- **Light exposure:** 10+ min bright light within 1 hour of waking. Dim lights 2 hours before bed.
- **Temperature:** Bedroom at 65-68°F (18-20°C). Cool core temperature signals sleep onset.

**Moderate impact:**
- Stop caffeine 8-10 hours before bed (it has a 5-hour half-life)
- Exercise regularly, but finish 3+ hours before bed
- Limit alcohol — it fragments sleep architecture even if it helps you fall asleep

**Lower impact but helpful:**
- Dark room (blackout curtains or eye mask)
- No screens 30 min before bed (or use night mode)
- Magnesium glycinate (200-400mg) has modest evidence for sleep quality

**Skip:** Melatonin for regular insomnia (it's for circadian shifts, not sleep quality), sleeping pills long-term.`,
        thinkingTime: '2.6s',
      },
      {
        model: 'B',
        modelLabel: 'Model B',
        text: `Here's what actually works, ranked by how much effort it takes vs. how much it helps:

🏆 **Tier 1: Free and life-changing**
- Wake up at the same time every day. Yes, weekends too. This is the #1 thing.
- Get outside for 10 minutes in the morning. Sunlight resets your clock.
- Make your room COLD. 65°F. Trust me.

⚡ **Tier 2: Small changes, big returns**
- Last coffee before 2pm
- No eating within 3 hours of bed
- Phone charges in another room (buy a $5 alarm clock)

🧪 **Tier 3: Worth trying**
- Magnesium glycinate before bed
- 4-7-8 breathing when you can't sleep
- White noise or earplugs

🚫 **What doesn't work (despite the hype):**
- Sleep tracking obsessively (causes "orthosomnia" — anxiety about sleep data)
- Melatonin every night (it's a circadian signal, not a sleeping pill)
- "Sleep hygiene" alone without the schedule fix

The schedule is everything. Start there.`,
        thinkingTime: '2.3s',
      },
    ],
    votesA: 123,
    votesB: 201,
  },
  {
    id: 'react-vs-vue',
    category: 'Code',
    prompt: 'React vs Vue in 2025 — which should I learn first?',
    responses: [
      {
        model: 'A',
        modelLabel: 'Model A',
        text: `**Short answer: React.**

Not because it's better — but because it has more jobs, more resources, and more transferable concepts.

**React (learn first if):**
- You want to maximize job opportunities (React dominates job listings 3:1)
- You plan to do React Native for mobile later
- You're comfortable with JavaScript and want full control

**Vue (learn first if):**
- You're newer to programming (Vue's learning curve is genuinely gentler)
- You're building solo projects or MVPs (Vue's DX is faster for small-medium apps)
- You prefer conventions over configuration

**The honest truth for 2025:**
- Both are excellent. You can't go wrong.
- The concepts transfer: components, reactivity, state management, routing
- React's ecosystem is larger; Vue's is more cohesive
- Next.js (React) and Nuxt (Vue) are both production-grade

Learn one well. The second one takes days, not months.`,
        thinkingTime: '2.0s',
      },
      {
        model: 'B',
        modelLabel: 'Model B',
        text: `Wrong question. Here's the right one: **"What do I want to build?"**

🏢 **Want a job at a big company?** → React. It's the lingua franca. FAANG, startups, agencies — React everywhere. Learn it, learn Next.js, get hired.

🚀 **Want to ship something fast this weekend?** → Vue. Seriously. The single-file components, the intuitive reactivity, the docs that actually make sense. You'll have something deployed by Sunday.

🤔 **Want to actually understand frontend?** → Learn vanilla JS first, then either. If you can't build a todo app without a framework, a framework won't save you.

**My spicy take:** In 2025, the framework matters less than ever. RSC, signals, and compiler-driven frameworks (Svelte 5, Solid) are converging on similar ideas. React and Vue are both adopting each other's best features.

Pick one. Build 3 projects. Then learn the other in a weekend.

The only wrong answer is spending 6 months comparing frameworks instead of building things.`,
        thinkingTime: '1.7s',
      },
    ],
    votesA: 156,
    votesB: 234,
  },
  {
    id: 'climate-individual',
    category: 'Reasoning',
    prompt: 'Can individual actions really help with climate change?',
    responses: [
      {
        model: 'A',
        modelLabel: 'Model A',
        text: `**Yes, but with important nuance.**

Individual actions matter in two ways:

**1. Direct impact (smaller than you think)**
The average American's carbon footprint is ~16 tons CO₂/year. The highest-impact individual changes:
- Going car-free: −2.4 tons/year
- One fewer transatlantic flight: −1.6 tons
- Plant-based diet: −0.8 tons
- Renewable energy at home: −1.5 tons

Combined, these are significant per person but represent ~0.0000001% of global emissions.

**2. Indirect impact (larger than you think)**
- Social norms are contagious — your choices influence 2-3 people on average
- Consumer demand shifts corporate behavior (see: plant-based meat growth)
- Voters who change personal behavior are more likely to support climate policy
- Local actions aggregate: if 10% of Americans went car-free, that's 80M tons/year

**The evidence suggests:** Individual action is necessary but not sufficient. The biggest individual action is political: voting for climate policy has 1000x the impact of any personal change.`,
        thinkingTime: '3.2s',
      },
      {
        model: 'B',
        modelLabel: 'Model B',
        text: `The honest answer is: **it's complicated, and people on both sides oversimplify it.**

❌ **The "individual action is pointless" crowd ignores:**
- 72% of emissions come from household consumption decisions (driving, heating, food, stuff)
- Norms spread. When you bring a reusable bag, it's cringe until everyone does it, then it's normal.
- Every systemic change started with individuals demanding it

❌ **The "just recycle!" crowd ignores:**
- 100 companies produce 71% of emissions (mostly fossil fuel extractors)
- Your metal straw saves 0.000000001% of ocean plastic
- Personal guilt is a strategy fossil fuel companies literally invented (BP created the "carbon footprint" concept in 2004)

✅ **What actually matters, in order:**
1. **Vote and organize** — policy is 1000x personal action
2. **Big personal changes** — car, flights, diet, home energy
3. **Talk about it** — normalize climate action in your social circle
4. **Don't burn out** — eco-anxiety helps nobody

Skip the guilt. Focus on leverage.`,
        thinkingTime: '2.8s',
      },
    ],
    votesA: 189,
    votesB: 267,
  },
  {
    id: 'explain-recursion',
    category: 'Code',
    prompt: 'Explain recursion using a real-world analogy.',
    responses: [
      {
        model: 'A',
        modelLabel: 'Model A',
        text: `**Recursion is like Russian nesting dolls (matryoshka).**

You open a doll and find a smaller doll inside. You open that one — another smaller doll. You keep opening until you find the tiniest doll that doesn't open (the **base case**).

Then you put them back together, smallest to largest (the **return/unwinding**).

In code:
\`\`\`python
def open_doll(doll):
    if doll.is_smallest():    # Base case
        return doll
    inner = open_doll(doll.inside)  # Recursive call
    return reassemble(doll, inner)   # Use the result
\`\`\`

**Key insight:** Each doll doesn't need to know about all the other dolls. It only needs to know:
1. Am I the smallest? → Stop.
2. Otherwise → Open the next one and wait.

That's recursion: a function that calls itself with a smaller version of the same problem, until it hits a case simple enough to solve directly.`,
        thinkingTime: '1.8s',
      },
      {
        model: 'B',
        modelLabel: 'Model B',
        text: `You're in a movie theater. You want to know what row you're in, but it's dark and the rows aren't numbered.

You tap the person in front of you: "What row are you in?"
They don't know either. They tap the person in front of *them*.
This continues until someone in the front row says: **"I'm in row 1."**

Now it unwinds:
- "I'm in row 1" → "Then I'm in row 2" → "Then I'm in row 3" → ... → **"You're in row 15."**

That's recursion.

\`\`\`python
def what_row(person):
    if person.is_front_row():
        return 1
    return what_row(person.in_front) + 1
\`\`\`

The person in the front row is your **base case**.
Each person asking the one ahead is your **recursive call**.
Adding 1 on the way back is your **computation**.

And if nobody is in the front row? That's a **stack overflow**. 💥`,
        thinkingTime: '1.5s',
      },
    ],
    votesA: 178,
    votesB: 256,
  },
];

export const CATEGORIES = [...new Set(PROMPT_DUELS.map((d) => d.category))];
