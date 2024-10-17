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

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from "@/components/ui/sheet";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert";

import useAuth from "@/hooks/useAuth";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

function Financial() {
  const tokenData = useAuth();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [globalFilter, setGlobalFilter] = React.useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  const context = useContext(GlobalInfo);

  const navigate = useNavigate();

  const [data, setdata] = useState([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [changeStatusId, setChangeStatusId] = useState(null);

  const [changeStatusOpen, setChangeStatusOpen] = useState(false);

  const [documentDetails, setDocumentDetails] = useState([]);

  const [paymentStatus, setPaymentStatus] = useState(null);
  const [paymentDisplayStatus, setPaymentDisplayStatus] = useState(null);
  const [documentStatus, setDocumentStatus] = useState(null);

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
          {row.original.first_name + " " + row.original.last_name}
        </div>
      )
    },
    {
      accessorKey: "document_name",
      header: () => <div className="text-center">Document</div>,
      cell: ({ row }) => (
        <div className={`capitalize`}>{row.original.document_name}</div>
      )
    },
    {
      accessorKey: "account_holder_name",
      header: () => <div className="text-center">Account Holder Name</div>,
      cell: ({ row }) => (
        <div className={`capitalize`}>{row.original.account_holder_name}</div>
      )
    },
    {
      accessorKey: "payment_transaction_id",
      header: () => <div className="text-center">Transaction ID</div>,
      cell: ({ row }) => (
        <div className={`capitalize`}>
          {row.original.payment_transaction_id}
        </div>
      )
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-center">Amount</div>,
      cell: ({ row }) => (
        <div className={`capitalize`}>€{row.original.amount}</div>
      )
    },
    {
      accessorKey: "amount_inr",
      header: () => <div className="text-center">Amount in INR</div>,
      cell: ({ row }) => (
        <div className={`capitalize`}>₹{row.original.amount_inr}</div>
      )
    },
    {
      accessorKey: "current_exchange_rate",
      header: () => <div className="text-center">Exchange Rate (€ to ₹)</div>,
      cell: ({ row }) => (
        <div className={`capitalize`}>
          ₹{row.original.current_exchange_rate}
        </div>
      )
    },
    {
      accessorKey: "date_of_transaction",
      header: () => <div className="text-center">Date of Transaction</div>,
      cell: ({ row }) => (
        <div className={`capitalize`}>{row.original.date_of_transaction}</div>
      )
    },
    {
      accessorKey: "amount_status",
      header: () => <div className="text-center">Status</div>,
      cell: ({ row }) => (
        // Start of Selection
        <span
          className={`capitalize text-center font-bold px-2 inline-flex text-xs leading-5 rounded-full ${
            row.original.amount_status === 0
              ? "bg-yellow-100 text-yellow-800"
              : row.original.amount_status === 1
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.original.amount_status === 0
            ? "Pending"
            : row.original.amount_status === 1
            ? "Approved"
            : "Rejected"}
        </span>
      )
    },
    {
      accessorKey: "payment_created_date",
      header: () => <div className="text-center">Date of Request</div>,
      cell: ({ row }) => (
        <div className={`capitalize`}>{row.original.payment_created_date}</div>
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
                fetchStatus(
                  row.original.student_id,
                  row.original.translation_doc_id,
                  row.original.payment_id
                );
                setChangeStatusId(row.original.payment_id);
                setChangeStatusOpen(true);
              }}
            >
              Change Status
            </div>
          </div>
        );
      }
    }
  ];

  const [studentId, setStudentId] = useState(null);
  const [translationDocId, setTranslationDocId] = useState(null);

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
      method: "get",
      url: context.apiEndPoint + "admin/student/translations/payment/requests",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setdata(res.data);
  };

  const fetchStatus = async (
    student_id = null,
    translation_doc_id = null,
    payment_id = null
  ) => {
    try {
      if (student_id && translation_doc_id) {
        const res = await axios({
          method: "get",
          url:
            context.apiEndPoint +
            "admin/student/translations/payment/requests/" +
            student_id +
            "/" +
            translation_doc_id,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (res.data.length > 0) {
          setDocumentStatus(
            res.data[0]?.document_payment_status
              ? res.data[0]?.document_payment_status
              : "0"
          );

          setPaymentDisplayStatus(
            res.data[0]?.document_payment_status
              ? res.data[0]?.document_payment_status
              : "0"
          );

          for (let x of res.data) {
            if (payment_id == x.payment_id) {
              setPaymentStatus(x?.amount_status ? x?.amount_status : "0");
            }
          }

          setDocumentDetails(res.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const submitStatus = async () => {
    try {
      const obj = {
        order_id: documentDetails[0].order_id,
        payment_id: changeStatusId,
        document_id: documentDetails[0].translation_doc_id,
        student_id: documentDetails[0].student_id,
        document_payment_status: documentStatus,
        amount_status: paymentStatus
      };

      const res = await axios({
        method: "post",
        url: context.apiEndPoint + "admin/student/translations/payment/update",
        data: obj,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setChangeStatusOpen(false);
      fetchStudents();
    } catch (error) {
      console.log(error);
    }
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
                    <CardTitle>Translation Transactions</CardTitle>
                    <CardDescription>
                      Manage your Translation Transactions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="w-full text-black dark:text-white">
                      <div className="flex flex-col sm:flex-row items-center py-4">
                        <div className="relative w-full mb-2 sm:mb-0 sm:mr-2">
                          <input
                            placeholder="Filter by names, transaction id, etc..."
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

      <Sheet open={changeStatusOpen} onOpenChange={setChangeStatusOpen}>
        <SheetContent
          side="bottom"
          className="h-[40rem] overflow-y-auto p-4 lg:p-10"
        >
          <SheetHeader>
            <SheetTitle>Change Status</SheetTitle>
          </SheetHeader>

          {documentDetails.length > 0 && (
            <div>
              <div>
                <div className="p-4 bg-white rounded shadow-md">
                  <div className="mb-2 text-xl font-semibold text-gray-800">
                    {documentDetails[0].first_name}{" "}
                    {documentDetails[0].last_name}
                  </div>
                  <div className="mb-1 text-gray-600">
                    Document:
                    <span className="font-bold">
                      {" "}
                      {documentDetails[0].document_name}
                    </span>
                  </div>
                  <div className="mb-1 text-gray-700">
                    Net Amount:
                    <span className="font-bold">
                      {" "}
                      €{documentDetails[0].net_amount}
                    </span>
                  </div>
                  <div className="text-gray-700">
                    Paid Amount:
                    <span className="font-bold">
                      {" "}
                      €{documentDetails[0].paid_amount}
                    </span>
                  </div>

                  <div className="text-gray-700">
                    Document Payment Status:
                    <span
                      className={`font-bold ${
                        paymentDisplayStatus == 0
                          ? "text-yellow-500"
                          : paymentDisplayStatus == 1
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {" "}
                      {paymentDisplayStatus == 0
                        ? "Pending"
                        : paymentDisplayStatus == 1
                        ? "Approved"
                        : "Rejected"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4 mt-4 lg:w-1/3 w-full">
                <div className="flex flex-col gap-2">
                  <label>Change the selected payment status</label>
                  <Select
                    value={paymentStatus ? paymentStatus.toString() : "0"}
                    onValueChange={(value) => {
                      setPaymentStatus(value);
                    }}
                  >
                    <SelectTrigger className="bg-white border-slate-400">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem
                        value="0"
                        className="hover:bg-gray-100 cursor-pointer"
                      >
                        Pending
                      </SelectItem>
                      <SelectItem
                        value="1"
                        className="hover:bg-gray-100 cursor-pointer "
                      >
                        Approved
                      </SelectItem>
                      <SelectItem
                        value="2"
                        className="hover:bg-gray-100 cursor-pointer "
                      >
                        Rejected
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <label> Change the Document Status</label>
                  <Select
                    value={documentStatus ? documentStatus.toString() : "0"}
                    onValueChange={(value) => {
                      setDocumentStatus(value);
                    }}
                  >
                    <SelectTrigger className="bg-white border-slate-400">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem
                        value="0"
                        className="hover:bg-gray-100 cursor-pointer"
                      >
                        Pending
                      </SelectItem>
                      <SelectItem
                        value="1"
                        className="hover:bg-gray-100 cursor-pointer"
                      >
                        Approved
                      </SelectItem>
                      <SelectItem
                        value="2"
                        className="hover:bg-gray-100 cursor-pointer"
                      >
                        Rejected
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <button
                    className="bg-teal-600 text-white p-2 rounded-md"
                    onClick={() => {
                      submitStatus();
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto ">
                <p className="text-gray-500 text-sm">
                  selected payment willl be highlighted
                </p>
                <table className="min-w-full divide-y divide-gray-200 ">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-semibold">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-semibold">
                        Amount in INR
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-semibold">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-semibold">
                        Date of Transaction
                      </th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider font-semibold">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documentDetails.map((detail) => (
                      <tr
                        key={detail.payment_id}
                        className={`hover:bg-gray-100 ${
                          changeStatusId === detail.payment_id
                            ? "bg-teal-300 hover:bg-teal-300"
                            : ""
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          €{detail.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          ₹{detail.amount_inr}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {detail.payment_transaction_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {detail.date_of_transaction}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              detail.amount_status === 0
                                ? "bg-yellow-100 text-yellow-800"
                                : detail.amount_status === 1
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {detail.amount_status === 0
                              ? "Pending"
                              : detail.amount_status === 1
                              ? "Approved"
                              : "Rejected"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Financial;
