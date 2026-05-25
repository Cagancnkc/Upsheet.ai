'use strict';
const crypto = require('crypto');
const ALG = 'aes-256-gcm';

function getKey() {
  const hex = process.env.ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    // Dev fallback — deterministic, never use in production
    return Buffer.alloc(32).fill('mocksheets-dev-key-not-for-prod!');
  }
  return Buffer.from(hex, 'hex');
}

function encrypt(plaintext) {
  if (plaintext == null) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALG, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return JSON.stringify({
    iv: iv.toString('hex'),
    data: encrypted.toString('hex'),
    tag: tag.toString('hex'),
  });
}

function decrypt(ciphertext) {
  if (!ciphertext) return null;
  try {
    const { iv, data, tag } = JSON.parse(ciphertext);
    const decipher = crypto.createDecipheriv(ALG, getKey(), Buffer.from(iv, 'hex'));
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    const dec = Buffer.concat([decipher.update(Buffer.from(data, 'hex')), decipher.final()]);
    return dec.toString('utf8');
  } catch {
    return null;
  }
}

module.exports = { encrypt, decrypt };
