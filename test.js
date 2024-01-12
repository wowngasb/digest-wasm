const {Md5, Sha256, Sha512} = require("./dist/digest_wasm")
const {readFile} = require("fs/promises");

(async () => {
    const data = await readFile("./LICENSE")

    const md5 = await Md5.digest_u8(new Uint8Array(data))
    console.assert(md5 === "86d3f3a95c324c9479bd8986968f4327", md5 + " MD5 计算结果不正确")

    const sha256 = await Sha256.digest_u8(new Uint8Array(data))
    console.assert(sha256 === "c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4", sha256 + " SHA256 计算结果不正确")

    const sha512 = await Sha512.digest_u8(new Uint8Array(data))
    console.assert(sha512 === "dc6b68d13b8cf959644b935f1192b02c71aa7a5cf653bd43b4480fa89eec8d4d3f16a2278ec8c3b40ab1fdb233b3173a78fd83590d6f739e0c9e8ff56c282557", sha512 + " SHA512 计算结果不正确")

    console.log("Test Done!")
})()