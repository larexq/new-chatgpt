const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("croxydb");
const { Configuration, OpenAIApi } = require('openai');
const { apikey } = require("../config.json");

module.exports = {
    name: "sor",
    description: 'Bota soru sorabilirsiniz.',
    type: 1,
    options: [
    {
    name: "soru",
    description: "Sorun nedir?",
    type: 3,
    required: true
    }
],
    run: async (client, interaction) => {

const soru = interaction.options.getString("soru")

const configuration = new Configuration({
  apiKey: apikey,
});
const openai = new OpenAIApi(configuration);

  let conversationLog = [{ role: 'system', content: 'You are a friendly chatbot.' }];

  try {
    await interaction.channel.sendTyping();

    let prevMessages = await interaction.channel.messages.fetch({ limit: 15 });
    prevMessages.reverse();

    prevMessages.forEach((msg) => {
      if (soru.startsWith('!')) return;
      if (msg.author.id !== client.user.id && interaction.user.bot) return;
      if (msg.author.id !== interaction.user.id) return;

      conversationLog.push({
        role: 'user',
        content: soru,
      });
    });

    const result = await openai
      .createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
        
      })
      .catch((error) => {
        console.log(`OPENAI ERR: ${error}`);
      });

    interaction.reply(result.data.choices[0].message);
  } catch (error) {
    console.log(`ERR: ${error}`);
  }
}
}