# Demo Recording Scripts

## Setup

- Resolution: 1920x1080 (or 1280x720 for social)
- Format: MP4 (master) + GIF (social preview)
- Duration: ~30 seconds each
- Tool: QuickTime (File > New Screen Recording) or OBS

---

## Demo 1: Dancing with AI

**URL:** https://dancing-with-ai.vercel.app/
**Target duration:** 30 seconds

### Pre-recording checklist
- [ ] Open site in a clean browser window (no bookmarks bar)
- [ ] Set browser zoom to 100%
- [ ] Hide dock/taskbar if possible
- [ ] Disable notifications

### Shot sequence

| Time | Action | What to capture |
|------|--------|-----------------|
| 0–3s | Open the URL, wait for full load | Hero / loading animation |
| 3–8s | Pan the mouse slowly across the floating panels | Glow effects + panel layout |
| 8–15s | Click a panel or trigger camera orbit animation | 3D/orbit motion effect |
| 15–22s | Let animation play, show depth | Visual depth + floating elements |
| 22–28s | Zoom browser slightly (Cmd+, then Cmd-) or scroll to show scale | Full scene impression |
| 28–30s | Rest on the most visually impressive frame | Hold on hero state |

### Director's notes
- Move the mouse slowly — jittery movement looks bad in GIF
- Wait for animations to settle before moving on
- The glow and float effects are the star — give them screen time
- End on a frame where the layout looks most polished

---

## Demo 2: Mindmap Command Center

**URL:** https://razbakov.com/mindmap/
**Target duration:** 30 seconds

### Pre-recording checklist
- [ ] Open site in a clean browser window
- [ ] Set browser zoom to 100%
- [ ] Let the mindmap fully load (may take 2–3 seconds)
- [ ] Disable notifications

### Shot sequence

| Time | Action | What to capture |
|------|--------|-----------------|
| 0–4s | Open URL, wait for initial radial render | Full mindmap loaded state |
| 4–10s | Click a branch to expand it | Branch expansion animation |
| 10–15s | Click the same or another branch to collapse | Collapse animation |
| 15–20s | Use scroll/pinch to zoom in on a cluster of nodes | Node detail, text labels |
| 20–24s | Zoom back out to show the full radial structure | Full map overview |
| 24–28s | Switch theme (dark ↔ light) if toggle exists | Visual contrast change |
| 28–30s | Rest on the full radial view | Big-picture visual impact |

### Director's notes
- The radial structure is the wow moment — start and end on the full view
- Zooming in shows depth; zooming out shows ambition — do both
- Theme switch (if available) is an easy visual payoff moment
- Keep mouse movements smooth and deliberate

---

## Export checklist

After recording:
- [ ] Trim to exactly 30 seconds
- [ ] Export MP4 (H.264, no audio or subtle background music)
- [ ] Export GIF: 480px wide, 15fps, using ffmpeg or Gifski
  ```
  ffmpeg -i demo.mp4 -vf "fps=15,scale=480:-1:flags=lanczos" -loop 0 demo.gif
  ```
- [ ] Save files as `dancing-with-ai-demo.mp4`, `dancing-with-ai-demo.gif`
- [ ] Save files as `mindmap-demo.mp4`, `mindmap-demo.gif`
