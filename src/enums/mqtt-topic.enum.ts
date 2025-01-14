export enum SubscribeTopic {
  SHUTTLE_INFORMATION_TOPIC = 'shuttle/information/',
  SHUTTLE_COMPLETE_MISSION_TOPIC = 'shuttle/completeMission/',
  ROUTE_PROGRAM_COMPLETE_MISSION_TOPIC = 'routeProgram/completeMission/',
}

export enum PublishTopic {
  SHUTTLE_RUN_STATUS_TOPIC = 'shuttle/run/',
  CONTROLLER_REPORT = 'controller/report/',
  SHUTTLE_HANDLE_TOPIC = 'shuttle/handle/',
  ROUTE_PROGRAM_HANDLE_TOPIC = 'routeProgram/handle/',
}
