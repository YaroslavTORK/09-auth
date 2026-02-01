export const Note_Tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;
export type NoteTags = (typeof Note_Tags)[number];


export interface Note {
    "id": string;
    "title": string;
    "content": string;
    "tag": NoteTags;
    "createdAt": string;
    "updatedAt": string;
}