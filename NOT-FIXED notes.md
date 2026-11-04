# Not fixed yet (look at after) - 2026-11-04

Folder sync: Codex folder = C:\Users\Hajar\AppData\Local\Temp\ruleproof-updates\roof-roof (live, Codex edits here).
Mirror = C:\Users\Hajar\Downloads\roof-roof\roof roof (served on :8767). Newer file wins, backup before overwrite.

1. Ruli still appears ~2.5s after page start on my slow PC. Cause: Google Fonts stylesheet blocks render, plus huge inline pages (Homepage 12MB, Real Estate 17MB, base64 images). Fix idea: move inline images to files, preload/self-host Albert Sans.
2. 18 Skills Training: console error "Cannot read properties of null (reading 'querySelector')". Existed before Ruli. Not investigated.
3. Ruli phone button hidden: no approved number. Needs Hajar's decision.
4. Ruli answers: not reviewed by Hajar yet (copied as-is, never rewritten).
5. Ruli chat panel not opened and clicked through on each page (only checked: widget visible, no overflow at 1330/390).
6. Mobile lift (84px above sticky CTA) not measured against the real CTA height.
7. 16 Training hero: Codex is mid-edit. restore_training_hero.py sets eyebrow "Training" + headline "Training that goes beyond completion", but the live file currently reads eyebrow "Scenario-based microlearning". Confirm with Codex which is final.
8. CONFIRMED: port 8766 serves an OLDER folder (no orb colour animation, different Training page), NOT roof-roof. Use :8767 (serves Downloads mirror, identical to Codex folder) or restart 8766 pointing at the Temp roof-roof folder.

## Proof page v2 (22 Proof v2.html), 2026-11-04 - open items
9. Copy is her paste, verbatim (72/72 lines checked). v2 is a NEW file; 22 Proof.html (old) is untouched and the site nav still links to the old one. Swap when she approves.
10. Design is v0: homepage system, no final design inspo yet (she will send). 2 asset slots are placeholders: framework upload visual, workspace screenshot.
11. "Explore tiers" button points to #demo (no tiers page decided). Hero "Book a demo" -> #demo, final CTA "Book a demo" -> 20 Contact reviewed.html. Confirm targets.
12. Ivona quote still "proposed, for her review and approval" (kept as an HTML comment, not shown). Needs Ivona's OK before it goes live.
13. Section 4 label "Works with any framework. Including yours." and others used as eyebrows. Confirm she wants them as labels.
14. Old page script + three.js removed from v2 (they drove the old 3D flow). Not checked on real phone, only 390px emulation.
