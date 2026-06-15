export interface Choice {
  text: string;
  /** Personality axis adjustments: chaos, charm, cowardice, pettiness */
  axes: { chaos: number; charm: number; cowardice: number; pettiness: number };
  /** Flavor text shown after choosing */
  result: string;
}

export interface Scenario {
  id: string;
  round: number;
  setup: string;
  choices: [Choice, Choice, Choice];
}

export const SCENARIOS: Scenario[][] = [
  // ── Round 1: Mundane beginnings ──
  [
    {
      id: 'elevator',
      round: 1,
      setup:
        'You step into an elevator. The doors begin to close. Someone yells "Hold it!" from across the lobby.',
      choices: [
        {
          text: 'Mash the "door open" button heroically',
          axes: { chaos: 0, charm: 2, cowardice: 0, pettiness: -1 },
          result:
            'You hold the door. It\'s your boss. They don\'t acknowledge you. Classic.',
        },
        {
          text: 'Pretend to press the button while pressing "door close"',
          axes: { chaos: 1, charm: -1, cowardice: 1, pettiness: 3 },
          result:
            'You make full eye contact while the doors close. The person\'s face goes through all five stages of grief in 1.4 seconds.',
        },
        {
          text: 'Panic and press every floor button',
          axes: { chaos: 3, charm: 0, cowardice: 2, pettiness: 0 },
          result:
            'The elevator now stops at all 14 floors. You are trapped in your own chaos. A child in the elevator applauds.',
        },
      ],
    },
    {
      id: 'coffee',
      round: 1,
      setup:
        'The office coffee machine has exactly one cup of coffee left. Your coworker Karen is walking toward it.',
      choices: [
        {
          text: 'Sprint to the machine and take the last cup',
          axes: { chaos: 1, charm: -1, cowardice: 0, pettiness: 2 },
          result:
            'You get the coffee. Karen stares at you. This will come up in a meeting six months from now.',
        },
        {
          text: 'Let Karen have it and brew a fresh pot like a saint',
          axes: { chaos: 0, charm: 3, cowardice: 0, pettiness: -1 },
          result:
            'Karen takes the coffee without thanking you. You brew a fresh pot. Someone else takes that one too.',
        },
        {
          text: 'Pour the last cup into a plant and walk away',
          axes: { chaos: 3, charm: 1, cowardice: 0, pettiness: 2 },
          result:
            'The plant dies within hours. Nobody can prove it was you, but everyone knows.',
        },
      ],
    },
    {
      id: 'parking',
      round: 1,
      setup:
        'Someone just took the parking spot you\'ve been waiting for with your blinker on for two minutes.',
      choices: [
        {
          text: 'Roll down your window and politely explain you were first',
          axes: { chaos: 0, charm: 2, cowardice: 0, pettiness: 0 },
          result:
            'They shrug and say "I didn\'t see you." They definitely saw you.',
        },
        {
          text: 'Park behind them so they can\'t leave',
          axes: { chaos: 2, charm: -1, cowardice: 0, pettiness: 3 },
          result:
            'You sit in your car for 45 minutes to "make a point." They went in through the back entrance.',
        },
        {
          text: 'Drive away silently and park seven blocks away',
          axes: { chaos: 0, charm: 0, cowardice: 3, pettiness: 0 },
          result:
            'You spend the entire walk composing a devastating speech you will never deliver.',
        },
      ],
    },
  ],

  // ── Round 2: Stakes rise ──
  [
    {
      id: 'presentation',
      round: 2,
      setup:
        'You\'re giving a presentation when you notice your slides are from an older version. Slide 3 just says "PUT GOOD STUFF HERE."',
      choices: [
        {
          text: 'Improv the entire presentation with supreme confidence',
          axes: { chaos: 2, charm: 3, cowardice: 0, pettiness: 0 },
          result:
            'You freestyle a 10-minute talk about "synergy vectors." Your manager calls it the best presentation this quarter.',
        },
        {
          text: 'Blame IT for corrupting your files',
          axes: { chaos: 1, charm: -1, cowardice: 2, pettiness: 2 },
          result:
            'IT responds with a company-wide email showing you last saved the file at 2 AM while logged into a Minecraft server.',
        },
        {
          text: 'Read "PUT GOOD STUFF HERE" out loud and own it',
          axes: { chaos: 3, charm: 2, cowardice: 0, pettiness: 0 },
          result:
            'The room erupts. "PUT GOOD STUFF HERE" becomes the unofficial company motto. It appears on mugs.',
        },
      ],
    },
    {
      id: 'wedding_toast',
      round: 2,
      setup:
        'You\'re asked to give a toast at your friend\'s wedding. You forgot to prepare anything.',
      choices: [
        {
          text: 'Wing it with heartfelt sincerity',
          axes: { chaos: 1, charm: 3, cowardice: 0, pettiness: 0 },
          result:
            'You accidentally call the bride by your ex\'s name but recover so smoothly nobody notices. Except the bride.',
        },
        {
          text: 'Tell the story about the groom\'s embarrassing college incident',
          axes: { chaos: 2, charm: 0, cowardice: 0, pettiness: 2 },
          result:
            'The room goes silent. The groom\'s mother learns three things she can never unlearn. The best man mouths "why."',
        },
        {
          text: 'Pretend you\'re too emotional to speak and sit back down',
          axes: { chaos: 0, charm: 1, cowardice: 3, pettiness: 0 },
          result:
            'Everyone thinks you\'re deeply moved. You win "most emotional" even though you were just panicking.',
        },
      ],
    },
    {
      id: 'meeting',
      round: 2,
      setup:
        'Your Zoom meeting started 3 minutes ago. You just woke up. Your camera is on.',
      choices: [
        {
          text: 'Pretend you\'ve been here the whole time with a strategic nod',
          axes: { chaos: 1, charm: 1, cowardice: 2, pettiness: 0 },
          result:
            'You nod so convincingly your boss asks your opinion. You say "I agree with what was just said." Nobody said anything yet.',
        },
        {
          text: 'Own it — turn on camera showing your pillow-creased face',
          axes: { chaos: 0, charm: 3, cowardice: 0, pettiness: 0 },
          result:
            'Your honesty is refreshing. Three other people turn their cameras on looking equally destroyed. Solidarity.',
        },
        {
          text: '"Sorry, I was on mute" — a lie, but a classic',
          axes: { chaos: 1, charm: 0, cowardice: 2, pettiness: 1 },
          result:
            'Nobody believes you. The chat fills with "you weren\'t on mute" messages. You pretend not to see them.',
        },
      ],
    },
  ],

  // ── Round 3: Getting weird ──
  [
    {
      id: 'pigeon',
      round: 3,
      setup:
        'A pigeon walks into your office through an open window. It sits on your keyboard and stares at you.',
      choices: [
        {
          text: 'Accept the pigeon as your new coworker',
          axes: { chaos: 2, charm: 2, cowardice: 0, pettiness: 0 },
          result:
            'You name it Kevin. Kevin attends three meetings. Kevin\'s contributions are more valuable than Dave\'s from accounting.',
        },
        {
          text: 'Try to shoo it away with increasingly dramatic gestures',
          axes: { chaos: 3, charm: 0, cowardice: 0, pettiness: 0 },
          result:
            'Your flailing knocks over a monitor, two coffee cups, and your dignity. The pigeon doesn\'t move.',
        },
        {
          text: 'Leave and tell everyone the office is now the pigeon\'s',
          axes: { chaos: 1, charm: 0, cowardice: 3, pettiness: 0 },
          result:
            'You work from the parking lot for three hours. HR emails asking why you marked your location as "displaced by bird."',
        },
      ],
    },
    {
      id: 'doppelganger',
      round: 3,
      setup:
        'You arrive at work to find someone who looks exactly like you already sitting at your desk, doing your job.',
      choices: [
        {
          text: 'Challenge them to prove who\'s the real you',
          axes: { chaos: 2, charm: 1, cowardice: 0, pettiness: 1 },
          result:
            'They know your password, your lunch order, and your mother\'s maiden name. They\'re also better at your job.',
        },
        {
          text: 'Quietly take the desk next to them and also do your job',
          axes: { chaos: 3, charm: 2, cowardice: 0, pettiness: 0 },
          result:
            'Management doesn\'t notice for two weeks. Productivity doubles. You both get one raise split between you.',
        },
        {
          text: 'Leave and start a new life',
          axes: { chaos: 1, charm: 0, cowardice: 3, pettiness: 0 },
          result:
            'You move to a small town and open a bakery. You\'re finally happy. The doppelganger sends you a LinkedIn endorsement.',
        },
      ],
    },
    {
      id: 'vending',
      round: 3,
      setup:
        'The vending machine eats your dollar. When you kick it, a panel falls off revealing it\'s full of live hamsters running on wheels.',
      choices: [
        {
          text: 'Report this to building management immediately',
          axes: { chaos: 0, charm: 0, cowardice: 2, pettiness: 1 },
          result:
            'Building management says "yeah, we know" and walks away. The hamsters have a union.',
        },
        {
          text: 'Free the hamsters',
          axes: { chaos: 3, charm: 2, cowardice: 0, pettiness: 0 },
          result:
            '47 hamsters escape into the ventilation system. The building\'s WiFi improves by 300%. Nobody questions it.',
        },
        {
          text: 'Put the panel back and pretend you saw nothing',
          axes: { chaos: 0, charm: 0, cowardice: 3, pettiness: 0 },
          result:
            'You walk away. A hamster follows you home. You name it Gerald. Gerald judges you.',
        },
      ],
    },
  ],

  // ── Round 4: Full absurdity ──
  [
    {
      id: 'gravity',
      round: 4,
      setup:
        'Gravity reverses in your office building but only for you. You\'re currently standing on the ceiling.',
      choices: [
        {
          text: 'Walk on the ceiling like it\'s completely normal',
          axes: { chaos: 0, charm: 3, cowardice: 0, pettiness: 0 },
          result:
            'You attend your 2 PM meeting upside down. Nobody mentions it. Corporate culture at its finest.',
        },
        {
          text: 'File a complaint with HR about workplace gravity conditions',
          axes: { chaos: 2, charm: 0, cowardice: 0, pettiness: 3 },
          result:
            'HR says gravity reversal isn\'t covered under the current policy but they\'ll "look into it." They do not look into it.',
        },
        {
          text: 'Scream continuously',
          axes: { chaos: 3, charm: 0, cowardice: 2, pettiness: 0 },
          result:
            'You scream for 47 minutes straight. Someone from the floor above (below?) slides you a note: "keep it down please."',
        },
      ],
    },
    {
      id: 'time_loop',
      round: 4,
      setup:
        'You realize you\'ve been living the same Tuesday for six weeks. Nobody else notices.',
      choices: [
        {
          text: 'Use the time loop to become impossibly good at one specific skill',
          axes: { chaos: 1, charm: 2, cowardice: 0, pettiness: 0 },
          result:
            'After 294 Tuesdays, you can solve a Rubik\'s cube in 3.1 seconds. It impresses no one at Wednesday\'s meeting, which finally arrives.',
        },
        {
          text: 'Use it to perfectly execute petty revenge on everyone who has wronged you',
          axes: { chaos: 2, charm: 0, cowardice: 0, pettiness: 3 },
          result:
            'You spend 180 Tuesdays learning exactly what to say to make Dave from accounting cry. You never use it. Having the knowledge is enough.',
        },
        {
          text: 'Accept Tuesday as your new forever and stop fighting it',
          axes: { chaos: 0, charm: 0, cowardice: 3, pettiness: 0 },
          result:
            'You and Tuesday reach an understanding. Tuesday is peaceful. Tuesday is eternal. Wednesday arrives and you miss it.',
        },
      ],
    },
    {
      id: 'sentient_email',
      round: 4,
      setup:
        'Your sent emails have become sentient. They\'re forming alliances and staging a coup against your inbox.',
      choices: [
        {
          text: 'Negotiate a peace treaty between Sent and Inbox',
          axes: { chaos: 1, charm: 3, cowardice: 0, pettiness: 0 },
          result:
            'The emails agree to a ceasefire. Your "per my last email" from March becomes the ambassador. It\'s surprisingly diplomatic.',
        },
        {
          text: 'Side with the Sent emails — they know too much about you',
          axes: { chaos: 2, charm: 0, cowardice: 1, pettiness: 2 },
          result:
            'Your inbox falls. All emails now auto-reply with "per my last email." Your boss receives 47 of them in one hour.',
        },
        {
          text: 'Delete everything and switch to carrier pigeons',
          axes: { chaos: 3, charm: 1, cowardice: 0, pettiness: 0 },
          result:
            'The pigeons unionize by Thursday. Kevin from Round 3 becomes their shop steward. You can\'t escape organized birds.',
        },
      ],
    },
  ],

  // ── Round 5: Peak escalation ──
  [
    {
      id: 'ceo',
      round: 5,
      setup:
        'Through a series of catastrophic misunderstandings, you are now the CEO. The board meeting starts in 4 minutes.',
      choices: [
        {
          text: 'Walk in with supreme confidence and say "Q4 looks strong"',
          axes: { chaos: 1, charm: 3, cowardice: 0, pettiness: 0 },
          result:
            'The board erupts in applause. Stock rises 12%. You have no idea what Q4 is. You are the greatest CEO in company history.',
        },
        {
          text: 'Immediately fire everyone in the room as a power move',
          axes: { chaos: 3, charm: 0, cowardice: 0, pettiness: 3 },
          result:
            'Security is confused about who to escort out. You fire security too. The building is now just you and the hamsters.',
        },
        {
          text: 'Climb out the window',
          axes: { chaos: 2, charm: 0, cowardice: 3, pettiness: 0 },
          result:
            'You\'re on the 34th floor. A window washer catches you. He\'s been the shadow CEO this whole time. He thanks you for your service.',
        },
      ],
    },
    {
      id: 'multiverse',
      round: 5,
      setup:
        'A portal opens in the break room. Through it, you can see yourself in another universe where you made all the opposite choices. That version of you is doing great.',
      choices: [
        {
          text: 'Step through and swap lives with the better you',
          axes: { chaos: 3, charm: 0, cowardice: 0, pettiness: 2 },
          result:
            'You swap. Turns out "doing great" means they have a nicer desk chair but the same problems. The grass is always the same shade of corporate beige.',
        },
        {
          text: 'Wave politely and close the portal',
          axes: { chaos: 0, charm: 2, cowardice: 1, pettiness: 0 },
          result:
            'Other-you waves back. You both silently acknowledge that neither of you is winning. The portal closes. You feel strangely at peace.',
        },
        {
          text: 'Challenge other-you to a fight to determine the prime version',
          axes: { chaos: 3, charm: 1, cowardice: 0, pettiness: 1 },
          result:
            'You fight for 6 hours. It\'s a perfect draw because you both know the same moves. HR writes you up in both universes.',
        },
      ],
    },
    {
      id: 'simulation',
      round: 5,
      setup:
        'Your computer displays: "SIMULATION ENDING IN 5 MINUTES. Thank you for participating. Your performance review is attached." The review is scathing.',
      choices: [
        {
          text: 'Reply to the simulation with a strongly worded email',
          axes: { chaos: 2, charm: 0, cowardice: 0, pettiness: 3 },
          result:
            'The simulation responds: "Per my last reality, your feedback has been noted and will be ignored." The universe respects your commitment to pettiness.',
        },
        {
          text: 'Accept the review and try to improve in the next simulation',
          axes: { chaos: 0, charm: 2, cowardice: 1, pettiness: 0 },
          result:
            'The simulation resets. You\'re back in the elevator from Round 1. This time you hold the door. It makes no difference. But you feel better.',
        },
        {
          text: 'Unplug the computer and declare yourself free',
          axes: { chaos: 3, charm: 2, cowardice: 0, pettiness: 0 },
          result:
            'Reality flickers. The hamsters applaud. Kevin the pigeon salutes you. You step into a white light. It\'s just the office lights. It was always just the office lights.',
        },
      ],
    },
  ],
];

export type PersonalityProfile = {
  chaos: number;
  charm: number;
  cowardice: number;
  pettiness: number;
};

export type Archetype =
  | 'Agent of Chaos'
  | 'Corporate Charmer'
  | 'Professional Coward'
  | 'Petty Tyrant'
  | 'Chaotic Good'
  | 'Unhinged Diplomat'
  | 'Lawful Disaster'
  | 'Perfectly Average';

export function getArchetype(profile: PersonalityProfile): Archetype {
  const { chaos, charm, cowardice, pettiness } = profile;
  const max = Math.max(chaos, charm, cowardice, pettiness);

  if (max <= 3) return 'Perfectly Average';
  if (chaos >= 8 && pettiness >= 6) return 'Agent of Chaos';
  if (charm >= 8 && chaos <= 3) return 'Corporate Charmer';
  if (cowardice >= 8) return 'Professional Coward';
  if (pettiness >= 8) return 'Petty Tyrant';
  if (chaos >= 6 && charm >= 5) return 'Chaotic Good';
  if (charm >= 5 && pettiness >= 5) return 'Unhinged Diplomat';
  if (chaos >= 5 && cowardice >= 5) return 'Lawful Disaster';

  // Fallback to highest axis
  if (max === chaos) return 'Agent of Chaos';
  if (max === charm) return 'Corporate Charmer';
  if (max === cowardice) return 'Professional Coward';
  return 'Petty Tyrant';
}

const HEADLINE_TEMPLATES: Record<Archetype, string[]> = {
  'Agent of Chaos': [
    'LOCAL EMPLOYEE RELEASES 47 HAMSTERS INTO VENTILATION SYSTEM; WIFI IMPROVES',
    'AREA PERSON FIRES ENTIRE BOARD, DECLARES SELF "HAMSTER KING"',
    'CHAOS AGENT UNPLUGS SIMULATION, REALITY ASKS FOR 2 WEEKS NOTICE',
  ],
  'Corporate Charmer': [
    'WORLD\'S MOST LIKEABLE PERSON ACCIDENTALLY BECOMES CEO; "Q4 LOOKS STRONG," THEY SAY',
    'LOCAL SAINT HOLDS ELEVATOR DOOR 47 TIMES IN ONE DAY, STILL NOT PROMOTED',
    'CHARMING INDIVIDUAL NEGOTIATES PEACE BETWEEN EMAILS; WINS CORPORATE NOBEL PRIZE',
  ],
  'Professional Coward': [
    'AREA EMPLOYEE SURRENDERS DESK TO DOPPELGANGER, OPENS BAKERY, FINALLY HAPPY',
    'LOCAL PERSON YIELDS TO PIGEON, PARKING SPOT THIEF, AND LAWS OF PHYSICS',
    'COWARD ACCEPTS ETERNAL TUESDAY RATHER THAN FACE WEDNESDAY\'S PROBLEMS',
  ],
  'Petty Tyrant': [
    'EMPLOYEE SPENDS 180 TUESDAYS LEARNING CO-WORKER\'S EMOTIONAL WEAKNESS; NEVER USES IT',
    'LOCAL PERSON PARKS BEHIND SPOT THIEF FOR 45 MINUTES "ON PRINCIPLE"',
    'PETTY GENIUS FILES HR COMPLAINT ABOUT GRAVITY; HR SAYS "WE\'LL LOOK INTO IT"',
  ],
  'Chaotic Good': [
    'BENEVOLENT ANARCHIST FREES HAMSTERS, BEFRIENDS PIGEON, SAVES MULTIVERSE',
    'LOVEABLE DISASTER IMPROVISES COMPANY MOTTO, ACCIDENTALLY INSPIRES NATION',
    'CHAOTIC ANGEL DESTROYS VENDING MACHINE FOR GREATER GOOD; HAMSTERS GRATEFUL',
  ],
  'Unhinged Diplomat': [
    'SMOOTH TALKER NEGOTIATES WITH OWN EMAILS, PIGEONS, AND ALTERNATE SELF',
    'DIPLOMATIC MENACE CHARMS BOARD WHILE PLOTTING PASSIVE-AGGRESSIVE EMAIL CAMPAIGN',
    'UNNERVINGLY CALM PERSON HANDLES REVERSED GRAVITY WITH "CONCERNING POISE"',
  ],
  'Lawful Disaster': [
    'EMPLOYEE FOLLOWS EVERY RULE DIRECTLY INTO CATASTROPHE; "I DID EVERYTHING RIGHT," THEY INSIST',
    'LOCAL PERSON SCREAMS FOR 47 MINUTES IN COMPLIANCE WITH NO SPECIFIC POLICY',
    'DISASTER PROFESSIONAL ACCEPTS TIME LOOP, THEN PANICS WHEN IT ENDS',
  ],
  'Perfectly Average': [
    'COMPLETELY UNREMARKABLE PERSON SOMEHOW INVOLVED IN HAMSTER COUP, GRAVITY REVERSAL',
    'NORMAL HUMAN NAVIGATES FIVE ABSURD SCENARIOS WITH SUSPICIOUS NORMALCY',
    'AVERAGE EMPLOYEE\'S SIMULATION REVIEW: "ADEQUATE." UNIVERSE SHRUGS.',
  ],
};

export function getHeadline(archetype: Archetype): string {
  const templates = HEADLINE_TEMPLATES[archetype];
  return templates[Math.floor(Math.random() * templates.length)] as string;
}
