"""Build optimized runtime art for the four-level expansion.

The Image Generation sources and intermediate alpha files are intentionally
ignored by git. This script keeps the final PNG canvases predictable for
Phaser pivots and converts authored 16:9 backgrounds to WebP.
"""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "assets"


def fit_alpha_source(
    source: Path,
    destination: Path,
    canvas_size: tuple[int, int],
    margin: int = 18,
) -> None:
    image = Image.open(source).convert("RGBA")
    bounds = image.getchannel("A").getbbox()
    if bounds is None:
        raise RuntimeError(f"No visible pixels in {source}")

    trimmed = image.crop(bounds)
    max_width = canvas_size[0] - margin * 2
    max_height = canvas_size[1] - margin * 2
    scale = min(max_width / trimmed.width, max_height / trimmed.height)
    resized = trimmed.resize(
        (
            max(1, round(trimmed.width * scale)),
            max(1, round(trimmed.height * scale)),
        ),
        Image.Resampling.LANCZOS,
    )

    canvas = Image.new("RGBA", canvas_size)
    x = (canvas_size[0] - resized.width) // 2
    y = canvas_size[1] - resized.height - margin
    canvas.alpha_composite(resized, (x, y))
    destination.parent.mkdir(parents=True, exist_ok=True)
    canvas.save(destination, optimize=True)

    alpha = canvas.getchannel("A")
    if any(alpha.getpixel(corner) != 0 for corner in ((0, 0), (0, canvas.height - 1), (canvas.width - 1, 0), (canvas.width - 1, canvas.height - 1))):
        raise RuntimeError(f"Transparent corner validation failed for {destination}")
    print(f"Wrote {destination.relative_to(ROOT)} ({canvas.width}x{canvas.height})")


def optimize_background(source: Path, destination: Path) -> None:
    image = Image.open(source).convert("RGB")
    image = image.resize((1536, 864), Image.Resampling.LANCZOS)
    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination, "WEBP", quality=84, method=6)
    print(f"Wrote {destination.relative_to(ROOT)} ({image.width}x{image.height})")


for level in ("level-02", "level-03", "level-04", "level-06"):
    optimize_background(
        ASSETS / "levels" / level / "background.png",
        ASSETS / "levels" / level / "background.webp",
    )


bosses = {
    "khotchasan": (900, 700),
    "akkhani": (620, 760),
    "masaka": (900, 580),
    "than-lek": (620, 780),
}
for name, canvas_size in bosses.items():
    fit_alpha_source(
        ASSETS / "characters" / "roster" / "poses" / f"{name}.alpha.source.png",
        ASSETS / "characters" / "roster" / "poses" / f"{name}.png",
        canvas_size,
        margin=20,
    )


projectiles = {
    "tusk-wave": (340, 118),
    "magma-boulder": (156, 132),
    "lotus-stinger": (290, 104),
    "chain-sigil": (176, 156),
    "shield-disc": (168, 168),
    "tidal-trident": (310, 142),
    "hypnosis-orb": (174, 174),
}
for name, canvas_size in projectiles.items():
    fit_alpha_source(
        ASSETS / "projectiles" / f"{name}.alpha.source.png",
        ASSETS / "projectiles" / f"{name}.png",
        canvas_size,
        margin=8,
    )
