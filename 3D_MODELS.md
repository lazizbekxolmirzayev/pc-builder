# Photoreal 3D models

The 3D viewer (`/view3d`), the builder's live preview, every component page and the
"Photoreal 3D models" library all load the real, textured GLB models in `public/models/`.

## What is in the library

| Folder | Model | Used for | Author · licence |
|---|---|---|---|
| gpus/rtx-founders.glb | GeForce RTX Founders Edition | all NVIDIA cards | Muhammad Kholis · CC BY 4.0 |
| gpus/radeon-dual-fan.glb | Radeon dual-fan card | AMD + Intel cards | Igor.Jop · CC BY 4.0 |
| cpus/ryzen-9.glb | AMD Ryzen 9 | Ryzen 9 CPUs | Igor.Jop · CC BY 4.0 |
| cpus/ryzen-5.glb | AMD Ryzen 5 | Ryzen 5 / 7 CPUs | Fochdog · CC BY 4.0 |
| cpus/intel-core.glb | Intel Core | Core i5/i7/i9 | Kuat-Entralla 3D Engineering · CC BY 4.0 |
| cpus/intel-core-ultra.glb | Intel Core Ultra | Core Ultra | Moonway 3D · CC BY 4.0 |
| motherboards/am4-board.glb | Gigabyte B450M board | all motherboards | Temoor · CC BY 4.0 |
| ram/hyperx-fury.glb | HyperX Fury DIMM | most RAM kits | Astrien · CC BY 4.0 |
| ram/crucial-ddr4.glb | Crucial DDR4 DIMM | Crucial / Patriot / LPX kits | BlackCube · CC BY 4.0 |
| storage/nvme-m2.glb | Samsung 970 EVO Plus M.2 | NVMe drives (mounted on the board) | Igor.Jop · CC BY 4.0 |
| storage/sata-ssd.glb | 2.5" SATA SSD | SATA SSD / HDD | jcbinet · CC BY 4.0 |
| psu/atx-psu.glb | Aerocool KCAS ATX PSU | all PSUs | nofurion · CC BY 4.0 |
| coolers/hyper-212.glb | Cooler Master tower | CM / Thermalright / DeepCool / ID-Cooling | wanderer · CC BY 4.0 |
| coolers/black-tower.glb | Black tower cooler | Noctua chromax / be quiet! / AIO fallback | Fochdog · CC BY 4.0 |
| cases/glass-tower.glb | Tempered-glass mid tower (3 front fans) | all cases | Harit · CC BY 4.0 |
| cases/corsair-4000d.glb | Corsair 4000D | library only | user-provided |
| fans/argb-120.glb | 120 mm ARGB fan | rear + top fans | original (scripts/models/blender/fan.py) |
| setup/monitor-27.glb | ASUS TUF monitor | monitors (scaled by inch size) | Artik · CC BY 4.0 |
| setup/keyboard-rgb.glb | AORUS K1 RGB keyboard | keyboards | Yolala1232 · CC BY 4.0 |
| setup/mouse-gaming.glb | Gaming mouse | mice | zhe_kan · CC BY 4.0 |
| setup/desk-mat.glb | Damascus desk mat | desk scene | supahot · CC BY 4.0 |
| setup/desk-walnut.glb | Walnut steel-frame desk | desks | original (scripts/models/blender/desk.py) |
| setup/gaming-chair.glb | Red gaming chair | chairs | user-provided |
| decor/ficus-plant.glb | Ficus lyrata | desk scene decor | LadyCris · CC BY 4.0 |

Source pages are in `src/data/models3d.ts`. **CC BY 4.0 requires visible credit** — it is shown on
the About page and under each model in the 3D library. Keep it if you publish the site.

## Conventions (why the parts line up)

All files were run through `scripts/models/normalize-models.mjs`:

* real-world **meters** (GPU 313 mm long, DIMM 133 mm, 27" monitor 615 mm wide)
* **installed orientation** in case-local axes: glass side = -X, front = +Z, up = +Y.
  The motherboard faces -X, GPU fans face down with the bracket at the rear, RAM contacts point
  into the board, the cooler base touches the CPU.
* peripherals stand on y = 0 and face the user (+Z)
* WebP textures (1–2K) + meshopt geometry → the library went from ~85 MB to ~37 MB

`src/components/site/RealPcScene.tsx` then only needs positions (`LAYOUT`), and
`src/data/models3d.ts → modelFor(part)` chooses the closest model for each catalogue part.

## Rendering

* HDRI image-based lighting (`public/hdri/studio_small_03_1k.hdr`, CC0 Poly Haven via pmndrs/drei-assets)
* soft shadows, contact shadows, reflective floor
* ACES tone mapping, bloom for ARGB fans/LEDs, SMAA, vignette (`@react-three/postprocessing`)
* the RGB colour picker drives every emissive ARGB material; the monitor shows a live wallpaper

## Adding another model

1. Download a GLB (Sketchfab "Download → glTF/GLB"; check the licence is CC0 or CC BY, not NC/ND).
2. Put it in `scripts/models/raw/`.
3. Add an entry to `scripts/models/models.json`:
   * `axes` – where the model's native +X, +Y, +Z should point (must be a rotation)
   * `fit` – `["x"|"y"|"z", meters]` real size along that axis after rotation
   * `anchor: "bottom"` for things that stand on a surface, `tex` for texture size
4. `npm run models:normalize`
5. Register it in `src/data/models3d.ts` (and in `modelFor` if it should be used for parts).
