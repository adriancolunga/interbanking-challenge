class Company {
    constructor(cuit, razonSocial, fechaAdhesion) {
        if (!cuit || !razonSocial || !fechaAdhesion) {
            throw new Error('Company requires CUIT, Razon Social, and Fecha Adhesion');
        }
        this.cuit = cuit;
        this.razonSocial = razonSocial;
        this.fechaAdhesion = new Date(fechaAdhesion);
    }
}

module.exports = Company;
