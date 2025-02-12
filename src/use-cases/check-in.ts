import type { CheckIn } from '@prisma/client'
import type { CheckInRepository } from '../repositories/check-in-repository'
import type { GymsRepository } from '../repositories/gym-repository'
import { ResourceNotFoundError } from './erros/resource-not-found'
import { getDistanceBetweenCoordinates } from '../utils/get-distance-between-coordinates'

interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  constructor(
    private checkInRepository: CheckInRepository,
    private gymRepository: GymsRepository,
  ) {}

  async execute({
    gymId,
    userId,
    userLatitude,
    userLongitude,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    const MAX_DISTANCE_KM = 0.1

    if (distance > MAX_DISTANCE_KM) {
      throw new Error()
    }

    const checkInOnSomeDate = await this.checkInRepository.findByUserIdAndDate(
      userId,
      new Date(),
    )

    if (checkInOnSomeDate) {
      throw new Error()
    }

    const checkIn = await this.checkInRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }
}
