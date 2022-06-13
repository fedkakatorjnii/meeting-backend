import { Test, TestingModule } from '@nestjs/testing';
import { GeolocationGateway } from './geolocation.gateway';

describe('GeolocationGateway', () => {
  let gateway: GeolocationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeolocationGateway],
    }).compile();

    gateway = module.get<GeolocationGateway>(GeolocationGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
