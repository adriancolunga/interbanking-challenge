const Transfer = require('../../src/domain/transfer');

describe('Transfer Domain Entity', () => {

    test('should create a Transfer instance with valid data', () => {
        const importe = 1500.75;
        const idEmpresa = '20-12345678-9';
        const cuentaDebito = 'CtaOrigen1';
        const cuenta = 'CtaDestino1';
        const fecha = new Date('2024-04-23');

        const transfer = new Transfer(importe, idEmpresa, cuentaDebito, cuenta, fecha);
        expect(transfer).toBeInstanceOf(Transfer);
        expect(transfer.importe).toBe(importe);
        expect(transfer.idEmpresa).toBe(idEmpresa);
        expect(transfer.cuentaDebito).toBe(cuentaDebito);
        expect(transfer.cuenta).toBe(cuenta);
        expect(transfer.fecha).toBeInstanceOf(Date);
        expect(transfer.fecha.toISOString()).toBe(fecha.toISOString());
    });

    test('should throw an error if importe is missing', () => {
        const idEmpresa = '20-12345678-9';
        const cuentaDebito = 'CtaOrigen1';
        const cuenta = 'CtaDestino1';
        const fecha = new Date();

        expect(() => new Transfer(undefined, idEmpresa, cuentaDebito, cuenta, fecha)).toThrow('Transfer requires importe, idEmpresa, cuentaDebito, cuenta, and fecha');
    });

    test('should throw an error if idEmpresa is missing', () => {
        const importe = 100;
        const cuentaDebito = 'CtaOrigen1';
        const cuenta = 'CtaDestino1';
        const fecha = new Date();

        expect(() => new Transfer(importe, null, cuentaDebito, cuenta, fecha)).toThrow('Transfer requires importe, idEmpresa, cuentaDebito, cuenta, and fecha');
        expect(() => new Transfer(importe, undefined, cuentaDebito, cuenta, fecha)).toThrow('Transfer requires importe, idEmpresa, cuentaDebito, cuenta, and fecha');
    });

    test('should throw an error if cuentaDebito is missing', () => {
        const importe = 100;
        const idEmpresa = '20-12345678-9';
        const cuenta = 'CtaDestino1';
        const fecha = new Date();

        expect(() => new Transfer(importe, idEmpresa, null, cuenta, fecha)).toThrow('Transfer requires importe, idEmpresa, cuentaDebito, cuenta, and fecha');
        expect(() => new Transfer(importe, idEmpresa, undefined, cuenta, fecha)).toThrow('Transfer requires importe, idEmpresa, cuentaDebito, cuenta, and fecha');
    });

    test('should throw an error if cuenta is missing', () => {
        const importe = 100;
        const idEmpresa = '20-12345678-9';
        const cuentaDebito = 'CtaOrigen1';
        const fecha = new Date();

        expect(() => new Transfer(importe, idEmpresa, cuentaDebito, null, fecha)).toThrow('Transfer requires importe, idEmpresa, cuentaDebito, cuenta, and fecha');
        expect(() => new Transfer(importe, idEmpresa, cuentaDebito, undefined, fecha)).toThrow('Transfer requires importe, idEmpresa, cuentaDebito, cuenta, and fecha');
    });

    test('should throw an error if fecha is missing', () => {
        const importe = 100;
        const idEmpresa = '20-12345678-9';
        const cuentaDebito = 'CtaOrigen1';
        const cuenta = 'CtaDestino1';

        expect(() => new Transfer(importe, idEmpresa, cuentaDebito, cuenta, null)).toThrow('Transfer requires importe, idEmpresa, cuentaDebito, cuenta, and fecha');
        expect(() => new Transfer(importe, idEmpresa, cuentaDebito, cuenta, undefined)).toThrow('Transfer requires importe, idEmpresa, cuentaDebito, cuenta, and fecha');
    });

    test('should convert importe to a number if a string is provided', () => {
        const importeString = '123.45';
        const idEmpresa = '20-12345678-9';
        const cuentaDebito = 'CtaOrigen1';
        const cuenta = 'CtaDestino1';
        const fecha = new Date();

        const transfer = new Transfer(importeString, idEmpresa, cuentaDebito, cuenta, fecha);

        expect(transfer.importe).toBe(123.45);
        expect(typeof transfer.importe).toBe('number');
    });
});
