import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
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

import {
  ChevronRightIcon,
  CaretSortIcon,
  DotsHorizontalIcon
} from "@radix-ui/react-icons";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { GrTransaction } from "react-icons/gr";
import { AiOutlineTranslation } from "react-icons/ai";

import { Badge } from "../../ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "../../ui/breadcrumb";
import { Button } from "../../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "../../ui/card";

import { Checkbox } from "../../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../../ui/dropdown";
import { Input } from "../../ui/input";
import { Sheet, SheetContent, SheetTrigger } from "../../ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "../../ui/tooltip";

import LanguageIndex from "./languages/index";
import { GlobalInfo } from "./../../../App";
import { Search } from "lucide-react";
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

function Consultant() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
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
      accessorKey: "fullname",
      header: () => <div className="text-center">Full name</div>,
      cell: ({ row }) => (
        <div className="capitalize font-bold text-md">
          {row.getValue("fullname")}
        </div>
      )
    },
    {
      accessorKey: "german_level_placement",
      header: () => <div className="text-center">German Level</div>,
      cell: ({ row }) => (
        <div
          className={`capitalize ${
            row.original.german_level_placement == "" ? "text-xs" : "text-md"
          }`}
        >
          {row.original.german_level_placement != ""
            ? row.original.german_level_placement
            : "Not provided"}
        </div>
      )
    },
    {
      accessorKey: "highest_qualification",
      header: () => <div className="text-center">Highest qualification</div>,
      cell: ({ row }) => (
        <div
          className={`capitalize ${
            row.original.highest_qualification == "" ? "text-xs" : "text-md"
          }`}
        >
          {row.original.highest_qualification != ""
            ? row.original.highest_qualification
            : "Not provided"}
        </div>
      )
    },
    {
      accessorKey: "gender",
      header: () => <div className="text-center">Gender</div>,
      cell: ({ row }) => (
        <div
          className={`capitalize ${
            row.original.gender == "" ? "text-xs" : "text-md"
          }`}
        >
          {row.original.gender != "" ? row.original.gender : "Not provided"}
        </div>
      )
    },
    {
      accessorKey: "current_status",
      header: () => <div className="text-center">Current Status</div>,
      cell: ({ row }) => (
        <div
          className={`capitalize ${
            row.original.current_status == "" ? "text-xs" : "text-md"
          }`}
        >
          {row.original.current_status != ""
            ? row.original.current_status
            : "Not provided"}
        </div>
      )
    },
    {
      accessorKey: "age",
      header: () => <div className="text-center">Age</div>,
      cell: ({ row }) => (
        <div
          className={`capitalize ${
            row.original.age == "" ? "text-xs" : "text-md"
          }`}
        >
          {row.original.age != "" ? row.original.age : "Not provided"}
        </div>
      )
    },
    {
      accessorKey: "placement",
      header: () => <div className="text-center">Placement </div>,
      cell: ({ row }) => (
        <div
          className={`capitalize ${
            row.original.placement != "" || row.original.placement == "placed"
              ? "text-md text-green-500 font-bold"
              : "text-xs"
          }`}
        >
          {row.original.placement != "" ? row.original.placement : "Not placed"}
        </div>
      )
    },
    {
      accessorKey: "marital_status",
      header: () => <div className="text-center">Marital Status</div>,
      cell: ({ row }) => (
        <div
          className={`capitalize ${
            row.original.marital_status == "" ? "text-xs" : "text-md"
          }`}
        >
          {row.original.marital_status != ""
            ? row.original.marital_status
            : "Not provided"}
        </div>
      )
    },
    {
      accessorKey: "num_of_children",
      header: () => <div className="text-center">Number of Children</div>,
      cell: ({ row }) => (
        <div
          className={`capitalize ${
            row.original.num_of_children == "" ? "text-xs" : "text-md"
          }`}
        >
          {row.original.num_of_children != "" &&
          row.original.marital_status != "single"
            ? row.original.num_of_children
            : "Not provided"}
        </div>
      )
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        return (
          <div className="flex flex-row gap-2 justify-center items-center">
            <div
              className="cursor-pointer bg-teal-600 text-white p-2 rounded-md"
              onClick={() => {
                navigate("/admin/candidate/resumes/" + row.original.student_id);
              }}
            >
              View Resume
            </div>
          </div>
        );
      }
    }
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection
    }
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await axios({
      method: "post",
      url: context.apiEndPoint + "students/all"
    });
    console.log(res.data);
    setdata(res.data);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {true && (
        <TooltipProvider>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all" className="w-full overflow-x-auto">
              <div className="flex items-center">
                {/* <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                </TabsList> */}
              </div>
              <TabsContent value="all">
                <Card
                  x-chunk="dashboard-06-chunk-0"
                  className="text-black dark:text-white"
                >
                  <CardHeader>
                    <CardTitle>Students</CardTitle>
                    <CardDescription>
                      Manage your Students and view their performance.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full text-black dark:text-white">
                      <div className="flex flex-col sm:flex-row items-center py-4">
                        <div className="relative w-full mb-2 sm:mb-0 sm:mr-2">
                          <input
                            placeholder="Filter by names, levels, qualifications, etc..."
                            value={globalFilter}
                            onChange={(event) =>
                              setGlobalFilter(event.target.value)
                            }
                            className="w-full rounded-md border-2 border-slate-400 bg-slate-100 p-2 pl-10 focus:outline-none focus:border-blue-500 dark:bg-slate-800 dark:text-white"
                          />
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button className="ml-auto text-black">
                              Columns{" "}
                              <ChevronDownIcon className="ml-2 h-4 w-4" />
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
                      <div className="rounded-md border overflow-x-auto max-w-full">
                        <Table className="max-w-full min-w-[900px]">
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
                      <div className="flex flex-col sm:flex-row items-center justify-end space-y-2 sm:space-y-0 sm:space-x-2 py-4">
                        <div className="flex-1 text-sm text-muted-foreground">
                          {table.getFilteredSelectedRowModel().rows.length} of{" "}
                          {table.getFilteredRowModel().rows.length} row(s)
                          selected.
                        </div>
                        <div className="space-x-2">
                          <Button
                            className="text-black"
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                          >
                            Previous
                          </Button>
                          <Button
                            className="text-black"
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
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </TooltipProvider>
      )}
    </div>
  );
}

export default Consultant;
