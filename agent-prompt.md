# Agent Task: post-thought-waterfall

**Project:** razbakov.com
**Dispatched:** 2026-03-23
**Notion card:** https://www.notion.so/32c9a1fda3518167b873eb1a4f4b0f0d
**Raw input:** /notion-execute-task: Execute Notion card 'Post "Thought Waterfall" on X + LinkedIn' (page_id: 32c9a1fd-a351-8167-b873-eb1a4f4b0f0d). Prepare the posts but do NOT publish.

## Instructions

This task is about preparing social media posts for the "Thought Waterfall" blog post.

Steps:
1. Read the Notion card at https://www.notion.so/32c9a1fda3518167b873eb1a4f4b0f0d for the posting instructions
2. Read the parent Thought Waterfall card at https://www.notion.so/32c9a1fda351801e9de0f74064ed4894 to get the "To Share" section with draft content
3. Verify the blog link https://razbakov.com/blog/2026-03-23-thought-waterfall is live (use curl or similar)
4. Check the blog post source in this repo under content/blog/ for the actual content
5. Prepare ready-to-post content:
   - X thread (5 tweets with hook: "I wake up at 3:45am with ideas crashing into each other...")
   - LinkedIn post (personal story format about cascading ideas + AI sub-agents, 150-250 words)
6. Save the drafted content back to the Notion card (update page content)
7. Do NOT actually publish anything — this requires Alex's approval

When done, update the Notion card:
1. Set Status to "Need input" (since posting requires Alex's approval): use notion-update-page with page_id "32c9a1fd-a351-8167-b873-eb1a4f4b0f0d", command "update_properties", properties { "Status": "Need input" }
2. Append drafted content to the card so Alex can review and copy-paste to post

### Delivery checklist
1. Commit all changes with a descriptive message
2. Push the branch: `git push -u origin agent/post-thought-waterfall`
3. Create a pull request: `gh pr create --title "Prepare Thought Waterfall social posts" --body "Drafted X thread and LinkedIn post for Thought Waterfall blog post"`
