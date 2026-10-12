#!/usr/bin/env python3
"""Build the three local image assets used by the S4-12 return sequence.

The first two scenes are derived from NASA's Blue Marble: Next Generation
August composite. The third scene is rendered from a local, simplified extract
of OpenStreetMap coastline geometry for the Pearl River Delta.
"""

from __future__ import annotations

import argparse
import json
import math
import subprocess
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont


Image.MAX_IMAGE_PIXELS = None

WIDTH = 1920
HEIGHT = 1080
APPROACH_WIDTH = 1600
APPROACH_HEIGHT = 900
APPROACH_FPS = 30
APPROACH_DURATION = 4.2
PRD_BOUNDS = (112.5, 21.8, 114.7, 23.6)
PRD_SOURCE_URL = "https://www.openstreetmap.org/copyright"
PRD_CITIES = (
    {"name": "广州", "longitude": 113.2644, "latitude": 23.1291, "offset": (-88, -42)},
    {"name": "东莞", "longitude": 113.7518, "latitude": 23.0207, "offset": (18, -34)},
    {"name": "深圳", "longitude": 114.0579, "latitude": 22.5431, "offset": (18, -34)},
    {"name": "香港", "longitude": 114.1694, "latitude": 22.3193, "offset": (18, 10)},
    {"name": "澳门", "longitude": 113.5439, "latitude": 22.1987, "offset": (-86, 12)},
    {"name": "中山", "longitude": 113.3926, "latitude": 22.5176, "offset": (-84, -38)},
    {"name": "江门", "longitude": 113.0815, "latitude": 22.5789, "offset": (-82, 12)},
)
PRD_TARGET = {"name": "珠海", "longitude": 113.58, "latitude": 22.27}


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


def _smoothstep(value: float) -> float:
    value = max(0.0, min(1.0, value))
    return value * value * (3 - 2 * value)


def _sample_equirectangular(texture: np.ndarray, longitude: np.ndarray, latitude: np.ndarray) -> np.ndarray:
    """Bilinearly sample an equirectangular Blue Marble texture."""
    texture_height, texture_width = texture.shape[:2]
    source_x = ((longitude + math.pi) / (2 * math.pi) * texture_width) % texture_width
    source_y = np.clip((math.pi / 2 - latitude) / math.pi * (texture_height - 1), 0, texture_height - 1)
    x0 = np.floor(source_x).astype(np.int32)
    y0 = np.floor(source_y).astype(np.int32)
    x1 = (x0 + 1) % texture_width
    y1 = np.minimum(y0 + 1, texture_height - 1)
    weight_x = (source_x - x0)[..., None]
    weight_y = (source_y - y0)[..., None]
    top = texture[y0, x0] * (1 - weight_x) + texture[y0, x1] * weight_x
    bottom = texture[y1, x0] * (1 - weight_x) + texture[y1, x1] * weight_x
    return top * (1 - weight_y) + bottom * weight_y


def build_earth_to_china_approach(
    source: Image.Image,
    first_scene: Path,
    second_scene: Path,
    output: Path,
    ffmpeg_bin: Path,
) -> None:
    """Render a geographically aligned orthographic-to-equirectangular push-in.

    The globe grows until its limb is beyond the viewport. Only then does the
    projection gradually relax into the exact 60E-149E / 5N-55N second scene.
    This keeps coastlines moving continuously while avoiding a visible flat-map
    deformation at the globe edge.
    """
    texture_source = source.convert("RGB")
    texture_source.thumbnail((7200, 3600), Image.Resampling.LANCZOS)
    texture = np.asarray(texture_source, dtype=np.float32)
    first = np.asarray(
        Image.open(first_scene).convert("RGB").resize(
            (APPROACH_WIDTH, APPROACH_HEIGHT), Image.Resampling.LANCZOS
        ),
        dtype=np.float32,
    )
    second = np.asarray(
        Image.open(second_scene).convert("RGB").resize(
            (APPROACH_WIDTH, APPROACH_HEIGHT), Image.Resampling.LANCZOS
        ),
        dtype=np.float32,
    )

    yy, xx = np.mgrid[0:APPROACH_HEIGHT, 0:APPROACH_WIDTH]
    center_x = APPROACH_WIDTH / 2
    center_y = APPROACH_HEIGHT / 2
    target_longitude = np.deg2rad(60 + (xx + 0.5) / APPROACH_WIDTH * (149 - 60))
    target_latitude = np.deg2rad(55 - (yy + 0.5) / APPROACH_HEIGHT * (55 - 5))
    target_vector = np.stack(
        (
            np.cos(target_latitude) * np.cos(target_longitude),
            np.cos(target_latitude) * np.sin(target_longitude),
            np.sin(target_latitude),
        ),
        axis=-1,
    )

    command = [
        str(ffmpeg_bin),
        "-y",
        "-loglevel", "error",
        "-f", "rawvideo",
        "-pix_fmt", "rgb24",
        "-s", f"{APPROACH_WIDTH}x{APPROACH_HEIGHT}",
        "-r", str(APPROACH_FPS),
        "-i", "-",
        "-an",
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "19",
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        str(output),
    ]
    process = subprocess.Popen(command, stdin=subprocess.PIPE)
    frame_count = round(APPROACH_FPS * APPROACH_DURATION)
    try:
        for frame_index in range(frame_count):
            progress = frame_index / (frame_count - 1)
            camera_progress = _smoothstep(min(1.0, progress / 0.72))
            longitude0 = math.radians(120 + (104.5 - 120) * camera_progress)
            latitude0 = math.radians(15 + (30 - 15) * camera_progress)
            start_radius = APPROACH_WIDTH * 445 / WIDTH
            end_radius = APPROACH_WIDTH * 1350 / WIDTH
            radius = start_radius + (end_radius - start_radius) * camera_progress

            nx = (xx + 0.5 - center_x) / radius
            ny = -(yy + 0.5 - center_y) / radius
            rho_sq = nx * nx + ny * ny
            rho = np.sqrt(np.clip(rho_sq, 0, 1))
            angular_distance = np.arcsin(rho)
            sin_distance = np.sin(angular_distance)
            cos_distance = np.cos(angular_distance)
            safe_rho = np.where(rho == 0, 1, rho)
            orthographic_latitude = np.arcsin(np.clip(
                cos_distance * math.sin(latitude0)
                + ny * sin_distance * math.cos(latitude0) / safe_rho,
                -1,
                1,
            ))
            orthographic_longitude = longitude0 + np.arctan2(
                nx * sin_distance,
                safe_rho * math.cos(latitude0) * cos_distance
                - ny * math.sin(latitude0) * sin_distance,
            )
            orthographic_vector = np.stack(
                (
                    np.cos(orthographic_latitude) * np.cos(orthographic_longitude),
                    np.cos(orthographic_latitude) * np.sin(orthographic_longitude),
                    np.sin(orthographic_latitude),
                ),
                axis=-1,
            )

            projection_progress = _smoothstep((progress - 0.58) / 0.42)
            geographic_vector = (
                orthographic_vector * (1 - projection_progress)
                + target_vector * projection_progress
            )
            geographic_vector /= np.linalg.norm(geographic_vector, axis=-1, keepdims=True)
            longitude = np.arctan2(geographic_vector[..., 1], geographic_vector[..., 0])
            latitude = np.arcsin(np.clip(geographic_vector[..., 2], -1, 1))
            sampled = _sample_equirectangular(texture, longitude, latitude)

            nz = np.sqrt(np.clip(1 - rho_sq, 0, 1))
            globe_light = np.clip(0.44 + 0.67 * (0.22 * nx + 0.13 * ny + 0.96 * nz), 0.33, 1.1)
            light = globe_light * (1 - projection_progress) + projection_progress
            sampled *= light[..., None]
            sampled[..., 2] *= 1.04 - 0.04 * projection_progress

            valid_globe = (rho_sq <= 1)[..., None]
            rendered = np.where(valid_globe, sampled, first)
            intro_blend = _smoothstep(progress / 0.12)
            rendered = first * (1 - intro_blend) + rendered * intro_blend
            final_blend = _smoothstep((progress - 0.93) / 0.07)
            rendered = rendered * (1 - final_blend) + second * final_blend
            frame = np.clip(rendered, 0, 255).astype(np.uint8)
            process.stdin.write(frame.tobytes())
            if frame_index % APPROACH_FPS == 0:
                print(f"rendered approach frame {frame_index + 1}/{frame_count}")
    finally:
        if process.stdin:
            process.stdin.close()
    if process.wait() != 0:
        raise RuntimeError("ffmpeg failed while encoding the Earth-to-China approach video")


def _mercator_y(latitude: float) -> float:
    latitude = max(min(latitude, 85.05112878), -85.05112878)
    return math.degrees(math.log(math.tan(math.pi / 4 + math.radians(latitude) / 2)))


def _point_line_distance(point, start, end) -> float:
    px, py = point
    sx, sy = start
    ex, ey = end
    dx = ex - sx
    dy = ey - sy
    if dx == 0 and dy == 0:
        return math.hypot(px - sx, py - sy)
    position = max(0, min(1, ((px - sx) * dx + (py - sy) * dy) / (dx * dx + dy * dy)))
    return math.hypot(px - (sx + position * dx), py - (sy + position * dy))


def _simplify_path(points, tolerance: float):
    if len(points) <= 2:
        return points
    retained = {0, len(points) - 1}
    pending = [(0, len(points) - 1)]
    while pending:
        start_index, end_index = pending.pop()
        farthest_index = 0
        farthest_distance = 0.0
        for index in range(start_index + 1, end_index):
            distance = _point_line_distance(points[index], points[start_index], points[end_index])
            if distance > farthest_distance:
                farthest_index = index
                farthest_distance = distance
        if farthest_distance <= tolerance:
            continue
        retained.add(farthest_index)
        pending.append((start_index, farthest_index))
        pending.append((farthest_index, end_index))
    return [points[index] for index in sorted(retained)]


def extract_prd_coastline(source: Path, output: Path) -> dict:
    raw = json.loads(source.read_text(encoding="utf-8"))
    paths = []
    for element in raw.get("elements", []):
        geometry = element.get("geometry") or []
        sections = []
        section = []
        for point in geometry:
            if point is None:
                if len(section) >= 2:
                    sections.append(section)
                section = []
                continue
            section.append((float(point["lon"]), float(point["lat"])))
        if len(section) >= 2:
            sections.append(section)
        for points in sections:
            simplified = _simplify_path(points, 0.00035)
            paths.append([[round(longitude, 6), round(latitude, 6)] for longitude, latitude in simplified])
    result = {
        "source": "OpenStreetMap contributors",
        "sourceUrl": PRD_SOURCE_URL,
        "license": "Open Database License (ODbL)",
        "retrievedFrom": "Overpass API",
        "osmBaseTimestamp": raw.get("osm3s", {}).get("timestamp_osm_base"),
        "bounds": {"west": PRD_BOUNDS[0], "south": PRD_BOUNDS[1], "east": PRD_BOUNDS[2], "north": PRD_BOUNDS[3]},
        "coastlines": paths,
    }
    output.write_text(json.dumps(result, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    return result


def _create_prd_projection(bounds, width: int, height: int, padding: int = 62):
    west, south, east, north = bounds
    mercator_south = _mercator_y(south)
    mercator_north = _mercator_y(north)
    scale = min(
        (width - padding * 2) / (east - west),
        (height - padding * 2) / (mercator_north - mercator_south),
    )
    map_width = (east - west) * scale
    map_height = (mercator_north - mercator_south) * scale
    offset_x = (width - map_width) / 2
    offset_y = (height - map_height) / 2

    def project(longitude: float, latitude: float):
        return (
            offset_x + (longitude - west) * scale,
            offset_y + (mercator_north - _mercator_y(latitude)) * scale,
        )

    return project, (offset_x, offset_y, offset_x + map_width, offset_y + map_height)


def _load_font(size: int, *, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        Path("C:/Windows/Fonts/msyhbd.ttc" if bold else "C:/Windows/Fonts/msyh.ttc"),
        Path("/System/Library/Fonts/PingFang.ttc"),
        Path("/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc"),
    ]
    for font_path in candidates:
        if font_path.exists():
            return ImageFont.truetype(str(font_path), size)
    return ImageFont.load_default(size=size)


def _build_land_mask(paths, project, frame) -> Image.Image:
    left, top, right, bottom = frame
    mask = Image.new("L", (WIDTH, HEIGHT), 0)
    pixels = mask.load()
    projected_segments = []
    for path in paths:
        for first, second in zip(path, path[1:]):
            longitude1, latitude1 = first
            longitude2, latitude2 = second
            x1, y1 = project(longitude1, latitude1)
            x2, y2 = project(longitude2, latitude2)
            if y1 == y2:
                continue
            projected_segments.append((x1, y1, x2, y2, latitude2 > latitude1))

    first_row = max(0, math.floor(top))
    last_row = min(HEIGHT - 1, math.ceil(bottom))
    left_column = max(0, math.floor(left))
    right_column = min(WIDTH - 1, math.ceil(right))
    _, mainland_cutoff_y = project(PRD_BOUNDS[0], 22.78)
    for y in range(first_row, last_row + 1):
        sample_y = y + 0.5
        crossings = []
        for x1, y1, x2, y2, moves_north in projected_segments:
            if not ((y1 <= sample_y < y2) or (y2 <= sample_y < y1)):
                continue
            ratio = (sample_y - y1) / (y2 - y1)
            crossings.append((x1 + (x2 - x1) * ratio, moves_north))
        if not crossings:
            if y <= mainland_cutoff_y:
                for x in range(left_column, right_column + 1):
                    pixels[x, y] = 255
            continue
        crossings.sort(key=lambda crossing: crossing[0])
        land = crossings[0][1]
        cursor = left_column
        for crossing_x, moves_north in crossings:
            crossing_column = max(left_column, min(right_column, round(crossing_x)))
            if land:
                for x in range(cursor, crossing_column + 1):
                    pixels[x, y] = 255
            land = not moves_north
            cursor = crossing_column
        if land:
            for x in range(cursor, right_column + 1):
                pixels[x, y] = 255
    return mask


def build_pearl_river_delta_tech_map(coastline_data: dict, output: Path) -> None:
    project, frame = _create_prd_projection(PRD_BOUNDS, WIDTH, HEIGHT)
    yy, xx = np.mgrid[0:HEIGHT, 0:WIDTH]
    distance = np.sqrt(((xx - WIDTH * 0.52) / WIDTH) ** 2 + ((yy - HEIGHT * 0.48) / HEIGHT) ** 2)
    background = np.zeros((HEIGHT, WIDTH, 3), dtype=np.uint8)
    background[..., 0] = np.clip(3 + yy / HEIGHT * 3, 0, 255)
    background[..., 1] = np.clip(16 + yy / HEIGHT * 12 - distance * 10, 5, 255)
    background[..., 2] = np.clip(30 + yy / HEIGHT * 20 - distance * 12, 12, 255)
    canvas = Image.fromarray(background, "RGB").convert("RGBA")

    coastlines = coastline_data["coastlines"]
    land_mask = _build_land_mask(coastlines, project, frame)
    land_layer = Image.new("RGBA", (WIDTH, HEIGHT), (18, 55, 69, 255))
    land_texture = np.asarray(land_layer).copy()
    land_texture[..., 1] += np.clip((HEIGHT - yy) / HEIGHT * 8, 0, 8).astype(np.uint8)
    land_layer = Image.fromarray(land_texture, "RGBA")
    land_layer.putalpha(land_mask)
    canvas.alpha_composite(land_layer)

    grid = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    grid_draw = ImageDraw.Draw(grid)
    for longitude in (112.5, 113.0, 113.5, 114.0, 114.5):
        x, _ = project(longitude, PRD_BOUNDS[1])
        grid_draw.line((x, frame[1], x, frame[3]), fill=(94, 196, 218, 24), width=1)
    for latitude in (22.0, 22.5, 23.0, 23.5):
        _, y = project(PRD_BOUNDS[0], latitude)
        grid_draw.line((frame[0], y, frame[2], y), fill=(94, 196, 218, 24), width=1)
    canvas.alpha_composite(grid)

    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    line_layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    line_draw = ImageDraw.Draw(line_layer)
    for path in coastlines:
        projected = [project(longitude, latitude) for longitude, latitude in path]
        if len(projected) < 2:
            continue
        glow_draw.line(projected, fill=(69, 215, 242, 92), width=7, joint="curve")
        line_draw.line(projected, fill=(105, 224, 244, 218), width=2, joint="curve")
    glow = glow.filter(ImageFilter.GaussianBlur(5))
    canvas.alpha_composite(glow)
    canvas.alpha_composite(line_layer)

    hud = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    hud_draw = ImageDraw.Draw(hud)
    target_x, target_y = project(PRD_TARGET["longitude"], PRD_TARGET["latitude"])
    for radius, alpha, width in ((72, 76, 2), (122, 44, 2), (190, 24, 1)):
        hud_draw.arc(
            (target_x - radius, target_y - radius, target_x + radius, target_y + radius),
            198,
            512,
            fill=(102, 226, 240, alpha),
            width=width,
        )
    hud_draw.line((target_x - 250, target_y, target_x - 64, target_y), fill=(95, 213, 232, 36), width=1)
    hud_draw.line((target_x + 64, target_y, target_x + 250, target_y), fill=(95, 213, 232, 36), width=1)
    hud_draw.line((target_x, target_y - 210, target_x, target_y - 64), fill=(95, 213, 232, 36), width=1)
    canvas.alpha_composite(hud)

    labels = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    label_draw = ImageDraw.Draw(labels)
    label_font = _load_font(25)
    city_font = _load_font(30, bold=True)
    for city in PRD_CITIES:
        x, y = project(city["longitude"], city["latitude"])
        label_draw.ellipse((x - 4, y - 4, x + 4, y + 4), fill=(118, 224, 241, 220))
        label_draw.ellipse((x - 10, y - 10, x + 10, y + 10), outline=(96, 207, 228, 70), width=1)
        offset_x, offset_y = city["offset"]
        label_draw.text((x + offset_x, y + offset_y), city["name"], font=label_font, fill=(191, 231, 237, 205))

    title_font = _load_font(40, bold=True)
    small_font = _load_font(19)
    label_draw.text((74, 70), "珠江口 · 粤港澳大湾区", font=title_font, fill=(210, 242, 246, 235))
    label_draw.text((77, 126), "RETURN NAVIGATION / FINAL APPROACH", font=small_font, fill=(94, 190, 209, 150))
    label_draw.line((76, 158, 342, 158), fill=(94, 190, 209, 80), width=1)
    label_draw.text((76, 174), "22.27°N  113.58°E", font=city_font, fill=(224, 201, 120, 220))
    canvas.alpha_composite(labels)

    canvas.convert("RGB").save(output, "PNG", optimize=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bmng-source", type=Path)
    parser.add_argument("--coastline-source", type=Path)
    parser.add_argument("--ffmpeg-bin", type=Path)
    parser.add_argument("--output-dir", required=True, type=Path)
    args = parser.parse_args()
    if not args.bmng_source and not args.coastline_source:
        parser.error("provide --bmng-source and/or --coastline-source")
    args.output_dir.mkdir(parents=True, exist_ok=True)
    if args.bmng_source:
        with Image.open(args.bmng_source) as source:
            build_asia_pacific_globe(source, args.output_dir / "earth-asia-pacific.jpg")
        with Image.open(args.bmng_source) as source:
            build_china_south_sea(source, args.output_dir / "china-south-sea.jpg")
        if args.ffmpeg_bin:
            with Image.open(args.bmng_source) as source:
                build_earth_to_china_approach(
                    source,
                    args.output_dir / "earth-asia-pacific.jpg",
                    args.output_dir / "china-south-sea.jpg",
                    args.output_dir / "earth-to-china-south-sea.mp4",
                    args.ffmpeg_bin,
                )
    if args.coastline_source:
        coastline_data = extract_prd_coastline(
            args.coastline_source,
            args.output_dir / "pearl-river-delta-osm-coastline.json",
        )
        build_pearl_river_delta_tech_map(
            coastline_data,
            args.output_dir / "pearl-river-delta-tech-map.png",
        )


if __name__ == "__main__":
    main()
