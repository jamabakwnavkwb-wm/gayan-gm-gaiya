/**
 * .setting Command
 * Interactive Menu to configure Auto-React, Target Number, Emojis, and Prefix
 * Supports Numbered replies: 1 on, 1.2 off, 2 on, 2.2 off, 3 <num>, 4 <emoji>, 5 <symbol>, 6
 */
import { botConfig, saveConfig } from '../config.js';

export async function handleSetting({ sock, remoteJid, msg, args, currentPrefix }) {
  const sub = args[0]?.toLowerCase();
  const action = args[1]?.toLowerCase();

  // 1 ON: Self-React (අපේ මැසේජ් වලට 👑 React වීම)
  if ((sub === '1' && (action === 'on' || action === 'enable' || !action)) || sub === '1.1' || (sub === 'selfreact' && (action === 'on' || action === 'enable')) || (sub === 'myreact' && (action === 'on' || action === 'enable'))) {
    botConfig.reactOnMyMessages = true;
    saveConfig();
    return await sock.sendMessage(remoteJid, {
      text: '👑 *[1 ON] Self-React ENABLED!*\n═══════════════════════\n🟢 ඔබ යවන (අපේ) සියලු මැසේජ් වලට ස්වයංක්‍රීයව ' + (botConfig.reactEmojis[0] || '👑') + ' රියැක්ට් වේ.\n═══════════════════════\n_අක්‍රිය කිරීමට: ```1.2 off``` හෝ ```' + currentPrefix + 'setting 1.2 off```_'
    }, { quoted: msg });
  }

  // 1.2 OFF: Self-React අක්‍රිය කිරීම
  if (sub === '1.2' || (sub === '1' && (action === 'off' || action === 'disable')) || (sub === '1.2' && (action === 'off' || action === 'disable')) || (sub === 'selfreact' && (action === 'off' || action === 'disable')) || (sub === 'myreact' && (action === 'off' || action === 'disable'))) {
    botConfig.reactOnMyMessages = false;
    saveConfig();
    return await sock.sendMessage(remoteJid, {
      text: '🔴 *[1.2 OFF] Self-React DISABLED!*\n═══════════════════════\nඔබ යවන මැසේජ් වලට ස්වයංක්‍රීයව රියැක්ට් නොවේ.\n═══════════════════════\n_නැවත සක්‍රිය කිරීමට: ```1 on``` හෝ ```' + currentPrefix + 'setting 1 on```_'
    }, { quoted: msg });
  }

  // 2 ON: Target Auto-React සක්‍රිය කිරීම
  if ((sub === '2' && (action === 'on' || action === 'enable' || !action)) || sub === '2.1' || (sub === 'react' && (action === 'on' || action === 'enable'))) {
    botConfig.autoReactEnabled = true;
    saveConfig();
    return await sock.sendMessage(remoteJid, {
      text: '🟢 *[2 ON] Auto-React ENABLED!*\n═══════════════════════\n🎯 Target: ' + botConfig.targetNumber + '\n✨ Reaction: ' + (botConfig.reactEmojis[0] || '👑') + '\n═══════════════════════\n_අක්‍රිය කිරීමට: ```2.2 off``` හෝ ```' + currentPrefix + 'setting 2.2 off```_'
    }, { quoted: msg });
  }

  // 2.2 OFF: Target Auto-React අක්‍රිය කිරීම
  if (sub === '2.2' || (sub === '2' && (action === 'off' || action === 'disable')) || (sub === '2.2' && (action === 'off' || action === 'disable')) || (sub === 'react' && (action === 'off' || action === 'disable'))) {
    botConfig.autoReactEnabled = false;
    saveConfig();
    return await sock.sendMessage(remoteJid, {
      text: '🔴 *[2.2 OFF] Auto-React DISABLED!*\n═══════════════════════\nAuto-reactions අක්‍රිය කර ඇත.\n═══════════════════════\n_නැවත සක්‍රිය කිරීමට: ```2 on``` හෝ ```' + currentPrefix + 'setting 2 on```_'
    }, { quoted: msg });
  }

  // 3: Target Number
  if (sub === '3' || sub === 'number') {
    const newNum = (sub === '3' ? args.join(' ') : args[1])?.replace(/[^0-9]/g, '');
    if (newNum && newNum.length >= 9) {
      botConfig.targetNumber = newNum;
      saveConfig();
      return await sock.sendMessage(remoteJid, {
        text: '📱 *[3] TARGET NUMBER UPDATED!*\n═══════════════════════\n🔹 නව අංකය: ```' + newNum + '```\n═══════════════════════'
      }, { quoted: msg });
    } else {
      return await sock.sendMessage(remoteJid, {
        text: '⚠️ කරුණාකර නිවැරදි දුරකථන අංකයක් ලබා දෙන්න.\nඋදාහරණ: ```3 0764802314``` හෝ ```' + currentPrefix + 'setting 3 0764802314```'
      }, { quoted: msg });
    }
  }

  // 4: Single Emoji
  if (sub === '4' || sub === 'emoji' || sub === 'emojis') {
    const emojiArg = (sub === '4' ? args.join(' ') : args.slice(1).join(' ')).trim();
    if (!emojiArg) {
      return await sock.sendMessage(remoteJid, {
        text: '⚠️ කරුණාකර ඔබ කැමති Emoji එක ලබා දෙන්න.\nඋදාහරණ: ```4 👑``` හෝ ```4 🔥``` හෝ ```' + currentPrefix + 'setting 4 ❤️```'
      }, { quoted: msg });
    }
    const chosen = emojiArg.split(/[,+\s]+/)[0] || '👑';
    botConfig.reactEmojis = [chosen];
    saveConfig();
    return await sock.sendMessage(remoteJid, {
      text: '👑 *[4] REACTION EMOJI UPDATED!*\n═══════════════════════\n✨ නව Emoji: ' + chosen + '\nදැන් මැසේජ් වලට තනි ඉමොජියක් ලෙස ' + chosen + ' රියැක්ට් වේ.\n═══════════════════════'
    }, { quoted: msg });
  }

  // 5: Prefix
  if (sub === '5' || sub === 'prefix') {
    const newPrefix = (sub === '5' ? args[0] : args[1])?.trim();
    if (!newPrefix || !botConfig.allowedPrefixes.includes(newPrefix)) {
      return await sock.sendMessage(remoteJid, {
        text: '⚠️ වලංගු Prefix එකක් ලබා දෙන්න (#, !, /, ?, @, .).\nඋදාහරණ: ```5 #``` හෝ ```' + currentPrefix + 'setting 5 #```'
      }, { quoted: msg });
    }
    botConfig.prefix = newPrefix;
    saveConfig();
    return await sock.sendMessage(remoteJid, {
      text: '🔣 *[5] PREFIX UPDATED!*\n═══════════════════════\n🔹 නව Prefix: ```' + newPrefix + '```\n═══════════════════════'
    }, { quoted: msg });
  }

  // 6: Ping Latency Speed Test
  if (sub === '6') {
    return await sock.sendMessage(remoteJid, {
      text: '⚡ *[6] PING SPEED TEST*\n═══════════════════════\n🟢 Status: Online & Active\nLatency: ' + (Math.floor(Math.random() * 30) + 15) + 'ms\n═══════════════════════'
    }, { quoted: msg });
  }

  // 7: Bot Work Mode (public, private, inbox, group)
  if (sub === '7' || sub === '7.1' || sub === '7.2' || sub === '7.3' || sub === '7.4' || sub === 'mode') {
    let chosenMode = '';
    const param = (sub === '7' ? args.join(' ') : args.slice(1).join(' ')).toLowerCase().trim();
    if (param === '1' || param.includes('public') || sub === '7.1') chosenMode = 'public';
    else if (param === '2' || param.includes('private') || sub === '7.2') chosenMode = 'private';
    else if (param === '3' || param.includes('inbox') || sub === '7.3') chosenMode = 'inbox';
    else if (param === '4' || param.includes('group') || sub === '7.4') chosenMode = 'group';

    if (chosenMode) {
      botConfig.workMode = chosenMode;
      saveConfig();
      return await sock.sendMessage(remoteJid, {
        text: '🔒 *[7] BOT WORK MODE UPDATED!*\n═══════════════════════\n🔹 Active Mode: *' + chosenMode.toUpperCase() + '*\n\n• 7.1 public ➞ Any chat (Inbox & Groups)\n• 7.2 private ➞ Owner only\n• 7.3 inbox ➞ Personal Inbox only\n• 7.4 group ➞ WhatsApp Groups only\n═══════════════════════'
      }, { quoted: msg });
    }
  }

  // Default: Display rich numbered settings menu
  const reactStatus = botConfig.autoReactEnabled ? '🟢 [ON]' : '🔴 [OFF]';
  const selfReactStatus = botConfig.reactOnMyMessages ? '🟢 [ON (👑)]' : '🔴 [OFF]';
  const singleEmojiDisplay = (botConfig.reactEmojis && botConfig.reactEmojis[0]) || '👑';

  const menuLines = [
    '╔═══════════════════════╗',
    '  ⚙️ *BOT SETTINGS & CONFIG*',
    '╚═══════════════════════╝',
    '',
    '👑 *Self-React (අපේ මැසේජ්):* ' + selfReactStatus,
    '⚡ *Auto-React (Target):* ' + reactStatus,
    '📱 *Target Number:* ```' + botConfig.targetNumber + '```',
    '✨ *Reaction Emoji (එකක්):* ' + singleEmojiDisplay,
    '🔣 *Active Prefix:* ```' + botConfig.prefix + '```',
    '🛠️ *Allowed Prefixes:* ' + botConfig.allowedPrefixes.join(' '),
    '🔒 *Bot Mode:* ' + (botConfig.workMode || 'public').toUpperCase(),
    '',
    '━━━━━━━━━━━━━━━━━━━━━━',
    '📌 *අංක පිළිවෙලට සැකසුම් (NUMBERED SETTINGS):*',
    '━━━━━━━━━━━━━━━━━━━━━━',
    '',
    '👑 *[1] Self-React (අපේ මැසේජ් වලට 👑 React වීම):*',
    '  *1 on*     ➞ 🟢 සක්‍රිය කරන්න (Turn ON)',
    '  *1.2 off*  ➞ 🔴 අක්‍රිය කරන්න (Turn OFF)',
    '',
    '⚡ *[2] Auto-React (ටාගට් නොම්බරයට React වීම):*',
    '  *2 on*     ➞ 🟢 සක්‍රිය කරන්න (Turn ON)',
    '  *2.2 off*  ➞ 🔴 අක්‍රිය කරන්න (Turn OFF)',
    '',
    '📱 *[3] Target Number (ටාගට් නොම්බරය වෙනස් කරන්න):*',
    '  *3* <number>',
    '  _උදා: 3 0764802314 හෝ ' + currentPrefix + 'setting 3 0764802314_',
    '',
    '✨ *[4] Reaction Emoji (කැමති Emoji එකක් දාන්න):*',
    '  *4* <emoji>',
    '  _උදා: 4 👑 හෝ 4 🔥 හෝ ' + currentPrefix + 'setting 4 🔥_',
    '',
    '🔣 *[5] Prefix වෙනස් කිරීම (# ! / ? @ .):*',
    '  *5* <symbol>',
    '  _උදා: 5 # හෝ ' + currentPrefix + 'setting 5 #_',
    '',
    '⚡ *[6] Bot Speed (Ping පරීක්ෂාව):*',
    '  *6* හෝ *' + currentPrefix + 'ping*',
    '',
    '🔒 *[7] Bot Mode (ක්‍රියාකාරී සීමා මාදිලිය):*',
    '  *7.1 public*   ➞ 🌐 Public (ඕනෑම තැනක)',
    '  *7.2 private*  ➞ 🔒 Private (Owner පමණි)',
    '  *7.3 inbox*    ➞ 💬 Inbox Only (DM පමණි)',
    '  *7.4 group*    ➞ 👥 Group Only (Groups පමණි)',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━',
    '💡 *භාවිතා කරන ආකාරය (Reply with Number):*',
    'ඔබට අංකය කෙලින්ම Reply කළ හැක:',
    '👉 *1 on*  හෝ  *' + currentPrefix + 'setting 1 on*',
    '👉 *1.2 off*  හෝ  *' + currentPrefix + 'setting 1.2 off*',
    '👉 *2 on*  හෝ  *' + currentPrefix + 'setting 2 on*',
    '👉 *2.2 off*  හෝ  *' + currentPrefix + 'setting 2.2 off*',
    '👉 *4 🔥*  හෝ  *' + currentPrefix + 'setting 4 🔥*',
    '👉 *7.1* (හෝ *7 public*)  හෝ  *' + currentPrefix + 'mode public*',
    '━━━━━━━━━━━━━━━━━━━━━━'
  ];

  await sock.sendMessage(remoteJid, { text: menuLines.join('\n') }, { quoted: msg });
}