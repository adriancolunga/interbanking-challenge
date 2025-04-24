const prisma = require('./prismaClient');
const CompanyRepository = require('../../domain/interfaces/companyRepository');
const Company = require('../../domain/company');

class PrismaCompanyRepository extends CompanyRepository {
    async findById(cuit) {
        const companyData = await prisma.company.findUnique({
            where: { cuit: cuit },
        });
        if (!companyData) return null;
        return new Company(companyData.cuit, companyData.razonSocial, companyData.fechaAdhesion);
    }

    async save(company) {
        const savedCompany = await prisma.company.upsert({
            where: { cuit: company.cuit },
            update: {
                razonSocial: company.razonSocial,
                fechaAdhesion: company.fechaAdhesion,
            },
            create: {
                cuit: company.cuit,
                razonSocial: company.razonSocial,
                fechaAdhesion: company.fechaAdhesion,
            },
        });
        return new Company(savedCompany.cuit, savedCompany.razonSocial, savedCompany.fechaAdhesion);
    }

    async findAdheredLastMonth() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
        const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
        if (currentMonth === 0) {
            startOfLastMonth.setFullYear(currentYear - 1);
            startOfLastMonth.setMonth(11);
        }

        const companiesData = await prisma.company.findMany({
            where: {
                fechaAdhesion: {
                    gte: startOfLastMonth,
                    lt: startOfCurrentMonth,
                },
            },
        });
        return companiesData.map(data => new Company(data.cuit, data.razonSocial, data.fechaAdhesion));
    }

    async findWithTransfersLastMonth() {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const startOfCurrentMonth = new Date(currentYear, currentMonth, 1);
        const startOfLastMonth = new Date(currentYear, currentMonth - 1, 1);
        if (currentMonth === 0) {
            startOfLastMonth.setFullYear(currentYear - 1);
            startOfLastMonth.setMonth(11);
        }

        const transfersLastMonth = await prisma.transfer.findMany({
            where: {
                fecha: {
                    gte: startOfLastMonth,
                    lt: startOfCurrentMonth,
                },
            },
            select: { company: true },
            distinct: ['idEmpresa'],
        });

        return transfersLastMonth.map(transfer => new Company(transfer.company.cuit, transfer.company.razonSocial, transfer.company.fechaAdhesion));
    }
}

module.exports = PrismaCompanyRepository;
