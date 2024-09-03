import React, { useState, useEffect, useContext } from "react";
import { FaPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table";
import moment from "moment";

import {
  File,
  Home,
  LineChart,
  ListFilter,
  MoreHorizontal,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Users2,
  ChevronDownIcon
} from "lucide-react";

import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../ui/table";
import {
  ChevronRightIcon,
  CaretSortIcon,
  DotsHorizontalIcon
} from "@radix-ui/react-icons";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../ui/dropdown";

import { Button } from "../../ui/button";

import { Checkbox } from "../../ui/checkbox";
import { Input } from "./../../ui/input";
import { GlobalInfo } from "./../../../App";

const Branding = () => {
  const [token, settoken] = useState(localStorage.getItem("token"));
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const context = useContext(GlobalInfo);

  const navigate = useNavigate();

  const [data, setdata] = useState([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="text-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false
    },
    {
      accessorKey: "brand_name",
      header: () => <div className="text-center">Image Name</div>,
      cell: ({ row }) => (
        <div className="capitalize text-blue-600">
          <Link to={"/admin/branding/view/" + row.original.brand_id}>
            {row.getValue("brand_name")}
          </Link>
        </div>
      )
    },
    {
      accessorKey: "brand_demo",
      header: ({ column }) => {
        return <div className="text-center">Image Demo</div>;
      },
      cell: ({ row }) => (
        <div className="lowercase  flex items-center justify-center">
          <img
            className="w-32 h-32"
            src={context.filesServerUrl + row.getValue("brand_demo")}
          />
        </div>
      )
    },
    {
      accessorKey: "brand_custom",
      header: ({ column }) => {
        return <div className="text-center">Image Dynamic</div>;
      },
      cell: ({ row }) => (
        <div className="lowercase flex items-center justify-center">
          <img
            className="w-32 h-32"
            src={context.filesServerUrl + row.getValue("brand_custom")}
          />
        </div>
      )
    },
    {
      accessorKey: "brand_created_date",
      header: () => <div className="text-center">Created date</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium  flex items-center justify-center">
            {moment(row.getValue("brand_created_date")).format(
              "DD MMM, YYYY HH:mm:ss"
            )}
          </div>
        );
      }
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 text-black dark:text-white"
              >
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[10rem]">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(
                    "https://portal.indephysio.com/app/branding/customize/" +
                      row.original.brand_id
                  );
                }}
              >
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate("/admin/branding/view/" + row.original.brand_id);
                }}
              >
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  handleDeleteItem(row.original.brand_id);
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    }
  });

  const getBrands = async () => {
    const response = await axios({
      method: "get",

      url: context.apiEndPoint + "admin/branding",

      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // console.log(response.data);
    setdata(response.data);
  };

  const handleDeleteItem = async (delete_id) => {
    const response = await axios({
      method: "post",
      data: {
        brand_id: delete_id
      },
      url: context.apiEndPoint + "admin/branding/delete",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    getBrands();
  };

  useEffect(() => {
    getBrands();
  }, []);

  return (
    <>
      <div className="w-full p-4">
        <div className="flex w-full justify-end">
          <div className="p-8 ">
            <Link to="/admin/branding/new">
              <button className="flex p-2 bg-teal-600 text-white items-center justify-center">
                <FaPlus />
                <div className="pl-2">Add Media</div>
              </button>
            </Link>
          </div>
        </div>

        <div>
          <div className="w-full text-black dark:text-white">
            <div className="flex items-center py-4">
              <Input
                placeholder="Filter Names..."
                value={
                  (table.getColumn("brand_name")?.getFilterValue() as string) ??
                  ""
                }
                onChange={(event) =>
                  table
                    .getColumn("brand_name")
                    ?.setFilterValue(event.target.value)
                }
                className="max-w-sm"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto">
                    Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected.
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Branding;
