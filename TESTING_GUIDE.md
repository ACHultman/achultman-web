# Testing Guide for Function Calling Features

This guide explains how to test the new GPT function calling features.

## Prerequisites

Before testing, you need to set up your environment variables in `.env.local`:

```bash
# Required for function calling to work
OPENAI_API_KEY=sk-your-key-here
OPENAI_SYSTEM_INIT_MSG="You are a helpful AI assistant helping visitors learn about Adam Hultman, a software engineer. Today is {CURR_DATE}. You can answer questions about Adam's career, blog posts, book recommendations, bookmarks, and more. Be friendly, informative, and concise."

# Required for Notion data fetching (blog, books, bookmarks)
NOTION_API_KEY=secret_your-key-here
NOTION_DATABASE_ID_BLOG=your-blog-db-id
NOTION_DATABASE_ID_BOOKS=your-books-db-id
NOTION_DATABASE_ID_BOOKMARKS=your-bookmarks-db-id

# Other required variables
EMAIL_PASS=your-email-password
NEXT_PUBLIC_EMAIL=your-email@example.com
NEXT_PUBLIC_APP_BASE_URL=http://localhost:3000
```

## Starting the Development Server

```bash
npm install
npm run dev
```

The site will be available at `http://localhost:3000`

## Test Scenarios

### 1. Blog Search Tool

**Test queries:**
- "What has Adam written about React?"
- "Find blog posts about architecture"
- "Show me posts tagged with performance"
- "Has Adam written anything about TypeScript?"

**Expected behavior:**
- AI should call the `searchBlog` tool
- Results should include matching blog posts with:
  - Title
  - Description
  - Tags
  - Published date
  - Link to the post

**Verification:**
- Check that relevant posts are returned
- Verify the search is case-insensitive
- Confirm results are limited to the requested number (default 5)

### 2. Book Recommendations Tool

**Test queries:**
- "What books does Adam recommend?"
- "Can you suggest some books from Adam's reading list?"
- "What is Adam currently reading?"
- "Show me 3 books Adam likes"

**Expected behavior:**
- AI should call the `getBooks` tool
- Results should include:
  - Book title
  - Author name
  - Link (if available)

**Verification:**
- Check that books are returned from the Notion database
- Verify the limit parameter works correctly
- Confirm links are valid

### 3. Bookmark Search Tool

**Test queries:**
- "Do you have any resources about TypeScript?"
- "Show me interesting AI tools Adam has saved"
- "What design resources does Adam recommend?"
- "Find bookmarks about React"

**Expected behavior:**
- AI should call the `searchBookmarks` tool
- Results should include:
  - Bookmark title
  - Link
  - Description
  - Tags

**Verification:**
- Check that search matches title, description, or tags
- Verify results are relevant to the query
- Confirm links are working

### 4. Career Timeline Query Tool

**Test queries:**
- "Where did Adam work in 2021?"
- "Tell me about Adam's time at Assembly Digital Media"
- "What co-op positions did Adam have?"
- "When did Adam graduate from UVic?"
- "What did Adam do at Schneider Electric?"

**Expected behavior:**
- AI should call the `queryCareerTimeline` tool
- Results should include:
  - Organization name
  - Position/role
  - Date range

**Verification:**
- Check that searches work for:
  - Company names
  - Year numbers
  - Position types (e.g., "co-op")
  - Education keywords
- Verify results are sorted chronologically
- Confirm both TIMELINE and gitTimelineData are searched

### 5. Current Date/Time Tool

**Test queries:**
- "What day is it today?"
- "What time is it?"
- "What's the current date?"
- "Tell me today's date"

**Expected behavior:**
- AI should call the `getCurrentDateTime` tool
- Results should include:
  - Formatted date (e.g., "Saturday, March 1, 2026")
  - Formatted time with timezone
  - ISO timestamp

**Verification:**
- Check that date matches current date
- Verify time is accurate
- Confirm timezone is included

### 6. Multi-Tool Usage

**Test queries:**
- "What did Adam do in 2021 and does he have any blog posts from that period?"
- "Tell me about Adam's current role and what books he's reading"
- "Show me resources about React and tell me when Adam worked with React"

**Expected behavior:**
- AI should call multiple tools in sequence
- Results should be combined into a coherent response
- Tools should be called in logical order

**Verification:**
- Check that both tools are executed
- Verify results from both tools appear in the response
- Confirm the AI synthesizes the information naturally

### 7. Error Handling

**Test scenarios:**

1. **Empty results:**
   - "Show me blog posts about COBOL"
   - Expected: Graceful message like "No blog posts found matching COBOL"

2. **Partial matches:**
   - "Find posts about rea" (partial word)
   - Expected: Should still find "React" posts

3. **Case sensitivity:**
   - "WHAT BOOKS DOES ADAM RECOMMEND?"
   - Expected: Should work the same as lowercase query

## Debugging

### Check Network Tab

1. Open browser DevTools (F12)
2. Go to Network tab
3. Send a message in chat
4. Look for POST request to `/api/v1/chat`
5. Check the request/response payload

### Check Server Logs

Watch the terminal where `npm run dev` is running:
- Tool execution will log errors (if any)
- You should see any `console.error()` messages from failed tool calls

### Check Browser Console

Look for any client-side errors in the browser console

## Performance Testing

1. **Response time:**
   - Simple queries (current time): ~1-2 seconds
   - Single tool queries (blog search): ~2-4 seconds
   - Multi-tool queries: ~4-8 seconds

2. **Streaming:**
   - Verify that responses stream character-by-character
   - Check that tool results don't block the entire response

3. **Mobile:**
   - Test on mobile device or mobile emulator
   - Verify responses are shorter and more concise
   - Check that the mobile mode message is added to system prompt

## Success Criteria

✅ All 5 tools execute successfully
✅ Search queries return relevant results
✅ Multi-tool usage works correctly
✅ Error messages are user-friendly
✅ Responses stream properly
✅ Mobile optimization works
✅ No security vulnerabilities
✅ No TypeScript errors
✅ Linting passes

## Known Limitations

- Notion API rate limits may apply
- Search is basic text matching (not semantic search)
- Timeline search is limited to 10 results
- Tools require valid API keys to function
- Edge runtime not supported (uses Node.js runtime)

## Troubleshooting

**Tool not being called:**
- Check that the query clearly needs that tool
- Verify the system message includes tool descriptions
- Try being more explicit in your query

**Notion data not loading:**
- Verify NOTION_API_KEY is correct
- Check that database IDs are correct
- Ensure Notion integration has access to databases

**OpenAI errors:**
- Verify OPENAI_API_KEY is valid
- Check that you have available credits
- Look for rate limit errors in logs

**Streaming issues:**
- Check browser console for errors
- Verify the chat component is using `useChat` hook correctly
- Look for network errors in DevTools
