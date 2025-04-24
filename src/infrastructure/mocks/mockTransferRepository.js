const TransferRepository = require('../../domain/interfaces/transferRepository');
const Transfer = require('../../domain/transfer');

class MockTransferRepository extends TransferRepository {
    constructor() {
        super();
        this.transfers = [];
        this.nextId = 1;
    }

    async save(transfer) {
        console.log(`[Mock] Saving transfer for company: ${transfer.idEmpresa}`);
        const transferToSave = { ...transfer, id: this.nextId++ };
        this.transfers.push(transferToSave);

        return Promise.resolve(new Transfer(transferToSave.importe, transferToSave.idEmpresa, transferToSave.cuentaDebito, transferToSave.cuenta, transferToSave.fecha));
    }
}

module.exports = MockTransferRepository;
