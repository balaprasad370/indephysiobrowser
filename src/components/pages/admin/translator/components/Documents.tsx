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
import { Link, useNavigate } from "react-router-dom";
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
import { GlobalInfo } from "./../../../../../App";

const TranslatorDocuments = ({ renderDocuments, loading, setLoading }) => {
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
      accessorKey: "fullname",
      header: () => <div className="text-center">Full name</div>,
      cell: ({ row }) => (
        <div className="capitalize text-center ">
          {row.original.first_name} {row.original.last_name}
        </div>
      )
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
          <div className="lowercase text-center font-bold text-blue-600">
            {row.original.document_name}
          </div>
        </Link>
      )
    },
    {
      accessorKey: "num_pages",
      header: () => <div className="text-center">Number of Pages </div>,
      cell: ({ row }) => (
        <div className="capitalize text-center font-bold">
          {row.original.num_pages}
        </div>
      )
    },
    {
      accessorKey: "net_amount",
      header: () => <div className="text-center">Net Amount </div>,
      cell: ({ row }) => (
        <div className="capitalize text-center font-bold">
          {row.original.net_amount}
        </div>
      )
    },
    {
      accessorKey: "paid_amount",
      header: ({ column }) => {
        return <div className="text-center">Paid Amount</div>;
      },
      cell: ({ row }) => (
        <div className="lowercase text-center font-bold">
          {row.original.paid_amount}
        </div>
      )
    },

    {
      accessorKey: "is_payment_approved",
      header: () => <div className="text-center">Payment Approved status</div>,
      cell: ({ row }) => (
        <div
          className={`capitalize text-center font-bold ${
            row.original.is_payment_approved == 1
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {row.original.is_payment_approved == 1 ? "Approved" : "Pending"}
        </div>
      )
    },
    {
      accessorKey: "status",
      header: () => <div className="text-center">Payment received status</div>,
      cell: ({ row }) => (
        <div
          className={`capitalize text-center font-bold ${
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
      accessorKey: "Document Translation Status",
      header: () => (
        <div className="text-center">Document Translation Status </div>
      ),
      cell: ({ row }) => (
        <div
          className={`capitalize text-center font-bold ${
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
          <div className="font-medium text-center">
            {moment(row.original.modified_at * 1000).format(
              "DD-MM-YYYY, HH:mm"
            )}
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
          <div className="flex flex-row gap-2 justify-center items-center text-white font-semibold">
            <div
              className="cursor-pointer bg-blue-500 p-2 rounded-md"
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
              {/* <AiOutlineTranslation size={20} color="white" /> */}
              Open
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
  }, [renderDocuments]);

  const getDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${context.apiEndPoint}admin/translator/documents`,
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

  return (
    <>
      <div>
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Documents</CardTitle>
            <CardDescription>
              List of all documents requested by clients
            </CardDescription>
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

export default TranslatorDocuments;
