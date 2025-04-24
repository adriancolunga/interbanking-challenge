class Transfer {
  constructor(importe, idEmpresa, cuentaDebito, cuenta, fecha) {
    if (importe === undefined || !idEmpresa || !cuentaDebito || !cuenta || !fecha) {
      throw new Error('Transfer requires importe, idEmpresa, cuentaDebito, cuenta, and fecha');
    }
    this.importe = parseFloat(importe);
    this.idEmpresa = idEmpresa;
    this.cuentaDebito = cuentaDebito;
    this.cuenta = cuenta;
    this.fecha = new Date(fecha);
  }
}

module.exports = Transfer;
