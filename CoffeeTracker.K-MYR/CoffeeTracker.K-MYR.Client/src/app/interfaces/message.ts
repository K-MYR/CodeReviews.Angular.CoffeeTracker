import { Status } from "./status";

export interface Message {
  id: string,
  text: string,
  status: Status
}
