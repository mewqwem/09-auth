import { User } from "@/types/user";
import { nextServer } from "./api";
import type { Note, NoteData, NotesResponse } from "@/types/note";
import { SessionResponse } from "./serverApi";

export type RegisterDataRequest = {
  email: string;
  password: string;
};
export type LoginDataRequest = {
  email: string;
  password: string;
};
export type UpdateUserData = {
  username?: string;
};

export const login = async (userData: LoginDataRequest): Promise<User> => {
  const { data } = await nextServer.post<User>("/auth/login", userData);
  return data;
};

export const register = async (
  userData: RegisterDataRequest,
): Promise<User> => {
  const { data } = await nextServer.post<User>("/auth/register", userData);
  return data;
};

export const logout = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const updateMe = async (userData: UpdateUserData): Promise<User> => {
  const { data } = await nextServer.patch<User>("/users/me", userData);
  return data;
};

export const createNote = async (noteData: NoteData): Promise<Note> => {
  const { data } = await nextServer.post<Note>("/notes", noteData);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await nextServer.delete<Note>(`/notes/${id}`);
  return data;
};

export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};

export const checkSession = async (): Promise<boolean> => {
  const { data } = await nextServer.get<SessionResponse>("/auth/session");
  return data.success;
};

export const fetchNotes = async (
  search: string = "",
  page: number = 1,
  perPage: number = 12,
  tag?: string,
): Promise<NotesResponse> => {
  const { data } = await nextServer.get<NotesResponse>("/notes", {
    params: { search, page, perPage, tag },
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await nextServer.get<Note>(`/notes/${id}`);
  return data;
};
