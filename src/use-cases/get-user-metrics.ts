import { CheckInsRepository } from "../repositories/check-ins-repository";

interface GetUserMetricsRequest {
  userId: string;
}

interface GetUserMetricsResponse {
  checkIns: number;
}

export class GetUserMetricsUseCase {
  constructor(private checkInsRepository: CheckInsRepository) {}

  async execute({
    userId,
  }: GetUserMetricsRequest): Promise<GetUserMetricsResponse> {
    const checkIns = await this.checkInsRepository.findAllCheckIns(userId);

    return { checkIns };
  }
}
