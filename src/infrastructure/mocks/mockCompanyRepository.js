const CompanyRepository = require('../../domain/interfaces/companyRepository');
const Company = require('../../domain/company');

class MockCompanyRepository extends CompanyRepository {
    constructor() {
        super();
        this.companies = new Map();

        const mockCompany1 = new Company('20-12345678-9', 'Company Mock 1', new Date(new Date().setMonth(new Date().getMonth() - 2))); // Adherida hace 2 meses
        const mockCompany2 = new Company('30-98765432-1', 'Company Mock 2', new Date()); // Adherida ahora
        const mockCompany3 = new Company('27-11223344-5', 'Company Mock 3', new Date(new Date().setMonth(new Date().getMonth() - 0.5))); // Adherida hace medio mes

        this.companies.set(mockCompany1.cuit, mockCompany1);
        this.companies.set(mockCompany2.cuit, mockCompany2);
        this.companies.set(mockCompany3.cuit, mockCompany3);
    }

    async findById(cuit) {
        console.log(`[Mock] Finding company with CUIT: ${cuit}`);
        return Promise.resolve(this.companies.get(cuit) || null);
    }

    async save(company) {
        console.log(`[Mock] Saving company with CUIT: ${company.cuit}`);
        this.companies.set(company.cuit, company);
        return Promise.resolve(company);
    }

    async findAdheredLastMonth() {
        console.log('[Mock] Finding companies adhered last month');
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
        const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
        if (currentMonth === 0) {
            startOfLastMonth.setFullYear(currentYear - 1);
            startOfLastMonth.setMonth(11);
        }

        const adheredLastMonth = Array.from(this.companies.values()).filter(company => {
            return company.fechaAdhesion >= startOfLastMonth && company.fechaAdhesion < startOfCurrentMonth;
        });

        return Promise.resolve(adheredLastMonth);
    }

    async findWithTransfersLastMonth() {
        console.log('[Mock] Finding companies with transfers last month');
        const companiesWithTransfers = [
            this.companies.get('20-12345678-9'),
            this.companies.get('27-11223344-5'),
        ].filter(company => company !== undefined);

        return Promise.resolve(companiesWithTransfers);
    }
}

module.exports = MockCompanyRepository;
