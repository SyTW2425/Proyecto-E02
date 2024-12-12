# Pokedeck - Aplicación web para gestión e intercambio de cartas Pokémon

Autores:

- Inés Garrote Fontenla alu0101512297@ull.edu.es
- Alejandro Javier Aguiar Pérez alu0101487168@ull.edu.es

Integración continua/Cubrimiento de Código:

[![Tests and Coverage](https://github.com/SyTW2425/Proyecto-E02/actions/workflows/node.js.yml/badge.svg)](https://github.com/SyTW2425/Proyecto-E02/actions/workflows/node.js.yml)


[![Coverage Status](https://coveralls.io/repos/github/SyTW2425/Proyecto-E02/badge.svg?branch=main)](https://coveralls.io/github/SyTW2425/Proyecto-E02?branch=main)

## Descripción
Pokedeck es una aplicación diseñada para satisfacer las necesidades de los coleccionistas de cartas Pokémon, ofreciendo una solución integral para gestionar, organizar y expandir sus colecciones. Desde registrar cartas hasta facilitar intercambios, Pokedeck brinda herramientas esenciales para aficionados de todas las edades.

## Funciones principales

### 1. Registro de cartas
- **Descripción**: Los usuarios pueden añadir y gestionar sus cartas Pokémon.
- **Características detalladas**:
  - Nombre de la carta.
  - Número de pokédex
  - Tipo
  - Debilidad
  - etc
- **Beneficio**: Facilita la organización y permite visualizar la colección completa de manera estructurada.

### 2. Búsqueda de cartas en la base de datos
- **Descripción**: Explora una amplia biblioteca de cartas Pokémon con filtros avanzados.
- **Filtros disponibles**:
  - Nombre del Pokémon.
  - Tipo (fuego, agua, eléctrico, etc.).
  - Edición.
  - Rareza.
- **Beneficio**: Ideal para encontrar cartas específicas o descubrir nuevas adquisiciones para la colección.

### 3. Intercambio de cartas
- **Descripción**: Los usuarios pueden realizar intercambios una por una con otros coleccionistas.
- **Características**:
  - Sistema seguro y transparente para acordar intercambios.
- **Beneficio**: Facilita la expansión de la colección al permitir el intercambio de cartas duplicadas o menos deseadas.

## Tecnologías utilizadas
- **Frontend**: [React](https://reactjs.org/)
- **Backend**: [Node.js](https://nodejs.org/) con [Express](https://expressjs.com/)
- **Base de datos**: [MongoDB](https://www.mongodb.com/)
- **Autenticación**: JSON Web Tokens (JWT)
- **Testing**: Chai, Mocha,Supertest