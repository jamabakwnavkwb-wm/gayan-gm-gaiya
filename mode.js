/**
 * .mode Command
 * Configures bot work mode: public | private | inbox | group
 */
import { botConfig, saveConfig } from '../config.js';

export async function handleMode({ sock, remoteJid, msg, args, currentPrefix }) {
  const chosen = (args[0] || '').toLowerCase().trim();
  if (['public', 'private', 'inbox', 'group'].includes(chosen)) {
    botConfig.workMode = chosen;
    saveConfig();
    const reply = [
      '🔒 *BOT WORK MODE UPDATED!*',
      '═══════════════════',
      '🔹 *Active Mode:* ```' + chosen.toUpperCase() + '```',
      '',
      '• public: Anyone can use commands anywhere (Inbox & Groups)',
      '• private: Only bot owner can run commands',
      '• inbox: Commands only work in personal DM / Inbox',
      '• group: Commands only work inside WhatsApp groups',
      '═══════════════════'
    ].join('\n');
    return await sock.sendMessage(remoteJid, { text: reply }, { quoted: msg });
  }
  const help = [
    '⚠️ *Usage of ' + currentPrefix + 'mode:*',
    '```' + currentPrefix + 'mode <public|private|inbox|group>```',
    '',
    '🔹 Current Mode: ```' + (botConfig.workMode || 'public').toUpperCase() + '```',
    '• public ➞ All chats',
    '• private ➞ Owner only',
    '• inbox ➞ Inbox only',
    '• group ➞ Groups only'
  ].join('\n');
  return await sock.sendMessage(remoteJid, { text: help }, { quoted: msg });
}