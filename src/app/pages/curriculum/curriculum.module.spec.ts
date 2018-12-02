import { CurriculumModule } from './curriculum.module';

describe('CurriculumModule', () => {
  let curriculumModule: CurriculumModule;

  beforeEach(() => {
    curriculumModule = new CurriculumModule();
  });

  it('should create an instance', () => {
    expect(curriculumModule).toBeTruthy();
  });
});
