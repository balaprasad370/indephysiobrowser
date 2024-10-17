import React, {
  useLayoutEffect,
  useState,
  useContext,
  useEffect,
  useRef
} from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import nouser from "../assets/nouser.jpg";
import { GrChapterAdd } from "react-icons/gr";
import { HiOutlineLightBulb } from "react-icons/hi";
import { FaCalendarAlt } from "react-icons/fa";
import { MdAssessment } from "react-icons/md";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { FaRegMoon } from "react-icons/fa";
import { FiSun } from "react-icons/fi";
import { RiAiGenerate } from "react-icons/ri";
import { BsFillMegaphoneFill } from "react-icons/bs";
import { BsTranslate } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa";
import { FaRupeeSign } from "react-icons/fa";
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
  LogOut,
  ChevronDownIcon,
  Users
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "../components/ui/breadcrumb";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider
} from "../components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../components/ui/dropdown";

import useAuth from "../hooks/useAuth";
import { ButtonProps, Button } from "./../components/ui/button";
import { GlobalInfo } from "./../App";
import axios from "axios";
import { ClientContext } from "../hooks/Clientcontext";

const AdminSidebar = () => {
  const context = useContext(GlobalInfo);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const { clientDetails } = useContext(ClientContext);

  const { theme, setTheme } = context;

  const navigate = useNavigate();

  const tokenData = useAuth();

  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <>
      <div className="flex flex-row min-h-screen w-full">
        {clientDetails && (
          <TooltipProvider delayDuration={0}>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex text-black dark:text-white">
              <nav className="flex flex-col items-center gap-4 px-2 py-4 ">
                <Link
                  to="/"
                  className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                >
                  <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                  <span className="sr-only">Dashboard</span>
                </Link>

                {clientDetails.is_super_admin == 1 ? (
                  <div className="flex flex-col gap-4">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to="/"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                          <Home className="h-5 w-5" />
                          <span className="sr-only">Dashboard</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">Dashboard</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to="/admin/quiz/generate"
                          className="flex h-9 w-9 items-center justify-center rounded-lg !dark:text-white transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                          <RiAiGenerate className="h-5 w-6" />

                          <span className="sr-only">Quiz Generator</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        Quiz Generator
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to="/admin/candidates"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                          <Users className="h-5 w-5" />
                          <span className="sr-only"> Candidates </span>
                        </Link>
                      </TooltipTrigger>

                      <TooltipContent side="right">Candidates</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to="/admin/branding"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                          <BsFillMegaphoneFill className="h-5 w-5" />
                          <span className="sr-only"> Branding </span>
                        </Link>
                      </TooltipTrigger>

                      <TooltipContent side="right">Branding</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          to="/admin/schedule"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                          <FaCalendarAlt className="h-5 w-5" />
                          <span className="sr-only">Schedule Management</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        Schedule Management
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ) : null}

                {/* Translator nav start  */}
                {clientDetails.is_translator == 1 ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to="/admin/translator"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      >
                        <BsTranslate className="h-5 w-5" />
                        <span className="sr-only"> Translation </span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Translation</TooltipContent>
                  </Tooltip>
                ) : null}

                {/* Translator nav end  */}

                {/* Consultant nav start  */}
                {clientDetails.is_consultant == 1 ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to="/admin/consultant"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      >
                        <FaUserTie className="h-5 w-5" />
                        <span className="sr-only"> Consultant </span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Consultant</TooltipContent>
                  </Tooltip>
                ) : null}

                {/* Consultant nav end  */}

                {/* Consultant nav start  */}
                {clientDetails.is_financial == 1 ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        to="/admin/financial"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                      >
                        <FaRupeeSign className="h-5 w-5" />
                        <span className="sr-only"> Financial </span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">Financial</TooltipContent>
                  </Tooltip>
                ) : null}

                {/* Consultant nav end  */}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      className="flex p-0 h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8 bg-transparent text-red-600 dark:text-red-600 hover:outline-none hover:border-none"
                      onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login", { replace: true });
                      }}
                    >
                      <LogOut className="h-5 w-5" />
                      <span className="sr-only">Logout</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Logout</TooltipContent>
                </Tooltip>
              </nav>
              {/* <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href="#"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                    >
                      <Settings className="h-5 w-5" />
                      <span className="sr-only">Settings</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
              </nav> */}
            </aside>


            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14 w-full ">
              <header
                className={` sticky top-0 z-30 flex h-14 items-center gap-4 border-b py-4  px-4 sm:static sm:h-auto sm:border-0 sm:px-6 w-full justify-between ${
               theme == "dark" ? "bg-[#262626]" : "bg-white"
             }`}
              >
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      size="icon"
                      variant="outline"
                      className="sm:hidden p-0"
                    >
                      <PanelLeft className="h-5 w-5" />
                      <span className="sr-only">Toggle Menu</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="sm:max-w-xs" >
                    <nav className="flex flex-col items-start justify-start gap-4 px-2 py-4 ">
                      <Link
                        to="/"
                        className="group flex h-9 w-full  shrink-0 items-center justify-start gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                      >
                        <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                        <span className="">Dashboard</span>
                      </Link>

                      {clientDetails.is_super_admin == 1 ? (
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-4">
                         



                          <Tooltip >
                            <TooltipTrigger asChild>
                              <Link
                                to="/admin/quiz/generate"
                                className="flex w-full items-center justify-start gap-2 rounded-lg text-muted-foreground transition-colors hover:text-foreground "
                              >
                                <RiAiGenerate className="h-5 w-6" />

                                <span className="">Quiz Generator</span>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              Quiz Generator
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip >
                            <TooltipTrigger asChild>
                              <Link
                                to="/admin/candidates"
                                className="flex w-full items-center justify-start gap-2 rounded-lg text-muted-foreground transition-colors hover:text-foreground "
                              >
                                <Users className="h-5 w-5" />
                                <span className=""> Candidates </span>
                              </Link>
                            </TooltipTrigger>

                            <TooltipContent side="right">
                              Candidates
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip >
                            <TooltipTrigger asChild>
                              <Link
                                to="/admin/branding"
                                className="flex w-full items-center justify-start gap-2 rounded-lg text-muted-foreground transition-colors hover:text-foreground "
                              >
                                <BsFillMegaphoneFill className="h-5 w-5" />
                                <span className=""> Branding </span>
                              </Link>
                            </TooltipTrigger>

                            <TooltipContent side="right">
                              Branding
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip >
                            <TooltipTrigger asChild>
                              <Link
                                to="/admin/schedule"
                                className="flex w-full items-center justify-start gap-2 rounded-lg text-muted-foreground transition-colors hover:text-foreground "
                              >
                                <FaCalendarAlt className="h-5 w-5" />
                                <span className="">
                                  Schedule Management
                                </span>
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              Schedule Management
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        </div>
                      ) : null}

                      {/* Translator nav start  */}
                      {clientDetails.is_translator == 1 ? (
                        <Tooltip >
                          <TooltipTrigger asChild>
                            <Link
                              to="/admin/translator"
                              className="flex w-full items-center justify-start gap-2 rounded-lg text-muted-foreground transition-colors hover:text-foreground "
                            >
                              <BsTranslate className="h-5 w-5" />
                              <span className=""> Translation </span>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            Translation
                          </TooltipContent>
                        </Tooltip>
                      ) : null}

                      {/* Translator nav end  */}

                      {/* Consultant nav start  */}
                      {clientDetails.is_consultant == 1 ? (
                        <Tooltip >
                          <TooltipTrigger asChild>
                            <Link
                              to="/admin/consultant"
                              className="flex w-full items-center justify-start gap-2 rounded-lg text-muted-foreground transition-colors hover:text-foreground "
                            >
                              <FaUserTie className="h-5 w-5" />
                              <span className=""> Consultant </span>
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right">
                            Consultant
                          </TooltipContent>
                        </Tooltip>
                      ) : null}

                      {/* Consultant nav end  */}

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            className="flex gap-2 p-0 py-2 items-center justify-start rounded-lg text-muted-foreground transition-colors hover:text-foreground bg-transparent text-red-600 dark:text-red-600 hover:outline-none hover:border-none"
                            onClick={() => {
                              localStorage.removeItem("token");
                              navigate("/login", { replace: true });
                            }}
                          >
                            <LogOut className="h-5 w-5" />
                            <span className="">Logout</span>
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="right">Logout</TooltipContent>
                      </Tooltip>
                    </nav>
                  </SheetContent>
                </Sheet>

                <Breadcrumb className="hidden md:flex">
                  <BreadcrumbList>
                    {pathnames.map((value, index) => {
                      const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                      return (
                        <>
                          {index == 0 ? (
                            <BreadcrumbItem key={index}>
                              <BreadcrumbLink asChild>
                                <Link to={"/"}>Home</Link>
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                          ) : (
                            <BreadcrumbItem key={index}>
                              <BreadcrumbLink asChild>
                                <Link to={to}>{value}</Link>
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                          )}
                          {index !== pathnames.length - 1 && (
                            <BreadcrumbSeparator key={Date.now()} />
                          )}
                        </>
                      );
                    })}
                  </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-row items-center px-2 lg:px-4 gap-4">
                  <div className="flex flex-row mx-3 gap-4">
                    {theme === "light" ? (
                      <button
                        className="p-2 bg-transparent text-black rounded-full dark:text-white hover:rounded-full dark:hover:border-black"
                        onClick={() => {
                          setTheme("dark");
                          localStorage.setItem("theme", "dark");
                          document.documentElement.classList.remove("light");
                          document.documentElement.classList.add("dark");
                        }}
                      >
                        <FaRegMoon />
                      </button>
                    ) : (
                      <button
                        className="p-2 bg-transparent text-black rounded-full dark:text-white hover:rounded-full dark:hover:border-black"
                        onClick={() => {
                          setTheme("light");
                          localStorage.setItem("theme", "light");
                          document.documentElement.classList.remove("dark");
                          document.documentElement.classList.add("light");
                        }}
                      >
                        <FiSun />
                      </button>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="overflow-hidden rounded-full p-0"
                      >
                        <img
                          src="../../../../src/assets/nouser.png"
                          width={56}
                          height={56}
                          alt="Avatar"
                          className="overflow-hidden rounded-full"
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="min-w-52">
                      <DropdownMenuLabel>
                        <p className="text-md font-bold">
                          {clientDetails && clientDetails.first_name}
                        </p>
                        <p className="text-sm text-muted-foreground font-normal">
                          {clientDetails && clientDetails.username}
                        </p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => {
                          localStorage.removeItem("token");
                          navigate("/login", { replace: true });
                        }}
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </header>
              <Outlet />
            </div>
          </TooltipProvider>
        )}
      </div>
    </>
  );
};

export default AdminSidebar;
