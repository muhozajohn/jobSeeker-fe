import { ConnectionRequestApiResponse, CreateConnectionRequestDto, UpdateConnectionStatusDto } from "@/types/notification";
import http from "@/utils/axiosInstance";
import { AxiosResponse } from "axios";

const CONNECTION_REQUEST_URL = "/connection-requests";

class ConnectionRequestService {
  create(data: CreateConnectionRequestDto): Promise<AxiosResponse<ConnectionRequestApiResponse>> {
    return http.post(CONNECTION_REQUEST_URL, data);
  }

  getAll() {
    return http.get(CONNECTION_REQUEST_URL);
  }

  updateStatus(id: number, data: UpdateConnectionStatusDto): Promise<AxiosResponse<ConnectionRequestApiResponse>> {
    return http.put(`${CONNECTION_REQUEST_URL}/${id}/status`, data);
  }
}

export const connectionRequestService = new ConnectionRequestService();
