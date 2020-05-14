import { IllcatalogModule } from './illcatalog.module';

describe('IllcatalogModule', () => {
  let illcatalogModule: IllcatalogModule;

  beforeEach(() => {
    illcatalogModule = new IllcatalogModule();
  });

  it('should create an instance', () => {
    expect(illcatalogModule).toBeTruthy();
  });
});
