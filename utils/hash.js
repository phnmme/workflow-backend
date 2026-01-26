const { hash: argon2Hash, argon2id } = require("argon2");
const env = require("../configs/env");

const passwordHasher = {
  async hashPassword(input) {
    const hash = await argon2Hash(input, {
      version: 19,
      type: argon2id,
      hashLength: 64,
      timeCost: 12,
      parallelism: 8,
      memoryCost: 2 ** 16,
      raw: true,
      salt: Buffer.from(env.entropy, "utf-8"),
    }).then((hash) => hash.toString("base64"));

    return hash;
  },

  async verifyPassword(input, storedHash) {
    const inputHash = await passwordHasher.hashPassword(input);
    return inputHash === storedHash;
  },
};

module.exports = passwordHasher;
