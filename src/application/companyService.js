const Company = require('../domain/company');

class CompanyService {
    constructor(companyRepository) {
        if (!companyRepository) throw new Error('CompanyRepository is required for CompanyService');
        this.companyRepository = companyRepository;
    }

    async addCompany(cuit, razonSocial) {
        if (!cuit || !razonSocial) throw new Error('CUIT and Razon Social are required');

        const newCompany = new Company(cuit, razonSocial, new Date());
        const savedCompany = await this.companyRepository.save(newCompany);
        return savedCompany;
    }

    async getAdheredCompaniesLastMonth() {
        const companies = await this.companyRepository.findAdheredLastMonth();
        return companies;
    }

    async getCompaniesWithTransfersLastMonth() {
        const companies = await this.companyRepository.findWithTransfersLastMonth();
        return companies;
    }
}

module.exports = CompanyService;
