/**
 * @param {Array<{plugin: string, type: string, [meta]: {}}>} messages
 * @return {null|{}}
 */
export default function getMetadataFromMessages(messages) {
  const filteredMessages = messages.filter(
    message =>
      message.plugin === "postcss-container-query" &&
      message.type === "metadata"
  );

  if (!filteredMessages.length) {
    return null;
  }

  return filteredMessages[0].meta;
}
