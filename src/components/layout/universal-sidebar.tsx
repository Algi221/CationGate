'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/animate-ui/components/radix/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import {
  BadgeCheck,
  Bell,
  CreditCard,
  LogOut,
  MoreHorizontal,
  Settings,
  Sparkles,
  ChevronsUpDown,
  ChevronRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

type NavItem = {
  title: string;
  icon: LucideIcon;
  isActive?: boolean;
  url?: string;
  items?: { title: string; url: string }[];
};

type ProjectItem = {
  name: string;
  url: string;
  icon: LucideIcon;
};

type RoleData = {
  user: { name: string; email: string; avatar: string; roleLabel: string };
  teams: { name: string; logo: LucideIcon; plan: string }[];
  navMain: NavItem[];
  projects: ProjectItem[];
};

type Role = 'gatekeeper' | 'admin_sekolah';

const SIDEBAR_DATA: Record<Role, RoleData> = {
  gatekeeper: {
    user: {
      name: 'Gatekeeper Superadmin',
      email: 'uno@cationgate.id',
      avatar: 'https://github.com/shadcn.png',
      roleLabel: 'Platform Superadmin',
    },
    teams: [
      { name: 'Cation Gate', logo: Settings, plan: 'Gatekeeper Platform' },
    ],
    navMain: [
      {
        title: 'Platform',
        icon: Settings,
        isActive: true,
        items: [
          { title: 'Dashboard', url: '/gatekeeper/dashboard' },
          { title: 'Manajemen Sekolah', url: '/gatekeeper/dashboard/schools' },
          { title: 'Feedback & Tiket', url: '/gatekeeper/dashboard/feedback' },
        ],
      },
      {
        title: 'Settings',
        icon: Settings,
        items: [
          { title: 'Pengaturan System', url: '/gatekeeper/dashboard/settings' },
          { title: 'Profil Gatekeeper', url: '/gatekeeper/dashboard/profile' },
        ],
      },
    ],
    projects: [],
  },
  admin_sekolah: {
    user: {
      name: 'Admin Sekolah',
      email: 'admin@sekolah.sch.id',
      avatar: 'https://github.com/shadcn.png',
      roleLabel: 'Admin Sekolah',
    },
    teams: [
      { name: 'Sekolah Ku', logo: Settings, plan: 'PPDB Portal' },
    ],
    navMain: [
      {
        title: 'Manajemen Siswa',
        icon: Settings,
        isActive: true,
        items: [
          { title: 'Ringkasan', url: '/dashboard' },
          { title: 'Data Calon Siswa', url: '/dashboard/pendaftar' },
          { title: 'Pembagian Kelas', url: '/dashboard/pembagian-kelas' },
          { title: 'Siswa Aktif', url: '/dashboard/siswa-aktif' },
        ],
      },
      {
        title: 'Konten Portal',
        icon: Settings,
        items: [
          { title: 'Kelola Informasi', url: '/dashboard/informasi' },
          { title: 'Kelola UI/Data', url: '/dashboard/kelola-ui' },
        ],
      },
      {
        title: 'Pengaturan Sistem',
        icon: Settings,
        items: [
          { title: 'Manajemen Admin', url: '/dashboard/admin' },
          { title: 'Pengaturan', url: '/dashboard/settings' },
        ],
      },
    ],
    projects: [],
  },
};

const NavCollapsible = ({
  item,
  isGroupActive,
  children,
}: {
  item: any;
  isGroupActive: boolean;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(isGroupActive);
  React.useEffect(() => {
    if (isGroupActive) {
      setOpen(true);
    }
  }, [isGroupActive]);
  return (
    <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
      {children}
    </Collapsible>
  );
};

export const UniversalSidebar = ({
  children,
  role = 'admin_sekolah',
}: {
  children: React.ReactNode;
  role?: 'gatekeeper' | 'admin_sekolah';
}) => {
  const isMobile = useIsMobile();
  const pathname = usePathname();

  const currentRole = role as Role;
  const roleData = SIDEBAR_DATA[currentRole] || SIDEBAR_DATA.admin_sekolah;
  const [activeTeam, setActiveTeam] = React.useState(roleData.teams[0]);

  if (!activeTeam) return null;

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground justify-between w-full"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                        <activeTeam.logo className="size-4" />
                      </div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {activeTeam.name}
                        </span>
                        <span className="truncate text-xs">
                          {activeTeam.plan}
                        </span>
                      </div>
                    </div>
                    <ChevronsUpDown className="size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-muted-foreground">
              Main Navigation
            </SidebarGroupLabel>
            <SidebarMenu>
              {roleData.navMain.map((item) => {
                const hasSubItems = item.items && item.items.length > 0;
                const isGroupActive =
                  item.isActive ||
                  (hasSubItems &&
                    item.items?.some((subItem) =>
                      pathname.startsWith(subItem.url)
                    ));

                if (!hasSubItems) {
                  return (
                    <React.Fragment key={item.title}>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          className={`hover:bg-slate-800 hover:text-white dark:hover:bg-slate-700 transition-all duration-300 text-[15px] h-10 px-3 ${
                            pathname.startsWith(item.url || '')
                              ? 'text-white bg-slate-800 dark:bg-slate-700 font-semibold'
                              : 'text-slate-700 font-medium'
                          }`}
                        >
                          <Link href={item.url || '#'}>
                            {item.icon && <item.icon className="size-5" />}
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </React.Fragment>
                  );
                }

                return (
                  <NavCollapsible
                    key={item.title}
                    item={item}
                    isGroupActive={isGroupActive}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className={`hover:bg-slate-800 hover:text-white dark:hover:bg-slate-700 transition-all duration-300 text-[15px] h-10 px-3 w-full justify-between ${
                          isGroupActive ? 'text-white bg-slate-800 dark:bg-slate-700 font-semibold' : 'text-slate-700 font-medium'
                        }`}
                      >
                        <CollapsibleTrigger>
                          <div className="flex items-center gap-3">
                            {item.icon && <item.icon className="size-5" />}
                            <span className="font-medium">{item.title}</span>
                          </div>
                          <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90 opacity-50 shrink-0 size-4" />
                        </CollapsibleTrigger>
                      </SidebarMenuButton>
                      <CollapsibleContent>
                        <SidebarMenuSub className="border-l-2 border-slate-200 ml-4 pl-4 mt-1">
                          {item.items?.map((subItem) => {
                            const isSubActive =
                              pathname === subItem.url ||
                              pathname.startsWith(subItem.url + '/');
                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  className={`hover:bg-slate-800 hover:text-white dark:hover:bg-slate-700 transition-all duration-300 text-[14px] h-9 px-3 ${
                                    isSubActive
                                      ? 'text-white bg-slate-800 dark:bg-slate-700 font-semibold'
                                      : 'text-slate-600 font-medium'
                                  }`}
                                >
                                  <Link href={subItem.url}>
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </NavCollapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-primary/10 hover:text-primary transition-colors justify-between w-full"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={roleData.user.avatar}
                          alt={roleData.user.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          {roleData.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {roleData.user.name}
                        </span>
                        <span className="truncate text-xs">
                          {roleData.user.email}
                        </span>
                      </div>
                    </div>
                    <ChevronsUpDown className="size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-border/50 bg-background/50 backdrop-blur-sm z-10 sticky top-0">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <div className="flex-1">
              <span className="text-sm font-semibold capitalize">
                {currentRole === 'gatekeeper'
                  ? 'Gatekeeper Platform'
                  : 'PPDB Admin Portal'}
              </span>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-4 bg-background">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};
