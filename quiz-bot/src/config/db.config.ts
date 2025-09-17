export default () => {
  const { DB_USER, DB_PASSWORD, DB_HOST, DB_LOCAL_PORT, DB_NAME } = process.env;

  return {
    uri: `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_LOCAL_PORT}/${DB_NAME}?authSource=admin`,
  };
};
