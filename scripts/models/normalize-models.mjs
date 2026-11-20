// Normalizes third-party GLBs into real-world meters + the site's installed orientation,
// then compresses (WebP textures, meshopt geometry).
import { NodeIO, getBounds } from "@gltf-transform/core";
import { ALL_EXTENSIONS, EXTMeshoptCompression } from "@gltf-transform/extensions";
import {
  dedup,
  prune,
  textureCompress,
  meshopt,
  weld,
  flatten,
  join,
  simplify,
  resample,
} from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptSimplifier, MeshoptDecoder } from "meshoptimizer";
import sharp from "sharp";
import draco3d from "draco3dgltf";
import fs from "fs";
await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  "meshopt.encoder": MeshoptEncoder,
  "meshopt.decoder": MeshoptDecoder,
  "draco3d.decoder": await draco3d.createDecoderModule(),
});
const cfg = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const only = process.argv[3];
const report = [];
for (const m of cfg) {
  if (only && m.out !== only) continue;
  const doc = await io.read(m.src);
  for (const e of doc.getRoot().listExtensionsUsed())
    if (e.extensionName === "KHR_draco_mesh_compression") e.dispose();
  const root = doc.getRoot();
  const scene = root.getDefaultScene() || root.listScenes()[0];
  // license metadata survives in asset.extras
  const extras = root.getAsset().extras || {};
  // R columns = where native +X,+Y,+Z go
  const [ex, ey, ez] = m.axes || [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ];
  const det =
    ex[0] * (ey[1] * ez[2] - ez[1] * ey[2]) -
    ey[0] * (ex[1] * ez[2] - ez[1] * ex[2]) +
    ez[0] * (ex[1] * ey[2] - ey[1] * ex[2]);
  if (Math.abs(det - 1) > 1e-6) throw new Error(m.out + " axes not a rotation, det=" + det);
  const wrap = doc.createNode("normalized");
  for (const c of scene.listChildren()) {
    scene.removeChild(c);
    wrap.addChild(c);
  }
  scene.addChild(wrap);
  wrap.setMatrix([
    ex[0],
    ex[1],
    ex[2],
    0,
    ey[0],
    ey[1],
    ey[2],
    0,
    ez[0],
    ez[1],
    ez[2],
    0,
    0,
    0,
    0,
    1,
  ]);
  let b = getBounds(scene);
  const size = b.max.map((v, i) => v - b.min[i]);
  const ai = { x: 0, y: 1, z: 2 }[m.fit[0]];
  const s = m.fit[1] / size[ai];
  const M = [
    ex[0] * s,
    ex[1] * s,
    ex[2] * s,
    0,
    ey[0] * s,
    ey[1] * s,
    ey[2] * s,
    0,
    ez[0] * s,
    ez[1] * s,
    ez[2] * s,
    0,
    0,
    0,
    0,
    1,
  ];
  wrap.setMatrix(M);
  b = getBounds(scene);
  const c = b.min.map((v, i) => (v + b.max[i]) / 2);
  const t = [-c[0], m.anchor === "bottom" ? -b.min[1] : -c[1], -c[2]];
  M[12] = t[0];
  M[13] = t[1];
  M[14] = t[2];
  wrap.setMatrix(M);
  // optional material restyle hook
  for (const mat of root.listMaterials()) {
    const r = (m.restyle || []).find((r) => new RegExp(r.match, "i").test(mat.getName() || ""));
    if (!r) continue;
    if (r.color) mat.setBaseColorFactor(r.color);
    if (r.metal !== undefined) mat.setMetallicFactor(r.metal);
    if (r.rough !== undefined) mat.setRoughnessFactor(r.rough);
    if (r.emissive) mat.setEmissiveFactor(r.emissive);
    if (r.noTex) mat.setBaseColorTexture(null);
  }
  await doc.transform(
    dedup(),
    prune(),
    weld(),
    ...(m.simplify
      ? [simplify({ simplifier: MeshoptSimplifier, ratio: m.simplify, error: 0.0005 })]
      : []),
    textureCompress({
      encoder: sharp,
      targetFormat: "webp",
      resize: [m.tex || 1024, m.tex || 1024],
      quality: 88,
    }),
    meshopt({ encoder: MeshoptEncoder, level: "medium" }),
  );
  root.getAsset().extras = { ...extras, normalizedBy: "pc-builder normalize.mjs", units: "meters" };
  fs.mkdirSync(m.out.split("/").slice(0, -1).join("/"), { recursive: true });
  await io.write(m.out, doc);
  const fb = getBounds(scene).max.map((v, i) => (v - getBounds(scene).min[i]).toFixed(3));
  report.push(
    `${m.out.split("/").slice(-2).join("/")}  ${fb.join("x")}  ${(fs.statSync(m.out).size / 1e6).toFixed(2)}MB  ${extras.license || ""}`,
  );
}
console.log(report.join("\n"));
