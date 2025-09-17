export default () => {
  const { TELEGRAM_BOT_TOKEN } = process.env;

  return {
    token: TELEGRAM_BOT_TOKEN,
  };
};
