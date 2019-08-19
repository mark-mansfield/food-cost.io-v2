import { SuppliersModule } from './suppliers.module';

describe('SuppliersModule', () => {
  let suppliersModule: SuppliersModule;

  beforeEach(() => {
    suppliersModule = new SuppliersModule();
  });

  it('should create an instance', () => {
    expect(suppliersModule).toBeTruthy();
  });
});
