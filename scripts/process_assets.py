"""Prepare generated source art for the runtime.

The script trims chroma-keyed atlas cells and creates web-optimized backgrounds.
It is deterministic and safe to rerun after replacing a generated source atlas.
"""

from pathlib import Path
from PIL import Image
import numpy as np
from scipy import ndimage


ROOT = Path(__file__).resolve().parents[1]


def split_atlas(
    source: Path,
    destination: Path,
    columns: int,
    rows: int,
    names: list[str],
    fixed_size: tuple[int, int] | None = None,
) -> None:
    image = Image.open(source).convert("RGBA")
    destination.mkdir(parents=True, exist_ok=True)
    cell_width = image.width / columns
    cell_height = image.height / rows

    for index, name in enumerate(names):
        column = index % columns
        row = index // columns
        left = round(column * cell_width)
        top = round(row * cell_height)
        right = round((column + 1) * cell_width)
        bottom = round((row + 1) * cell_height)
        cell = image.crop((left, top, right, bottom))
        alpha = np.asarray(cell.getchannel("A"))
        labels, count = ndimage.label(alpha > 18)
        if count:
            sizes = np.bincount(labels.ravel())
            largest = sizes[1:].max()
            remove: list[int] = []
            for component in range(1, count + 1):
                ys, xs = np.where(labels == component)
                if not len(xs):
                    continue
                touches_edge = (
                    xs.min() <= 2
                    or ys.min() <= 2
                    or xs.max() >= cell.width - 3
                    or ys.max() >= cell.height - 3
                )
                if sizes[component] < largest * 0.012 or (
                    touches_edge and sizes[component] < largest * 0.35
                ):
                    remove.append(component)
            if remove:
                clean = np.asarray(cell).copy()
                clean[np.isin(labels, remove), 3] = 0
                cell = Image.fromarray(clean, "RGBA")
        alpha_bounds = cell.getchannel("A").getbbox()
        if alpha_bounds is None:
            raise RuntimeError(f"No visible pixels in atlas cell {name}")
        trimmed = cell.crop(alpha_bounds)
        if fixed_size:
            padded = Image.new("RGBA", fixed_size)
            padded.alpha_composite(
                trimmed,
                ((fixed_size[0] - trimmed.width) // 2, fixed_size[1] - trimmed.height - 10),
            )
        else:
            padded = Image.new("RGBA", (trimmed.width + 24, trimmed.height + 24))
            padded.alpha_composite(trimmed, (12, 12))
        padded.save(destination / f"{name}.png", optimize=True)


def optimize_background(source: Path, destination: Path, quality: int = 84) -> None:
    image = Image.open(source).convert("RGB")
    image.save(destination, "WEBP", quality=quality, method=6)


split_atlas(
    ROOT / "public/assets/characters/hanuman/atlas.png",
    ROOT / "public/assets/characters/hanuman/poses",
    4,
    3,
    [
        "idle",
        "run-a",
        "run-b",
        "jump",
        "fall",
        "dash",
        "attack-1",
        "attack-2",
        "heavy",
        "air-attack",
        "hurt",
        "victory",
    ],
    (460, 380),
)

split_atlas(
    ROOT / "public/assets/characters/roster/atlas.png",
    ROOT / "public/assets/characters/roster/poses",
    4,
    2,
    [
        "gatekeeper",
        "matchanu",
        "maiyarap",
        "rama",
        "yak-guard",
        "yak-archer",
        "bat-spirit",
        "shadow-mage",
    ],
)

split_atlas(
    ROOT / "public/assets/ui/objects-atlas.png",
    ROOT / "public/assets/ui/objects",
    4,
    2,
    [
        "rama-seal",
        "checkpoint",
        "dash-wall",
        "sleep-mist",
        "heart-reliquary",
        "heart-seal",
        "blade-trap",
        "exit-portal",
    ],
)

optimize_background(
    ROOT / "public/assets/poster/opening-poster.png",
    ROOT / "public/assets/poster/opening-poster.webp",
    86,
)
for level in ("level-01", "level-02", "level-03"):
    optimize_background(
        ROOT / f"public/assets/levels/{level}/background.png",
        ROOT / f"public/assets/levels/{level}/background.webp",
    )

print("Generated runtime sprites and optimized WebP backgrounds.")
