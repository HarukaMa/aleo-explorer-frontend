import { type ColumnDef, createTableHook, type RowData } from "@tanstack/svelte-table"

const { appFeatures, createAppColumnHelper, createAppTable } = createTableHook({ features: {} })

export { createAppColumnHelper, createAppTable }

export type DataTableColumns<TData extends RowData> = ReadonlyArray<ColumnDef<typeof appFeatures, TData, any>>
