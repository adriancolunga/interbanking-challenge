const CompanyService = require('../../src/application/companyService');
const MockCompanyRepository = require('../../src/infrastructure/mocks/mockCompanyRepository');
const Company = require('../../src/domain/company');

describe('CompanyService', () => {
    let companyRepository;
    let companyService;

    beforeEach(() => {
        companyRepository = new MockCompanyRepository();
        companyService = new CompanyService(companyRepository);
    });

    test('should create CompanyService instance with repository', () => {
        expect(companyService).toBeInstanceOf(CompanyService);
        expect(companyService.companyRepository).toBe(companyRepository);
    });

    test('should throw error if repository is missing', () => {
        expect(() => new CompanyService(null)).toThrow('CompanyRepository is required for CompanyService');
        expect(() => new CompanyService(undefined)).toThrow('CompanyRepository is required for CompanyService');
    });


    test('should add a new company', async () => {
        const cuit = '20-12345678-0';
        const razonSocial = 'Nueva Empresa S.A.';

        const saveSpy = jest.spyOn(companyRepository, 'save');
        const newCompany = await companyService.addCompany(cuit, razonSocial);

        expect(saveSpy).toHaveBeenCalledTimes(1);

        expect(saveSpy.mock.calls[0][0]).toBeInstanceOf(Company);
        expect(saveSpy.mock.calls[0][0].cuit).toBe(cuit);
        expect(saveSpy.mock.calls[0][0].razonSocial).toBe(razonSocial);
        expect(saveSpy.mock.calls[0][0].fechaAdhesion).toBeInstanceOf(Date);

        // Se verifica el resultado devuelto por el servicio
        expect(newCompany).toBeInstanceOf(Company);
        expect(newCompany.cuit).toBe(cuit);
        expect(newCompany.razonSocial).toBe(razonSocial);
        expect(newCompany.fechaAdhesion).toBeInstanceOf(Date);

        // Se verifica que la empresa fue realmente añadida al mock en memoria
        const foundCompany = await companyRepository.findById(cuit);
        expect(foundCompany).not.toBeNull();
        expect(foundCompany.cuit).toBe(cuit);

        saveSpy.mockRestore();
    });

    test('should throw error if CUIT or Razon Social are missing when adding company', async () => {
        await expect(companyService.addCompany(null, 'Razon Social')).rejects.toThrow('CUIT and Razon Social are required');
        await expect(companyService.addCompany('20-123-456-7', null)).rejects.toThrow('CUIT and Razon Social are required');
        await expect(companyService.addCompany(null, null)).rejects.toThrow('CUIT and Razon Social are required');

        const saveSpy = jest.spyOn(companyRepository, 'save');
        try {
            await companyService.addCompany(null, 'Razon Social');
        } catch (e) { }
        expect(saveSpy).not.toHaveBeenCalled();
        saveSpy.mockRestore();
    });


    test('should get companies adhered last month', async () => {
        const findAdheredSpy = jest.spyOn(companyRepository, 'findAdheredLastMonth');
        const adheredCompanies = await companyService.getAdheredCompaniesLastMonth();

        expect(findAdheredSpy).toHaveBeenCalledTimes(1);
        expect(adheredCompanies).toBeInstanceOf(Array);

        adheredCompanies.forEach(company => {
            expect(company).toBeInstanceOf(Company);
        });

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
        const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
        if (currentMonth === 0) {
            startOfLastMonth.setFullYear(currentYear - 1);
            startOfLastMonth.setMonth(11);
        }

        const expectedCompanies = Array.from(companyRepository.companies.values()).filter(company => {
            return company.fechaAdhesion >= startOfLastMonth && company.fechaAdhesion < startOfCurrentMonth;
        });

        expect(adheredCompanies.length).toBe(expectedCompanies.length);
        findAdheredSpy.mockRestore();
    });

    test('should get companies with transfers last month', async () => {
        const findWithTransfersSpy = jest.spyOn(companyRepository, 'findWithTransfersLastMonth');
        const companiesWithTransfers = await companyService.getCompaniesWithTransfersLastMonth();

        expect(findWithTransfersSpy).toHaveBeenCalledTimes(1);
        expect(companiesWithTransfers).toBeInstanceOf(Array);

        companiesWithTransfers.forEach(company => {
            expect(company).toBeInstanceOf(Company);
        });

        const expectedCuitsFromMock = ['20-12345678-9', '27-11223344-5'];
        const resultCuits = companiesWithTransfers.map(c => c.cuit).sort();
        expect(resultCuits).toEqual(expectedCuitsFromMock.sort());

        findWithTransfersSpy.mockRestore();
    });
});
