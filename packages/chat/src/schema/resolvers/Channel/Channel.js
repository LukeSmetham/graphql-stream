export const Channel = {
    config: ({ data }) => data.config,
    created_at: ({ data }) => data.created_at,
    created_by: ({ data }) => data.created_by,
    frozen: ({ data }) => data.frozen,
    last_message_at: ({ data }) => data.last_message_at,
    members: async ({ id }, _, { stream }) => {
        try {
            const channel = stream.chat.channel(...id);
            const {members} = await channel.queryMembers({});
            console.log(members);
            return members;
        } catch (error) {
            console.log(error);
        }
    },
    membership: () => [],
    messages: () => [],
    mutedUsers: () => [],
    read: () => [],
    threads: () => [],
    type: ({ data }) => data.type,
    typing: () => [],
    unreadCount: () => [],
    updated_at: ({ data }) => data.updated_at,
    watchers: () => [],
};
