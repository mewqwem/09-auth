import { cookies } from "next/headers";
import { nextServer } from "./api";
import type { Note, NotesResponse } from "@/types/note";
import { User } from "@/types/user";
import { AxiosResponse } from "axios";

export interface SessionResponse {
  success: boolean;
}

const getAuthHeaders = async () => {
  const cookieStore = await cookies();
  return {
    Cookie: cookieStore.toString(),
  };
};

export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get<User>("/users/me", {
    headers: await getAuthHeaders(),
  });
  return data;
};

export const checkSession = async (): Promise<
  AxiosResponse<SessionResponse>
> => {
  const response = await nextServer.get<SessionResponse>("/auth/session", {
    headers: await getAuthHeaders(),
  });

  return response;
};

export const fetchNotes = async (
  search: string = "",
  page: number = 1,
  perPage: number = 12,
  tag?: string,
): Promise<NotesResponse> => {
  const { data } = await nextServer.get<NotesResponse>("/notes", {
    params: { search, page, perPage, tag },
    headers: await getAuthHeaders(),
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await nextServer.get<Note>(`/notes/${id}`, {
    headers: await getAuthHeaders(),
  });
  return data;
};
