@echo off

wasm-pack build --release --target web --no-pack --out-dir dist/lib

node patch.mjs
node test.js
