/**
 * .apply Command
 * Supports:
 * 1. .apply prefix <char> (e.g. .apply prefix #, .apply prefix !)
 * 2. .apply <emoji> (e.g. .apply 👑 or .apply 🔥)
 */
import { botConfig, saveConfig } from '../config.js';

export async function handleApply({ sock, remoteJid, msg, args, currentPrefix }) {
  if (!args || args.length === 0) {
    const helpMsg = [
      '❌ *Invalid Usage of ' + currentPrefix + 'apply*',
      '',
      '*1. Change Prefix:*',
      '```' + currentPrefix + 'apply prefix <symbol>```',
      'Example: ```' + currentPrefix + 'apply prefix #```',
      'Allowed: ' + botConfig.allowedPrefixes.join('  '),
      '',
      '*2. Change Auto-Reaction Emoji (Single):*',
      '```' + currentPrefix + 'apply <emoji>```',
      'Example: ```' + currentPrefix + 'apply 👑```',
      'Example: ```' + currentPrefix + 'apply 🔥```'
    ].join('\n');

    return await sock.sendMessage(remoteJid, { text: helpMsg }, { quoted: msg });
  }

  // Case 1: .apply prefix <symbol>
  if (args[0].toLowerCase() === 'prefix') {
    const newPrefix = args[1]?.trim();
    if (!newPrefix) {
      return await sock.sendMessage(remoteJid, {
        text: '⚠️ Please provide a prefix symbol. Example: ```' + currentPrefix + 'apply prefix #```'
      }, { quoted: msg });
    }

    if (!botConfig.allowedPrefixes.includes(newPrefix)) {
      return await sock.sendMessage(remoteJid, {
        text: '⚠️ Prefix ' + newPrefix + ' is not allowed! Allowed: ' + botConfig.allowedPrefixes.join(', ')
      }, { quoted: msg });
    }

    botConfig.prefix = newPrefix;
    saveConfig();

    const successMsg = [
      '✅ *PREFIX UPDATED SUCCESSFULLY*',
      '═══════════════════',
      '🔹 *Old Prefix:* ```' + currentPrefix + '```',
      '🔹 *New Prefix:* ```' + newPrefix + '```',
      '',
      'You can now use commands with:',
      '• ```' + newPrefix + 'ping```',
      '• ```' + newPrefix + 'setting```',
      '• ```' + newPrefix + 'apply```',
      '═══════════════════'
    ].join('\n');

    return await sock.sendMessage(remoteJid, { text: successMsg }, { quoted: msg });
  }

  // Case 2: .apply <emoji> (e.g. .apply 👑 or .apply 🔥)
  const fullText = args.join(' ');
  const splitEmojis = fullText.split(/[,+\s]+/).filter(Boolean);

  if (splitEmojis.length > 0) {
    const chosen = splitEmojis[0] || '👑';
    botConfig.reactEmojis = [chosen];
    saveConfig();

    const emojiSuccessMsg = [
      '👑 *REACTION EMOJI UPDATED (එක ඉමොජියක්)*',
      '═══════════════════',
      '✨ *Active Emoji:* ' + chosen,
      '🎯 *Target Number:* ' + botConfig.targetNumber,
      '⚡ *Status:* ' + (botConfig.autoReactEnabled ? 'Active (Auto-Reacting 🟢)' : 'Disabled in .setting 🔴'),
      '👑 *Self-React (අපේ මැසේජ්):* ' + (botConfig.reactOnMyMessages ? '🟢 ON' : '🔴 OFF'),
      '',
      'Whenever messages are sent, the bot will auto-react with single emoji: ' + chosen + '!',
      '═══════════════════'
    ].join('\n');

    return await sock.sendMessage(remoteJid, { text: emojiSuccessMsg }, { quoted: msg });
  }
}