#!/usr/bin/env python3
"""Build the three local image assets used by the S4-12 return sequence.

The first two scenes are derived from NASA's Blue Marble: Next Generation
August composite. The third scene is assembled from the OpenStreetMap Standard
tile layer for a fixed Pearl River Delta bounding box.
"""

from __future__ import annotations

import argparse
import io
import math
import subprocess
import time
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter


Image.MAX_IMAGE_PIXELS = None

WIDTH = 1920
HEIGHT = 1080
OSM_BOUNDS = (112.0, 21.7, 115.47, 23.5)
OSM_ZOOM = 9
USER_AGENT = "EscapeGlobe-Education/1.0 (local classroom asset build)"


def _save_jpeg(image: Image.Image, path: Path) -> None:
    image.convert("RGB").save(path, "JPEG", quality=91, optimize=True, progressive=True)


def build_asia_pacific_globe(source: Image.Image, output: Path) -> None:
    source = source.convert("RGB")
    source.thumbnail((7200, 3600), Image.Resampling.LANCZOS)
    texture = np.asarray(source)
    texture_height, texture_width = texture.shape[:2]

    canvas = Image.new("RGB", (WIDTH, HEIGHT), "#010810")
    rng = np.random.default_rng(1204)
    stars = ImageDraw.Draw(canvas, "RGBA")
    for _ in range(430):
        x = int(rng.integers(0, WIDTH))
        y = int(rng.integers(0, HEIGHT))
        radius = int(rng.choice([1, 1, 1, 2]))
        alpha = int(rng.integers(35, 112))
        stars.ellipse((x - radius, y - radius, x + radius, y + radius), fill=(154, 212, 225, alpha))

    radius = 445
    center_x, center_y = WIDTH // 2, HEIGHT // 2
    yy, xx = np.mgrid[-radius:radius, -radius:radius]
    nx = (xx + 0.5) / radius
    ny = -(yy + 0.5) / radius
    rho_sq = nx * nx + ny * ny
    mask = rho_sq <= 1
    rho = np.sqrt(np.clip(rho_sq, 0, 1))
    c = np.arcsin(rho)
    sin_c = np.sin(c)
    cos_c = np.cos(c)
    latitude0 = math.radians(15)
    longitude0 = math.radians(120)
    safe_rho = np.where(rho == 0, 1, rho)
    latitude = np.arcsin(
        cos_c * math.sin(latitude0)
        + ny * sin_c * math.cos(latitude0) / safe_rho
    )
    longitude = longitude0 + np.arctan2(
        nx * sin_c,
        safe_rho * math.cos(latitude0) * cos_c
        - ny * math.sin(latitude0) * sin_c,
    )
    longitude = (longitude + math.pi) % (2 * math.pi) - math.pi
    source_x = np.clip(((longitude + math.pi) / (2 * math.pi) * texture_width).astype(np.int32), 0, texture_width - 1)
    source_y = np.clip(((math.pi / 2 - latitude) / math.pi * texture_height).astype(np.int32), 0, texture_height - 1)

    globe = np.zeros((radius * 2, radius * 2, 4), dtype=np.uint8)
    sampled = texture[source_y, source_x].astype(np.float32)
    nz = np.sqrt(np.clip(1 - rho_sq, 0, 1))
    light = np.clip(0.44 + 0.67 * (0.22 * nx + 0.13 * ny + 0.96 * nz), 0.33, 1.1)
    sampled *= light[..., None]
    sampled[..., 2] *= 1.04
    globe[..., :3] = np.clip(sampled, 0, 255).astype(np.uint8)
    globe[..., 3] = np.where(mask, 255, 0).astype(np.uint8)
    globe_image = Image.fromarray(globe, "RGBA")

    atmosphere = Image.new("L", (radius * 2, radius * 2), 0)
    ImageDraw.Draw(atmosphere).ellipse((7, 7, radius * 2 - 7, radius * 2 - 7), fill=225)
    atmosphere = atmosphere.filter(ImageFilter.GaussianBlur(17))
    atmosphere_layer = Image.new("RGBA", atmosphere.size, (66, 163, 205, 0))
    atmosphere_layer.putalpha(atmosphere.point(lambda value: int(value * 0.34)))
    position = (center_x - radius, center_y - radius)
    canvas = canvas.convert("RGBA")
    canvas.alpha_composite(atmosphere_layer, position)
    canvas.alpha_composite(globe_image, position)

    vignette = Image.new("L", (WIDTH, HEIGHT), 0)
    draw = ImageDraw.Draw(vignette)
    draw.ellipse((-180, -260, WIDTH + 180, HEIGHT + 260), fill=215)
    vignette = vignette.filter(ImageFilter.GaussianBlur(150))
    shade = Image.new("RGBA", (WIDTH, HEIGHT), (0, 4, 9, 255))
    shade.putalpha(Image.eval(vignette, lambda value: 118 - int(value * 0.5)))
    canvas.alpha_composite(shade)
    _save_jpeg(canvas, output)


def _crop_equirectangular(source: Image.Image, west: float, south: float, east: float, north: float) -> Image.Image:
    width, height = source.size
    left = round((west + 180) / 360 * width)
    right = round((east + 180) / 360 * width)
    top = round((90 - north) / 180 * height)
    bottom = round((90 - south) / 180 * height)
    return source.crop((left, top, right, bottom))


def build_china_south_sea(source: Image.Image, output: Path) -> None:
    crop = _crop_equirectangular(source, 60, 5, 149, 55)
    crop = crop.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    crop = ImageEnhance.Contrast(crop).enhance(1.08)
    crop = ImageEnhance.Color(crop).enhance(0.92)
    overlay = Image.new("RGBA", crop.size, (0, 19, 36, 0))
    overlay.putalpha(25)
    crop = Image.alpha_composite(crop.convert("RGBA"), overlay)
    _save_jpeg(crop, output)


def _longitude_to_world_x(longitude: float, zoom: int) -> float:
    return (longitude + 180) / 360 * (2**zoom) * 256


def _latitude_to_world_y(latitude: float, zoom: int) -> float:
    latitude = max(min(latitude, 85.05112878), -85.05112878)
    radians = math.radians(latitude)
    return (1 - math.asinh(math.tan(radians)) / math.pi) / 2 * (2**zoom) * 256


def _load_osm_tile(x: int, y: int, zoom: int, cache_dir: Path) -> Image.Image:
    cache_dir.mkdir(parents=True, exist_ok=True)
    cache_path = cache_dir / f"{zoom}-{x}-{y}.png"
    if cache_path.exists():
        try:
            return Image.open(cache_path).convert("RGB")
        except OSError:
            cache_path.unlink()
    url = f"https://tile.openstreetmap.org/{zoom}/{x}/{y}.png"
    curl = subprocess.run(
        [
            "curl",
            "-sS",
            "-L",
            "--fail",
            "--retry",
            "4",
            "--retry-all-errors",
            "--connect-timeout",
            "15",
            "--max-time",
            "45",
            "-A",
            USER_AGENT,
            url,
        ],
        check=False,
        capture_output=True,
    )
    if curl.returncode == 0:
        image = Image.open(io.BytesIO(curl.stdout)).convert("RGB")
        cache_path.write_bytes(curl.stdout)
        return image
    raise RuntimeError(f"Unable to download OSM tile {zoom}/{x}/{y}: {curl.stderr.decode('utf-8', 'replace')}")


def build_pearl_river_delta(output: Path, cache_dir: Path) -> None:
    west, south, east, north = OSM_BOUNDS
    left_world = _longitude_to_world_x(west, OSM_ZOOM)
    right_world = _longitude_to_world_x(east, OSM_ZOOM)
    top_world = _latitude_to_world_y(north, OSM_ZOOM)
    bottom_world = _latitude_to_world_y(south, OSM_ZOOM)
    first_x = math.floor(left_world / 256)
    last_x = math.floor((right_world - 1) / 256)
    first_y = math.floor(top_world / 256)
    last_y = math.floor((bottom_world - 1) / 256)
    mosaic = Image.new("RGB", ((last_x - first_x + 1) * 256, (last_y - first_y + 1) * 256))
    for tile_y in range(first_y, last_y + 1):
        for tile_x in range(first_x, last_x + 1):
            tile = _load_osm_tile(tile_x, tile_y, OSM_ZOOM, cache_dir)
            mosaic.paste(tile, ((tile_x - first_x) * 256, (tile_y - first_y) * 256))
            time.sleep(0.08)
    crop = mosaic.crop((
        round(left_world - first_x * 256),
        round(top_world - first_y * 256),
        round(right_world - first_x * 256),
        round(bottom_world - first_y * 256),
    ))
    crop = crop.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    _save_jpeg(crop, output)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bmng-source", required=True, type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    parser.add_argument("--tile-cache", type=Path, default=Path("/private/tmp/s4-12-osm-tiles"))
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)
    with Image.open(args.bmng_source) as source:
        build_asia_pacific_globe(source, args.output_dir / "earth-asia-pacific.jpg")
    with Image.open(args.bmng_source) as source:
        build_china_south_sea(source, args.output_dir / "china-south-sea.jpg")
    build_pearl_river_delta(args.output_dir / "pearl-river-delta-map.jpg", args.tile_cache)


if __name__ == "__main__":
    main()
