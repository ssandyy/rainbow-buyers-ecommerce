"use client";

import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton, Tooltip } from "@mui/material";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
    type MRT_ColumnFiltersState,
    type MRT_PaginationState,
    type MRT_SortingState,
} from "material-react-table";
import { useState } from "react";

interface Props<T extends object> {
    queryKey: string;
    fetchUrl: string;
    collumnConfig: MRT_ColumnDef<T>[];
    initialPageSize?: number;
    exportEndPoint?: string;
    deleteEndPoint?: string;
    deletetype?: string;
    trashview?: boolean;
    createAction?: React.ReactNode;
}

type ApiResponse<T> = {
    data: T[];
    meta: {
        totalRowCount: number;
    };
};

const DataTable = <T extends object>({
    queryKey,
    fetchUrl,
    collumnConfig,
    initialPageSize = 10,
    createAction,
}: Props<T>) => {

    // ------------------ states ------------------
    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [pagination, setPagination] = useState<MRT_PaginationState>({
        pageIndex: 0,
        pageSize: initialPageSize,
    });

    // ------------------ fetching ------------------
    const {
        data: rawResponse,
        isError,
        isRefetching,
        isLoading,
        refetch,
    } = useQuery<any>({
        queryKey: [
            queryKey,
            { columnFilters, globalFilter, pagination, sorting },
        ],
        queryFn: async () => {
            const fetchURL = new URL(fetchUrl, window.location.origin);

            // add query params for server-side API
            fetchURL.searchParams.set("start", `${pagination.pageIndex * pagination.pageSize}`);
            fetchURL.searchParams.set("size", `${pagination.pageSize}`);
            fetchURL.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
            fetchURL.searchParams.set("globalFilter", globalFilter ?? "");
            fetchURL.searchParams.set("sorting", JSON.stringify(sorting ?? []));

            const response = await fetch(fetchURL.href);
            if (!response.ok) throw new Error("Failed to fetch");
            return await response.json();
        },
        placeholderData: keepPreviousData,
    });

    // Normalize response to { rows, total }
    let rows: T[] = [];
    let totalRows = 0;
    if (rawResponse) {
        const payload = rawResponse.data ?? rawResponse; // unwrap if wrapped by { data: ... }
        if (Array.isArray(payload?.data)) {
            rows = payload.data as T[];
            totalRows = Number(payload?.meta?.totalRowCount) || (rows?.length ?? 0);
        } else if (Array.isArray(payload)) {
            rows = payload as T[];
            totalRows = rows?.length ?? 0;
        }
    }

    // ------------------ table config ------------------
    const table = useMaterialReactTable({
        columns: collumnConfig,
        data: rows,
        enableRowSelection: true,
        enableColumnOrdering: true,
        enableStickyHeader: true,
        columnFilterDisplayMode: 'popover',
        initialState: { showColumnFilters: true },
        manualFiltering: true,
        manualPagination: true,
        manualSorting: true,
        muiToolbarAlertBannerProps: {
            color: isError ? "error" : undefined,
            children: isError ? "Error loading data" : undefined,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,

        renderTopToolbarCustomActions: () => (
            <div className="flex items-center gap-2">
                {createAction}
                <Tooltip arrow title="Refresh Data">
                    <IconButton id="admin-table-refresh" onClick={() => refetch()}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </div>
        ),
        rowCount: totalRows,
        state: {
            columnFilters,
            globalFilter,
            isLoading,
            pagination,
            showAlertBanner: isError,
            showProgressBars: isRefetching,
            sorting,
        },
    });

    return <MaterialReactTable table={table} />;
};

export default DataTable;
