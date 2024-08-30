import React, { useState, useEffect } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../ui/table.tsx";
import axios from "axios";
import { useParams } from "react-router-dom";
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
import {
  ChevronRightIcon,
  CaretSortIcon,
  DotsHorizontalIcon
} from "@radix-ui/react-icons";

export type Payment = {
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  holder_name: string;
  package_name: string;
  date: string;
};

export default function DataTableDemo() {
  const { id } = useParams();
  const [data, setData] = React.useState<Payment[]>([]);
  const [token, settoken] = useState(localStorage.getItem("token"));

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        let color = "#ff961d";
        const status = row.getValue("status");

        switch (status) {
          case "completed":
            color = "#10B981";
            break;
          case "pending":
            color = "#ff961d";
            break;
          case "rejected":
            color = "#EF4444";
            break;

          default:
            color = "#ff961d";
            break;
        }

        return (
          <div
            className="capitalize"
            style={{
              color: color,
              fontWeight: "800"
            }}
          >
            {row.getValue("status")}
          </div>
        );
      }
    },

    {
      accessorKey: "holder_name",
      header: "Holder Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("holder_name")}</div>
      )
    },
    {
      accessorKey: "payment_transaction_id",
      header: "Transaction Id",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.getValue("payment_transaction_id")}
        </div>
      )
    },
    {
      accessorKey: "package_name",
      header: "Package Name",
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("package_name")}</div>
      )
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-left">Amount</div>,
      cell: ({ row }) => {
        const amount = row.getValue<number>("amount"); // Ensure amount is a number
        // Display the amount directly as a number
        return <div className="text-left font-medium">{amount.toString()}</div>;
      }
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const rawDate = row.getValue<string>("date"); // Ensure date is a string
        // Convert the date string to a Date object
        const dateObj = new Date(rawDate);

        // Check if the date is valid
        if (isNaN(dateObj.getTime())) {
          return <div className="text-left">Invalid date</div>;
        }

        // Format the date
        const formattedDate = dateObj.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        });

        return <div className="text-left">{formattedDate}</div>;
      }
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const transaction_id = row.original.transaction_id;
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
                  handleUpdatePayment(transaction_id, "accept");
                }}
              >
                Confirm transaction
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  handleUpdatePayment(transaction_id, "reject");
                }}
              >
                Reject transaction
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }
    }
  ];

  const getTransactionDetails = async () => {
    try {
      const response = await axios({
        method: "post",
        url: "https://server.indephysio.com/admin/student/transactionDetails",
        data: {
          studentId: id
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Assuming response.data is an object containing the transaction details
      const transaction = response.data.data;

      //   console.log("my", transaction);

      // Format the transaction data

      // Set the data as an array with a single transaction
      setData(transaction ? transaction : []);
    } catch (error) {
      console.error("Error fetching transaction details:", error);
    }
  };

  const handleUpdatePayment = async (transaction_id, val) => {
    // console.log(transaction_id, val);

    try {
      const response = await axios({
        method: "post",
        url: "https://server.indephysio.com/admin/student/updateTransaction",
        data: {
          transaction_id: transaction_id,
          status: val
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data.status) getTransactionDetails();
    } catch (err) {
      console.log(err);
    }
  };

  React.useEffect(() => {
    getTransactionDetails();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="w-full p-4 text-black dark:text-white">
      <p className="mb-4 text-2xl font-semibold text-gray-800">
        Consultancy fees
      </p>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
  );
}
