import React from "react";
import { useSelector } from "react-redux";
import { useAuth } from "@/layouts/Root";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Avatar from "@/components/atoms/Avatar";
function Header({ onToggleSidebar }) {
  const { user, isAuthenticated } = useSelector(state => state.user)
  const { logout } = useAuth()

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
    <div className="flex items-center justify-between h-16 px-4">
        {/* Left side */}
        <div className="flex items-center gap-4">
            <button
                onClick={onToggleSidebar}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors lg:hidden">
            </button>
            <div>
                <h2 className="text-xl font-bold text-slate-900">Good morning, Admin</h2>
                {/* Right side */}
                <div className="flex items-center gap-3">
                    {/* Quick Actions */}
                    <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <ApperIcon name="Bell" size={20} className="text-slate-600" />
                        </button>
                        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                            <ApperIcon name="Search" size={20} className="text-slate-600" />
                        </button>
                    </div>
                    {/* User Profile */}
                    {isAuthenticated && <div className="flex items-center gap-3 border-l border-slate-200 pl-3">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-semibold text-slate-900">
                                {user?.firstName || user?.name || "User"}
                            </p>
                            <p className="text-xs text-slate-500">
                                {user?.role || "Staff"}
                            </p>
                        </div>
                        <div className="relative">
                            <Avatar
                                src={user?.avatar || user?.profilePicture}
                                fallback={user?.firstName ? user.firstName.charAt(0) : "U"}
                                size="md"
                                className="cursor-pointer" />
                            <div className="absolute -top-1 -right-1">
                                <Badge
                                    variant="success"
                                    size="sm"
                                    className="w-4 h-4 rounded-full p-0 border-2 border-white">
                                    <span className="sr-only">Online</span>
                                </Badge>
                            </div>
                        </div>
                        {/* Logout Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={logout}
                            className="hidden md:flex items-center gap-2 text-slate-600 hover:text-red-600 border-slate-300 hover:border-red-300">
                            <ApperIcon name="LogOut" size={16} />
                            <span>Logout</span>
                        </Button>
                    </div>}
                </div>
            </div>
        </div></div></header>
  )
}

export default Header