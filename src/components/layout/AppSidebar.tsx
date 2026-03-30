import {
  LayoutDashboard, FileBarChart, ClipboardList, MessageSquare,
  Building2, Users, Settings, Activity, LogOut, Inbox, Zap
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useInboxCounts } from '@/hooks/useInboxCounts';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const mainNav = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Bandeja', url: '/inbox', icon: Inbox },
  { title: 'Reportes', url: '/reports', icon: FileBarChart },
  { title: 'Indicadores', url: '/indicators', icon: Activity },
  { title: 'Observaciones', url: '/observations', icon: MessageSquare },
];

const adminNav = [
  { title: 'Instituciones', url: '/institutions', icon: Building2 },
  { title: 'Periodos', url: '/periods', icon: ClipboardList },
  { title: 'Inicio Automático', url: '/auto-start', icon: Zap },
  { title: 'Usuarios', url: '/users', icon: Users },
  { title: 'Configuración', url: '/settings', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const { user, profile, signOut, userRole } = useAuth();
  const { data: inboxCounts } = useInboxCounts(user?.id);
  const isActive = (path: string) => location.pathname === path || (path !== '/' && location.pathname.startsWith(path));

  const getBadge = (url: string) => {
    if (url === '/inbox' && inboxCounts?.total) return inboxCounts.total;
    if (url === '/reports' && inboxCounts?.pendingReview) return inboxCounts.pendingReview;
    return 0;
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-inner bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">SG</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-sidebar-foreground">SGVI</p>
              <p className="text-[10px] text-muted-foreground leading-none">Gestión de Indicadores</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-8 w-8 rounded-inner bg-primary flex items-center justify-center">
              <span className="text-sm font-bold text-primary-foreground">SG</span>
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => {
                const count = getBadge(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink to={item.url} end={item.url === '/'} activeClassName="bg-sidebar-accent text-primary font-medium">
                        <div className="relative">
                          <item.icon className="h-4 w-4" />
                          {collapsed && count > 0 && (
                            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                              {count > 9 ? '9+' : count}
                            </span>
                          )}
                        </div>
                        {!collapsed && (
                          <span className="flex-1 flex items-center justify-between">
                            <span>{item.title}</span>
                            {count > 0 && (
                              <Badge variant="destructive" className="ml-auto h-5 min-w-5 flex items-center justify-center px-1.5 text-[10px]">
                                {count}
                              </Badge>
                            )}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {userRole === 'admin' && (
          <SidebarGroup>
            <SidebarGroupLabel>Administración</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNav.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive(item.url)}>
                      <NavLink to={item.url} activeClassName="bg-sidebar-accent text-primary font-medium">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        {!collapsed && profile && (
          <div className="px-2 py-1.5">
            <p className="text-xs font-medium text-sidebar-foreground truncate">{profile.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{profile.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'sm'}
          className="w-full text-muted-foreground hover:text-destructive"
          onClick={signOut}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Cerrar Sesión</span>}
        </Button>
        {!collapsed && (
          <p className="text-[10px] text-muted-foreground text-center">SGVI v1.0</p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
