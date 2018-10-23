import { DishesModule } from './dishes.module';

describe('DishesModule', () => {
  let dishesModule: DishesModule;

  beforeEach(() => {
    dishesModule = new DishesModule();
  });

  it('should create an instance', () => {
    expect(dishesModule).toBeTruthy();
  });
});
