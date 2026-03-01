# Function Calling Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    Chat Component                         │  │
│  │  - User types question                                    │  │
│  │  - Displays AI responses                                  │  │
│  │  - Shows tool usage (optional)                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ HTTP POST /api/v1/chat
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CHAT API (Node.js Runtime)                   │
│                    src/pages/api/v1/chat.ts                     │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  1. Receive messages from user                           │  │
│  │  2. Add enhanced system message with tool descriptions   │  │
│  │  3. Call streamText() with tools                         │  │
│  │  4. Stream response back to client                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
              ┌────────────────────────────────┐
              │   OpenAI GPT-4.1-mini Model    │
              │   (with function calling)      │
              └────────────────────────────────┘
                               │
                               │ Decides which tool(s) to call
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TOOL EXECUTION LAYER                         │
│                    src/lib/chatTools.ts                         │
│                                                                 │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │  searchBlog    │  │   getBooks     │  │searchBookmarks │   │
│  │                │  │                │  │                │   │
│  │ - Query Notion │  │ - Fetch from   │  │ - Query Notion │   │
│  │   blog DB      │  │   Notion books │  │   bookmarks DB │   │
│  │ - Filter by    │  │   DB           │  │ - Filter by    │   │
│  │   keywords     │  │ - Return list  │  │   keywords     │   │
│  │ - Return posts │  │   with authors │  │ - Return links │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
│                                                                 │
│  ┌────────────────┐  ┌────────────────┐                        │
│  │queryCareer     │  │getCurrentDate  │                        │
│  │Timeline        │  │Time            │                        │
│  │                │  │                │                        │
│  │ - Search       │  │ - Get system   │                        │
│  │   TIMELINE     │  │   date/time    │                        │
│  │ - Search git   │  │ - Format       │                        │
│  │   timeline data│  │   nicely       │                        │
│  │ - Return events│  │ - Return info  │                        │
│  └────────────────┘  └────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ Tool results
                               ▼
              ┌────────────────────────────────┐
              │   OpenAI GPT-4.1-mini Model    │
              │   (formats results naturally)  │
              └────────────────────────────────┘
                               │
                               │ Final response
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│               (Streamed response appears)                       │
└─────────────────────────────────────────────────────────────────┘

DATA SOURCES:
┌────────────────┐  ┌────────────────┐  ┌────────────────┐
│  Notion API    │  │  In-Memory     │  │  System Time   │
│  (External)    │  │  Data          │  │  (Built-in)    │
│                │  │                │  │                │
│  - Blog Posts  │  │  - TIMELINE    │  │  - Date        │
│  - Books       │  │  - Git Timeline│  │  - Time        │
│  - Bookmarks   │  │                │  │                │
└────────────────┘  └────────────────┘  └────────────────┘
```

## Example Flow

**User asks:** "What has Adam written about React?"

1. **Chat Component** → Sends message to `/api/v1/chat`
2. **Chat API** → Passes to OpenAI with tools
3. **OpenAI** → Analyzes query, decides to call `searchBlog` tool
4. **searchBlog Tool** → 
   - Calls `fetchNotions('blog')`
   - Filters posts for "react" in title/description/tags
   - Returns matching posts
5. **OpenAI** → Receives tool results, formats into natural response
6. **Chat API** → Streams formatted response back
7. **Chat Component** → Displays response to user

Response might look like:
> "Adam has written several blog posts about React! Here are some of his posts:
> 
> 1. **Building Scalable React Applications** (January 2024)
>    - A deep dive into architecture patterns for large React apps
>    - Tags: react, architecture, performance
>    [Read more →](/blog/abc123)
>
> 2. **React Hooks Best Practices** (March 2023)
>    - Common pitfalls and how to avoid them
>    - Tags: react, hooks, javascript
>    [Read more →](/blog/def456)"

## Multi-Tool Example

**User asks:** "What did Adam do in 2021 and does he have any blog posts from that period?"

1. OpenAI calls `queryCareerTimeline("2021")`
2. Receives: Work at Schneider Electric, Co-op at Assembly, etc.
3. OpenAI calls `searchBlog("2021")` 
4. Receives: Blog posts published in 2021
5. OpenAI combines both results into coherent response

This demonstrates the power of **multi-step tool usage** enabled by `maxSteps: 5`.
