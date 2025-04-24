const prisma = require('./prismaClient');
const TransferRepository = require('../../domain/interfaces/transferRepository');
const Transfer = require('../../domain/transfer');

class PrismaTransferRepository extends TransferRepository {
    async save(transfer) {
        const savedTransfer = await prisma.transfer.create({
            data: {
                importe: transfer.importe,
                idEmpresa: transfer.idEmpresa,
                cuentaDebito: transfer.cuentaDebito,
                cuenta: transfer.cuenta,
                fecha: transfer.fecha,
            },
        });

        return new Transfer(savedTransfer.importe, savedTransfer.idEmpresa, savedTransfer.cuentaDebito, savedTransfer.cuenta, savedTransfer.fecha);
    }
}

module.exports = PrismaTransferRepository;
