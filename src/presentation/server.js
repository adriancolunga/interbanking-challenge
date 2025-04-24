const http = require('http');
const url = require('url');
const dotenv = require('dotenv');
dotenv.config();

const PrismaCompanyRepository = require('../infrastructure/prisma/prismaCompanyRepository');
const PrismaTransferRepository = require('../infrastructure/prisma/prismaTransferRepository');

const MockCompanyRepository = require('../infrastructure/mocks/mockCompanyRepository');
const MockTransferRepository = require('../infrastructure/mocks/mockTransferRepository');

const CompanyService = require('../application/companyService');
const TransferService = require('../application/transferService');

let companyRepository
let transferRepository
const env = process.env.NODE_ENV
if (env === 'local') {
    companyRepository = new MockCompanyRepository();
    transferRepository = new MockTransferRepository();
} else {
    companyRepository = new PrismaCompanyRepository();
    transferRepository = new PrismaTransferRepository();
}

const companyService = new CompanyService(companyRepository);
const transferService = new TransferService(transferRepository, companyRepository);

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    const sendJson = (res, statusCode, data) => {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    };

    const parseRequestBody = (req) => {
        return new Promise((resolve, reject) => {
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                try {
                    if (body) resolve(JSON.parse(body));
                    else resolve({});
                } catch (error) {
                    reject(new Error('Invalid JSON body'));
                }
            });
            req.on('error', err => {
                reject(err);
            });
        });
    };

    try {
        if (method === 'GET' && path === '/companies/transfers/last-month') {
            const companies = await companyService.getCompaniesWithTransfersLastMonth();
            sendJson(res, 200, companies);
        } else if (method === 'GET' && path === '/companies/adhered/last-month') {
            const companies = await companyService.getAdheredCompaniesLastMonth();
            sendJson(res, 200, companies);
        } else if (method === 'POST' && path === '/companies') {
            const body = await parseRequestBody(req);
            const { cuit, razonSocial } = body;

            if (!cuit || !razonSocial) {
                sendJson(res, 400, { error: 'CUIT and Razon Social are required' });
                return;
            }

            const newCompany = await companyService.addCompany(cuit, razonSocial);
            sendJson(res, 201, newCompany);
        } else if (method === 'POST' && path === '/transfers') {
            const body = await parseRequestBody(req);
            const { importe, idEmpresa, cuentaDebito, cuenta } = body;

            if (!importe || !idEmpresa || !cuentaDebito || !cuenta) {
                sendJson(res, 400, { error: 'Importe, Id Empresa, Cuenta Debito and Cuenta are required' });
                return;
            }

            const newTransfer = await transferService.addTransfer(importe, idEmpresa, cuentaDebito, cuenta, body.fecha);
            sendJson(res, 201, newTransfer);
        }
        else {
            sendJson(res, 404, { error: 'Not Found' });
        }
    } catch (error) {
        console.error('Error handling request:', error);
        sendJson(res, 500, { error: 'Internal Server Error', details: error.message });
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} [Environment: ${env}]`);
    console.log(`Persistence Mode: ${env === 'local' ? 'Mocks' : 'Database (Prisma)'}`);
});
