from __future__ import annotations

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
POSE_DIR = ROOT / "public" / "assets" / "characters" / "roster" / "poses"
BOSSES = (
    "gatekeeper",
    "khotchasan",
    "akkhani",
    "masaka",
    "matchanu",
    "than-lek",
    "maiyarap",
)
PADDING = 28
ALPHA_THRESHOLD = 12


def trim_alpha(image: Image.Image) -> Image.Image:
    alpha = image.getchannel("A")
    mask = alpha.point(lambda value: 255 if value > ALPHA_THRESHOLD else 0)
    bounds = mask.getbbox()
    if bounds is None:
        raise ValueError("Pose has no visible pixels")
    return image.crop(bounds)


def resize_to_height(image: Image.Image, height: int) -> Image.Image:
    width = max(1, round(image.width * height / image.height))
    return image.resize((width, height), Image.Resampling.LANCZOS)


def place_bottom_center(
    image: Image.Image,
    canvas_size: tuple[int, int],
) -> Image.Image:
    canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    x = (canvas.width - image.width) // 2
    y = canvas.height - PADDING - image.height
    canvas.alpha_composite(image, (x, y))
    return canvas


def process_boss(name: str) -> None:
    idle = trim_alpha(Image.open(POSE_DIR / f"{name}.png").convert("RGBA"))
    sheet = Image.open(POSE_DIR / f"{name}-attacks.alpha.source.png").convert("RGBA")
    midpoint = sheet.width // 2
    cast = trim_alpha(sheet.crop((0, 0, midpoint, sheet.height)))
    strike = trim_alpha(sheet.crop((midpoint, 0, sheet.width, sheet.height)))

    target_height = max(cast.height, strike.height)
    idle = resize_to_height(idle, target_height)
    poses = {"idle": idle, "cast": cast, "strike": strike}
    canvas_width = max(pose.width for pose in poses.values()) + PADDING * 2
    canvas_height = target_height + PADDING * 2

    for pose_name, pose in poses.items():
        output = place_bottom_center(pose, (canvas_width, canvas_height))
        output.save(
            POSE_DIR / f"{name}-{pose_name}.webp",
            "WEBP",
            quality=90,
            method=6,
        )

    print(
        f"{name}: canvas={canvas_width}x{canvas_height} "
        f"idle={idle.width}x{idle.height} "
        f"cast={cast.width}x{cast.height} "
        f"strike={strike.width}x{strike.height}"
    )


def main() -> None:
    for boss in BOSSES:
        process_boss(boss)


if __name__ == "__main__":
    main()
