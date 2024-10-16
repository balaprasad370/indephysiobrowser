import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
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
import { HiOutlineDocumentText } from "react-icons/hi";
import { GrTransaction } from "react-icons/gr";
import { AiOutlineTranslation } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

import moment from "moment";

import { GlobalInfo } from "./../../../../App";
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
import axios from "axios";

import Documents from "./components/Documents";
import { MdRefresh } from "react-icons/md";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";

const Translator = () => {
  const navigate = useNavigate();
  const context = useContext(GlobalInfo);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const [currentType, setCurrentType] = useState<"students" | "documents">(
    "documents"
  );

  const [loading, setLoading] = useState(false);
  const [renderDocuments, setRenderDocuments] = useState(false);

  const [data, setdata] = useState([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
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
        <div className="capitalize text-center text-blue-600">
          <Link to={"/admin/translator/student/" + row.original.student_id}>
            {row.original.first_name} {row.original.last_name}
          </Link>
        </div>
      )
    },
    {
      accessorKey: "total_paid_amt",
      header: () => <div className="text-center">Paid Amount in EUR</div>,
      cell: ({ row }) => (
        <div className="lowercase text-center font-bold">
          {row.original.total_paid_amt}
        </div>
      )
    },
    {
      accessorKey: "total_net_amt",
      header: () => <div className="text-center">Net Amount in EUR</div>,
      cell: ({ row }) => (
        <div className="capitalize text-center font-bold">
          {row.original.total_net_amt}
        </div>
      )
    },
    {
      accessorKey: "modified_at",
      header: () => <div className="text-center">Last Updated at </div>,
      cell: ({ row }) => {
        return (
          <div className="font-medium text-center">
            {moment(row.original.latest_modified_at * 1000)
              .format("DD-MM-YYYY, HH:mm")}
          </div>
        );
      }
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        return (
          <div className="flex flex-row gap-2 justify-center items-center">
            <div
              className="cursor-pointer bg-blue-500 p-2 rounded-md"
              onClick={() => {
                navigate(
                  "/admin/translator/student/" + row.original.student_id
                );
              }}
            >
              <AiOutlineTranslation size={20} color="white" />
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

  const getStudents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${context.apiEndPoint}admin/translator/students`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setdata(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    if (currentType === "students") {
      getStudents();
    }
  }, [currentType, renderDocuments]);

  return (
    <>
      <div className="flex flex-col items-start w-full text-black dark:text-white">
        <div className="flex  items-start justify-end w-full px-4 py-4">
          <div className="flex flex-row justify-center items-center gap-2 ">
            <button
              onClick={() => setRenderDocuments(!renderDocuments)}
              disabled={loading}
              className="border border-gray-500 bg-inherit p-2 rounded-md mx-2"
            >
              <MdRefresh
                size={20}
                className={`text-teal-500 transition-all duration-300 ${
                  loading && "animate-spin"
                }`}
              />
            </button>
          </div>

          <div
            className="inline-flex rounded-md shadow-sm border border-gray-500"
            role="group"
          >
            <button
              className={`${
                currentType === "documents"
                  ? "bg-teal-500  focus:bg-teal-500 focus:border-none focus:outline-none text-white border-none outline-none rounded-md dark:rounded-none overflow-hidden"
                  : "text-black  border-none rounded-md dark:rounded-none overflow-hidden"
              }  px-3 py-1  transition`}
              onClick={() => setCurrentType("documents")}
            >
              Documents
            </button>

            <button
              className={`${
                currentType === "students"
                  ? "bg-teal-500 focus:bg-teal-500 focus:border-none focus:outline-none text-white border-none outline-none rounded-none"
                  : "text-black  border-none rounded-md dark:rounded-none overflow-hidden"
              }  px-3 py-1 transition `}
              onClick={() => setCurrentType("students")}
            >
              Students
            </button>
          </div>
        </div>

        {/* table for students     */}

        <div className="w-full px-4 py-4">
          {currentType === "students" && (
            <Card className="w-full px-4 py-4">
              <CardHeader className="text-center">
                <CardTitle>Students</CardTitle>
                <CardDescription>
                  List of students assigned to you
                </CardDescription>
              </CardHeader>
              <div className="rounded-md border overflow-x-auto max-w-full px-4">
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
            </Card>
          )}

          {/* table for documents     */}

          {currentType === "documents" && (
            <Documents
              renderDocuments={renderDocuments}
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Translator;
