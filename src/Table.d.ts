import { CSSProperties } from "vue";


export interface TableLiteColumn {
    label: string;
    field: string;
    isKey?: boolean;
    width?: string;
    sortable?: boolean;
    display?: boolean;
    headerClasses?: string[];
    columnClasses?: string[];
    headerStyles?: CSSProperties;
    columnStyles?: CSSProperties;
}












