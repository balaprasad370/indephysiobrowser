import React, { useState, useContext, useEffect } from "react";
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
import moment from "moment";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  ChevronRightIcon,
  CaretSortIcon,
  DotsHorizontalIcon
} from "@radix-ui/react-icons";

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
import { HiOutlineDocumentText } from "react-icons/hi";
import { GrTransaction } from "react-icons/gr";
import { AiOutlineTranslation } from "react-icons/ai";
import { GlobalInfo } from "../../../../App";

const StudentsDocuments = () => {
  const { student_id } = useParams();
  const navigate = useNavigate();
  const context = useContext(GlobalInfo);
  const [token, setToken] = useState(localStorage.getItem("token"));

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
      accessorKey: "document_name",
      header: ({ column }) => {
        return <div className="text-center">Document Name</div>;
      },
      cell: ({ row }) => (
        <Link
          to={
            "/admin/candidate/translations/" +
            row.original.student_id +
            "/documents/" +
            row.original.doc_cat_id +
            "/" +
            row.original.translation_doc_id
          }
        >
          <div className="lowercase font-bold">
            {row.original.document_name}
          </div>
        </Link>
      )
    },
    {
      accessorKey: "paid_amount",
      header: ({ column }) => {
        return <div className="text-center">Paid Amount</div>;
      },
      cell: ({ row }) => (
        <div className="lowercase font-bold">{row.original.paid_amount}</div>
      )
    },
    {
      accessorKey: "net_amount",
      header: () => <div className="text-center">Net Amount </div>,
      cell: ({ row }) => (
        <div className="capitalize font-bold">{row.original.net_amount}</div>
      )
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Payment Status </div>,
      cell: ({ row }) => (
        <div
          className={`capitalize font-bold ${
            row.original.net_amount - row.original.paid_amount == 0
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {row.original.net_amount - row.original.paid_amount == 0
            ? "Paid"
            : "Pending"}
        </div>
      )
    },
    {
      accessorKey: "Document Status",
      header: () => <div className="text-center">Document Status </div>,
      cell: ({ row }) => (
        <div
          className={`capitalize font-bold ${
            row.original.translation_status == 0
              ? "text-red-500"
              : "text-green-500"
          }`}
        >
          {row.original.translation_status == 0 ? "Pending" : "Completed"}
        </div>
      )
    },
    {
      accessorKey: "modified_at",
      header: () => <div className="text-center">Last Updated at </div>,
      cell: ({ row }) => {
        return (
          <div className="font-medium ">
            {moment(row.getValue("modified_at")).format("DD-MM-YYYY, HH:mm")}
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
              className="cursor-pointer bg-blue-500 p-2 rounded-md text-white font-medium"
              onClick={() => {
                navigate(
                  "/admin/candidate/translations/" +
                    row.original.student_id +
                    "/documents/" +
                    row.original.doc_cat_id +
                    "/" +
                    row.original.translation_doc_id
                );
              }}
            >
              View Document
              {/* <AiOutlineTranslation size={20} color="white" /> */}
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

  useEffect(() => {
    getDocuments();
  }, []);

  const getDocuments = async () => {
    try {
      const response = await axios.get(
        `${context.apiEndPoint}admin/translator/documents/` + student_id,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setdata(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 px-4 py-4 text-black dark:text-white">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold capitalize">
              {data.length > 0
                ? data[0].first_name + " " + data[0].last_name
                : "Not Valid Student"}
            </CardTitle>
            <CardDescription>Documents</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto max-w-full">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default StudentsDocuments;
