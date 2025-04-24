const TransferService = require('../../src/application/transferService');
const MockTransferRepository = require('../../src/infrastructure/mocks/mockTransferRepository');
const MockCompanyRepository = require('../../src/infrastructure/mocks/mockCompanyRepository');
const Transfer = require('../../src/domain/transfer');

describe('TransferService', () => {
    let transferRepository;
    let companyRepository;
    let transferService;

    beforeEach(() => {
        transferRepository = new MockTransferRepository();
        companyRepository = new MockCompanyRepository();
        transferService = new TransferService(transferRepository, companyRepository);
    });

    test('should create TransferService instance with repositories', () => {
        expect(transferService).toBeInstanceOf(TransferService);
        expect(transferService.transferRepository).toBe(transferRepository);
        expect(transferService.companyRepository).toBe(companyRepository);
    });

    test('should throw error if transferRepository is missing', () => {
        expect(() => new TransferService(null, companyRepository)).toThrow('TransferRepository and CompanyRepository are required for TransferService');
    });

    test('should throw error if companyRepository is missing', () => {
        expect(() => new TransferService(transferRepository, null)).toThrow('TransferRepository and CompanyRepository are required for TransferService');
    });

    test('should add a new transfer if company exists', async () => {
        const importe = 5000.00;
        const idEmpresa = '20-12345678-9';
        const cuentaDebito = 'CtaDebitoTest';
        const cuenta = 'CtaCreditoTest';

        const findCompanySpy = jest.spyOn(companyRepository, 'findById');
        const saveTransferSpy = jest.spyOn(transferRepository, 'save');

        const newTransfer = await transferService.addTransfer(importe, idEmpresa, cuentaDebito, cuenta);

        expect(findCompanySpy).toHaveBeenCalledTimes(1);
        expect(findCompanySpy).toHaveBeenCalledWith(idEmpresa);

        expect(saveTransferSpy).toHaveBeenCalledTimes(1);
        expect(saveTransferSpy.mock.calls[0][0]).toBeInstanceOf(Transfer);
        expect(saveTransferSpy.mock.calls[0][0].importe).toBe(importe);

        expect(newTransfer).toBeInstanceOf(Transfer);
        expect(newTransfer.importe).toBe(importe);

        findCompanySpy.mockRestore();
        saveTransferSpy.mockRestore();
    });

    test('should throw error when adding transfer if company does not exist', async () => {
        const importe = 5000.00;
        const idEmpresa = '99-99999999-9';
        const cuentaDebito = 'CtaDebitoTest';
        const cuenta = 'CtaCreditoTest';

        const findCompanySpy = jest.spyOn(companyRepository, 'findById');
        findCompanySpy.mockResolvedValueOnce(null);

        const saveTransferSpy = jest.spyOn(transferRepository, 'save');

        await expect(transferService.addTransfer(importe, idEmpresa, cuentaDebito, cuenta)).rejects.toThrow(`Company with CUIT ${idEmpresa} not found`);

        expect(findCompanySpy).toHaveBeenCalledTimes(1);
        expect(findCompanySpy).toHaveBeenCalledWith(idEmpresa);
        expect(saveTransferSpy).not.toHaveBeenCalled();

        findCompanySpy.mockRestore();
        saveTransferSpy.mockRestore();
    });

    // test('should throw error if importe is not positive when adding transfer', async () => {
    //     const idEmpresa = '20-12345678-9'; // Empresa existente
    //     const cuentaDebito = 'CtaDebitoTest';
    //     const cuenta = 'CtaCreditoTest';

    //     const findCompanySpy = jest.spyOn(companyRepository, 'findById');
    //     const saveTransferSpy = jest.spyOn(transferRepository, 'save');

    //     // importe cero
    //     await expect(transferService.addTransfer(0, idEmpresa, cuentaDebito, cuenta)).rejects.toThrow('Importe must be positive');
    //     // importe negativo
    //     await expect(transferService.addTransfer(-100, idEmpresa, cuentaDebito, cuenta)).rejects.toThrow('Importe must be positive');

    //     expect(findCompanySpy).not.toHaveBeenCalled();
    //     expect(saveTransferSpy).not.toHaveBeenCalled();

    //     findCompanySpy.mockRestore();
    //     saveTransferSpy.mockRestore();
    // });
});
