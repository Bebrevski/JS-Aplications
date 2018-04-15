let crudService = (() => {
    function getActiveReceipt(userId, bool) {
        const endpoint = `receipts?query={"_acl.creator":"${userId}","active":${bool}}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    function getEntriesById(receiptId) {
        const endpoint = `entries?query={"receiptId":"${receiptId}"}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    function createReceipt(active, productCount, total) {
        const endpoint = 'receipts';

        let data = {active, productCount, total};

        return remote.post('appdata', endpoint, 'kinvey', data)
    }

    function addEntry(type, qty, price, total, receiptId) {
        const endpoint = 'entries';
        let data = {type, qty, price, receiptId, total};

        return remote.post('appdata', endpoint, 'kinvey', data);
    }

    function deleteEntry(entryId) {
        const endpoint = `entries/${entryId}`;

        return remote.remove('appdata', endpoint, 'kinvey');
    }

    function getMyReceipts(userId, bool) {
        const endpoint = `receipts?query={"_acl.creator":"${userId}","active":${bool}}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    function commitReceipt(receiptId, active, productCount, total) {
        const endpoint = `receipts/${receiptId}`;

        let data = {active, productCount, total};
        return remote.update('appdata', endpoint, 'kinvey', data)
    }

    function receiptDetails(receiptId) {
        const endpoint = `receipts/${receiptId}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    return {
        getActiveReceipt,
        getEntriesById,
        createReceipt,
        addEntry,
        deleteEntry,
        getMyReceipts,
        commitReceipt,
        receiptDetails
    }
})();