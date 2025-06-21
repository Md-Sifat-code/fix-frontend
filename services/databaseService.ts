import { profilesService } from "./profiles-service"

// Re-export the functions to maintain backward compatibility
export const fetchProfiles = profilesService.getAll
