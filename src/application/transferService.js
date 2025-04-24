const Transfer = require('../domain/transfer');

class TransferService {
    constructor(transferRepository, companyRepository) {
        if (!transferRepository || !companyRepository) {
            throw new Error('TransferRepository and CompanyRepository are required for TransferService');
        }
        this.transferRepository = transferRepository;
        this.companyRepository = companyRepository;
    }

    async addTransfer(importe, idEmpresa, cuentaDebito, cuenta, fecha) {
        const companyExists = await this.companyRepository.findById(idEmpresa);

        if (!companyExists) throw new Error(`Company with CUIT ${idEmpresa} not found`);
        if (importe <= 0) throw new Error('Importe must be positive');

        let date
        if (fecha) {
            const [day, month, year] = fecha.split('/');
            date = new Date(`${year}-${month}-${day}`);
        }

        const newTransfer = new Transfer(importe, idEmpresa, cuentaDebito, cuenta, date ?? new Date());
        const savedTransfer = await this.transferRepository.save(newTransfer);
        return savedTransfer;
    }
}

module.exports = TransferService;
