export type NoteTag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface Note {
  _id: string;
  title: string;
  content: string;
  tag: NoteTag;
}

export interface CreateNotePayload {
  title: string;
  content: string;
  tag: NoteTag;
}