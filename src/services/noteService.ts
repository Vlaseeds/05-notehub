import axios from 'axios';
import type { Note, CreateNotePayload } from '../types/note';

export interface FetchNotesResponse {
  data: Note[];
  page: number;
  perPage: number;
  totalPages: number;
}

const api = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
});

api.interceptors.request.use((config) => {
  const token = import.meta.env.VITE_NOTEHUB_TOKEN;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const fetchNotes = async (page: number, perPage: number, search: string): Promise<FetchNotesResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    perPage: perPage.toString(),
  });
  if (search) {
    params.append('search', search);
  }
  
  const response = await api.get<FetchNotesResponse>(`/notes?${params.toString()}`);
  return response.data;
};

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  const response = await api.post<Note>('/notes', note);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await api.delete<Note>(`/notes/${id}`);
  return response.data;
};