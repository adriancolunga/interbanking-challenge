# Interbanking Challenge

## Puntos Clave:

* **Arquitectura Hexagonal:** El código está estructurado en capas claras (Dominio, Aplicación, Infraestructura, Presentación) para garantizar el desacople y testeabilidad.

* **Tecnologías:**

  * **Lenguaje:** JavaScript (Node.js puro).

  * **Base de Datos:** PostgreSQL.

  * **ORM:** Prisma.

  * **Docker**

* **Mocks y Tests Unitarios:** Se desarrollaron mocks en la capa de infraestructura para permitir pruebas unitarias aisladas de las capas de Dominio y Aplicación utilizando Jest.

* **.env:** El archivo cuenta con las credenciales de acceso a la base de datos. La variable NODE_ENV se establece inicialmente como `local` para disponer de los mocks, cambiar a  `dev` para hacer pruebas con la base de datos real.

## Endpoints:

* `GET /companies/transfers/last-month`: Recupera las empresas que realizaron transferencias en el último mes.

* `GET /companies/adhered/last-month`: Recupera las empresas que se adhirieron al sistema en el último mes.

* `POST /companies`: Permite la adhesión de una nueva empresa. Requiere un cuerpo JSON con `cuit` y `razonSocial`.

* `POST /transfers`: Permite registrar una nueva transferencia. Este endpoint se creó con el propósito de facilitar el testear del endpoint `GET /companies/transfers/last-month` con datos reales en la base de datos. Requiere un cuerpo JSON con `importe`, `idEmpresa` `cuentaDebito`, `cuenta` y `fecha` (fecha opcional, para testear se puede ingresar, por ejemplo, "07/03/2025". De no enviar la propiedad se toma la fecha actual)

## Uso

```bash
# Clonar repositorio
$ git clone https://github.com/adriancolunga/interbanking-challenge.git

# Despliegue
$ docker compose up -d
```

## Test

```bash
# Test unitarios
$ npm run test

# Test coverage
$ npm run test:cov
```