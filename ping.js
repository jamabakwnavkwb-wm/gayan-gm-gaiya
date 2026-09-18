/**
 * .ping Command
 * Measures speed, uptime, and bot health
 */
import os from 'os';
import { botConfig } from '../config.js';

export async function handlePing({ sock, remoteJid, msg, startTime, currentPrefix }) {
  const latency = Date.now() - startTime;
  const uptime = formatUptime(process.uptime());
  const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
  const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(1);

  const pingMessage = [
    '⚡ *P O N G !*',
    '═══════════════════',
    '📡 *Response Latency:* ' + latency + 'ms',
    '⏱️ *Uptime:* ' + uptime,
    '💾 *RAM Used:* ' + ramUsage + ' MB / ' + totalRam + ' GB',
    '🔣 *Current Prefix:* ```' + currentPrefix + '```',
    '👑 *Auto-React:* ' + (botConfig.autoReactEnabled ? '🟢 ON' : '🔴 OFF'),
    '🎯 *Target:* ' + botConfig.targetNumber + ' (' + botConfig.reactEmojis.join(' ') + ')',
    '═══════════════════',
    '_Type ' + currentPrefix + 'setting to configure bot_'
  ].join('\n');

  await sock.sendMessage(remoteJid, { text: pingMessage }, { quoted: msg });
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return (d > 0 ? d + 'd ' : '') + h + 'h ' + m + 'm ' + s + 's';
}