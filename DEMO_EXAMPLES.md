# Function Calling Demo Examples

This document shows example conversations demonstrating each of the 5 function calling tools.

---

## Example 1: Blog Search

**User Query:**
> "What has Adam written about React?"

**AI Response:**
> I found several blog posts Adam has written about React! Here are some highlights:
> 
> **1. Building Scalable React Applications** (Published: January 15, 2024)
> - A comprehensive guide to architecture patterns for large-scale React applications
> - Tags: react, architecture, performance, frontend
> - [Read the full post →](/blog/abc-123)
> 
> **2. React Hooks: Best Practices and Common Pitfalls** (Published: March 22, 2023)
> - Practical tips for using hooks effectively and avoiding common mistakes
> - Tags: react, hooks, javascript, best-practices
> - [Read the full post →](/blog/def-456)
> 
> **3. State Management in React: A Comprehensive Guide** (Published: November 8, 2023)
> - Comparing different state management solutions for React applications
> - Tags: react, redux, zustand, state-management
> - [Read the full post →](/blog/ghi-789)
> 
> Would you like to know more about any specific post?

**Tool Called:** `searchBlog(query: "react", limit: 5)`

---

## Example 2: Book Recommendations

**User Query:**
> "Can you recommend some books Adam has read?"

**AI Response:**
> Absolutely! Here are some books from Adam's reading list:
> 
> **1. "Designing Data-Intensive Applications"** by Martin Kleppmann
> - A comprehensive guide to building scalable and maintainable systems
> - [View on Amazon →](https://amazon.com/...)
> 
> **2. "The Pragmatic Programmer"** by David Thomas and Andrew Hunt
> - Essential reading for software engineers at any level
> - [View on Amazon →](https://amazon.com/...)
> 
> **3. "Clean Code"** by Robert C. Martin
> - Learn to write code that's easy to read and maintain
> - [View on Amazon →](https://amazon.com/...)
> 
> **4. "System Design Interview"** by Alex Xu
> - Prepare for system design interviews with real-world examples
> - [View on Amazon →](https://amazon.com/...)
> 
> **5. "Atomic Habits"** by James Clear
> - Build better habits and break bad ones
> - [View on Amazon →](https://amazon.com/...)
> 
> These books cover software engineering, system design, and personal development. Would you like recommendations in a specific area?

**Tool Called:** `getBooks(limit: 5)`

---

## Example 3: Bookmark Search

**User Query:**
> "Do you have any resources about TypeScript?"

**AI Response:**
> Yes! Adam has curated several great TypeScript resources. Here are some of his favorites:
> 
> **1. TypeScript Deep Dive**
> - Comprehensive online book covering TypeScript from basics to advanced concepts
> - Tags: typescript, documentation, learning
> - [Visit resource →](https://basarat.gitbook.io/typescript/)
> 
> **2. Total TypeScript by Matt Pocock**
> - Interactive TypeScript challenges and tutorials
> - Tags: typescript, tutorial, interactive
> - [Visit resource →](https://www.totaltypescript.com/)
> 
> **3. TypeScript Playground**
> - Official playground for experimenting with TypeScript
> - Tags: typescript, tools, playground
> - [Visit resource →](https://www.typescriptlang.org/play)
> 
> **4. DefinitelyTyped**
> - Repository of high-quality TypeScript type definitions
> - Tags: typescript, types, npm
> - [Visit resource →](https://github.com/DefinitelyTyped/DefinitelyTyped)
> 
> These resources range from learning materials to practical tools. Is there a specific aspect of TypeScript you're interested in?

**Tool Called:** `searchBookmarks(query: "typescript", limit: 5)`

---

## Example 4: Career Timeline Query

**User Query:**
> "Where did Adam work in 2021?"

**AI Response:**
> In 2021, Adam had a busy year with multiple positions:
> 
> **Schneider Electric** - Software Designer - Co-op
> - Duration: January 2021 - September 2021
> - This was Adam's longest co-op term, where he worked as a software designer
> 
> **Assembly Digital Media** - Full-stack Software Developer Co-op
> - Duration: September 2021 - December 2021
> - Adam joined Assembly as a co-op developer in the fall of 2021
> 
> These co-op positions were part of Adam's Software Engineering degree program at the University of Victoria, where he gained valuable real-world experience in software development.

**Tool Called:** `queryCareerTimeline(query: "2021")`

---

## Example 5: Current Date/Time

**User Query:**
> "What day is it today?"

**AI Response:**
> Today is **Saturday, March 1, 2026** at **8:30 AM PST**.
> 
> It's the first day of March! Is there anything specific you'd like to know about dates or scheduling?

**Tool Called:** `getCurrentDateTime()`

---

## Example 6: Multi-Tool Usage

**User Query:**
> "What did Adam do in 2021 and does he have any blog posts from that period?"

**AI Response:**
> Great question! Let me tell you about Adam's activities in 2021:
> 
> ### Career in 2021
> 
> Adam had two co-op positions in 2021:
> 
> **Schneider Electric** - Software Designer - Co-op (January - September 2021)
> - Adam spent most of 2021 working at Schneider Electric, a global leader in energy management and automation
> 
> **Assembly Digital Media** - Full-stack Software Developer Co-op (September - December 2021)
> - In the fall, Adam joined Assembly Digital Media as a full-stack developer
> 
> ### Blog Posts from 2021
> 
> While Adam was quite busy with his co-op positions, he did publish a few technical posts:
> 
> **1. "Lessons from My First Year of Co-op Experience"** (Published: December 2021)
> - Reflections on what Adam learned during his co-op terms
> - Tags: career, co-op, software-engineering
> - [Read more →](/blog/xyz-123)
> 
> **2. "Building Scalable APIs: Lessons from Production"** (Published: October 2021)
> - Insights gained from building production systems
> - Tags: api, architecture, backend
> - [Read more →](/blog/uvw-456)
> 
> It was a transformative year for Adam, balancing hands-on industry experience with sharing knowledge through his blog!

**Tools Called:**
1. `queryCareerTimeline(query: "2021")`
2. `searchBlog(query: "2021", limit: 5)`

---

## Key Features Demonstrated

✅ **Natural Language** - Responses flow naturally, tool usage is invisible
✅ **Rich Formatting** - Proper markdown, links, and structure
✅ **Context Awareness** - AI understands what information is relevant
✅ **Multi-Step Reasoning** - Combines multiple tools for complex answers
✅ **Follow-up Prompts** - Suggests related questions to keep conversation going
✅ **Error Handling** - Graceful responses when data isn't available

---

## Mobile Experience

On mobile devices, responses are automatically shortened:

**User Query (Mobile):**
> "What has Adam written about React?"

**AI Response (Mobile):**
> Found 3 React posts:
> 
> • **Scalable React Apps** (Jan 2024)
>   Architecture patterns
>   [Read →](/blog/abc-123)
> 
> • **React Hooks Guide** (Mar 2023)
>   Best practices & pitfalls
>   [Read →](/blog/def-456)
> 
> • **State Management** (Nov 2023)
>   Comparing solutions
>   [Read →](/blog/ghi-789)
> 
> Want details on any?

**Note:** Mobile responses use:
- Bullet points instead of numbered lists
- Shorter descriptions
- Compressed formatting
- Concise language

---

## Error Handling Examples

### When No Results Found

**User Query:**
> "Show me blog posts about COBOL"

**AI Response:**
> I searched Adam's blog posts but didn't find anything about COBOL. Adam's blog primarily focuses on modern web technologies like React, TypeScript, Next.js, and system architecture.
> 
> Would you like to see what topics Adam has written about? Or are you interested in learning about legacy system modernization instead?

### When Service Unavailable

**User Query:**
> "What books does Adam recommend?"

**AI Response (if Notion is down):**
> I'm having trouble accessing Adam's book list right now. You can try:
> - Checking the Books page directly at [/books](/books)
> - Asking me about Adam's career or blog posts instead
> - Trying again in a moment
> 
> Is there something else I can help you with?

---

## Performance Notes

- **Simple queries** (current date): ~1-2 seconds
- **Single tool queries** (blog search): ~2-4 seconds
- **Multi-tool queries**: ~4-8 seconds
- **Streaming**: Responses appear progressively, not all at once
- **Mobile**: Faster due to shorter responses

---

## Testing Instructions

To see these features in action:

1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Open the chat widget
4. Try the example queries above
5. Watch the Network tab to see tool calls
6. Check server logs for execution details

See `TESTING_GUIDE.md` for comprehensive testing scenarios.
