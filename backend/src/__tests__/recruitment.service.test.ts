import { CandidateService } from '../modules/recruitment/recruitment.service';
import { CandidateRepository } from '../modules/recruitment/candidate.repository';

jest.mock('../modules/recruitment/candidate.repository');
const MockRepo = CandidateRepository as jest.MockedClass<typeof CandidateRepository>;

describe('CandidateService', () => {
  let service: CandidateService;
  let repo: jest.Mocked<CandidateRepository>;

  beforeEach(() => {
    MockRepo.mockClear();
    service = new CandidateService();
    repo = MockRepo.mock.instances[0] as jest.Mocked<CandidateRepository>;
  });

  describe('getById', () => {
    it('returns candidate when found', async () => {
      const mock = { id: 'c1', full_name: 'Test Candidate', stage: 'applied' } as any;
      repo.findById = jest.fn().mockResolvedValue(mock);
      const result = await service.getById('c1');
      expect(result).toEqual(mock);
    });

    it('throws 404 when not found', async () => {
      repo.findById = jest.fn().mockResolvedValue(null);
      await expect(service.getById('none')).rejects.toMatchObject({ statusCode: 404 });
    });
  });

  describe('moveStage', () => {
    it('moves to valid stage', async () => {
      const mock = { id: 'c1', stage: 'applied' } as any;
      repo.findById = jest.fn().mockResolvedValue(mock);
      repo.update = jest.fn().mockResolvedValue({ ...mock, stage: 'screening' } as any);

      const result = await service.moveStage('c1', 'screening');
      expect(repo.update).toHaveBeenCalledWith('c1', { stage: 'screening' });
    });

    it('throws 400 for invalid stage', async () => {
      repo.findById = jest.fn().mockResolvedValue({ id: 'c1' } as any);
      await expect(service.moveStage('c1', 'invalid_stage')).rejects.toMatchObject({ statusCode: 400 });
    });
  });

  describe('getStats', () => {
    it('returns stats object', async () => {
      const mockStats = { total: '10', applied: '3', screening: '3', interview: '2', offer: '1', hired: '1', new_this_week: '2' };
      repo.getStats = jest.fn().mockResolvedValue(mockStats);
      const result = await service.getStats();
      expect(result).toEqual(mockStats);
    });
  });
});
