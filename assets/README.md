# Icon assets

- `icon.png`: the final 128x128 PNG used by VS Code and the Marketplace, with transparent outer corners.
- `icon-source.png`: the original generated artwork, retained for future exports.

The artwork was generated using the built-in `image_gen` tool. The final PNG was exported at 128x128 pixels with macOS `sips`.

## Generation prompt

```text
Use case: logo-brand. Asset type: a production app icon for the VS Code extension Quick Log: Console Shortcuts. Create one beautiful, extremely simple geometric icon, optimized for a final 128 by 128 pixel PNG and legible at 24 and 32 pixels. A dark midnight rounded-square tile fills the square canvas, with a little true transparent alpha only outside its rounded corners. Center one bold terminal prompt symbol: a clean bright mint right-facing chevron followed by a short white underscore. Use two thick, carefully balanced geometric strokes, generous internal negative space, precise alignment, crisp flat vector-like edges and a strong silhouette. Refined modern developer tool aesthetic. No letters, no words, no title, no tiny text, no separate badges, no decorative objects, no mockup, no 3D, no gradients, no glow, no shadows, no watermark. One icon only, viewed perfectly straight on.
```
