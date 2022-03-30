const SuperheroRoute = require('../routes/superhero_v2.router');
const SuperheroModel = require('../models/superhero_v2.model');
const Boom = require('@hapi/boom');

class SuperheroService {
  //Promesas y funciones asincronicas
  //Una funcion asincronica devuelve una promesa
  //Js es un lenguaje ejecuta un hilo -> solo hace una cosa a la vez
  async createSuperhero(superheroV2) {
    superheroV2.save();
    return superheroV2;
  }

  async listSuperhero() {
    return SuperheroModel.find();
  }

  //Función que devuelve una promesa
  find() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(SuperheroModel.find());
      }, 3000);
    });
  }

  async showSuperhero(superheroId) {
    return SuperheroModel.findById({ _id: superheroId }).then(
      (superheroFind) => {
        if (!superheroFind) throw Boom.notFound('No se encontro el superhero');
        return superheroFind;
      }
    );
  }

  async editSuperhero(superheroId, superhero, realname, superpower) {
    return SuperheroModel.findById({ _id: superheroId }).then(
      (superheroFind) => {
        if (!superheroFind) throw Boom.notFound('No se encontro el superhero');
        return SuperheroModel.updateOne(
          { superheroId },
          { superhero, realname, superpower }
        );
      }
    );
  }

  async removeSuperhero(superheroId) {
    return SuperheroModel.findById({ _id: superheroId }).then(
      (superheroFind) => {
        if (!superheroFind) throw Boom.notFound('No se encontro el superhero');
        return SuperheroModel.deleteOne(superheroFind);
      }
    );
  }
}

module.exports = SuperheroService;
