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

function Dashboard() {
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
      accessorKey: "fullname",
      header: () => <div className="text-center">Full name</div>,
      cell: ({ row }) => (
        <div className="capitalize text-blue-600 min-w-40">
          <Link to={"/admin/candidate/" + row.original.student_id}>
            {row.getValue("fullname")}
          </Link>
        </div>
      )
    },
    {
      accessorKey: "username",
      header: ({ column }) => {
        return (
          <div className="text-center min-w-40">
            <Button
              variant="ghost"
              className="text-black dark:text-white text-center"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Email
              <CaretSortIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("username")}</div>
      )
    },
    {
      accessorKey: "package",
      header: () => <div className="text-center">Package</div>,
      cell: ({ row }) => (
        <div className="capitalize min-w-40">{row.getValue("package")}</div>
      )
    },
    {
      accessorKey: "mobile",
      header: () => <div className="text-right">Mobile</div>,
      cell: ({ row }) => {
        return (
          <div className="text-right font-medium min-w-24">{row.getValue("mobile")}</div>
        );
      }
    },
    {
      id: "actions",
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
                  navigate("/admin/candidate/" + row.original.student_id);
                }}
              >
                Visit Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigate(
                    "/admin/candidate/transactions/" + row.original.student_id
                  );
                }}
              >
                Consultancy fees
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigate(
                    "/admin/candidate/documents/" + row.original.student_id
                  );
                }}
              >
                Documents
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

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const res = await axios({
      method: "post",
      url: context.apiEndPoint + "students/all"
    });
    setdata(res.data);
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {true && (
        <TooltipProvider>
          <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <Tabs defaultValue="all" className="w-full overflow-x-auto">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                </TabsList>
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
                        <Input
                          placeholder="Filter Names..."
                          value={
                            (table
                              .getColumn("fullname")
                              ?.getFilterValue() as string) ?? ""
                          }
                          onChange={(event) =>
                            table
                              .getColumn("fullname")
                              ?.setFilterValue(event.target.value)
                          }
                          className="max-w-sm mb-2 sm:mb-0 sm:mr-2"
                        />
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
                        <Table className="max-w-full overflow-x-auto">
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

export default Dashboard;
