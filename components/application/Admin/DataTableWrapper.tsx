"use client";

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { MRT_ColumnDef } from "material-react-table";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import DataTable from "./DataTable";

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

const DataTableWrapper = <T extends object>({
    queryKey,
    fetchUrl,
    collumnConfig,
    initialPageSize = 10,
    createAction,
    trashview,
}: Props<T>) => {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    // ✅ create proper theme objects
    const lightTheme = createTheme({
        palette: { mode: "light" },
    });
    const darkTheme = createTheme({
        palette: { mode: "dark" },
    });

    const finalFetchUrl = trashview ? `${fetchUrl}?trash=1` : fetchUrl;

    return (
        <ThemeProvider theme={resolvedTheme === "dark" ? darkTheme : lightTheme}>
            <CssBaseline />
            <DataTable
                queryKey={trashview ? `${queryKey}-trash` : queryKey}
                fetchUrl={finalFetchUrl}
                collumnConfig={collumnConfig}
                initialPageSize={initialPageSize}
                createAction={createAction}
            />
        </ThemeProvider>
    );
};

export default DataTableWrapper;
