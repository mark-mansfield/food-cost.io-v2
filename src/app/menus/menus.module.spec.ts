import { MenusModule } from './menus.module';

describe('MenusModule', () => {
  let menusModule: MenusModule;

  beforeEach(() => {
    menusModule = new MenusModule();
  });

  it('should create an instance', () => {
    expect(menusModule).toBeTruthy();
  });
});
