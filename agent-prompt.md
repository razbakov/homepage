# Agent Task: post-dancing-with-ai

**Project:** razbakov.com
**Dispatched:** 2026-03-24
**Notion card:** https://www.notion.so/32c9a1fda351819e9126f641d50cc704
**Raw input:** /notion-execute-task: Execute Notion card 'Post "Dancing with AI" campaign on X + LinkedIn' (page_id: 32c9a1fd-a351-819e-9126-f641d50cc704). Read the card content, prepare the social media posts as described, document results back on the page, and set status to 'To review'. Check marketing/dancing-with-ai/ folder for existing campaign materials. If actual posting requires human action, prepare everything and note what's left for the user.

## Instructions

1. Read the Notion card at page_id `32c9a1fd-a351-819e-9126-f641d50cc704` to understand what social media content is needed.
2. Check the `~/Projects/ikigai/marketing/dancing-with-ai/` folder for existing campaign materials, blog post drafts, platform research, etc.
3. Check `~/Projects/ikigai/engineering/razbakov.com/content/blog/` for any published "Dancing with AI" blog post.
4. Prepare ready-to-post content:
   - **X/Twitter thread:** 4-7 tweets. Hook tweet (personal/surprising/contrarian) → story → CTA with link + engagement question.
   - **LinkedIn post:** 150-250 words. Personal story format, end with question.
5. Write the drafted posts back to the Notion card as a `## Drafted Content` section.
6. Note what the user still needs to do manually (e.g., actually posting, recording video if mentioned).

When done, update the Notion card:
1. Set Status to "To review": notion-update-page(page_id: "32c9a1fd-a351-819e-9126-f641d50cc704", command: "update_properties", properties: { "Status": "To review" })
2. Append a ## Result section with what was done, where to find it, and next steps.

### Delivery checklist
1. Commit all changes with a descriptive message
2. Push the branch: `git push -u origin agent/post-dancing-with-ai`
3. Create a pull request: `gh pr create --title "Draft Dancing with AI social media posts" --body "Prepared X thread and LinkedIn post for Dancing with AI campaign"`
