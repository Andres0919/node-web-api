export default class heroService {
  constructor({ heroRepository }) {
    this.heroRepository = heroRepository;
  }

  find() {
    return this.heroRepository.find();
  }

  create(data) {
    return this.heroRepository.create(data);
  }
}
