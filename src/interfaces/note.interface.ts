export interface INotes{
    title: string;
    description: string;
    createdBy: number;
    color?: string;
    isArchive: boolean;
    isTrash: boolean;
    id?: string | number;
}