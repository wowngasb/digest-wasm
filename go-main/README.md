# WebAssembly main execution example

A simple hello world that prints to the browser console.

``` sh
../tinygo build -o wasm.wasm -target wasm ./main.go

python2 -m SimpleHTTPServer 8080

http://127.0.0.1:8080/

```

## License

Note that `index.html` is copied almost verbatim from the Go 1.12 source at
`$GOROOT/misc/wasm/wasm_exec.html`. Its license applies to this file.
