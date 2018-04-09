let messagesService  = (() => {
        function loadMyMessages(username) {
            let endpoint = `messages?query={"recipient_username":"${username}"}`;

            return remote.get('appdata', endpoint, 'kinvey');
        }

        function loadArchiveMessages(username) {
            let endpoint = `messages?query={"sender_username":"${username}"}`;

            return remote.get('appdata', endpoint, 'kinvey');
        }

        function deleteMessage(messageId) {
            let endpoint = `messages/${messageId}`;

            return remote.remove('appdata', endpoint, 'kinvey');
        }

        function loadAllUsers() {
            return remote.get('user', '', 'kinvey');
        }

        function sendMessage(sender_username, sender_name, recipient_username, text) {
            let msgData = {
                sender_username,
                sender_name,
                recipient_username,
                text
            };

            return remote.post('appdata', 'messages', 'kinvey', msgData);
        }

        return {
            loadMyMessages,
            loadArchiveMessages,
            deleteMessage,
            loadAllUsers,
            sendMessage
        }
})();