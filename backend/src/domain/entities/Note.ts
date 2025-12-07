export type NoteType = 'initial' | 'interim' | 'discharge';

export interface Note {
  id: string;
  patientId: string;
  patientName: string;
  type: NoteType;
  content: string;
  createdAt: Date;
}

export class NoteEntity implements Note {
  constructor(
    public id: string,
    public patientId: string,
    public patientName: string,
    public type: NoteType,
    public content: string,
    public createdAt: Date
  ) {}

  static create(
    id: string,
    patientId: string,
    patientName: string,
    type: NoteType,
    content: string
  ): NoteEntity {
    return new NoteEntity(id, patientId, patientName, type, content, new Date());
  }
}
