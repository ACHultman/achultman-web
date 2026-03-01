# GPT Function Calling Features

This document describes the innovative GPT function calling features implemented in the chat system.

## Overview

The chat assistant now has access to 5 powerful tools that allow it to provide dynamic, data-driven responses about Adam Hultman's professional life, writing, and interests.

## Available Tools

### 1. Search Blog Posts (`searchBlog`)

**Purpose**: Search Adam's blog posts by keywords or topics

**When to use**: When users ask about Adam's writing, blog posts, or specific technical topics

**Parameters**:
- `query` (string): Keywords or topics to search for (e.g., "react", "architecture", "performance")
- `limit` (number, optional): Maximum number of results to return (default: 5)

**Returns**:
- List of matching blog posts with title, description, tags, published date, and URL

**Example queries**:
- "What has Adam written about React?"
- "Show me blog posts about system architecture"
- "Find posts tagged with performance"

### 2. Get Book Recommendations (`getBooks`)

**Purpose**: Get book recommendations from Adam's reading list

**When to use**: When users ask about books Adam has read or want reading recommendations

**Parameters**:
- `limit` (number, optional): Maximum number of books to return (default: 5)

**Returns**:
- List of books with title, author, and link

**Example queries**:
- "What books does Adam recommend?"
- "What is Adam reading?"
- "Can you suggest some books from Adam's list?"

### 3. Search Bookmarks (`searchBookmarks`)

**Purpose**: Search Adam's curated bookmarks and resources by topic

**When to use**: When users ask about resources, tools, articles, or interesting links

**Parameters**:
- `query` (string): Keywords or topics to search for (e.g., "typescript", "design", "AI")
- `limit` (number, optional): Maximum number of results to return (default: 5)

**Returns**:
- List of bookmarks with title, link, description, and tags

**Example queries**:
- "Do you have any resources about TypeScript?"
- "Show me interesting AI tools Adam has saved"
- "What design resources does Adam recommend?"

### 4. Query Career Timeline (`queryCareerTimeline`)

**Purpose**: Query specific information from Adam's career timeline

**When to use**: When users ask about work history, specific companies, education, or career progression

**Parameters**:
- `query` (string): What to search for (e.g., "Assembly", "UVic", "co-op", "2021")

**Returns**:
- List of matching career events with organization, position, and date range

**Example queries**:
- "Where did Adam work in 2021?"
- "Tell me about Adam's time at Assembly Digital Media"
- "What co-op positions did Adam have?"
- "When did Adam graduate from UVic?"

### 5. Get Current Date/Time (`getCurrentDateTime`)

**Purpose**: Get the current date and time

**When to use**: When users ask about the current date, time, or day of week

**Parameters**: None

**Returns**:
- Current date (formatted), time (formatted), and ISO timestamp

**Example queries**:
- "What day is it today?"
- "What time is it?"
- "What's the current date?"

## Technical Implementation

### Architecture

The function calling system uses the Vercel AI SDK with OpenAI's GPT-4.1-mini model:

1. **Tool Definitions** (`src/lib/chatTools.ts`):
   - Each tool is defined using the AI SDK's `tool()` function
   - Parameters are validated using Zod schemas
   - Execute functions contain the business logic for each tool

2. **Chat API** (`src/pages/api/v1/chat.ts`):
   - Uses Node.js runtime (not Edge) for Notion SDK compatibility
   - Configures `streamText()` with tools and `maxSteps: 5` for multi-step tool usage
   - Enhanced system message explains available tools to the AI

3. **Data Sources**:
   - **Blog, Books, Bookmarks**: Fetched from Notion databases via `fetchNotions()`
   - **Career Timeline**: Queried from in-memory data structures (`TIMELINE` and `gitTimelineRootData`)
   - **Current Date/Time**: Computed in real-time

4. **Search API Endpoints** (`src/pages/api/v1/search/*`):
   - Created as backup/alternative access methods
   - Can be used by other parts of the application
   - Use standard Next.js API routes

### Key Features

- **Multi-step Tool Usage**: The AI can call multiple tools in sequence to answer complex questions
- **Intelligent Tool Selection**: The AI automatically chooses which tools to use based on the query
- **Natural Language Integration**: Tool results are seamlessly integrated into conversational responses
- **Error Handling**: Graceful fallbacks when tools fail or return no results
- **Mobile Optimization**: Responses are automatically shortened for mobile users

### Example Interaction Flow

```
User: "What has Adam written about React?"
  ↓
AI recognizes this needs the searchBlog tool
  ↓
searchBlog(query: "react", limit: 5) is called
  ↓
Notion database is queried and filtered
  ↓
Results are returned to the AI
  ↓
AI formats results into a natural language response:
"Adam has written several blog posts about React. Here are some highlights:
1. 'Building Scalable React Applications' (Published: Jan 2024)
   - Tags: react, architecture, performance
   - Description: Best practices for large-scale React apps...
..."
```

## Testing

To test the function calling features:

1. **Manual Testing via Chat Interface**:
   - Start the dev server: `npm run dev`
   - Open the chat widget on the homepage
   - Ask questions that trigger different tools
   - Verify the AI uses the appropriate tools and returns accurate data

2. **Testing Individual Tools**:
   - Each tool can be tested by asking specific questions
   - Check the network tab to see tool execution
   - Verify data is fetched from correct sources

3. **Multi-tool Testing**:
   - Ask complex questions requiring multiple tools
   - Example: "What did Adam do in 2021 and does he have any blog posts about his work there?"
   - Verify the AI chains tools appropriately

## Future Enhancements

Potential improvements to consider:

1. **Contact Form Integration**: Allow the AI to help users fill out and submit the contact form
2. **Analytics Integration**: Provide the AI with access to site analytics data
3. **GitHub Integration**: Let the AI query Adam's GitHub repositories and activity
4. **Project Showcase**: Allow querying details about specific projects
5. **Skill Matrix**: Enable the AI to query detailed skill levels and technologies
6. **Calendar Integration**: Check availability for meetings or calls
7. **Code Snippets**: Search and share code snippets from blog posts or repositories

## Security Considerations

- All Notion API calls are server-side only
- API keys are never exposed to the client
- Tool execution is rate-limited through the existing API middleware
- Input validation using Zod schemas prevents malicious payloads
- Search queries are sanitized before database operations

## Performance

- In-memory data (timeline) provides instant responses
- Notion queries are cached at the database level
- Maximum tool steps limited to 5 to prevent excessive API calls
- Tool results are automatically streamed to the client for better UX
