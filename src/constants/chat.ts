export const CHAT_BOT_WELCOME_MESSAGE =
    "Hey! I'm an AI built to answer questions about Adam — his career, projects, tech stack, and what gets him fired up. What do you want to know?";

// Groups: 0 = Recruiter, 1 = Engineer, 2 = Manager
export const INIT_PROMPT_CHOICES = [
    // Group A — Recruiter
    "Is Adam open to new roles?",
    "What's Adam's experience level?",
    "What industries has Adam worked in?",
    "Does Adam work remote?",

    // Group B — Engineer
    "How does Adam approach system design?",
    "What's Adam's take on AI in production?",
    "What's the hardest technical problem Adam has solved?",
    "How does Adam handle security in his work?",

    // Group C — Manager
    "How does Adam work on a team?",
    "Has Adam led projects end-to-end?",
    "What kind of problems does Adam own?",
    "What's Adam been building lately?",
];
