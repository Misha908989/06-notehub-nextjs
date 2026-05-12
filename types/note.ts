export interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: string;
}

export interface NotesResponse {
  notes: Note[];
  totalPages: number;
  totalNotes: number;
}

export type NoteTag =
  | "Todo"
  | "Work"
  | "Personal"
  | "Meeting"
  | "Shopping"
  | "Other";

export interface CreateNoteData {
  title: string;
  content: string;
  tag: NoteTag;
}
