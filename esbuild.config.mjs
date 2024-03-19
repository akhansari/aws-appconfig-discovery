import esbuild from "esbuild"

await esbuild.build({
  entryPoints: ["src/lambda.ts"],
  bundle: true,
  platform: "node",
  outdir: "./dist",
})
