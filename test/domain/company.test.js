const Company = require('../../src/domain/company');

describe('Company Domain Entity', () => {
    test('should create a Company instance with valid data', () => {
        const cuit = '20-12345678-9';
        const razonSocial = 'Empresa de Prueba S.A.';
        const fechaAdhesion = new Date('2023-10-26');

        const company = new Company(cuit, razonSocial, fechaAdhesion);
        expect(company).toBeInstanceOf(Company);
        expect(company.cuit).toBe(cuit);
        expect(company.razonSocial).toBe(razonSocial);
        expect(company.fechaAdhesion).toBeInstanceOf(Date);
    });

    test('should throw an error if CUIT is missing', () => {
        const razonSocial = 'Empresa de Prueba S.A.';
        const fechaAdhesion = new Date();

        expect(() => new Company(null, razonSocial, fechaAdhesion)).toThrow('Company requires CUIT, Razon Social, and Fecha Adhesion');
        expect(() => new Company(undefined, razonSocial, fechaAdhesion)).toThrow('Company requires CUIT, Razon Social, and Fecha Adhesion');
    });

    test('should throw an error if Razon Social is missing', () => {
        const cuit = '20-12345678-9';
        const fechaAdhesion = new Date();

        expect(() => new Company(cuit, null, fechaAdhesion)).toThrow('Company requires CUIT, Razon Social, and Fecha Adhesion');
        expect(() => new Company(cuit, undefined, fechaAdhesion)).toThrow('Company requires CUIT, Razon Social, and Fecha Adhesion');
    });

    test('should throw an error if Fecha Adhesion is missing', () => {
        const cuit = '20-12345678-9';
        const razonSocial = 'Empresa de Prueba S.A.';

        expect(() => new Company(cuit, razonSocial, null)).toThrow('Company requires CUIT, Razon Social, and Fecha Adhesion');
        expect(() => new Company(cuit, razonSocial, undefined)).toThrow('Company requires CUIT, Razon Social, and Fecha Adhesion');
    });

    test('should convert fechaAdhesion to a Date object if a string is provided', () => {
        const cuit = '20-12345678-9';
        const razonSocial = 'Empresa de Prueba S.A.';
        const fechaAdhesionString = '2024-01-15T10:00:00.000Z';

        const company = new Company(cuit, razonSocial, fechaAdhesionString);

        expect(company.fechaAdhesion).toBeInstanceOf(Date);
        expect(company.fechaAdhesion.toISOString()).toBe(fechaAdhesionString);
    });
});
